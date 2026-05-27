import { createClient } from '@/lib/supabase/server'
import { PagesEditor } from './PagesEditor'
import type { Metadata } from 'next'
import type { Page } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'עמודים ו-SEO | מימוש 360 ניהול',
  robots: { index: false, follow: false },
}

async function getPages(): Promise<Page[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('pages')
      .select('*')
      .order('slug', { ascending: true })
    return (data ?? []) as Page[]
  } catch {
    return []
  }
}

export default async function PagesAdminPage() {
  const pages = await getPages()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">עמודים ו-SEO</h1>
        <p className="text-gray-500 text-sm mt-1">ערוך כותרות ותיאורי מטא לכל עמוד באתר</p>
      </div>
      <PagesEditor pages={pages} />
    </div>
  )
}
