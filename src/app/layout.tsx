import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mimush360.co.il'
  ),
  title: {
    default: 'מימוש 360 | מימוש זכויות רפואיות מול ביטוח לאומי',
    template: '%s | מימוש 360',
  },
  description:
    'מימוש 360 מסייעת לכם למצות את הזכויות הרפואיות שמגיעות לכם מביטוח לאומי. ליווי מקצועי, אישי ואמין לאורך כל הדרך.',
  keywords: [
    'ביטוח לאומי',
    'זכויות רפואיות',
    'מימוש זכויות',
    'נכות',
    'גמלאות',
    'מימוש 360',
  ],
  authors: [{ name: 'מימוש 360' }],
  creator: 'מימוש 360',
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: 'https://mimush360.co.il',
    siteName: 'מימוש 360',
    title: 'מימוש 360 | מימוש זכויות רפואיות מול ביטוח לאומי',
    description:
      'מימוש 360 מסייעת לכם למצות את הזכויות הרפואיות שמגיעות לכם מביטוח לאומי.',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'מימוש 360',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'מימוש 360 | מימוש זכויות רפואיות',
    description: 'ליווי מקצועי לממוש זכויות רפואיות מביטוח לאומי',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <a href="#main-content" className="skip-to-content">
          דלג לתוכן הראשי
        </a>
        {children}
        <Toaster
          position="bottom-right"
          richColors
          dir="rtl"
        />
      </body>
    </html>
  )
}
