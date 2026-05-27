'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatDate, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '@/lib/utils'
import { Loader2, Plus, Edit2, Check, X, Phone, MessageCircle, Mail, Archive, ArchiveRestore, PhoneCall } from 'lucide-react'
import type { Lead, LeadNote, LeadStatus } from '@/types'

interface LeadActionsProps {
  lead: Lead & { lead_notes?: LeadNote[] }
}

const STATUS_OPTIONS: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'disqualified',
  'converted',
]

export function LeadActions({ lead }: LeadActionsProps) {
  const router = useRouter()
  const supabase = createClient()

  const [status, setStatus] = useState<LeadStatus>(lead.status)
  const [noteText, setNoteText] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [addingNote, setAddingNote] = useState(false)
  const [notes, setNotes] = useState<LeadNote[]>(lead.lead_notes ?? [])
  const [archiving, setArchiving] = useState(false)
  const [markingContact, setMarkingContact] = useState(false)

  // Edit mode
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(lead.full_name ?? '')
  const [editPhone, setEditPhone] = useState(lead.phone ?? '')
  const [editEmail, setEditEmail] = useState(lead.email ?? '')
  const [savingEdit, setSavingEdit] = useState(false)

  const updateStatus = async (newStatus: LeadStatus) => {
    setUpdatingStatus(true)
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', lead.id)

    if (error) {
      toast.error('שגיאה בעדכון הסטטוס')
    } else {
      setStatus(newStatus)
      toast.success('סטטוס עודכן')
      // Audit log
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'update_lead_status',
          entity_type: 'lead',
          entity_id: lead.id,
          metadata: { from: status, to: newStatus },
        })
      }
      router.refresh()
    }
    setUpdatingStatus(false)
  }

  const markContacted = async () => {
    setMarkingContact(true)
    const now = new Date().toISOString()
    const { error } = await supabase
      .from('leads')
      .update({ last_contacted_at: now, updated_at: now })
      .eq('id', lead.id)

    if (error) {
      toast.error('שגיאה בעדכון')
    } else {
      toast.success('תאריך קשר עודכן')
      // Audit log
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'mark_lead_contacted',
          entity_type: 'lead',
          entity_id: lead.id,
          metadata: { contacted_at: now },
        })
      }
      router.refresh()
    }
    setMarkingContact(false)
  }

  const archiveLead = async () => {
    if (!confirm(lead.archived_at ? 'לשחזר ליד מהארכיון?' : 'להעביר ליד לארכיון?')) return
    setArchiving(true)
    const now = new Date().toISOString()
    const { error } = await supabase
      .from('leads')
      .update({
        archived_at: lead.archived_at ? null : now,
        updated_at: now,
      })
      .eq('id', lead.id)

    if (error) {
      toast.error('שגיאה בפעולה')
    } else {
      toast.success(lead.archived_at ? 'ליד שוחזר מהארכיון' : 'ליד הועבר לארכיון')
      // Audit log
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: lead.archived_at ? 'unarchive_lead' : 'archive_lead',
          entity_type: 'lead',
          entity_id: lead.id,
        })
      }
      router.refresh()
    }
    setArchiving(false)
  }

  const saveEdit = async () => {
    setSavingEdit(true)
    const { error } = await supabase
      .from('leads')
      .update({
        full_name: editName || null,
        phone: editPhone || null,
        email: editEmail || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead.id)

    if (error) {
      toast.error('שגיאה בעדכון הפרטים')
    } else {
      toast.success('פרטים עודכנו')
      setEditing(false)
      router.refresh()
    }
    setSavingEdit(false)
  }

  const cancelEdit = () => {
    setEditName(lead.full_name ?? '')
    setEditPhone(lead.phone ?? '')
    setEditEmail(lead.email ?? '')
    setEditing(false)
  }

  const addNote = async () => {
    if (!noteText.trim()) return
    setAddingNote(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('לא מחובר')
      setAddingNote(false)
      return
    }

    const { data, error } = await supabase
      .from('lead_notes')
      .insert({
        lead_id: lead.id,
        content: noteText.trim(),
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      toast.error('שגיאה בהוספת הערה')
    } else if (data) {
      setNotes((prev) => [data as LeadNote, ...prev])
      setNoteText('')
      toast.success('הערה נוספה')
    }
    setAddingNote(false)
  }

  const whatsappHref = lead.phone
    ? `https://wa.me/972${lead.phone.replace(/^0/, '').replace(/\D/g, '')}?text=${encodeURIComponent('היי, פנית אלינו דרך האתר ואני רוצה לעזור לך')}`
    : null

  return (
    <>
      {/* Quick Contact */}
      {(lead.phone || lead.email) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">יצירת קשר מהירה</h2>
          <div className="flex flex-wrap gap-3">
            {lead.phone && (
              <a
                href={`tel:${lead.phone.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <Phone className="h-4 w-4" />
                התקשר עכשיו
              </a>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                שלח וואטסאפ
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Mail className="h-4 w-4" />
                שלח מייל
              </a>
            )}
            <button
              onClick={markContacted}
              disabled={markingContact}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-60 transition-colors"
            >
              {markingContact ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PhoneCall className="h-4 w-4" />
              )}
              סמן כנוצר קשר
            </button>
          </div>
        </div>
      )}

      {/* Edit Contact Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">עריכת פרטים</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 text-sm text-[#2D6A4F] hover:text-[#1B4332] font-medium transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              ערוך
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">שם מלא</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                placeholder="שם מלא"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">טלפון</label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                placeholder="050-1234567"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">אימייל</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={saveEdit}
                disabled={savingEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#1B4332] disabled:opacity-60 transition-colors"
              >
                {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                שמור
              </button>
              <button
                onClick={cancelEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
                ביטול
              </button>
            </div>
          </div>
        ) : (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-gray-400 text-xs mb-0.5">שם</dt>
              <dd className="font-medium text-gray-900">{lead.full_name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs mb-0.5">טלפון</dt>
              <dd className="font-medium text-gray-900" dir="ltr">{lead.phone ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs mb-0.5">אימייל</dt>
              <dd className="font-medium text-gray-900">{lead.email ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs mb-0.5">מקור</dt>
              <dd className="font-medium text-gray-900 capitalize">{lead.source}</dd>
            </div>
          </dl>
        )}
      </div>

      {/* Status Update */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">עדכון סטטוס</h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              disabled={updatingStatus || s === status}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
                s === status
                  ? `${LEAD_STATUS_COLORS[s]} cursor-default`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={s === status}
            >
              {updatingStatus && s === status ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin inline" />
              ) : (
                LEAD_STATUS_LABELS[s]
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">הערות פנימיות</h2>

        <div className="mb-5">
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="הוסף הערה פנימית — תזכורות, עדכונים, מידע חשוב..."
            rows={3}
          />
          <Button
            onClick={addNote}
            disabled={addingNote || !noteText.trim()}
            size="sm"
            className="mt-2 bg-[#2D6A4F] hover:bg-[#1B4332]"
          >
            {addingNote ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <><Plus className="h-3.5 w-3.5" />הוסף הערה</>
            )}
          </Button>
        </div>

        {notes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">אין הערות עדיין</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li key={note.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
                <time className="text-xs text-gray-400 mt-2 block">
                  {formatDate(note.created_at)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Archive */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-2">פעולות ניהוליות</h2>
        <p className="text-sm text-gray-500 mb-4">
          {lead.archived_at
            ? 'ליד זה נמצא בארכיון. ניתן לשחזר אותו.'
            : 'העברה לארכיון תסיר את הליד מהרשימה הפעילה.'}
        </p>
        <button
          onClick={archiveLead}
          disabled={archiving}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
            lead.archived_at
              ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          {archiving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : lead.archived_at ? (
            <ArchiveRestore className="h-4 w-4" />
          ) : (
            <Archive className="h-4 w-4" />
          )}
          {lead.archived_at ? 'שחזר מארכיון' : 'ארכב ליד'}
        </button>
      </div>
    </>
  )
}
