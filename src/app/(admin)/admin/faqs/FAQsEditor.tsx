'use client'
import React, { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Check, X, Loader2 } from 'lucide-react'
import type { FAQ } from '@/types'

interface FAQsEditorProps {
  faqs: FAQ[]
}

interface FAQForm {
  question: string
  answer: string
}

export function FAQsEditor({ faqs: initialFaqs }: FAQsEditorProps) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FAQForm>({ question: '', answer: '' })
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState<FAQForm>({ question: '', answer: '' })
  const [adding, setAdding] = useState(false)
  const [, startTransition] = useTransition()
  const supabase = createClient()

  const startEdit = (faq: FAQ) => {
    setEditingId(faq.id)
    setEditForm({ question: faq.question, answer: faq.answer })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ question: '', answer: '' })
  }

  const saveEdit = async (faqId: string) => {
    if (!editForm.question.trim() || !editForm.answer.trim()) {
      toast.error('יש למלא שאלה ותשובה')
      return
    }
    setSaving(true)
    const { data, error } = await supabase
      .from('faqs')
      .update({ question: editForm.question.trim(), answer: editForm.answer.trim() })
      .eq('id', faqId)
      .select()
      .single()

    if (error) {
      toast.error('שגיאה בשמירה')
    } else if (data) {
      setFaqs((prev) => prev.map((f) => (f.id === faqId ? (data as FAQ) : f)))
      setEditingId(null)
      toast.success('שאלה עודכנה')
      // Audit
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id, action: 'update_faq', entity_type: 'faq', entity_id: faqId,
        })
      }
    }
    setSaving(false)
  }

  const togglePublish = (faq: FAQ) => {
    startTransition(async () => {
      const { data, error } = await supabase
        .from('faqs')
        .update({ is_published: !faq.is_published })
        .eq('id', faq.id)
        .select()
        .single()

      if (error) {
        toast.error('שגיאה בעדכון')
      } else if (data) {
        setFaqs((prev) => prev.map((f) => (f.id === faq.id ? (data as FAQ) : f)))
        toast.success(faq.is_published ? 'הסתרת שאלה' : 'שאלה מוצגת')
      }
    })
  }

  const deleteFaq = async (faqId: string) => {
    if (!confirm('למחוק את השאלה לצמיתות?')) return
    const { error } = await supabase.from('faqs').delete().eq('id', faqId)
    if (error) {
      toast.error('שגיאה במחיקה')
    } else {
      setFaqs((prev) => prev.filter((f) => f.id !== faqId))
      toast.success('שאלה נמחקה')
      // Audit
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id, action: 'delete_faq', entity_type: 'faq', entity_id: faqId,
        })
      }
    }
  }

  const moveOrder = async (faqId: string, direction: 'up' | 'down') => {
    const idx = faqs.findIndex((f) => f.id === faqId)
    if (idx < 0) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === faqs.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const newFaqs = [...faqs]
    // Swap display_order values
    const aOrder = newFaqs[idx].display_order
    const bOrder = newFaqs[swapIdx].display_order
    newFaqs[idx] = { ...newFaqs[idx], display_order: bOrder }
    newFaqs[swapIdx] = { ...newFaqs[swapIdx], display_order: aOrder }
    // Swap positions in array
    ;[newFaqs[idx], newFaqs[swapIdx]] = [newFaqs[swapIdx], newFaqs[idx]]
    setFaqs(newFaqs)

    // Persist both
    await Promise.all([
      supabase.from('faqs').update({ display_order: bOrder }).eq('id', faqId),
      supabase.from('faqs').update({ display_order: aOrder }).eq('id', newFaqs[idx].id),
    ])
  }

  const addFaq = async () => {
    if (!addForm.question.trim() || !addForm.answer.trim()) {
      toast.error('יש למלא שאלה ותשובה')
      return
    }
    setAdding(true)
    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.display_order)) + 1 : 1
    const { data, error } = await supabase
      .from('faqs')
      .insert({
        question: addForm.question.trim(),
        answer: addForm.answer.trim(),
        display_order: maxOrder,
        is_published: true,
      })
      .select()
      .single()

    if (error) {
      toast.error('שגיאה בהוספה')
    } else if (data) {
      setFaqs((prev) => [...prev, data as FAQ])
      setAddForm({ question: '', answer: '' })
      setShowAddForm(false)
      toast.success('שאלה נוספה')
      // Audit
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id, action: 'create_faq', entity_type: 'faq', entity_id: (data as FAQ).id,
        })
      }
    }
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowAddForm((v) => !v)}
          className="bg-[#2D6A4F] hover:bg-[#1B4332] gap-2"
        >
          <Plus className="h-4 w-4" />
          הוסף שאלה
        </Button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-[#2D6A4F]/30 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">שאלה חדשה</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">שאלה</label>
              <input
                type="text"
                value={addForm.question}
                onChange={(e) => setAddForm((f) => ({ ...f, question: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                placeholder="מה השאלה?"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">תשובה</label>
              <Textarea
                value={addForm.answer}
                onChange={(e) => setAddForm((f) => ({ ...f, answer: e.target.value }))}
                rows={3}
                placeholder="מה התשובה?"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={addFaq}
                disabled={adding}
                className="bg-[#2D6A4F] hover:bg-[#1B4332] gap-2"
              >
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                הוסף
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowAddForm(false); setAddForm({ question: '', answer: '' }) }}
              >
                ביטול
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FAQs list */}
      {faqs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
          אין שאלות נפוצות עדיין. לחץ על &quot;הוסף שאלה&quot; להתחלה.
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                faq.is_published ? 'border-gray-200' : 'border-gray-200 opacity-60'
              }`}
            >
              {editingId === faq.id ? (
                <div className="p-5 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">שאלה</label>
                    <input
                      type="text"
                      value={editForm.question}
                      onChange={(e) => setEditForm((f) => ({ ...f, question: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">תשובה</label>
                    <Textarea
                      value={editForm.answer}
                      onChange={(e) => setEditForm((f) => ({ ...f, answer: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => saveEdit(faq.id)}
                      disabled={saving}
                      className="bg-[#2D6A4F] hover:bg-[#1B4332] gap-2"
                      size="sm"
                    >
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      שמור
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      <X className="h-3.5 w-3.5" />
                      ביטול
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400">#{faq.display_order}</span>
                        {!faq.is_published && (
                          <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">מוסתר</span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 mb-2">{faq.question}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Order buttons */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveOrder(faq.id, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                          title="הזז למעלה"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveOrder(faq.id, 'down')}
                          disabled={idx === faqs.length - 1}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                          title="הזז למטה"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => togglePublish(faq)}
                        className={`p-2 rounded-lg transition-colors ${
                          faq.is_published
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={faq.is_published ? 'הסתר' : 'הצג'}
                      >
                        {faq.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => startEdit(faq)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="ערוך"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteFaq(faq.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="מחק"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
