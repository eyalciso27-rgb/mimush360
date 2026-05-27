'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  HelpCircle,
  Globe,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

interface AdminSidebarProps {
  profile: Profile | null
}

const navItems = [
  { label: 'לוח בקרה', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'לידים', href: '/admin/leads', icon: Users },
  { label: 'סיפורי הצלחה', href: '/admin/content', icon: Star },
  { label: 'שאלות נפוצות', href: '/admin/faqs', icon: HelpCircle },
  { label: 'עמודים ו-SEO', href: '/admin/pages', icon: Globe },
  { label: 'הגדרות', href: '/admin/settings', icon: Settings },
]

const ROLE_LABELS: Record<string, string> = {
  admin: 'מנהל',
  editor: 'עורך',
  viewer: 'צופה',
}

// ─── Extracted outside to avoid re-creation on every render ───────────────
interface SidebarNavProps {
  profile: Profile | null
  pathname: string
  onNavigate: () => void
  onSignOut: () => void
  signingOut: boolean
}

function SidebarNav({ profile, pathname, onNavigate, onSignOut, signingOut }: SidebarNavProps) {
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-200">
        <Image
          src="/logo.jpg"
          alt="מימוש 360"
          width={36}
          height={36}
          className="rounded-lg object-contain"
        />
        <div>
          <p className="font-bold text-gray-900 text-sm">מימוש 360</p>
          <p className="text-xs text-gray-500">פאנל ניהול</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="ניווט ניהול">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-[#2D6A4F] text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-gray-200 p-3">
        {profile && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#2D6A4F]/10 flex items-center justify-center text-[#2D6A4F] font-bold text-sm shrink-0">
              {(profile.full_name ?? profile.email)?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile.full_name ?? profile.email}
              </p>
              <p className="text-xs text-gray-500">
                {ROLE_LABELS[profile.role] ?? profile.role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={onSignOut}
          disabled={signingOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label="יציאה מהמערכת"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          {signingOut ? 'יוצא...' : 'יציאה'}
        </button>
      </div>
    </div>
  )
}
// ──────────────────────────────────────────────────────────────────────────

export function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const supabase = createClient()

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 bg-white border-l border-gray-200 h-screen sticky top-0 shrink-0"
        aria-label="תפריט ניהול"
      >
        <SidebarNav
          profile={profile}
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
          onSignOut={handleSignOut}
          signingOut={signingOut}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 right-0 left-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          aria-label="פתח תפריט"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="מימוש 360" width={28} height={28} className="rounded-md" />
          <span className="font-bold text-sm text-gray-900">ניהול</span>
        </div>
        <div className="w-9" aria-hidden="true" />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-64 bg-white h-full shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 left-3 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="סגור תפריט"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarNav
              profile={profile}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
              onSignOut={handleSignOut}
              signingOut={signingOut}
            />
          </aside>
        </div>
      )}
    </>
  )
}
