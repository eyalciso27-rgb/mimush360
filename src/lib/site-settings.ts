import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/lib/utils'

export interface PublicSettings {
  phone: string
  whatsapp: string
  email: string
  address: string
  typeformId: string
  whatsappMessage: string
}

/** Fetch site settings from Supabase, falling back to siteConfig defaults */
export async function getPublicSettings(): Promise<PublicSettings> {
  const defaults: PublicSettings = {
    phone: siteConfig.phone,
    whatsapp: siteConfig.whatsapp,
    email: siteConfig.email,
    address: siteConfig.address,
    typeformId: siteConfig.typeformId,
    whatsappMessage: siteConfig.whatsappMessage,
  }

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['phone', 'whatsapp', 'email', 'address', 'typeform_id'])

    if (!data || data.length === 0) return defaults

    const map: Record<string, string> = {}
    for (const row of data) {
      map[row.key] = row.value
    }

    return {
      phone: map['phone'] || defaults.phone,
      whatsapp: map['whatsapp'] || defaults.whatsapp,
      email: map['email'] || defaults.email,
      address: map['address'] || defaults.address,
      typeformId: map['typeform_id'] || defaults.typeformId,
      whatsappMessage: defaults.whatsappMessage,
    }
  } catch {
    // Supabase not configured or table missing — use defaults
    return defaults
  }
}
