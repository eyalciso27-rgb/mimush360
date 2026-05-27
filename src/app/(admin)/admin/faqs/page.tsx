import { createClient } from '@/lib/supabase/server'
import { FAQsEditor } from './FAQsEditor'
import type { Metadata } from 'next'
import type { FAQ } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'שאלות נפוצות | מימוש 360 ניהול',
  robots: { index: false, follow: false },
}

async function getFAQs(): Promise<FAQ[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true })
    return (data ?? []) as FAQ[]
  } catch {
    return []
  }
}

export default async function FAQsPage() {
  const faqs = await getFAQs()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">שאלות נפוצות</h1>
        <p className="text-gray-500 text-sm mt-1">נהל את השאלות הנפוצות המוצגות באתר</p>
      </div>
      <FAQsEditor faqs={faqs} />
    </div>
  )
}
