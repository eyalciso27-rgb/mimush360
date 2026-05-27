'use client'
import React, { useState, useEffect, startTransition } from 'react'

type Prefs = {
  fontSize: number       // 0 = normal, 1 = large, 2 = x-large
  highContrast: boolean
  grayscale: boolean
  highlightLinks: boolean
  pauseAnimations: boolean
  readableFont: boolean
}

const DEFAULT_PREFS: Prefs = {
  fontSize: 0,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  pauseAnimations: false,
  readableFont: false,
}

function applyPrefs(prefs: Prefs) {
  const html = document.documentElement
  const classList = html.classList

  // Font size
  classList.remove('a11y-font-large', 'a11y-font-xlarge')
  if (prefs.fontSize === 1) classList.add('a11y-font-large')
  if (prefs.fontSize === 2) classList.add('a11y-font-xlarge')

  // Toggles
  classList.toggle('a11y-high-contrast', prefs.highContrast)
  classList.toggle('a11y-grayscale', prefs.grayscale)
  classList.toggle('a11y-highlight-links', prefs.highlightLinks)
  classList.toggle('a11y-pause-animations', prefs.pauseAnimations)
  classList.toggle('a11y-readable-font', prefs.readableFont)
}

const AccessibilityIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 6c1.1 0 2 .9 2 2v5l2.5 4.3-1.7 1-2.8-4.8V14h-2v1.5L7.2 20.3l-1.7-1L8 15V10c0-1.1.9-2 2-2h2z" />
  </svg>
)

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)

  // Load saved prefs on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('a11y_prefs')
      if (saved) {
        const parsed = JSON.parse(saved) as Prefs
        applyPrefs(parsed)
        startTransition(() => setPrefs(parsed))
      }
    } catch {
      // ignore
    }
  }, [])

  const update = (patch: Partial<Prefs>) => {
    const next = { ...prefs, ...patch }
    setPrefs(next)
    applyPrefs(next)
    localStorage.setItem('a11y_prefs', JSON.stringify(next))
  }

  const reset = () => {
    setPrefs(DEFAULT_PREFS)
    applyPrefs(DEFAULT_PREFS)
    localStorage.removeItem('a11y_prefs')
  }

  const fontLabel = ['רגיל', 'גדול', 'גדול מאוד'][prefs.fontSize]

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'סגור תפריט נגישות' : 'פתח תפריט נגישות'}
        aria-expanded={open}
        aria-controls="a11y-panel"
        className="fixed bottom-6 right-6 z-[9997] w-12 h-12 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white shadow-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-[#B5860D]"
      >
        <AccessibilityIcon />
      </button>

      {/* Panel */}
      {open && (
        <div
          id="a11y-panel"
          role="dialog"
          aria-label="הגדרות נגישות"
          className="fixed bottom-20 right-4 z-[9997] w-72 bg-[#0A1F14] border border-[#1B4332] rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1B4332]">
            <span className="font-bold text-white text-sm">הגדרות נגישות</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="סגור"
              className="text-white/40 hover:text-white transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </div>

          {/* Options */}
          <div className="p-3 flex flex-col gap-1.5">

            {/* Font size */}
            <div className="flex items-center justify-between bg-white/[0.04] rounded-lg px-3 py-2.5">
              <span className="text-white/80 text-sm">גודל טקסט: <span className="text-[#B5860D] font-bold">{fontLabel}</span></span>
              <div className="flex gap-1">
                <button
                  onClick={() => update({ fontSize: Math.max(0, prefs.fontSize - 1) })}
                  aria-label="הקטן טקסט"
                  disabled={prefs.fontSize === 0}
                  className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-base disabled:opacity-30 transition-colors"
                >
                  A−
                </button>
                <button
                  onClick={() => update({ fontSize: Math.min(2, prefs.fontSize + 1) })}
                  aria-label="הגדל טקסט"
                  disabled={prefs.fontSize === 2}
                  className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-base disabled:opacity-30 transition-colors"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Toggle options */}
            {(
              [
                { label: 'ניגודיות גבוהה', key: 'highContrast' },
                { label: 'גווני אפור', key: 'grayscale' },
                { label: 'הדגש קישורים', key: 'highlightLinks' },
                { label: 'עצור אנימציות', key: 'pauseAnimations' },
                { label: 'כתב קריא', key: 'readableFont' },
              ] as { label: string; key: keyof Prefs }[]
            ).map(({ label, key }) => (
              <button
                key={key}
                onClick={() => update({ [key]: !prefs[key] })}
                aria-pressed={prefs[key] as boolean}
                className={`flex items-center justify-between bg-white/[0.04] hover:bg-white/[0.08] rounded-lg px-3 py-2.5 transition-colors text-sm ${
                  prefs[key] ? 'ring-1 ring-[#B5860D]' : ''
                }`}
              >
                <span className="text-white/80">{label}</span>
                <span
                  className={`w-8 h-4 rounded-full transition-colors relative ${
                    prefs[key] ? 'bg-[#B5860D]' : 'bg-white/20'
                  }`}
                  aria-hidden="true"
                >
                  <span
                    className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${
                      prefs[key] ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </span>
              </button>
            ))}

            {/* Reset */}
            <button
              onClick={reset}
              className="mt-1 w-full h-8 rounded-lg border border-white/20 text-white/50 hover:text-white hover:border-white/40 text-xs transition-colors"
            >
              איפוס הכל
            </button>

            {/* Accessibility statement link */}
            <a
              href="/accessibility"
              className="text-center text-xs text-[#B5860D] hover:text-[#D4A017] transition-colors py-1"
            >
              הצהרת נגישות
            </a>
          </div>
        </div>
      )}
    </>
  )
}
