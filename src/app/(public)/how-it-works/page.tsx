import type { Metadata } from 'next'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { CTASection } from '@/components/sections/CTASection'
import { CheckCircle } from 'lucide-react'
import { getPublicSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'איך זה עובד | מימוש 360',
  description:
    'גלו כיצד עובד התהליך של מימוש זכויות רפואיות מול ביטוח לאומי עם מימוש 360 — פשוט, ברור ויעיל.',
  openGraph: {
    title: 'איך זה עובד | מימוש 360',
    description: 'ארבעה שלבים פשוטים שמביאים תוצאות — מימוש זכויות רפואיות.',
  },
}

const faqs = [
  {
    q: 'כמה זמן לוקח התהליך?',
    a: 'התהליך תלוי בסוג הזכאות ובנסיבות האישיות. בממוצע, מדובר על כמה חודשים מרגע הגשת הבקשה ועד קבלת ההחלטה.',
  },
  {
    q: 'כמה עולה השירות?',
    a: 'הייעוץ הראשוני הוא חינם לחלוטין. בהמשך, העלות תלויה בסוג השירות ותוסבר לכם בשקיפות מלאה לפני כל התחייבות.',
  },
  {
    q: 'מה קורה אם הבקשה נדחית?',
    a: 'אנחנו לא מוותרים. במקרה של דחייה, בוחנים את האפשרויות להשיג ולערער — ולרוב מצליחים לשנות את ההחלטה.',
  },
  {
    q: 'האם אני צריך לבוא למשרד?',
    a: 'לא בהכרח. רוב ההתנהלות יכולה להתבצע מרחוק, דרך טלפון, וואטסאפ ומייל. נסגל את התהליך לצרכים שלכם.',
  },
  {
    q: 'האם גם בני משפחה יכולים להגיש?',
    a: 'כן! אנחנו מסייעים גם לבני משפחה שמגישים תביעות בשם יקיריהם. ניתן לטפל בכמה תיקים בו-זמנית.',
  },
]

export default async function HowItWorksPage() {
  const settings = await getPublicSettings()
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
              פשוט מתמיד
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              איך זה עובד?
            </h1>
            <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
              אנחנו הפכנו תהליך מורכב לפשוט. כל מה שאתם צריכים לעשות הוא
              לפנות אלינו — אנחנו נדאג לכל השאר.
            </p>
          </div>
        </div>
      </section>

      <HowItWorksSection />

      {/* What we handle */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">
                מה אנחנו מטפלים בו עבורכם
              </h2>
              <p className="text-gray-600 mb-6">
                אתם לא צריכים להבין את הבירוקרטיה. זה בדיוק מה שאנחנו כאן
                בשבילו.
              </p>
              <ul className="space-y-3">
                {[
                  'בדיקת זכאות מקיפה ויסודית',
                  'איסוף וארגון כל המסמכים הנדרשים',
                  'הגשת הבקשות לביטוח לאומי',
                  'מעקב שוטף אחר מצב התיק',
                  'ניהול תקשורת מול הגופים הרלוונטיים',
                  'ייצוג בערעורים במקרה הצורך',
                  'עדכון שוטף לגבי מצב התיק',
                  'ליווי עד לקבלת הכסף בפועל',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">
                שאלות נפוצות
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="bg-white rounded-xl border border-gray-200 group"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 marker:hidden list-none hover:text-[#2D6A4F] transition-colors">
                      <span>{faq.q}</span>
                      <span className="text-[#2D6A4F] text-lg group-open:rotate-45 transition-transform font-bold shrink-0 mr-3" aria-hidden="true">+</span>
                    </summary>
                    <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="מוכנים להתחיל?"
        subtitle="השלב הראשון הוא פשוט — צרו איתנו קשר ונבדוק יחד מה מגיע לכם."
        settings={settings}
      />
    </>
  )
}
