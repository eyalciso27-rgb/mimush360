import React from 'react'
import { Star, Quote } from 'lucide-react'
import type { Testimonial } from '@/types'

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
  showAll?: boolean
}

const defaultTestimonials: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'מ. כהן',
    content:
      'הייתי בייאוש מוחלט אחרי שנים של ניסיונות כושלים מול ביטוח לאומי. מימוש 360 לקחו את העניין לידיים ותוך כמה חודשים קיבלתי את כל מה שמגיע לי. ממליץ בחום!',
    rating: 5,
    is_published: true,
    display_order: 1,
  },
  {
    name: 'ר. לוי',
    content:
      'שירות מקצועי ואנושי ברמה אחרת. הם ידעו בדיוק מה לעשות, הסבירו לי כל צעד ולא הרגשתי לבד בתהליך. תודה ענקית למצוות.',
    rating: 5,
    is_published: true,
    display_order: 2,
  },
  {
    name: 'ש. אברהם',
    content:
      'לא האמנתי שיש אנשים שבאמת רוצים לעזור ולא רק להרוויח. כל הצוות היה זמין, סבלני ואדיב. הצליחו לממש זכויות שלא ידעתי שבכלל קיימות.',
    rating: 5,
    is_published: true,
    display_order: 3,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`דירוג ${rating} מתוך 5 כוכבים`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-[#B5860D] fill-[#B5860D]' : 'text-gray-300'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function TestimonialsSection({
  testimonials,
  showAll = false,
}: TestimonialsSectionProps) {
  const items = testimonials ?? defaultTestimonials
  const displayItems = showAll ? items : items.slice(0, 3)

  return (
    <section
      className="py-20 bg-gradient-to-br from-[#1B2A4A] to-[#2D6A4F] text-white"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white rounded-full px-4 py-1.5 mb-4 text-sm font-medium">
            סיפורי הצלחה
          </div>
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-black text-white mb-4"
          >
            לקוחות שכבר קיבלו את מה שמגיע להם
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            מאות אנשים כבר הצליחו — בזכות ליווי מקצועי וצמוד.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayItems.map((testimonial, index) => (
            <article
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-full bg-[#B5860D]/30 flex items-center justify-center text-[#B5860D] font-bold text-lg shrink-0"
                  aria-hidden="true"
                >
                  {testimonial.name.charAt(0)}
                </div>
                <Quote
                  className="h-8 w-8 text-white/20"
                  aria-hidden="true"
                />
              </div>

              <StarRating rating={testimonial.rating} />

              <blockquote className="mt-4 mb-4">
                <p className="text-white/85 text-sm leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </blockquote>

              <cite className="text-white/60 text-sm font-medium not-italic">
                — {testimonial.name}
              </cite>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
