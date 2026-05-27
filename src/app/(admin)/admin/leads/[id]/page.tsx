import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDate, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '@/lib/utils'
import { LeadActions } from './LeadActions'
import type { Metadata } from 'next'
import type { Lead, LeadNote } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'פרטי ליד | מימוש 360 ניהול',
  robots: { index: false, follow: false },
}

interface LeadPageProps {
  params: Promise<{ id: string }>
}

async function getLead(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads')
    .select('*, lead_notes(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as Lead & { lead_notes: LeadNote[] }
}

export default async function LeadDetailPage({ params }: LeadPageProps) {
  const { id } = await params
  const lead = await getLead(id)

  if (!lead) notFound()

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <a
          href="/admin/leads"
          className="text-sm text-[#2D6A4F] hover:underline font-medium mb-3 inline-block"
        >
          ← חזרה ללידים
        </a>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {lead.full_name ?? 'ליד ללא שם'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              התקבל ב-{formatDate(lead.created_at)} · מקור: {lead.source}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium shrink-0 ${
              LEAD_STATUS_COLORS[lead.status] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {LEAD_STATUS_LABELS[lead.status] ?? lead.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Contact info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">פרטי קשר</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500 mb-0.5">שם</dt>
              <dd className="font-medium text-gray-900">{lead.full_name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500 mb-0.5">טלפון</dt>
              <dd className="font-medium text-gray-900" dir="ltr">
                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone.replace(/\D/g, '')}`}
                    className="text-[#2D6A4F] hover:underline"
                  >
                    {lead.phone}
                  </a>
                ) : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 mb-0.5">אימייל</dt>
              <dd className="font-medium text-gray-900">
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className="text-[#2D6A4F] hover:underline">
                    {lead.email}
                  </a>
                ) : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 mb-0.5">מקור</dt>
              <dd className="font-medium text-gray-900 capitalize">{lead.source}</dd>
            </div>
          </dl>
        </div>

        {lead.message && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">הודעה</h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {lead.message}
            </p>
          </div>
        )}

        <LeadActions lead={lead} />
      </div>
    </div>
  )
}
