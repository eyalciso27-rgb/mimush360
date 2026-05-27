import React from 'react'
import { ClipboardList, Search, FileCheck, DollarSign } from 'lucide-react'

const STEP_ICONS = [ClipboardList, Search, FileCheck, DollarSign]
const STEP_COLORS = ['bg-[#2D6A4F]', 'bg-[#B5860D]', 'bg-[#1B2A4A]', 'bg-[#2D6A4F]']

const DEFAULT_STEPS = [
  {
    step: '01',
    title: 'מלאו שאלון קצר',
    description:
      'ממלאים שאלון פשוט בן מספר שאלות לבדיקה ראשונית של הזכאות שלכם. זה לוקח פחות מ-3 דקות.',
  },
  {
    step: '02',
    title: 'בדיקה מקצועית',
    description:
      'צוות המומחים שלנו בוחן את המקרה שלכם לעומק ובודק את כל הזכויות הרלוונטיות שעשויות להגיע לכם.',
  },
  {
    step: '03',
    title: 'הגשת התביעה',
    description:
      'אנחנו מכינים ומגישים את כל המסמכים הדרושים מולכם, מול ביטוח לאומי ומול כל גוף רלוונטי אחר.',
  },
  {
    step: '04',
    title: 'קבלת הכסף',
    description:
      'לאחר אישור התביעה, הכסף מועבר ישירות אליכם. אנחנו מלווים אתכם עד לרגע האחרון.',
  },
]

interface HowItWorksSectionProps {
  content?: Record<string, unknown>
}

export function HowItWorksSection({ content }: HowItWorksSectionProps) {
  const stepsTag = (content?.steps_tag as string) ?? 'התהליך שלנו'
  const stepsHeading = (content?.steps_heading as string) ?? 'פשוט, ברור, ויעיל'
  const stepsSubtitle =
    (content?.steps_subtitle as string) ??
    'ארבעה שלבים פשוטים שמפשטים לכם את הבירוקרטיה ומביאים תוצאות.'
  const stepsRaw = content?.steps as Array<{ step: string; title: string; description: string }> | undefined
  const steps = stepsRaw ?? DEFAULT_STEPS

  return (
    <section
      className="py-20 bg-white"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full px-4 py-1.5 mb-4 text-sm font-medium">
            {stepsTag}
          </div>
          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
          >
            {stepsHeading}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {stepsSubtitle}
          </p>
        </div>

        {/* Steps */}
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" aria-label="שלבי התהליך">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index % STEP_ICONS.length]
            const color = STEP_COLORS[index % STEP_COLORS.length]
            return (
              <li key={step.step} className="relative flex flex-col items-center text-center group">
                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-10 right-[-50%] w-full h-0.5 bg-gray-200 z-0"
                    aria-hidden="true"
                  />
                )}

                {/* Step circle */}
                <div
                  className={`relative z-10 w-20 h-20 rounded-full ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  aria-hidden="true"
                >
                  <Icon className="h-8 w-8 text-white" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
