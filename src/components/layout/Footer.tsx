import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/utils'
import type { PublicSettings } from '@/lib/site-settings'

const footerLinks = [
  { label: 'ראשי', href: '/' },
  { label: 'אודות', href: '/about' },
  { label: 'איך זה עובד', href: '/how-it-works' },
  { label: 'סיפורי הצלחה', href: '/testimonials' },
  { label: 'צור קשר', href: '/contact' },
  { label: 'הצהרת נגישות', href: '/accessibility' },
  { label: 'מדיניות פרטיות', href: '/privacy' },
]

interface FooterProps {
  settings: PublicSettings
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const whatsappUrl = getWhatsAppUrl(settings.whatsapp, settings.whatsappMessage)

  return (
    <footer
      className="bg-[#1B2A4A] text-white pt-12 pb-6"
      role="contentinfo"
      aria-label="פוטר האתר"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <Image
                src="/logo.jpg"
                alt="מימוש 360"
                width={48}
                height={48}
                style={{ height: 'auto' }}
                className="rounded-lg object-contain"
              />
              <span className="text-xl font-bold text-white">מימוש 360</span>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
              אנחנו מלווים אנשים פרטיים למצות את הזכויות הרפואיות שמגיעות להם
              מביטוח לאומי — בפשטות, באמינות ובליווי אישי.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="קישורים בפוטר">
            <h3 className="font-semibold text-white mb-4 text-base">ניווט מהיר</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-base">יצירת קשר</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={`tel:${settings.phone.replace(/-/g, '')}`}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  aria-label={`טלפון: ${settings.phone}`}
                >
                  <Phone className="h-4 w-4 text-[#52B788] shrink-0" aria-hidden="true" />
                  <span className="ltr-text group-hover:text-[#52B788] transition-colors">
                    {settings.phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  aria-label={`דואר אלקטרוני: ${settings.email}`}
                >
                  <Mail className="h-4 w-4 text-[#52B788] shrink-0" aria-hidden="true" />
                  <span className="group-hover:text-[#52B788] transition-colors">
                    {settings.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  aria-label="שלח הודעת וואטסאפ"
                >
                  <svg
                    className="h-4 w-4 text-[#25D366] shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="group-hover:text-[#25D366] transition-colors">וואטסאפ</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-[#52B788] shrink-0" aria-hidden="true" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {currentYear} מימוש 360. כל הזכויות שמורות.</p>
          <p>בניית אתר מקצועי | <span className="text-gray-300">מימוש 360</span></p>
        </div>
      </div>
    </footer>
  )
}
