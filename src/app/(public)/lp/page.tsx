import { getPublicSettings } from '@/lib/site-settings'
import { LandingPageClient } from './LandingPageClient'

export default async function LandingPage() {
  const settings = await getPublicSettings()
  return <LandingPageClient settings={settings} />
}
