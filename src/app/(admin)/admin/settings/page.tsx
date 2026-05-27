import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSettingsClient } from './AdminSettingsClient'
import type { Metadata } from 'next'
import type { Profile, AuditLog } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'הגדרות ניהול | מימוש 360',
  robots: { index: false, follow: false },
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as Profile | null

  if (profile?.role !== 'admin') redirect('/admin')

  const [profilesResult, auditResult, siteSettingsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: true }),
    supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('site_settings')
      .select('key, value, description')
      .order('key', { ascending: true }),
  ])

  const profiles = (profilesResult.data ?? []) as Pick<Profile, 'id' | 'email' | 'full_name' | 'role' | 'created_at'>[]
  const auditLogs = (auditResult.data ?? []) as AuditLog[]
  const siteSettings = (siteSettingsResult.data ?? []) as { key: string; value: string; description: string }[]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">הגדרות</h1>
        <p className="text-gray-500 text-sm mt-1">פרטי האתר, ניהול משתמשים ויומן פעולות</p>
      </div>

      <AdminSettingsClient
        profiles={profiles}
        auditLogs={auditLogs}
        currentUserId={user.id}
        siteSettings={siteSettings}
      />
    </div>
  )
}
