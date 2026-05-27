import { z } from 'zod'

export const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, 'שם מלא חייב להכיל לפחות 2 תווים')
    .max(100, 'שם מלא ארוך מדי'),
  phone: z
    .string()
    .min(9, 'מספר טלפון לא תקין')
    .max(15, 'מספר טלפון לא תקין')
    .regex(/^[\d\-\+\s]+$/, 'מספר טלפון לא תקין'),
  email: z
    .string()
    .email('כתובת מייל לא תקינה')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'הודעה חייבת להכיל לפחות 10 תווים')
    .max(1000, 'ההודעה ארוכה מדי'),
})

export type ContactFormData = z.infer<typeof contactSchema>
