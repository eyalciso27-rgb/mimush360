import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { getPublicSettings } from '@/lib/site-settings'

// Always fetch fresh settings — never serve cached layout
export const dynamic = 'force-dynamic'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getPublicSettings()

  return (
    <>
      <Header settings={settings} />
      <main id="main-content" className="flex-1 pt-16 md:pt-20">
        {children}
      </main>
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} />
    </>
  )
}
