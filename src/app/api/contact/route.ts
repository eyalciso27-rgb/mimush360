import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { contactSchema } from '@/lib/validations/contact'

// Simple in-memory rate limiter (use Redis/KV for production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 5

  const entry = rateLimitMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= maxRequests) return false
  entry.count++
  return true
}

const contactApiSchema = contactSchema.extend({
  source: z.string().max(50).optional().default('contact_form'),
  email: z
    .string()
    .email('כתובת מייל לא תקינה')
    .optional()
    .or(z.literal(''))
    .optional(),
})

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor?.split(',')[0].trim() ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'יותר מדי בקשות. נסו שוב בעוד דקה.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'גוף הבקשה אינו תקין' }, { status: 400 })
  }

  const parsed = contactApiSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'נתונים לא תקינים', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { fullName, phone, email, message, source } = parsed.data

  try {
    const supabase = await createServiceClient()

    const { error } = await supabase.from('leads').insert({
      full_name: fullName,
      phone,
      email: email || null,
      message,
      source: source ?? 'contact_form',
      status: 'new',
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'שגיאה בשמירת הפנייה. נסו שוב מאוחר יותר.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'הפנייה התקבלה בהצלחה' },
      { status: 201 }
    )
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { error: 'שגיאה פנימית. נסו שוב מאוחר יותר.' },
      { status: 500 }
    )
  }
}
