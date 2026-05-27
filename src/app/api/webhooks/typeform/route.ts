import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

interface TypeformAnswer {
  field: { id: string; type: string; ref: string }
  type: string
  text?: string
  phone_number?: string
  email?: string
  choice?: { label: string }
}

interface TypeformPayload {
  event_id: string
  event_type: string
  form_response: {
    form_id: string
    token: string
    submitted_at: string
    answers?: TypeformAnswer[]
    definition?: {
      fields: Array<{ id: string; title: string; type: string; ref: string }>
    }
  }
}

function extractFieldValue(answer: TypeformAnswer): string | null {
  switch (answer.type) {
    case 'text':
    case 'long_text':
      return answer.text ?? null
    case 'phone_number':
      return answer.phone_number ?? null
    case 'email':
      return answer.email ?? null
    case 'choice':
      return answer.choice?.label ?? null
    default:
      return null
  }
}

function parseTypeformResponse(payload: TypeformPayload) {
  const { answers, definition, token } = payload.form_response

  if (!answers || !definition) {
    return { responseId: token, fullName: null, phone: null, email: null, message: null }
  }

  const fieldMap = new Map(definition.fields.map((f) => [f.id, f]))

  let fullName: string | null = null
  let phone: string | null = null
  let email: string | null = null
  const messageParts: string[] = []

  for (const answer of answers) {
    const field = fieldMap.get(answer.field.id)
    if (!field) continue

    const value = extractFieldValue(answer)
    if (!value) continue

    const titleLower = field.title.toLowerCase()
    const refLower = field.ref.toLowerCase()

    if (titleLower.includes('שם') || titleLower.includes('name') || refLower.includes('name')) {
      fullName = value
    } else if (
      titleLower.includes('טלפון') ||
      titleLower.includes('phone') ||
      refLower.includes('phone') ||
      answer.type === 'phone_number'
    ) {
      phone = value
    } else if (
      titleLower.includes('מייל') ||
      titleLower.includes('email') ||
      answer.type === 'email'
    ) {
      email = value
    } else {
      messageParts.push(`${field.title}: ${value}`)
    }
  }

  return {
    responseId: token,
    fullName,
    phone,
    email,
    message: messageParts.join('\n') || 'פנייה מ-Typeform',
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.TYPEFORM_WEBHOOK_SECRET
  if (secret) {
    const signature = request.headers.get('typeform-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let payload: TypeformPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (payload.event_type !== 'form_response') {
    return NextResponse.json({ ok: true })
  }

  const { responseId, fullName, phone, email, message } =
    parseTypeformResponse(payload)

  try {
    const supabase = await createServiceClient()

    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('typeform_response_id', responseId)
      .single()

    if (existing) {
      return NextResponse.json({ ok: true, message: 'Duplicate' })
    }

    await supabase.from('leads').insert({
      full_name: fullName,
      phone,
      email,
      message,
      source: 'typeform',
      status: 'new',
      typeform_response_id: responseId,
      metadata: {
        form_id: payload.form_response.form_id,
        submitted_at: payload.form_response.submitted_at,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Typeform webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
