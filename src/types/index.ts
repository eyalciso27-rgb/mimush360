export * from './database'

export interface NavItem {
  label: string
  href: string
}

export interface ContactFormData {
  fullName: string
  phone: string
  email: string
  message: string
}

export interface SiteConfig {
  phone: string
  whatsapp: string
  whatsappMessage: string
  email: string
  address: string
  businessName: string
  typeformId: string
}
