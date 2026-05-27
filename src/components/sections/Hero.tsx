'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { siteConfig, getWhatsAppUrl } from '@/lib/utils'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import type { PublicSettings } from '@/lib/site-settings'

interface HeroProps {
  typeformId?: string
  settings?: PublicSettings
}

const benefits = [
  'ייעוץ ראשוני ללא עלות',
  'ליווי אישי לאורך כל התהליך',
  'עשרות שנות ניסיון בתחום',
]

export function Hero({ typeformId, settings }: HeroProps) {
  const whatsapp = settings?.whatsapp ?? siteConfig.whatsapp
  const whatsappMessage = settings?.whatsappMessage ?? siteConfig.whatsappMessage
  const whatsappUrl = getWhatsAppUrl(whatsapp, whatsappMessage)

  const handleCTA = () => {
    const id = typeformId ?? siteConfig.typeformId
    if (typeof window !== 'undefined' && id && id !== 'YOUR_TYPEFORM_ID' && id !== '') {
      // Open Typeform if configured
      window.open(`https://form.typeform.com/to/${id}`, '_blank', 'noopener,noreferrer')
    } else {
      // Fallback: scroll to contact section or navigate to contact page
      const contactSection = document.getElementById('contact-section')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.href = '/contact'
      }
    }
  }

  return (
    <section
      className="relative bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#1B2A4A] text-white overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-10"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 max-w-6xl py-20 md:py-28">
        <div className="max-w-3xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-[#52B788] rounded-full animate-pulse" aria-hidden="true" />
            <span className="text-sm font-medium text-white/90">
              ייעוץ ראשוני חינם
            </span>
          </div>

          {/* Main Heading */}
          <h1
            id="hero-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
          >
            מגיע לך יותר.
            <br />
            <span className="text-[#B5860D]">אנחנו כאן</span> כדי לדאוג
            <br />
            שתקבל את זה.
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
            מימוש 360 מסייעת לכם לממש את הזכויות הרפואיות שמגיעות לכם מביטוח
            לאומי — בפשטות, בשקיפות, וללא בירוקרטיה מיותרת.
          </p>

          {/* Benefits */}
          <ul className="flex flex-col gap-2.5 mb-10" aria-label="יתרונות שירות">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <CheckCircle
                  className="h-5 w-5 text-[#52B788] shrink-0"
                  aria-hidden="true"
                />
                <span className="text-white/90 text-base font-medium">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4" role="group" aria-label="כפתורי פעולה">
            <Button
              size="xl"
              onClick={handleCTA}
              className="bg-[#B5860D] hover:bg-[#9A7010] text-white font-bold shadow-xl group"
              aria-label="בדקו אם מגיע לכם כסף - פתח שאלון"
            >
              <span>בדקו אם מגיע לכם כסף</span>
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            </Button>

            <Button
              size="xl"
              variant="outline"
              asChild
              className="border-white/40 text-white hover:bg-white/10 hover:border-white font-semibold"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="פנה אלינו בוואטסאפ"
              >
                <svg
                  className="h-5 w-5 text-[#25D366]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                וואטסאפ עכשיו
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 32.5C672 35 768 40 864 42.5C960 45 1056 45 1152 42.5C1248 40 1344 35 1392 32.5L1440 30V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
            fill="#FAFAF8"
          />
        </svg>
      </div>
    </section>
  )
}
