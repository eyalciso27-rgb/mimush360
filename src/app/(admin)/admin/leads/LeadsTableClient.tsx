'use client'
import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDate, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '@/lib/utils'
import { Phone, MessageCircle, FileDown, ChevronDown, Loader2, Mail } from 'lucide-react'
import type { Lead, LeadStatus } from '@/types'

type LeadRow = Pick<Lead, 'id' | 'full_name' | 'phone' | 'email' | 'status' | 'source' | 'created_at' | 'archived_at' | 'last_contacted_at'>

interface LeadsTableClientProps {
  leads: LeadRow[]
  total: number
}

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'חדש' },
  { value: 'contacted', label: 'נוצר קשר' },
  { value: 'qualified', label: 'מתאים' },
  { value: 'disqualified', label: 'לא מתאים' },
  { value: 'converted', label: 'הפך ללקוח' },
]

function StatusBadge({
  leadId,
  status,
  onUpdate,
}: {
  leadId: string
  status: LeadStatus
  onUpdate: (id: string, status: LeadStatus) => void
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const supabase = createClient()

  const handleChange = (newStatus: LeadStatus) => {
    if (newStatus === status) { setOpen(false); return }
    setOpen(false)
    startTransition(async () => {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', leadId)
      if (error) {
        toast.error('שגיאה בעדכון הסטטוס')
      } else {
        onUpdate(leadId, newStatus)
        toast.success('סטטוס עודכן')
      }
    })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
          LEAD_STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
        {LEAD_STATUS_LABELS[status] ?? status}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <ul
            role="listbox"
            className="absolute z-20 top-7 right-0 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[130px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === status}
                onClick={() => handleChange(opt.value)}
                className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-50 flex items-center gap-2 ${
                  opt.value === status ? 'font-semibold text-[#2D6A4F]' : 'text-gray-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    LEAD_STATUS_COLORS[opt.value]?.split(' ')[0] ?? 'bg-gray-300'
                  }`}
                />
                {opt.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function exportToCSV(leads: LeadRow[]) {
  const headers = ['שם', 'טלפון', 'אימייל', 'מקור', 'סטטוס', 'תאריך', 'נוצר קשר לאחרונה']
  const rows = leads.map((l) => [
    l.full_name ?? '',
    l.phone ?? '',
    l.email ?? '',
    l.source,
    LEAD_STATUS_LABELS[l.status] ?? l.status,
    new Date(l.created_at).toLocaleDateString('he-IL'),
    l.last_contacted_at ? new Date(l.last_contacted_at).toLocaleDateString('he-IL') : '',
  ])
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const bom = '﻿' // UTF-8 BOM for Excel
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `לידים-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function LeadsTableClient({ leads: initialLeads, total }: LeadsTableClientProps) {
  const [leads, setLeads] = useState<LeadRow[]>(initialLeads)

  const handleStatusUpdate = (id: string, newStatus: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)))
  }

  if (leads.length === 0) {
    return <div className="py-16 text-center text-gray-500 text-sm">לא נמצאו לידים</div>
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50">
        <span className="text-xs text-gray-500">מציג {leads.length} מתוך {total}</span>
        <button
          onClick={() => exportToCSV(leads)}
          className="inline-flex items-center gap-1.5 text-xs text-[#2D6A4F] hover:text-[#1B4332] font-medium transition-colors"
          title="ייצא לאקסל"
        >
          <FileDown className="h-4 w-4" />
          ייצוא CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" dir="rtl">
          <thead>
            <tr className="border-b border-gray-100 bg-white">
              <th className="text-right px-4 py-3 font-medium text-gray-600">שם</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">יצירת קשר</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">מקור</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">סטטוס</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">תאריך</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-medium text-gray-900 hover:text-[#2D6A4F] hover:underline"
                  >
                    {lead.full_name ?? 'לא צוין'}
                  </Link>
                  {lead.email && (
                    <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">
                      {lead.email}
                    </div>
                  )}
                  {lead.last_contacted_at && (
                    <div className="text-xs text-emerald-600 mt-0.5">
                      קשר: {new Date(lead.last_contacted_at).toLocaleDateString('he-IL')}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {lead.phone ? (
                      <>
                        <a
                          href={`tel:${lead.phone.replace(/\D/g, '')}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                          title={`התקשר ל-${lead.phone}`}
                          aria-label={`התקשר ל-${lead.phone}`}
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                        <a
                          href={`https://wa.me/972${lead.phone.replace(/^0/, '').replace(/\D/g, '')}?text=${encodeURIComponent('היי, פנית אלינו דרך האתר ואני רוצה לעזור לך')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="שלח וואטסאפ"
                          aria-label="שלח וואטסאפ"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      </>
                    ) : null}
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title={`שלח מייל ל-${lead.email}`}
                        aria-label={`שלח מייל ל-${lead.email}`}
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {!lead.phone && !lead.email && (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                    {lead.phone && (
                      <span className="text-gray-600 text-xs mr-1" dir="ltr">{lead.phone}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs capitalize">{lead.source}</td>
                <td className="px-4 py-3">
                  <StatusBadge
                    leadId={lead.id}
                    status={lead.status}
                    onUpdate={handleStatusUpdate}
                  />
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {formatDate(lead.created_at)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="text-xs text-[#2D6A4F] hover:underline whitespace-nowrap"
                  >
                    פרטים ←
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
