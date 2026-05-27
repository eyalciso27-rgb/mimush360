import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { SiteConfig } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const siteConfig: SiteConfig = {
  phone: '050-1234567',
  whatsapp: '972501234567',
  whatsappMessage: 'היי, הגעתי מהאתר ואשמח לבדוק את הזכאות שלי',
  email: 'info@mimush360.co.il',
  address: 'ישראל',
  businessName: 'מימוש 360',
  typeformId: process.env.NEXT_PUBLIC_TYPEFORM_ID ?? 'YOUR_TYPEFORM_ID',
}

export function getWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function formatPhoneForTel(phone: string): string {
  return `tel:${phone.replace(/-/g, '')}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: 'חדש',
  contacted: 'נוצר קשר',
  qualified: 'מתאים',
  disqualified: 'לא מתאים',
  converted: 'הפך ללקוח',
}

export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  disqualified: 'bg-red-100 text-red-800',
  converted: 'bg-purple-100 text-purple-800',
}
