import { createClient } from '@/lib/supabase/server'
import { Users, MessageSquare, Star, Phone, MessageCircle } from 'lucide-react'
import { formatDate, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Lead, LeadStatus } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'לוח בקרה | מימוש 360 ניהול',
  robots: { index: false, follow: false },
}

async function getDashboardData() {
  try {
    const supabase = await createClient()

    const [leadsResult, recentLeadsResult] = await Promise.all([
      supabase.from('leads').select('id, status, created_at, archived_at').is('archived_at', null),
      supabase
        .from('leads')
        .select('id, full_name, phone, status, source, created_at')
        .is('archived_at', null)
        .order('created_at', { ascending: false })
        .limit(8),
    ])

    const allLeads = (leadsResult.data ?? []) as Pick<Lead, 'id' | 'status' | 'created_at' | 'archived_at'>[]

    const statusCounts = allLeads.reduce(
      (acc, lead) => {
        acc[lead.status] = (acc[lead.status] ?? 0) + 1
        return acc
      },
      {} as Record<LeadStatus, number>
    )

    // Leads this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const leadsThisMonth = allLeads.filter(
      (l) => new Date(l.created_at) >= startOfMonth
    ).length

    // Leads last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const leadsLastWeek = allLeads.filter(
      (l) => new Date(l.created_at) >= sevenDaysAgo
    ).length

    // Leads today
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const leadsToday = allLeads.filter(
      (l) => new Date(l.created_at) >= startOfToday
    ).length

    return {
      totalLeads: allLeads.length,
      newLeads: statusCounts['new'] ?? 0,
      convertedLeads: statusCounts['converted'] ?? 0,
      leadsThisMonth,
      leadsLastWeek,
      leadsToday,
      statusCounts,
      recentLeads: (recentLeadsResult.data ?? []) as Pick<Lead, 'id' | 'full_name' | 'phone' | 'status' | 'source' | 'created_at'>[],
    }
  } catch {
    return {
      totalLeads: 0,
      newLeads: 0,
      convertedLeads: 0,
      leadsThisMonth: 0,
      leadsLastWeek: 0,
      leadsToday: 0,
      statusCounts: {} as Record<LeadStatus, number>,
      recentLeads: [],
    }
  }
}

const STATUS_ORDER: LeadStatus[] = ['new', 'contacted', 'qualified', 'disqualified', 'converted']

export default async function AdminDashboardPage() {
  const {
    totalLeads,
    newLeads,
    convertedLeads,
    leadsThisMonth,
    leadsLastWeek,
    leadsToday,
    statusCounts,
    recentLeads,
  } = await getDashboardData()

  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0

  const stats = [
    {
      label: 'סה"כ לידים',
      value: totalLeads,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      sub: `${leadsLastWeek} השבוע`,
    },
    {
      label: 'חדשים — לטיפול',
      value: newLeads,
      icon: MessageSquare,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      sub: newLeads > 0 ? 'ממתינים לתגובה' : 'הכל מטופל ✓',
      urgent: newLeads > 0,
    },
    {
      label: 'היום',
      value: leadsToday,
      icon: Phone,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      sub: `${leadsThisMonth} החודש`,
    },
    {
      label: 'הפכו ללקוחות',
      value: convertedLeads,
      icon: Star,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      sub: `שיעור המרה: ${conversionRate}%`,
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">לוח בקרה</h1>
        <p className="text-gray-500 text-sm mt-1">סקירה כללית של פעילות האתר</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`bg-white rounded-xl border p-5 shadow-sm ${
                stat.urgent ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-black text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-0.5 font-medium">{stat.label}</div>
              <div className={`text-xs mt-1 ${stat.urgent ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
                {stat.sub}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">פירוק לפי סטטוס</h2>
          {totalLeads === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">אין לידים עדיין</p>
          ) : (
            <div className="space-y-3">
              {STATUS_ORDER.map((s) => {
                const count = statusCounts[s] ?? 0
                const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0
                const barColor = {
                  new: 'bg-blue-400',
                  contacted: 'bg-yellow-400',
                  qualified: 'bg-green-400',
                  disqualified: 'bg-red-400',
                  converted: 'bg-purple-400',
                }[s] ?? 'bg-gray-300'

                return (
                  <Link
                    key={s}
                    href={`/admin/leads?status=${s}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium group-hover:text-[#2D6A4F] transition-colors">
                        {LEAD_STATUS_LABELS[s]}
                      </span>
                      <span className="text-gray-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">פעולות מהירות</h2>
          <div className="space-y-2">
            <Link
              href="/admin/leads?status=new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 transition-colors group border border-transparent hover:border-amber-200"
            >
              <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                <MessageSquare className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 group-hover:text-amber-700">
                  לידים חדשים לטיפול
                </div>
                <div className="text-xs text-gray-400">{newLeads} ממתינים</div>
              </div>
            </Link>
            <Link
              href="/admin/leads"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-200"
            >
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                  כל הלידים
                </div>
                <div className="text-xs text-gray-400">רשימה מלאה + ייצוא CSV</div>
              </div>
            </Link>
            <Link
              href="/admin/content"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors group border border-transparent hover:border-green-200"
            >
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <Star className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 group-hover:text-green-700">
                  סיפורי הצלחה
                </div>
                <div className="text-xs text-gray-400">הוסף או ערוך המלצות</div>
              </div>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
            >
              <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <Phone className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">פרטי האתר</div>
                <div className="text-xs text-gray-400">טלפון, וואטסאפ, כתובת</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">פניות אחרונות</h2>
            <Link href="/admin/leads" className="text-xs text-[#2D6A4F] hover:underline">
              הצג הכל
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">אין פניות עדיין</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentLeads.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2D6A4F]/10 flex items-center justify-center text-[#2D6A4F] font-bold text-sm shrink-0">
                      {(lead.full_name ?? '?')[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {lead.full_name ?? 'ללא שם'}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${
                            LEAD_STATUS_COLORS[lead.status]?.split(' ')[0] ?? 'bg-gray-300'
                          }`}
                        />
                        <span className="text-xs text-gray-400">
                          {LEAD_STATUS_LABELS[lead.status]}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 shrink-0">
                      {new Date(lead.created_at).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
