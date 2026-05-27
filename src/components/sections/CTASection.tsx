'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { siteConfig, getWhatsAppUrl } from '@/lib/utils'
import { ArrowLeft, Phone } from 'lucide-react'
import type { PublicSettings } from '@/lib/site-settings'

interface CTASectionProps {
  title?: string
  subtitle?: string
  settings?: PublicSettings
}

export function CTASection({
  title = 'מוכנים לבדוק מה מגיע לכם?',
  subtitle = 'ייעוץ ראשוני חינם. ללא התחייבות. ללא סיכון.',
  settings,
}: CTASectionProps) {
  const phone = settings?.phone ?? siteConfig.phone
  const whatsapp = settings?.whatsapp ?? siteConfig.whatsapp
  const whatsappMessage = settings?.whatsappMessage ?? siteConfig.whatsappMessage
  const typeformId = settings?.typeformId ?? siteConfig.typeformId
  const whatsappUrl = getWhatsAppUrl(whatsapp, whatsappMessage)

  const handleCTA = () => {
    const id = typeformId
    if (typeof window !== 'undefined' && id && id !== 'YOUR_TYPEFORM_ID' && id !== '') {
      window.open(`https://form.typeform.com/to/${id}`, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = '/contact'
    }
  }

  return (
    <section className="py-20 bg-[#FAFAF8]" aria-labelledby="cta-heading">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-3xl p-10 md:p-14 text-white shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-white/90">
            התחילו עכשיו — בחינם
          </div>

          <h2 id="cta-heading" className="text-3xl md:text-4xl font-black mb-4">
            {title}
          </h2>
          <p className="text-lg text-white/75 mb-8 max-w-lg mx-auto">{subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center" role="group" aria-label="כפתורי פעולה">
            <Button
              size="xl"
              onClick={handleCTA}
              className="bg-[#B5860D] hover:bg-[#9A7010] text-white font-bold shadow-xl group"
              aria-label="בדקו אם מגיע לכם כסף"
            >
              <span>בדקו אם מגיע לכם כסף</span>
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            </Button>

            <Button
              size="xl"
              variant="outline"
              asChild
              className="border-white/40 text-white hover:bg-white/10 font-semibold"
            >
              <a
                href={`tel:${phone.replace(/-/g, '')}`}
                aria-label={`התקשרו אלינו: ${phone}`}
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                <span className="ltr-text">{phone}</span>
              </a>
            </Button>
          </div>

          <p className="mt-6 text-xs text-white/50">
            * כל הפרטים שמסרתם מוגנים ושמורים בהצפנה מלאה
          </p>
        </div>
      </div>
    </section>
  )
}
