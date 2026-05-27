import React from 'react'
import { Shield, Users, Clock, Award, HeartHandshake, TrendingUp } from 'lucide-react'

const ICON_LIST = [HeartHandshake, Award, Shield, TrendingUp, Clock, Users]
const COLOR_LIST = [
  { color: 'text-[#2D6A4F]', bg: 'bg-[#2D6A4F]/10' },
  { color: 'text-[#B5860D]', bg: 'bg-[#B5860D]/10' },
  { color: 'text-[#1B2A4A]', bg: 'bg-[#1B2A4A]/10' },
  { color: 'text-[#2D6A4F]', bg: 'bg-[#2D6A4F]/10' },
  { color: 'text-[#B5860D]', bg: 'bg-[#B5860D]/10' },
  { color: 'text-[#1B2A4A]', bg: 'bg-[#1B2A4A]/10' },
]

const DEFAULT_FEATURES = [
  {
    title: 'ליווי אישי ואנושי',
    description:
      'אנחנו מבינים שמדובר בתהליך רגיש. מלווים אתכם בסבלנות, בבהירות ובגובה העיניים לאורך כל הדרך.',
  },
  {
    title: 'ניסיון ומקצועיות',
    description:
      'עשרות שנות ניסיון בתחום הזכויות הרפואיות מול ביטוח לאומי. אנחנו יודעים בדיוק מה לעשות ואיך לעשות.',
  },
  {
    title: 'שקיפות מלאה',
    description:
      'ללא עלויות נסתרות, ללא הפתעות. אתם יודעים בדיוק מה קורה בכל שלב ומה מגיע לכם.',
  },
  {
    title: 'תוצאות מוכחות',
    description:
      'מאות לקוחות שכבר קיבלו את מה שמגיע להם. הנתונים מדברים בעד עצמם — אנחנו מביאים תוצאות.',
  },
  {
    title: 'חיסכון בזמן ובאנרגיה',
    description:
      'הבירוקרטיה מסובכת ומתישה. אנחנו לוקחים על עצמנו את כל ההתנהלות מול הגופים הרלוונטיים.',
  },
  {
    title: 'תמיכה לכל המשפחה',
    description:
      'לא רק עבורכם — עוזרים גם לבני משפחה לממש את זכויותיהם. כי כל אחד ראוי לקבל את מה שמגיע לו.',
  },
]

interface FeaturesProps {
  content?: Record<string, unknown>
}

export function Features({ content }: FeaturesProps) {
  const heading = (content?.features_heading as string) ?? 'למה לבחור במימוש 360?'
  const subtitle =
    (content?.features_subtitle as string) ?? 'כי אנחנו לא רק עוד חברה — אנחנו שותפים שלכם לדרך.'
  const featuresRaw = content?.features as Array<{ title: string; description: string }> | undefined
  const features = featuresRaw ?? DEFAULT_FEATURES

  return (
    <section
      className="py-20 bg-[#FAFAF8]"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full px-4 py-1.5 mb-4 text-sm font-medium">
            למה לבחור בנו
          </div>
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
          >
            {heading}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = ICON_LIST[index % ICON_LIST.length]
            const colors = COLOR_LIST[index % COLOR_LIST.length]
            return (
              <article
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 group"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  aria-hidden="true"
                >
                  <Icon className={`h-6 w-6 ${colors.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
