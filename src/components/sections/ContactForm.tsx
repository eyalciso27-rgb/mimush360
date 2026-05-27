'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { contactSchema, type ContactFormData } from '@/lib/validations/contact'
import { CheckCircle, Loader2 } from 'lucide-react'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'שגיאה בשליחת הטופס')
      }

      setSubmitted(true)
      reset()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'שגיאה בשליחת הטופס, נסו שוב'
      toast.error(message)
    }
  }

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 text-center gap-4"
        role="alert"
        aria-live="polite"
      >
        <div className="w-16 h-16 bg-[#2D6A4F]/10 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-[#2D6A4F]" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          ההודעה נשלחה בהצלחה!
        </h3>
        <p className="text-gray-600 max-w-sm">
          תודה שפנית אלינו. נחזור אליך בהקדם האפשרי — בדרך כלל תוך יום עסקים.
        </p>
        <Button
          variant="outline"
          onClick={() => setSubmitted(false)}
          className="mt-2"
        >
          שלח הודעה נוספת
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      aria-label="טופס יצירת קשר"
      noValidate
    >
      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="fullName">
          שם מלא <span className="text-red-500" aria-hidden="true">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="ישראל ישראלי"
          autoComplete="name"
          aria-required="true"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          {...register('fullName')}
        />
        {errors.fullName && (
          <p
            id="fullName-error"
            className="text-sm text-red-600"
            role="alert"
          >
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">
          טלפון <span className="text-red-500" aria-hidden="true">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="050-0000000"
          autoComplete="tel"
          inputMode="tel"
          dir="ltr"
          aria-required="true"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          {...register('phone')}
        />
        {errors.phone && (
          <p id="phone-error" className="text-sm text-red-600" role="alert">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Email (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="email">
          אימייל <span className="text-gray-400 text-xs">(אופציונלי)</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="israel@example.com"
          autoComplete="email"
          dir="ltr"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message">
          הודעה <span className="text-red-500" aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="ספר לנו בקצרה על המצב שלך ומה אתה מחפש..."
          rows={4}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message')}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-red-600" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Privacy notice */}
      <p className="text-xs text-gray-500">
        הפרטים שתמסור ישמרו בצורה מאובטחת ולא יועברו לצד שלישי.
      </p>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] font-semibold"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            שולח...
          </>
        ) : (
          'שלח הודעה'
        )}
      </Button>
    </form>
  )
}
