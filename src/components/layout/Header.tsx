'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getWhatsAppUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { PublicSettings } from '@/lib/site-settings'

const navItems = [
  { label: 'ראשי', href: '/' },
  { label: 'אודות', href: '/about' },
  { label: 'איך זה עובד', href: '/how-it-works' },
  { label: 'סיפורי הצלחה', href: '/testimonials' },
  { label: 'צור קשר', href: '/contact' },
]

interface HeaderProps {
  settings: PublicSettings
}

export function Header({ settings }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const whatsappUrl = getWhatsAppUrl(settings.whatsapp, settings.whatsappMessage)

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100'
          : 'bg-white/90 backdrop-blur-sm'
      )}
      role="banner"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] rounded-lg p-1"
            aria-label="מימוש 360 - דף הבית"
          >
            <Image
              src="/logo.jpg"
              alt="מימוש 360"
              width={44}
              height={44}
              style={{ height: 'auto' }}
              className="rounded-lg object-contain transition-transform group-hover:scale-105"
              priority
            />
            <span className="font-bold text-lg text-[#1B4332] hidden sm:block">
              מימוש 360
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="ניווט ראשי">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-[#2D6A4F] hover:bg-[#2D6A4F]/10 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${settings.phone.replace(/-/g, '')}`}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#2D6A4F] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] rounded-lg px-2 py-1"
              aria-label={`התקשר אלינו: ${settings.phone}`}
            >
              <Phone className="h-4 w-4" />
              <span className="ltr-text">{settings.phone}</span>
            </a>
            <Button
              asChild
              size="sm"
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="פתח שיחת וואטסאפ"
              >
                בדקו זכאות עכשיו
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F]"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden transition-all duration-300 overflow-hidden',
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!isMenuOpen}
      >
        <div className="bg-white border-t border-gray-100 px-4 py-4">
          <nav aria-label="תפריט ניווט נייד" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:text-[#2D6A4F] hover:bg-[#2D6A4F]/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-gray-100">
            <a
              href={`tel:${settings.phone.replace(/-/g, '')}`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              aria-label={`התקשר אלינו: ${settings.phone}`}
            >
              <Phone className="h-4 w-4 text-[#2D6A4F]" />
              <span className="ltr-text">{settings.phone}</span>
            </a>
            <Button
              asChild
              className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
              >
                בדקו זכאות עכשיו
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
