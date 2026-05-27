import { createClient } from '@/lib/supabase/server'
import { ContentEditor } from './ContentEditor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'סיפורי הצלחה | מימוש 360 ניהול',
  robots: { index: false, follow: false },
}

async function getTestimonials() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export default async function ContentPage() {
  const testimonials = await getTestimonials()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">סיפורי הצלחה</h1>
        <p className="text-gray-500 text-sm mt-1">
          ניהול המלצות ושיפורי הצלחה שמוצגים באתר
        </p>
      </div>

      <ContentEditor testimonials={testimonials} />
    </div>
  )
}
