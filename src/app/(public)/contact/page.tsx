import type { Metadata } from 'next'
import { ContactForm } from '@/components/sections/ContactForm'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/utils'
import { getPublicSettings } from '@/lib/site-settings'
import { getPageContent } from '@/lib/page-content'

export const metadata: Metadata = {
  title: 'צור קשר | מימוש 360',
  description: 'פנו אלינו לייעוץ ראשוני חינם. מימוש 360 זמינה עבורכם בטלפון, וואטסאפ ומייל.',
  openGraph: {
    title: 'צור קשר | מימוש 360',
    description: 'פנו אלינו לייעוץ ראשוני חינם — בטלפון, וואטסאפ או מייל.',
  },
}

export default async function ContactPage() {
  const [settings, contactContent] = await Promise.all([
    getPublicSettings(),
    getPageContent('contact'),
  ])

  const heroTag = (contactContent.hero_tag as string) ?? 'נשמח לעזור'
  const heroHeading = (contactContent.hero_heading as string) ?? 'צרו איתנו קשר'
  const heroSubtitle =
    (contactContent.hero_subtitle as string) ??
    'מלאו את הטופס ואנחנו נחזור אליכם בהקדם האפשרי — בדרך כלל תוך יום עסקים.'
  const formTitle = (contactContent.form_title as string) ?? 'שלחו לנו הודעה'

  const contactMethods = [
    {
      icon: Phone,
      title: 'טלפון',
      value: settings.phone,
      href: `tel:${settings.phone.replace(/-/g, '')}`,
      description: 'ימים א׳-ה׳, 9:00–18:00',
      color: 'text-[#2D6A4F]',
      bg: 'bg-[#2D6A4F]/10',
    },
    {
      icon: MessageCircle,
      title: 'וואטסאפ',
      value: 'שלח הודעה',
      href: getWhatsAppUrl(settings.whatsapp, settings.whatsappMessage),
      description: 'זמינים גם בערבים ובסופי שבוע',
      color: 'text-[#25D366]',
      bg: 'bg-[#25D366]/10',
      external: true,
    },
    {
      icon: Mail,
      title: 'אימייל',
      value: settings.email,
      href: `mailto:${settings.email}`,
      description: 'נחזור אליך תוך יום עסקים',
      color: 'text-[#B5860D]',
      bg: 'bg-[#B5860D]/10',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
              {heroTag}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6">{heroHeading}</h1>
            <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#FAFAF8]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Methods */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">דרכי יצירת קשר</h2>

              <div className="space-y-4 mb-8">
                {contactMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <a
                      key={method.title}
                      href={method.href}
                      target={method.external ? '_blank' : undefined}
                      rel={method.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200 hover:border-[#2D6A4F] hover:shadow-sm transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F]"
                      aria-label={`${method.title}: ${method.value}`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl ${method.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                        aria-hidden="true"
                      >
                        <Icon className={`h-6 w-6 ${method.color}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{method.title}</div>
                        <div className={`font-medium ${method.color}`}>{method.value}</div>
                        <div className="text-xs text-gray-500">{method.description}</div>
                      </div>
                    </a>
                  )
                })}
              </div>

              {/* Info box */}
              <div className="bg-[#2D6A4F]/5 border border-[#2D6A4F]/20 rounded-xl p-5">
                <h3 className="font-semibold text-[#1B4332] mb-2">מה קורה אחרי שתפנו?</h3>
                <ol className="text-sm text-gray-700 space-y-1.5">
                  <li className="flex gap-2">
                    <span className="text-[#2D6A4F] font-bold shrink-0">1.</span>
                    <span>ניצור איתכם קשר תוך יום עסקים</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#2D6A4F] font-bold shrink-0">2.</span>
                    <span>נקיים שיחת היכרות קצרה ללא עלות</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#2D6A4F] font-bold shrink-0">3.</span>
                    <span>נבדוק יחד מה מגיע לכם</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#2D6A4F] font-bold shrink-0">4.</span>
                    <span>נציג הצעה ברורה ושקופה לפני כל התחייבות</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{formTitle}</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
