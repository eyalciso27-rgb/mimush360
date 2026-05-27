import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import type { Profile } from '@/types'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware already handles auth redirect for /admin/* routes.
  // Layout only fetches profile for sidebar; login page skips this layout
  // because it lives outside the (admin)/admin route tree conceptually,
  // but since Next.js nests it here we just guard gracefully.
  let profile: Profile | null = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      profile = data as Profile | null
    }
  } catch {
    // Supabase not configured yet or user not logged in
  }

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar profile={profile} />
      <main
        id="main-content"
        className="flex-1 lg:p-8 p-4 pt-18 lg:pt-8 overflow-auto"
      >
        {children}
      </main>
    </div>
  )
}
