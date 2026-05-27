import { createClient } from '@/lib/supabase/server'
import { getPageContent } from '@/lib/page-content'
import { PageContentEditor } from './PageContentEditor'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'עריכת תוכן עמוד | מימוש 360 ניהול',
  robots: { index: false, follow: false },
}

const SLUG_LABELS: Record<string, string> = {
  home: 'דף ראשי',
  about: 'אודות',
  'how-it-works': 'איך זה עובד',
  contact: 'צור קשר',
}

const VALID_SLUGS = Object.keys(SLUG_LABELS)

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PageContentEditorPage({ params }: Props) {
  const { slug } = await params

  if (!VALID_SLUGS.includes(slug)) {
    notFound()
  }

  // Get page record for the page id
  let pageId: string | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('pages').select('id').eq('slug', slug).single()
    pageId = data?.id ?? null
  } catch {
    // ignore
  }

  const content = await getPageContent(slug)
  const pageName = SLUG_LABELS[slug] ?? slug

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <a href="/admin/pages" className="hover:text-[#2D6A4F] transition-colors">
            עמודים ו-SEO
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium">{pageName}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">עריכת תוכן — {pageName}</h1>
        <p className="text-gray-500 text-sm mt-1">
          ערוך את כל תוכן העמוד. השינויים יופיעו באתר מיד לאחר השמירה.
        </p>
      </div>
      <PageContentEditor slug={slug} pageId={pageId} initialContent={content} pageName={pageName} />
    </div>
  )
}
