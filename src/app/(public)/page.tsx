import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { CTASection } from '@/components/sections/CTASection'
import { createClient } from '@/lib/supabase/server'
import { getPublicSettings } from '@/lib/site-settings'
import { getPageContent } from '@/lib/page-content'

export const metadata: Metadata = {
  title: 'מימוש 360 | מימוש זכויות רפואיות מול ביטוח לאומי',
  description:
    'מימוש 360 מסייעת לכם לממש את הזכויות הרפואיות שמגיעות לכם מביטוח לאומי. ליווי אישי, מקצועי ואמין.',
}

async function getTestimonials() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .limit(3)
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [testimonials, settings, homeContent] = await Promise.all([
    getTestimonials(),
    getPublicSettings(),
    getPageContent('home'),
  ])

  return (
    <>
      <Hero typeformId={settings.typeformId} settings={settings} content={homeContent} />
      <Features content={homeContent} />
      <HowItWorksSection content={homeContent} />
      <TestimonialsSection testimonials={testimonials.length > 0 ? testimonials : undefined} />
      <CTASection
        title={(homeContent.cta_title as string) ?? undefined}
        subtitle={(homeContent.cta_subtitle as string) ?? undefined}
        settings={settings}
      />
    </>
  )
}
