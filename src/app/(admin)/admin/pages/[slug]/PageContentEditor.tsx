'use client'
import React, { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Save, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

interface PageContentEditorProps {
  slug: string
  pageId: string | null
  initialContent: Record<string, unknown>
  pageName: string
}

// ─── Reusable list editors ────────────────────────────────────────────────────

function StringListEditor({
  label,
  hint,
  items,
  onChange,
}: {
  label: string
  hint?: string
  items: string[]
  onChange: (items: string[]) => void
}) {
  const move = (from: number, to: number) => {
    const next = [...items]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => i > 0 && move(i, i - 1)}
                disabled={i === 0}
                className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                title="העלה"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => i < items.length - 1 && move(i, i + 1)}
                disabled={i === items.length - 1}
                className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                title="הורד"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items]
                next[i] = e.target.value
                onChange(next)
              }}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              dir="rtl"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="מחק"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#2D6A4F] hover:text-[#1B4332] font-medium"
      >
        <Plus className="h-4 w-4" />
        הוסף פריט
      </button>
    </div>
  )
}

interface TitleDescItem {
  title: string
  description: string
}

function TitleDescListEditor({
  label,
  items,
  onChange,
  stepField,
}: {
  label: string
  items: TitleDescItem[]
  onChange: (items: TitleDescItem[]) => void
  stepField?: boolean
}) {
  const move = (from: number, to: number) => {
    const next = [...items]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                פריט {i + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => i > 0 && move(i, i - 1)}
                  disabled={i === 0}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  title="העלה"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => i < items.length - 1 && move(i, i + 1)}
                  disabled={i === items.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  title="הורד"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="מחק"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {stepField && (
              <div className="mb-2">
                <label className="block text-xs text-gray-500 mb-1">מספר שלב</label>
                <input
                  type="text"
                  value={(item as unknown as Record<string, string>).step ?? String(i + 1).padStart(2, '0')}
                  onChange={(e) => {
                    const next = [...items]
                    ;(next[i] as unknown as Record<string, string>).step = e.target.value
                    onChange(next)
                  }}
                  className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  dir="ltr"
                />
              </div>
            )}
            <div className="mb-2">
              <label className="block text-xs text-gray-500 mb-1">כותרת</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => {
                  const next = [...items]
                  next[i] = { ...next[i], title: e.target.value }
                  onChange(next)
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">תיאור</label>
              <textarea
                value={item.description}
                onChange={(e) => {
                  const next = [...items]
                  next[i] = { ...next[i], description: e.target.value }
                  onChange(next)
                }}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none"
                dir="rtl"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          onChange([
            ...items,
            stepField
              ? ({ step: String(items.length + 1).padStart(2, '0'), title: '', description: '' } as unknown as TitleDescItem)
              : { title: '', description: '' },
          ])
        }
        className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#2D6A4F] hover:text-[#1B4332] font-medium"
      >
        <Plus className="h-4 w-4" />
        הוסף פריט
      </button>
    </div>
  )
}

// ─── Field helpers ────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  value,
  onChange,
  multiline = false,
  rows = 3,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  rows?: number
}) {
  const cls =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]'
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={`${cls} resize-none`} dir="rtl" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} dir="rtl" />
      )}
    </div>
  )
}

// ─── Tab component ────────────────────────────────────────────────────────────

