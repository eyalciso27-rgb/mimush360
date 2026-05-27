'use client'
import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Plus, Trash2, Eye, EyeOff, Edit2, Check, X } from 'lucide-react'
import type { Testimonial } from '@/types'

interface ContentEditorProps {
  testimonials: Testimonial[]
}

export function ContentEditor({ testimonials: initialTestimonials }: ContentEditorProps) {
  const supabase = createClient()

  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [newTestimonial, setNewTestimonial] = useState({ name: '', content: '', rating: 5 })
  const [addingTestimonial, setAddingTestimonial] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ name: string; content: string; rating: number }>({
    name: '', content: '', rating: 5,
  })
  const [savingEdit, setSavingEdit] = useState(false)

  const addTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.content) return
    setAddingTestimonial(true)
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          name: newTestimonial.name,
          content: newTestimonial.content,
          rating: newTestimonial.rating,
          is_published: true,
          display_order: testimonials.length + 1,
        })
        .select()
        .single()

      if (error) throw error
      if (data) {
        setTestimonials((prev) => [...prev, data as Testimonial])
        setNewTestimonial({ name: '', content: '', rating: 5 })
        toast.success('סיפור הצלחה נוסף')
      }
    } catch {
      toast.error('שגיאה בהוספת סיפור הצלחה')
    } finally {
      setAddingTestimonial(false)
    }
  }

  const startEdit = (t: Testimonial) => {
    setEditingId(t.id)
    setEditValues({ name: t.name, content: t.content, rating: t.rating })
  }

  const saveEdit = async (id: string) => {
    setSavingEdit(true)
    const { error } = await supabase
      .from('testimonials')
      .update({
        name: editValues.name,
        content: editValues.content,
        rating: editValues.rating,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      toast.error('שגיאה בשמירה')
    } else {
      setTestimonials((prev) =>
        prev.map((t) => t.id === id ? { ...t, ...editValues } : t)
      )
      setEditingId(null)
      toast.success('עודכן בהצלחה')
    }
    setSavingEdit(false)
  }

  const toggleTestimonial = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_published: !current })
      .eq('id', id)

    if (!error) {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_published: !current } : t))
      )
      toast.success(!current ? 'סיפור הוצג באתר' : 'סיפור הוסתר מהאתר')
    }
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm('האם למחוק סיפור הצלחה זה?')) return
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (!error) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
      toast.success('נמחק')
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">הוסף סיפור הצלחה חדש</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="t-name">שם הלקוח</Label>
            <Input
              id="t-name"
              value={newTestimonial.name}
              onChange={(e) => setNewTestimonial((p) => ({ ...p, name: e.target.value }))}
              placeholder="מ. כהן"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-rating">דירוג (1–5 כוכבים)</Label>
            <Input
              id="t-rating"
              type="number"
              min={1}
              max={5}
              value={newTestimonial.rating}
              onChange={(e) =>
                setNewTestimonial((p) => ({ ...p, rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 5)) }))
              }
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="t-content">תוכן ההמלצה</Label>
            <Textarea
              id="t-content"
              value={newTestimonial.content}
              onChange={(e) => setNewTestimonial((p) => ({ ...p, content: e.target.value }))}
              placeholder="הלקוח קיבל X ש&quot;ח לאחר שנים של מאבק..."
              rows={3}
            />
          </div>
        </div>
        <Button
          onClick={addTestimonial}
          disabled={addingTestimonial || !newTestimonial.name || !newTestimonial.content}
          className="mt-4 bg-[#2D6A4F] hover:bg-[#1B4332]"
        >
          {addingTestimonial ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          הוסף סיפור
        </Button>
      </div>

      {/* Existing Testimonials */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            סיפורי הצלחה קיימים ({testimonials.length})
          </h2>
          <span className="text-xs text-gray-400">
            {testimonials.filter((t) => t.is_published).length} מוצגים באתר
          </span>
        </div>
        {testimonials.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">אין סיפורי הצלחה עדיין</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {testimonials.map((t) => (
              <li key={t.id} className="px-6 py-5">
                {editingId === t.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`edit-name-${t.id}`} className="text-xs">שם</Label>
                        <Input
                          id={`edit-name-${t.id}`}
                          value={editValues.name}
                          onChange={(e) => setEditValues((p) => ({ ...p, name: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-rating-${t.id}`} className="text-xs">דירוג</Label>
                        <Input
                          id={`edit-rating-${t.id}`}
                          type="number"
                          min={1}
                          max={5}
                          value={editValues.rating}
                          onChange={(e) =>
                            setEditValues((p) => ({ ...p, rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 5)) }))
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`edit-content-${t.id}`} className="text-xs">תוכן</Label>
                      <Textarea
                        id={`edit-content-${t.id}`}
                        value={editValues.content}
                        onChange={(e) => setEditValues((p) => ({ ...p, content: e.target.value }))}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit(t.id)}
                        disabled={savingEdit}
                        className="bg-[#2D6A4F] hover:bg-[#1B4332]"
                      >
                        {savingEdit ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        שמור
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-3.5 w-3.5" />
                        ביטול
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">{t.name}</span>
                        <span className="text-amber-400 text-xs">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            t.is_published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {t.is_published ? 'מוצג באתר' : 'מוסתר'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{t.content}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(t)}
                        className="p-1.5 text-gray-500 hover:text-[#2D6A4F] hover:bg-gray-100 rounded-lg transition-colors"
                        title="ערוך"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleTestimonial(t.id, t.is_published)}
                        className="p-1.5 text-gray-500 hover:text-[#2D6A4F] hover:bg-gray-100 rounded-lg transition-colors"
                        title={t.is_published ? 'הסתר' : 'הצג'}
                      >
                        {t.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => deleteTestimonial(t.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="מחק"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
