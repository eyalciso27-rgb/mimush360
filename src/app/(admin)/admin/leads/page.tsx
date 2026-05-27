import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LeadsTableClient } from './LeadsTableClient'
import type { Metadata } from 'next'
import type { Lead } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'לידים | מימוש 360 ניהול',
  robots: { index: false, follow: false },
}

interface LeadsPageProps {
  searchParams: Promise<{ status?: string; q?: string; page?: string; source?: string; archived?: string }>
}

const PAGE_SIZE = 25

async function getLeads(status?: string, search?: string, page = 1, source?: string, archived = false) {
  try {
    const supabase = await createClient()
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase
      .from('leads')
      .select('id, full_name, phone, email, status, source, created_at, archived_at, last_contacted_at', {
        count: 'exact',
      })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (archived) {
      query = query.not('archived_at', 'is', null)
    } else {
      query = query.is('archived_at', null)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (source && source !== 'all') {
      query = query.eq('source', source)
    }

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`
      )
    }

    const { data, count } = await query
    return {
      leads: (data ?? []) as Pick<Lead, 'id' | 'full_name' | 'phone' | 'email' | 'status' | 'source' | 'created_at' | 'archived_at' | 'last_contacted_at'>[],
      total: (count ?? 0) as number,
    }
  } catch {
    return { leads: [], total: 0 }
  }
}

const STATUS_FILTERS = [
  { value: 'all', label: 'הכל' },
  { value: 'new', label: 'חדשים' },
  { value: 'contacted', label: 'נוצר קשר' },
  { value: 'qualified', label: 'מתאים' },
  { value: 'disqualified', label: 'לא מתאים' },
  { value: 'converted', label: 'הפכו ללקוח' },
]

const SOURCE_FILTERS = [
  { value: 'all', label: 'כל מקורות' },
  { value: 'contact_form', label: 'טופס קשר' },
  { value: 'typeform', label: 'Typeform' },
  { value: 'whatsapp', label: 'וואטסאפ' },
  { value: 'phone', label: 'טלפון' },
]

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams
  const status = params.status
  const search = params.q
  const page = parseInt(params.page ?? '1', 10)
  const source = params.source
  const archived = params.archived === '1'

  const { leads, total } = await getLeads(status, search, page, source, archived)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const buildParams = (overrides: Record<string, string | undefined>) => {
    const base: Record<string, string> = {}
    if (search) base.q = search
    if (status) base.status = status
    if (source) base.source = source
    if (archived) base.archived = '1'
    return new URLSearchParams({ ...base, ...overrides } as Record<string, string>)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {archived ? 'ארכיון לידים' : 'לידים'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">סה&quot;כ {total} פניות</p>
        </div>
        <div className="flex gap-2">
          {archived ? (
            <Link
              href="/admin/leads"
              className="h-9 px-4 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
            >
              ← חזרה ללידים פעילים
            </Link>
          ) : (
            <Link
              href="/admin/leads?archived=1"
              className="h-9 px-4 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 flex items-center transition-colors"
            >
              ארכיון
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3">
        <form method="GET" className="flex gap-2 flex-wrap">
          <input
            name="q"
            type="search"
            defaultValue={search}
            placeholder="חפש לפי שם, טלפון או מייל..."
            className="h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] min-w-[220px] flex-1 max-w-sm"
          />
          {status && <input type="hidden" name="status" value={status} />}
          {source && source !== 'all' && <input type="hidden" name="source" value={source} />}
          {archived && <input type="hidden" name="archived" value="1" />}
          <button
            type="submit"
            className="h-9 px-4 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#1B4332] transition-colors"
          >
            חפש
          </button>
          {(search || status || source) && (
            <Link
              href={archived ? '/admin/leads?archived=1' : '/admin/leads'}
              className="h-9 px-3 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 flex items-center transition-colors"
            >
              נקה
            </Link>
          )}
        </form>

        {/* Status filters */}
        <div className="flex gap-1.5 flex-wrap items-center">
          <span className="text-xs text-gray-500 ml-1">סטטוס:</span>
          {STATUS_FILTERS.map((opt) => (
            <Link
              key={opt.value}
              href={`/admin/leads?${buildParams({ status: opt.value !== 'all' ? opt.value : undefined, page: undefined })}`}
              className={`h-8 px-3 rounded-full text-xs font-medium transition-colors ${
                (opt.value === 'all' && !status) || status === opt.value
                  ? 'bg-[#2D6A4F] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>

        {/* Source filters */}
        <div className="flex gap-1.5 flex-wrap items-center">
          <span className="text-xs text-gray-500 ml-1">מקור:</span>
          {SOURCE_FILTERS.map((opt) => (
            <Link
              key={opt.value}
              href={`/admin/leads?${buildParams({ source: opt.value !== 'all' ? opt.value : undefined, page: undefined })}`}
              className={`h-8 px-3 rounded-full text-xs font-medium transition-colors ${
                (opt.value === 'all' && !source) || source === opt.value
                  ? 'bg-[#B5860D] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <LeadsTableClient leads={leads} total={total} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              עמוד {page} מתוך {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/leads?${buildParams({ page: String(page - 1) })}`}
                  className="h-8 px-3 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 flex items-center"
                >
                  הקודם
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/leads?${buildParams({ page: String(page + 1) })}`}
                  className="h-8 px-3 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 flex items-center"
                >
                  הבא
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