function Tabs({ tabs, activeTab, onSelect }: { tabs: string[]; activeTab: string; onSelect: (t: string) => void }) {
  return (
    <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onSelect(tab)}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors ${
            activeTab === tab
              ? 'bg-white border border-b-white border-gray-200 text-[#2D6A4F] -mb-px'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

// ─── Page-specific editors ────────────────────────────────────────────────────

function HomeEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const [tab, setTab] = useState('Hero')
  const hero = (content.hero as Record<string, unknown>) ?? {}
  const features = (content.features as TitleDescItem[]) ?? []

  const setHero = (patch: Record<string, unknown>) =>
    onChange({ ...content, hero: { ...hero, ...patch } })

  return (
    <>
      <Tabs tabs={['Hero', 'יתרונות', 'CTA']} activeTab={tab} onSelect={setTab} />
      {tab === 'Hero' && (
        <div className="space-y-4">
          <Field label="תג (badge)" value={(hero.tag as string) ?? ''} onChange={(v) => setHero({ tag: v })} />
          <Field label="שורת כותרת 1" value={(hero.heading_line1 as string) ?? ''} onChange={(v) => setHero({ heading_line1: v })} />
          <Field label="שורת כותרת 2" value={(hero.heading_line2 as string) ?? ''} onChange={(v) => setHero({ heading_line2: v })} />
          <Field label="שורת כותרת 3" value={(hero.heading_line3 as string) ?? ''} onChange={(v) => setHero({ heading_line3: v })} />
          <Field label="טקסט מודגש בצהוב" hint="הטקסט שמופיע בצבע זהב בכותרת" value={(hero.heading_highlight as string) ?? ''} onChange={(v) => setHero({ heading_highlight: v })} />
          <Field label="כיתוב משני (subtitle)" value={(hero.subtitle as string) ?? ''} onChange={(v) => setHero({ subtitle: v })} multiline rows={3} />
          <StringListEditor
            label="רשימת יתרונות (bullets)"
            hint="הפריטים עם סימן ✓ מתחת לכותרת"
            items={(hero.benefits as string[]) ?? []}
            onChange={(v) => setHero({ benefits: v })}
          />
          <Field label="טקסט כפתור ראשי" value={(hero.cta_primary as string) ?? ''} onChange={(v) => setHero({ cta_primary: v })} />
          <Field label="טקסט כפתור WhatsApp" value={(hero.cta_whatsapp as string) ?? ''} onChange={(v) => setHero({ cta_whatsapp: v })} />
        </div>
      )}
      {tab === 'יתרונות' && (
        <div className="space-y-4">
          <Field label="כותרת סקשן" value={(content.features_heading as string) ?? ''} onChange={(v) => onChange({ ...content, features_heading: v })} />
          <Field label="כיתוב משני" value={(content.features_subtitle as string) ?? ''} onChange={(v) => onChange({ ...content, features_subtitle: v })} multiline rows={2} />
          <TitleDescListEditor
            label="כרטיסי יתרונות"
            items={features}
            onChange={(v) => onChange({ ...content, features: v })}
          />
        </div>
      )}
      {tab === 'CTA' && (
        <div className="space-y-4">
          <Field label="כותרת" value={(content.cta_title as string) ?? ''} onChange={(v) => onChange({ ...content, cta_title: v })} />
          <Field label="כיתוב משני" value={(content.cta_subtitle as string) ?? ''} onChange={(v) => onChange({ ...content, cta_subtitle: v })} multiline rows={2} />
        </div>
      )}
    </>
  )
}

function AboutEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const [tab, setTab] = useState('Hero')
  const values = (content.values as TitleDescItem[]) ?? []

  return (
    <>
      <Tabs tabs={['Hero', 'הסיפור שלנו', 'ערכים', 'CTA']} activeTab={tab} onSelect={setTab} />
      {tab === 'Hero' && (
        <div className="space-y-4">
          <Field label="תג (badge)" value={(content.hero_tag as string) ?? ''} onChange={(v) => onChange({ ...content, hero_tag: v })} />
          <Field label="כותרת" value={(content.hero_heading as string) ?? ''} onChange={(v) => onChange({ ...content, hero_heading: v })} />
          <Field label="טקסט מודגש בצהוב" hint="שורת ההדגשה שמופיעה בצבע זהב" value={(content.hero_heading_highlight as string) ?? ''} onChange={(v) => onChange({ ...content, hero_heading_highlight: v })} />
          <Field label="כיתוב משני" value={(content.hero_subtitle as string) ?? ''} onChange={(v) => onChange({ ...content, hero_subtitle: v })} multiline rows={3} />
        </div>
      )}
      {tab === 'הסיפור שלנו' && (
        <div className="space-y-4">
          <Field label="כותרת סקשן" value={(content.story_heading as string) ?? ''} onChange={(v) => onChange({ ...content, story_heading: v })} />
          <StringListEditor
            label="פסקאות הסיפור"
            hint="כל פריט = פסקה נפרדת"
            items={(content.story_paragraphs as string[]) ?? []}
            onChange={(v) => onChange({ ...content, story_paragraphs: v })}
          />
          <StringListEditor
            label="סטטיסטיקות / נקודות חוזקה"
            hint="הפריטים עם סימן ✓ בעמוד האודות"
            items={(content.stats as string[]) ?? []}
            onChange={(v) => onChange({ ...content, stats: v })}
          />
        </div>
      )}
      {tab === 'ערכים' && (
        <div className="space-y-4">
          <Field label="כותרת" value={(content.values_heading as string) ?? ''} onChange={(v) => onChange({ ...content, values_heading: v })} />
          <Field label="כיתוב משני" value={(content.values_subtitle as string) ?? ''} onChange={(v) => onChange({ ...content, values_subtitle: v })} multiline rows={2} />
          <TitleDescListEditor
            label="ערכי החברה"
            items={values}
            onChange={(v) => onChange({ ...content, values: v })}
          />
        </div>
      )}
      {tab === 'CTA' && (
        <div className="space-y-4">
          <Field label="כותרת" value={(content.cta_title as string) ?? ''} onChange={(v) => onChange({ ...content, cta_title: v })} />
          <Field label="כיתוב משני" value={(content.cta_subtitle as string) ?? ''} onChange={(v) => onChange({ ...content, cta_subtitle: v })} multiline rows={2} />
        </div>
      )}
    </>
  )
}

function HowItWorksEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const [tab, setTab] = useState('Hero')
  const steps = (content.steps as TitleDescItem[]) ?? []

  return (
    <>
      <Tabs tabs={['Hero', 'שלבים', 'שירותים', 'CTA']} activeTab={tab} onSelect={setTab} />
      {tab === 'Hero' && (
        <div className="space-y-4">
          <Field label="תג (badge)" value={(content.hero_tag as string) ?? ''} onChange={(v) => onChange({ ...content, hero_tag: v })} />
          <Field label="כותרת" value={(content.hero_heading as string) ?? ''} onChange={(v) => onChange({ ...content, hero_heading: v })} />
          <Field label="כיתוב משני" value={(content.hero_subtitle as string) ?? ''} onChange={(v) => onChange({ ...content, hero_subtitle: v })} multiline rows={3} />
        </div>
      )}
      {tab === 'שלבים' && (
        <div className="space-y-4">
          <Field label="תג (badge) של סקשן השלבים" value={(content.steps_tag as string) ?? ''} onChange={(v) => onChange({ ...content, steps_tag: v })} />
          <Field label="כותרת" value={(content.steps_heading as string) ?? ''} onChange={(v) => onChange({ ...content, steps_heading: v })} />
          <Field label="כיתוב משני" value={(content.steps_subtitle as string) ?? ''} onChange={(v) => onChange({ ...content, steps_subtitle: v })} multiline rows={2} />
          <TitleDescListEditor
            label="שלבי התהליך"
            items={steps}
            onChange={(v) => onChange({ ...content, steps: v })}
            stepField
          />
        </div>
      )}
      {tab === 'שירותים' && (
        <div className="space-y-4">
          <Field label="כותרת" value={(content.services_heading as string) ?? ''} onChange={(v) => onChange({ ...content, services_heading: v })} />
          <Field label="כיתוב משני" value={(content.services_subtitle as string) ?? ''} onChange={(v) => onChange({ ...content, services_subtitle: v })} multiline rows={2} />
          <StringListEditor
            label="רשימת שירותים"
            hint="כל פריט מופיע עם ✓ ירוק"
            items={(content.services as string[]) ?? []}
            onChange={(v) => onChange({ ...content, services: v })}
          />
        </div>
      )}
      {tab === 'CTA' && (
        <div className="space-y-4">
          <Field label="כותרת" value={(content.cta_title as string) ?? ''} onChange={(v) => onChange({ ...content, cta_title: v })} />
          <Field label="כיתוב משני" value={(content.cta_subtitle as string) ?? ''} onChange={(v) => onChange({ ...content, cta_subtitle: v })} multiline rows={2} />
        </div>
      )}
    </>
  )
}

function ContactEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const [tab, setTab] = useState('Hero')

  return (
    <>
      <Tabs tabs={['Hero', 'טופס', 'CTA']} activeTab={tab} onSelect={setTab} />
      {tab === 'Hero' && (
        <div className="space-y-4">
          <Field label="תג (badge)" value={(content.hero_tag as string) ?? ''} onChange={(v) => onChange({ ...content, hero_tag: v })} />
          <Field label="כותרת" value={(content.hero_heading as string) ?? ''} onChange={(v) => onChange({ ...content, hero_heading: v })} />
          <Field label="כיתוב משני" value={(content.hero_subtitle as string) ?? ''} onChange={(v) => onChange({ ...content, hero_subtitle: v })} multiline rows={3} />
        </div>
      )}
      {tab === 'טופס' && (
        <div className="space-y-4">
          <Field label="כותרת הטופס" value={(content.form_title as string) ?? ''} onChange={(v) => onChange({ ...content, form_title: v })} />
          <Field label="כיתוב משני בטופס" value={(content.form_subtitle as string) ?? ''} onChange={(v) => onChange({ ...content, form_subtitle: v })} multiline rows={2} />
        </div>
      )}
      {tab === 'CTA' && (
        <div className="space-y-4">
          <Field label="כותרת" value={(content.cta_title as string) ?? ''} onChange={(v) => onChange({ ...content, cta_title: v })} />
          <Field label="כיתוב משני" value={(content.cta_subtitle as string) ?? ''} onChange={(v) => onChange({ ...content, cta_subtitle: v })} multiline rows={2} />
        </div>
      )}
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PageContentEditor({ slug, pageId, initialContent, pageName }: PageContentEditorProps) {
  const [content, setContent] = useState<Record<string, unknown>>(initialContent)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const save = useCallback(async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('pages')
        .update({
          content: content,
          updated_by: user?.id ?? null,
        })
        .eq('slug', slug)

      if (error) {
        toast.error('שגיאה בשמירה: ' + error.message)
        return
      }

      toast.success('נשמר! השינויים יופיעו באתר מיד')

      // Audit log
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'update_page_content',
          entity_type: 'page',
          entity_id: pageId ?? undefined,
          metadata: { slug, pageName },
        })
      }
    } catch {
      toast.error('שגיאה בלתי צפויה')
    } finally {
      setSaving(false)
    }
  }, [content, slug, pageId, pageName, supabase])

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <p className="text-sm text-gray-500">
          עורך תוכן מלא — כל שינוי נשמר ל-Supabase ומוצג מיידית באתר
        </p>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D6A4F] text-white rounded-lg text-sm font-semibold hover:bg-[#1B4332] disabled:opacity-60 transition-colors shadow-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'שומר...' : 'שמור שינויים'}
        </button>
      </div>

      {/* Editor body */}
      <div className="p-6">
        {slug === 'home' && <HomeEditor content={content} onChange={setContent} />}
        {slug === 'about' && <AboutEditor content={content} onChange={setContent} />}
        {slug === 'how-it-works' && <HowItWorksEditor content={content} onChange={setContent} />}
        {slug === 'contact' && <ContactEditor content={content} onChange={setContent} />}
      </div>

      {/* Bottom save */}
      <div className="flex justify-end px-6 py-4 border-t border-gray-100">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D6A4F] text-white rounded-lg text-sm font-semibold hover:bg-[#1B4332] disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'שומר...' : 'שמור שינויים'}
        </button>
      </div>
    </div>
  )
}
