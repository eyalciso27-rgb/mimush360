'use client'
import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { Save, Loader2 } from 'lucide-react'
import type { Profile, AuditLog, UserRole } from '@/types'

interface SiteSetting {
  key: string
  value: string
  description: string
}

interface AdminSettingsClientProps {
  profiles: Pick<Profile, 'id' | 'email' | 'full_name' | 'role' | 'created_at'>[]
  auditLogs: AuditLog[]
  currentUserId: string
  siteSettings: SiteSetting[]
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'מנהל',
  editor: 'עורך',
  viewer: 'צופה',
}

const SITE_SETTING_LABELS: Record<string, { label: string; placeholder: string; hint?: string }> = {
  phone: {
    label: 'טלפון',
    placeholder: '050-1234567',
    hint: 'מספר הטלפון שיוצג בכל האתר',
  },
  whatsapp: {
    label: 'וואטסאפ',
    placeholder: '9720501234567',
    hint: 'מספר וואטסאפ ללא + (לדוגמה: 9720501234567)',
  },
  email: {
    label: 'אימייל',
    placeholder: 'info@mimush360.co.il',
    hint: 'כתובת אימייל ליצירת קשר',
  },
  address: {
    label: 'כתובת',
    placeholder: 'תל אביב, ישראל',
  },
  typeform_id: {
    label: 'Typeform ID',
    placeholder: 'השאר ריק למעבר לדף יצירת קשר',
    hint: 'מזהה הטופס מ-typeform.com — ישמש לכפתור "בדקו אם מגיע לכם כסף". אם ריק, הכפתור יעביר לדף יצירת קשר.',
  },
}

// Keys to show, in order
const SETTING_KEYS = ['phone', 'whatsapp', 'email', 'address', 'typeform_id']

export function AdminSettingsClient({
  profiles: initialProfiles,
  auditLogs,
  currentUserId,
  siteSettings: initialSiteSettings,
}: AdminSettingsClientProps) {
  const supabase = createClient()
  const [profiles, setProfiles] = useState(initialProfiles)
  const [activeTab, setActiveTab] = useState<'site' | 'users' | 'audit'>('site')
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)

  // Build a map from key → value for site settings
  const buildMap = (settings: SiteSetting[]) =>
    Object.fromEntries(settings.map((s) => [s.key, s.value]))

  const [siteValues, setSiteValues] = useState<Record<string, string>>(() =>
    buildMap(initialSiteSettings)
  )
  const [savingSite, setSavingSite] = useState(false)

  const updateRole = async (userId: string, newRole: UserRole) => {
    setUpdatingRole(userId)
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      toast.error('שגיאה בעדכון תפקיד')
    } else {
      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
      )
      toast.success('תפקיד עודכן')
    }
    setUpdatingRole(null)
  }

  const saveSiteSettings = async () => {
    setSavingSite(true)
    try {
      const upserts = SETTING_KEYS.map((key) => ({
        key,
        value: siteValues[key] ?? '',
        description: SITE_SETTING_LABELS[key]?.label ?? key,
        updated_at: new Date().toISOString(),
      }))

      const { error } = await supabase
        .from('site_settings')
        .upsert(upserts, { onConflict: 'key' })

      if (error) {
        toast.error('שגיאה בשמירת ההגדרות: ' + error.message)
      } else {
        toast.success('ההגדרות נשמרו בהצלחה! רענן את האתר לראות את השינויים.')
      }
    } catch (e) {
      toast.error('שגיאה לא צפויה')
    } finally {
      setSavingSite(false)
    }
  }

  return (
    <div>
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit" role="tablist">
        {(['site', 'users', 'audit'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'site' ? 'פרטי האתר' : tab === 'users' ? 'ניהול משתמשים' : 'יומן פעולות'}
          </button>
        ))}
      </div>

      {/* ── Site Settings Tab ── */}
      {activeTab === 'site' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">פרטי יצירת קשר והגדרות האתר</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              השינויים יופיעו בכל האתר — כותרת, תחתית עמוד, כפתורים ועמוד יצירת קשר.
            </p>
          </div>
          <div className="p-6 space-y-5">
            {SETTING_KEYS.map((key) => {
              const meta = SITE_SETTING_LABELS[key]
              return (
                <div key={key}>
                  <label
                    htmlFor={`site-${key}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {meta.label}
                  </label>
                  <input
                    id={`site-${key}`}
                    type="text"
                    value={siteValues[key] ?? ''}
                    onChange={(e) =>
                      setSiteValues((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    placeholder={meta.placeholder}
                    dir={key === 'typeform_id' ? 'ltr' : 'rtl'}
                    className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent"
                  />
                  {meta.hint && (
                    <p className="mt-1 text-xs text-gray-400">{meta.hint}</p>
                  )}
                </div>
              )
            })}

            <div className="pt-2">
              <button
                onClick={saveSiteSettings}
                disabled={savingSite}
                className="inline-flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
              >
                {savingSite ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                שמור שינויים
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Users Tab ── */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">משתמשים ({profiles.length})</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              עדכון תפקידים. הוספת משתמשים חדשים דרך Supabase Auth.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-right px-6 py-3 font-medium text-gray-600">שם</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-600">אימייל</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-600">תפקיד</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-600">הצטרף</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {p.full_name ?? '—'}
                      {p.id === currentUserId && (
                        <span className="mr-2 text-xs bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5">
                          אתה
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600" dir="ltr">{p.email}</td>
                    <td className="px-6 py-4">
                      {p.id === currentUserId ? (
                        <span className="text-gray-700 font-medium">{ROLE_LABELS[p.role]}</span>
                      ) : (
                        <select
                          value={p.role}
                          onChange={(e) => updateRole(p.id, e.target.value as UserRole)}
                          disabled={updatingRole === p.id}
                          className="h-8 rounded-lg border border-gray-300 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] disabled:opacity-50"
                          aria-label={`תפקיד של ${p.full_name ?? p.email}`}
                        >
                          {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
                            <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Audit Log Tab ── */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">יומן פעולות</h2>
            <p className="text-xs text-gray-500 mt-0.5">20 הפעולות האחרונות במערכת</p>
          </div>
          {auditLogs.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">אין פעולות עדיין</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir="rtl">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-right px-6 py-3 font-medium text-gray-600">פעולה</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-600">ישות</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-600">תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{log.action}</td>
                      <td className="px-6 py-3 text-gray-600 text-xs">
                        {log.entity_type}
                        {log.entity_id ? ` / ${log.entity_id.slice(0, 8)}...` : ''}
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs">
                        {formatDate(log.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
