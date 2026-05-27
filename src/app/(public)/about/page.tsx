import type { Metadata } from 'next'
import Image from 'next/image'
import { CTASection } from '@/components/sections/CTASection'
import { CheckCircle, Target, Heart, Users2 } from 'lucide-react'
import { getPublicSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'אודות מימוש 360',
  description:
    'הכירו את מימוש 360 — הצוות שמלווה אנשים לממש את הזכויות הרפואיות שמגיעות להם מביטוח לאומי.',
  openGraph: {
    title: 'אודות מימוש 360',
    description: 'הכירו את הצוות המקצועי שמסייע לאנשים לממש זכויות רפואיות.',
  },
}

const values = [
  {
    icon: Heart,
    title: 'אנושיות',
    description: 'כל לקוח הוא אדם עם סיפור ייחודי. אנחנו מקשיבים, מבינים ופועלים מתוך אמפתיה אמיתית.',
  },
  {
    icon: Target,
    title: 'מיקוד בתוצאות',
    description: 'אנחנו לא עוצרים עד שהלקוח מקבל את מה שמגיע לו. תוצאות הן המדד היחיד להצלחה שלנו.',
  },
  {
    icon: Users2,
    title: 'שקיפות מלאה',
    description: 'אין עלויות נסתרות, אין הפתעות. הלקוח יודע בכל רגע מה קורה ומה הצפוי.',
  },
]

export default async function AboutPage() {
  const settings = await getPublicSettings()
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
              הסיפור שלנו
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              אנחנו מאמינים שכל אדם
              <br />
              <span className="text-[#B5860D]">ראוי לקבל מה שמגיע לו</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
              מימוש 360 נוסדה מתוך אמונה פשוטה: הבירוקרטיה של ביטוח לאומי
              לא צריכה לעמוד בין אנשים לבין הזכויות שמגיעות להם.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">
                הדרך שהביאה אותנו לכאן
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  מימוש 360 נוסדה על ידי אנשי מקצוע עם ניסיון רב שנים בתחום
                  הזכויות הרפואיות מול ביטוח לאומי. ראינו מקרוב כיצד אנשים
                  מפסידים כסף ומגיע להם רק בשל חוסר ידע, עייפות מבירוקרטיה
                  או פשוט חוסר זמן.
                </p>
                <p>
                  הבנו שאנחנו יכולים לשנות את המצב — להיות הגשר בין האדם
                  לבין מה שמגיע לו. לקחת על עצמנו את ההתנהלות הקשה, ולאפשר
                  ללקוחות להתמקד בהחלמה ובחיים שלהם.
                </p>
                <p>
                  היום, לאחר מאות מקרים מוצלחים, אנחנו ממשיכים עם אותה
                  מחויבות: כל לקוח מקבל ליווי אישי, שקוף ויסודי — מהרגע
                  הראשון ועד הרגע שבו הכסף מגיע אליו.
                </p>
              </div>
            </div>

            <div className="bg-[#FAFAF8] rounded-3xl p-8">
              <div className="flex flex-col items-center mb-6">
                <Image
                  src="/logo.jpg"
                  alt="מימוש 360"
                  width={80}
                  height={80}
                  className="rounded-2xl object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900">מימוש 360</h3>
                <p className="text-sm text-gray-500">מימוש זכויות רפואיות</p>
              </div>

              <ul className="space-y-3">
                {[
                  'מאות לקוחות מרוצים',
                  'ניסיון רב שנים בתחום',
                  'שיעור הצלחה גבוה',
                  'ליווי עד לסגירת התיק',
                  'זמינות מלאה ומענה מהיר',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#FAFAF8]" aria-labelledby="values-heading">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 id="values-heading" className="text-3xl font-black text-gray-900 mb-4">
              הערכים שמנחים אותנו
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              לא רק מקצועיות — גם אנושיות. זה מה שמבדיל אותנו.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <article
                  key={value.title}
                  className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2D6A4F]/10 mb-4">
                    <Icon className="h-7 w-7 text-[#2D6A4F]" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <CTASection
        title="רוצים לדעת עוד? נשמח לדבר"
        subtitle="צרו איתנו קשר לשיחה ראשונית — ללא עלות, ללא התחייבות."
        settings={settings}
      />
    </>
  )
}
