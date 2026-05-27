'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { getWhatsAppUrl } from '@/lib/utils'
import { CheckCircle, Phone, ArrowLeft, Shield, Star } from 'lucide-react'
import type { PublicSettings } from '@/lib/site-settings'

const benefits = [
  'ייעוץ ראשוני חינמי — ללא התחייבות',
  'ניסיון עם מאות מקרים מוצלחים',
  'ליווי אישי מהשלב הראשון ועד קבלת הכסף',
  'טיפול מהיר ויעיל בכל הניירת',
]

const trustSignals = [
  { icon: Shield, text: 'מאובטח ומוגן' },
  { icon: Star, text: 'שיעור הצלחה גבוה' },
  { icon: CheckCircle, text: 'ייעוץ ראשוני חינם' },
]

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

  const handleTypeform = () => {
    const id = settings.typeformId
    if (id && id !== 'YOUR_TYPEFORM_ID' && id !== '') {
      window.open(`https://form.typeform.com/to/${id}`, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = '/contact'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#1B2A4A] flex flex-col">
      <header className="px-4 py-4 flex justify-center" role="banner">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="מימוש 360" width={44} height={44} className="rounded-lg object-contain" priority />
          <span className="font-bold text-xl text-white">מימוש 360</span>
        </div>
      </header>

      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center text-white mb-8">
            <h1 className="text-3xl md:text-4xl font-black mb-4">מגיע לך יותר מביטוח לאומי?</h1>
            <p className="text-white/80 text-lg">בדקו עכשיו — בחינם, ללא התחייבות</p>
          </div>

          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {trustSignals.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-white/80 text-xs">
                <Icon className="h-3.5 w-3.5 text-[#52B788]" aria-hidden="true" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#2D6A4F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-[#2D6A4F]" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">קיבלנו! נחזור אליך בקרוב</h2>
                <p className="text-gray-600 text-sm mb-6">נציג שלנו יצור איתך קשר תוך שעות ספורות.</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#20B857] transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  דברו איתנו בוואטסאפ
                </a>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-1">השאירו פרטים</h2>
                <p className="text-gray-600 text-sm mb-5">ניצור איתכם קשר תוך שעות ספורות</p>

                <form onSubmit={handleSubmit} className="space-y-4" aria-label="טופס הרשמה">
                  <div>
                    <label htmlFor="lp-name" className="block text-sm font-medium text-gray-700 mb-1.5">שם מלא</label>
                    <input
                      id="lp-name" type="text" value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      placeholder="ישראל ישראלי" required
                      className="w-full h-11 rounded-lg border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="lp-phone" className="block text-sm font-medium text-gray-700 mb-1.5">טלפון</label>
                    <input
                      id="lp-phone" type="tel" value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="050-0000000" required inputMode="tel" dir="ltr"
                      className="w-full h-11 rounded-lg border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent text-right"
                      aria-required="true"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-[#B5860D] hover:bg-[#9A7010] font-bold text-base" disabled={loading}>
                    {loading ? 'שולח...' : (<>בדקו את הזכאות שלי <ArrowLeft className="h-4 w-4" aria-hidden="true" /></>)}
                  </Button>
                </form>

                <div className="flex items-center gap-3 mt-4">
                  <hr className="flex-1 border-gray-200" />
                  <span className="text-xs text-gray-400">או</span>
                  <hr className="flex-1 border-gray-200" />
                </div>
                <Button variant="outline" size="lg" className="w-full mt-4 border-[#2D6A4F] text-[#2D6A4F] font-semibold" onClick={handleTypeform}>
                  מלאו שאלון קצר
                </Button>
              </>
            )}

            <ul className="mt-6 space-y-2 border-t border-gray-100 pt-5">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle className="h-3.5 w-3.5 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center mt-6">
            <a
              href={`tel:${settings.phone.replace(/-/g, '')}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
              aria-label={`התקשר אלינו: ${settings.phone}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="ltr-text">מעדיפים לדבר? {settings.phone}</span>
            </a>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-white/40 text-xs" role="contentinfo">
        © {new Date().getFullYear()} מימוש 360. כל הזכויות שמורות.
      </footer>
    </div>
  )
}
