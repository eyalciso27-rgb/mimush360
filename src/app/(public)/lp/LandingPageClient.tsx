'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { getWhatsAppUrl } from '@/lib/utils'
import { CheckCircle, Phone, ArrowLeft, Shield, Star, Users, Award } from 'lucide-react'
import type { PublicSettings } from '@/lib/site-settings'

const benefits = [
  'ייעוץ ראשוני חינמי — ללא התחייבות',
  'ניסיון עם מאות מקרים מוצלחים',
  'ליווי אישי מהשלב הראשון ועד קבלת הכסף',
  'טיפול מהיר ויעיל בכל הניירת',
]

const stats = [
  { icon: Users, value: '500+', label: 'לקוחות מרוצים' },
  { icon: Award, value: '95%', label: 'שיעור הצלחה' },
  { icon: Star, value: '0₪', label: 'עלות ייעוץ ראשוני' },
]

const WhatsAppIcon = () => (
  <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

interface LandingPageClientProps {
  settings: PublicSettings
}

export function LandingPageClient({ settings }: LandingPageClientProps) {
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const whatsappUrl = getWhatsAppUrl(settings.whatsapp, settings.whatsappMessage)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          message: 'פנייה מדף נחיתה',
          source: 'lp',
        }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const handleContact = () => {
    window.location.href = '/contact'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D2B1D] via-[#1B4332] to-[#0D2B1D] relative overflow-hidden" dir="rtl">

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Large gold circle top-right */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#B5860D]/10 blur-3xl" />
        {/* Green glow bottom-left */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#52B788]/15 blur-3xl" />
        {/* Subtle grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Decorative coin/shekel shape */}
        <svg className="absolute top-24 left-8 opacity-10 w-24 h-24 hidden md:block" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="#B5860D" strokeWidth="3"/>
          <circle cx="50" cy="50" r="35" stroke="#B5860D" strokeWidth="1.5"/>
          <text x="50" y="58" fontSize="28" fontWeight="bold" fill="#B5860D" textAnchor="middle">₪</text>
        </svg>
        {/* Decorative star shape */}
        <svg className="absolute bottom-32 right-10 opacity-10 w-16 h-16 hidden md:block" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#B5860D"/>
        </svg>
        {/* Floating dots */}
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-[#52B788]/40" />
        <div className="absolute top-2/3 left-1/3 w-3 h-3 rounded-full bg-[#B5860D]/30" />
        <div className="absolute top-1/2 left-10 w-1.5 h-1.5 rounded-full bg-white/20" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex justify-between items-center max-w-5xl mx-auto" role="banner">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="מימוש 360"
            width={48}
            height={48}
            className="rounded-xl object-contain shadow-lg"
            priority
          />
          <div>
            <span className="font-black text-xl text-white block leading-tight">מימוש 360</span>
            <span className="text-[#52B788] text-xs font-medium">מימוש זכויות ביטוח לאומי</span>
          </div>
        </div>
        <a
          href={`tel:${settings.phone.replace(/-/g, '')}`}
          className="hidden sm:inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/20 transition-all"
          aria-label={`התקשר אלינו: ${settings.phone}`}
        >
          <Phone className="h-4 w-4 text-[#52B788]" aria-hidden="true" />
          <span dir="ltr">{settings.phone}</span>
        </a>
      </header>

      {/* Hero Section */}
      <main id="main-content" className="relative z-10">
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-16">

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#B5860D]/20 border border-[#B5860D]/40 text-[#F0C040] text-xs font-semibold px-4 py-2 rounded-full">
              <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              ייעוץ ראשוני חינם — ללא התחייבות
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
              <span className="block">מגיע לך כסף</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-l from-[#52B788] to-[#B5860D]">
                מביטוח לאומי
              </span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              רוב האנשים לא יודעים על זכויותיהם.<br />
              <span className="text-white font-semibold">אנחנו כאן כדי שתקבלו את מה שמגיע לכם.</span>
            </p>
          </div>

          {/* Stats row */}
          <div className="flex justify-center gap-6 md:gap-12 mb-10">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-2">
                  <Icon className="h-5 w-5 text-[#52B788]" aria-hidden="true" />
                </div>
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-white/60 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Two-column layout: Form + Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">

            {/* Lead form card */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-[#2D6A4F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-[#2D6A4F]" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">קיבלנו!</h2>
                  <p className="text-gray-600 text-sm mb-5">נחזור אליכם תוך שעות ספורות.</p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20B857] text-white font-bold px-5 py-3.5 rounded-xl transition-colors text-sm"
                  >
                    <WhatsAppIcon />
                    המשיכו בוואטסאפ
                  </a>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-gray-900">בדקו את הזכאות שלכם</h2>
                    <p className="text-gray-500 text-sm mt-1">השאירו פרטים ונחזור אליכם מהר</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5" aria-label="טופס הרשמה">
                    <div>
                      <label htmlFor="lp-name" className="block text-sm font-medium text-gray-700 mb-1.5">שם מלא</label>
                      <input
                        id="lp-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="ישראל ישראלי"
                        required
                        className="w-full h-11 rounded-xl border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent"
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label htmlFor="lp-phone" className="block text-sm font-medium text-gray-700 mb-1.5">טלפון</label>
                      <input
                        id="lp-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="050-0000000"
                        required
                        inputMode="tel"
                        dir="ltr"
                        className="w-full h-11 rounded-xl border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent text-right"
                        aria-required="true"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-[#B5860D] hover:bg-[#9A7010] disabled:opacity-60 text-white font-bold rounded-xl text-base transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          שולח...
                        </span>
                      ) : (
                        <>
                          בדקו את הזכאות שלי
                          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </form>

                  <ul className="mt-5 space-y-2 pt-4 border-t border-gray-100">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-xs text-gray-500">
                        <CheckCircle className="h-3.5 w-3.5 text-[#2D6A4F] shrink-0 mt-0.5" aria-hidden="true" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Contact options card */}
            <div className="flex flex-col gap-4">
              {/* WhatsApp CTA — big */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-[#25D366] hover:bg-[#20B857] text-white rounded-2xl px-6 py-5 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
                aria-label="פנו אלינו בוואטסאפ"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <WhatsAppIcon />
                </div>
                <div className="flex-1 text-right">
                  <div className="font-bold text-lg leading-tight">כתבו לנו בוואטסאפ</div>
                  <div className="text-white/80 text-sm mt-0.5">זמין עכשיו — תגובה מהירה</div>
                </div>
                <ArrowLeft className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </a>

              {/* Phone CTA */}
              <a
                href={`tel:${settings.phone.replace(/-/g, '')}`}
                className="flex items-center gap-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-2xl px-6 py-5 transition-all hover:-translate-y-0.5 group"
                aria-label={`התקשרו אלינו: ${settings.phone}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#52B788]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="h-5 w-5 text-[#52B788]" aria-hidden="true" />
                </div>
                <div className="flex-1 text-right">
                  <div className="font-bold text-lg leading-tight" dir="ltr">{settings.phone}</div>
                  <div className="text-white/60 text-sm mt-0.5">לשיחה ישירה עם נציג</div>
                </div>
                <ArrowLeft className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </a>

              {/* Contact page CTA */}
              <button
                onClick={handleContact}
                className="flex items-center gap-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-2xl px-6 py-5 transition-all hover:-translate-y-0.5 group text-right w-full"
                aria-label="עברו לדף יצירת קשר"
              >
                <div className="w-12 h-12 rounded-full bg-[#B5860D]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Shield className="h-5 w-5 text-[#B5860D]" aria-hidden="true" />
                </div>
                <div className="flex-1 text-right">
                  <div className="font-bold text-lg leading-tight">טופס יצירת קשר</div>
                  <div className="text-white/60 text-sm mt-0.5">שלחו פנייה מפורטת</div>
                </div>
                <ArrowLeft className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </button>

              {/* Trust badge */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mt-auto">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-[#52B788]" aria-hidden="true" />
                  <span className="text-white text-sm font-semibold">למה מימוש 360?</span>
                </div>
                <ul className="space-y-1.5">
                  {['מומחים מוכחים בתחום', 'ללא תשלום מראש', 'ליווי אישי לאורך כל הדרך'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-white/70">
                      <CheckCircle className="h-3 w-3 text-[#52B788] shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 text-white/30 text-xs border-t border-white/10" role="contentinfo">
        © {new Date().getFullYear()} מימוש 360. כל הזכויות שמורות.
      </footer>
    </div>
  )
}
