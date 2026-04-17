'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { LocaleSwitcher } from '@/components/locale-switcher'
import { AnaqioTypographyLogo } from '@/components/ui/anaqio-typography-logo'
import { ScrollLink } from '@/components/ui/scroll-link'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Solution', targetId: 'solution' },
  { label: 'Comment', targetId: 'how-it-works' },
  { label: 'Pourquoi', targetId: 'why-anaqio' },
  { label: 'Vision', targetId: 'vision' },
] as const

const PAGE_LINKS = [
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

export function Header() {
  const t = useTranslations('header')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-[9980] transition-all duration-500',
        'md:left-16',
        isScrolled ? 'bg-[#2B3AE7]/95 shadow-sm backdrop-blur-md' : 'bg-transparent'
      )}
    >
      <div className="flex h-14 items-center justify-between px-6 md:px-8">
        {/* Mobile: logo */}
        <Link href="/" className="flex items-center gap-2 md:hidden" aria-label="Anaqio">
          <AnaqioTypographyLogo instanceId="header-logo-mobile" className="w-20" variant="none" />
        </Link>

        {/* Desktop nav — right-aligned */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-8"
        >
          {NAV_LINKS.map(({ label, targetId }) => (
            <ScrollLink
              key={targetId}
              targetId={targetId}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
            >
              {label}
            </ScrollLink>
          ))}
          {PAGE_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
          <div className="ml-4 border-l border-white/20 pl-4">
            <LocaleSwitcher />
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setIsMobileOpen(true)}
          aria-label={t('menu.aria')}
        >
          <div className="flex flex-col gap-[5px]">
            <span className="block h-[2px] w-5 bg-white" />
            <span className="block h-[2px] w-5 bg-white" />
          </div>
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex flex-col bg-[#2B3AE7] px-6 pb-12 pt-20"
          >
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mt-8 flex flex-col gap-5">
              {NAV_LINKS.map(({ label, targetId }) => (
                <ScrollLink
                  key={targetId}
                  targetId={targetId}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-3xl font-black text-white"
                >
                  {label}
                </ScrollLink>
              ))}
            </div>

            <div className="mt-10 flex gap-6">
              {PAGE_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-auto">
              <LocaleSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
