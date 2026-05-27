import type { Metadata } from 'next'
import { CTASection } from '@/components/sections/CTASection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { createClient } from '@/lib/supabase/server'
import { getPublicSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'סיפורי הצלחה | מימוש 360',
  description:
    'קראו סיפורי הצלחה אמיתיים של לקוחות שמימשו את זכויותיהם הרפואיות עם עזרת מימוש 360.',
  openGraph: {
    title: 'סיפורי הצלחה | מימוש 360',
    description: 'לקוחות אמיתיים שקיבלו את מה שמגיע להם.',
  },
}

async function getTestimonials() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export default async function TestimonialsPage() {
  const [testimonials, settings] = await Promise.all([getTestimonials(), getPublicSettings()])

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
              לקוחות מרוצים
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              סיפורי הצלחה אמיתיים
            </h1>
            <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
              אלה אנשים שפנו אלינו בספק, וסיימו עם תוצאות שלא ציפו להן.
              הסיפורים שלהם הם ההוכחה הטובה ביותר לעבודה שלנו.
            </p>
          </div>
        </div>
      </section>

      <TestimonialsSection
        testimonials={testimonials.length > 0 ? testimonials : undefined}
        showAll
      />

      {/* Note */}
      <section className="py-8 bg-[#FAFAF8]">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-sm text-gray-500 text-center">
            * כל הסיפורים הם מקרים אמיתיים. שמות וזהויות שונו לצורך שמירה על
            פרטיות הלקוחות.
          </p>
        </div>
      </section>

      <CTASection
        title="הסיפור הבא יכול להיות שלכם"
        subtitle="פנו אלינו לייעוץ ראשוני חינם ונבדוק יחד מה מגיע לכם."
        settings={settings}
      />
    </>
  )
}
