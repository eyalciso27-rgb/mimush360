'use client'
import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Edit2, Check, X, Globe, Eye, EyeOff, Loader2, FileEdit } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Page } from '@/types'

const CONTENT_EDITABLE_SLUGS = ['home', 'about', 'how-it-works', 'contact']

interface PagesEditorProps {
  pages: Page[]
}

const SLUG_LABELS: Record<string, string> = {
  home: 'דף ראשי',
  about: 'אודות',
  'how-it-works': 'איך זה עובד',
  contact: 'צור קשר',
  testimonials: 'סיפורי הצלחה',
  lp: 'דף נחיתה',
}

export function PagesEditor({ pages: initialPages }: PagesEditorProps) {
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editMeta, setEditMeta] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const startEdit = (page: Page) => {
    setEditingId(page.id)
    setEditTitle(page.title)
    setEditMeta(page.meta_description ?? '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditMeta('')
  }

  const saveEdit = async (pageId: string) => {
    if (!editTitle.trim()) {
      toast.error('כותרת העמוד לא יכולה להיות ריקה')
      return
    }
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('pages')
      .update({
        title: editTitle.trim(),
        meta_description: editMeta.trim() || null,
        updated_by: user?.id ?? null,
      })
      .eq('id', pageId)
      .select()
      .single()

    if (error) {
      toast.error('שגיאה בשמירה')
    } else if (data) {
      setPages((prev) => prev.map((p) => (p.id === pageId ? (data as Page) : p)))
      setEditingId(null)
      toast.success('עמוד עודכן')
      // Audit
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'update_page_seo',
          entity_type: 'page',
          entity_id: pageId,
          metadata: { title: editTitle.trim(), meta_description: editMeta.trim() || null },
        })
      }
    }
    setSaving(false)
  }

  const togglePublish = async (page: Page) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('pages')
      .update({
        is_published: !page.is_published,
        updated_by: user?.id ?? null,
      })
      .eq('id', page.id)
      .select()
      .single()

    if (error) {
      toast.error('שגיאה בעדכון')
    } else if (data) {
      setPages((prev) => prev.map((p) => (p.id === page.id ? (data as Page) : p)))
      toast.success(page.is_published ? 'עמוד הוסתר' : 'עמוד פורסם')
    }
  }

  if (pages.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
        לא נמצאו עמודים. יש לוודא שהטבלה מאותחלת נכון.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pages.map((page) => (
        <div
          key={page.id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          {editingId === page.id ? (
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="h-5 w-5 text-[#2D6A4F]" />
                <span className="font-semibold text-gray-900">
                  {SLUG_LABELS[page.slug] ?? page.slug}
                </span>
                <span className="text-xs text-gray-400 font-mono">/{page.slug}</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  כותרת SEO (title tag)
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  maxLength={70}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  placeholder="כותרת העמוד לגוגל..."
                />
                <p className="text-xs text-gray-400 mt-1">{editTitle.length}/70 תווים</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  תיאור מטא (meta description)
                </label>
                <textarea
                  value={editMeta}
                  onChange={(e) => setEditMeta(e.target.value)}
                  maxLength={160}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none"
                  placeholder="תיאור קצר לתוצאות החיפוש..."
                />
                <p className="text-xs text-gray-400 mt-1">{editMeta.length}/160 תווים</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(page.id)}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#1B4332] disabled:opacity-60 transition-colors"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
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
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="h-5 w-5 text-[#2D6A4F] shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {SLUG_LABELS[page.slug] ?? page.slug}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">/{page.slug}</span>
                        {!page.is_published && (
                          <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">טיוטה</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 mr-8">
                    <div>
                      <span className="text-xs text-gray-400">כותרת: </span>
                      <span className="text-sm text-gray-800">{page.title}</span>
                    </div>
                    {page.meta_description ? (
                      <div>
                        <span className="text-xs text-gray-400">תיאור מטא: </span>
                        <span className="text-sm text-gray-600 line-clamp-2">{page.meta_description}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-amber-600">⚠ אין תיאור מטא — מומלץ להוסיף</div>
                    )}
                    <div className="text-xs text-gray-400">
                      עודכן: {formatDate(page.updated_at)}
                    </div>
                    {CONTENT_EDITABLE_SLUGS.includes(page.slug) && (
                      <div className="mt-2">
                        <a
                          href={`/admin/pages/${page.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2D6A4F] hover:text-[#1B4332] bg-[#2D6A4F]/10 hover:bg-[#2D6A4F]/20 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <FileEdit className="h-3.5 w-3.5" />
                          ערוך תוכן עמוד
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePublish(page)}
                    className={`p-2 rounded-lg transition-colors ${
                      page.is_published
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={page.is_published ? 'הסתר עמוד' : 'פרסם עמוד'}
                  >
                    {page.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(page)}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    title="ערוך SEO"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {CONTENT_EDITABLE_SLUGS.includes(page.slug) && (
                    <a
                      href={`/admin/pages/${page.slug}`}
                      className="p-2 rounded-lg text-[#2D6A4F] hover:bg-[#2D6A4F]/10 transition-colors"
                      title="ערוך תוכן"
                    >
                      <FileEdit className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
