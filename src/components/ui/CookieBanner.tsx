'use client'
import React, { useState, useEffect, startTransition } from 'react'
import Link from 'next/link'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) startTransition(() => setVisible(true))
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="הסכמה לשימוש בעוגיות"
      className="fixed bottom-0 right-0 left-0 z-[9998] p-4"
    >
      <div className="max-w-4xl mx-auto bg-[#0A1F14] border border-[#1B4332] rounded-xl shadow-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Text */}
        <div className="flex-1 text-sm text-white/75 leading-relaxed">
          <span className="font-bold text-white">🍪 שימוש בעוגיות</span>
          {' — '}
          אנו משתמשים בעוגיות לשיפור חווית הגלישה ולניתוח תנועה באתר.{' '}
          <Link
            href="/privacy"
            className="text-[#B5860D] underline hover:text-[#D4A017] transition-colors"
          >
            מדיניות פרטיות
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="h-9 px-4 rounded-md border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm transition-colors"
            aria-label="דחה שימוש בעוגיות"
          >
            דחייה
          </button>
          <button
            onClick={accept}
            className="h-9 px-5 rounded-md bg-[#B5860D] hover:bg-[#C49A0E] text-white font-bold text-sm transition-colors"
            aria-label="אשר שימוש בעוגיות"
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  )
}
