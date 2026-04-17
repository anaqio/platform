'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { LocaleSwitcher } from '@/components/locale-switcher'
import { ScrollLink } from '@/components/ui/scroll-link'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'

const SECTION_LINKS = [
  { label: 'Solution', targetId: 'solution' },
  { label: 'Comment ça marche', targetId: 'how-it-works' },
  { label: 'Pourquoi Anaqio', targetId: 'why-anaqio' },
  { label: 'Vision', targetId: 'vision' },
] as const

const PAGE_LINKS = [
  { label: 'À propos', href: '/about' },
  { label: 'Marque', href: '/brand' },
  { label: 'Contact', href: '/contact' },
] as const

export function MenuSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add('has-sidebar')
    return () => document.body.classList.remove('has-sidebar')
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const close = () => setIsOpen(false)

  return (
    <>
      {/* ── Fixed left strip ── */}
      <div
        className={cn(
          'fixed left-0 top-0 z-[9990] hidden h-full w-16 flex-col items-center justify-between py-6 md:flex',
          'border-r border-white/10 bg-[#2B3AE7]'
        )}
      >
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-2">
          <Link href="/" aria-label="Anaqio home">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/90">
              <span className="text-[10px] font-black tracking-tight text-[#2B3AE7]">AQ</span>
            </div>
          </Link>
        </div>

        {/* Rotated MENU label — click to open overlay */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          className="group flex flex-col items-center gap-3"
        >
          {/* Two line hamburger */}
          <div className="flex flex-col gap-[5px]">
            <span className="block h-[2px] w-5 bg-white transition-all duration-300 group-hover:w-4" />
            <span className="block h-[2px] w-5 bg-white transition-all duration-300" />
          </div>
          <span
            className="text-[9px] font-bold uppercase tracking-[0.3em] text-white"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            MENU
          </span>
        </button>

        {/* Bottom locale */}
        <div className="scale-75">
          <LocaleSwitcher />
        </div>
      </div>

      {/* ── Full-screen overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9995] flex bg-[#2B3AE7] md:pl-16"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            >
              <X size={18} />
            </button>

            <div className="flex w-full flex-col justify-center px-12 md:px-24">
              {/* Primary nav */}
              <nav className="mb-16">
                {SECTION_LINKS.map(({ label, targetId }, i) => (
                  <motion.div
                    key={targetId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                  >
                    <ScrollLink
                      targetId={targetId}
                      onClick={close}
                      className="block py-3 font-display text-4xl font-black text-white/80 transition-colors hover:text-white md:text-6xl"
                    >
                      {label}
                    </ScrollLink>
                  </motion.div>
                ))}
              </nav>

              {/* Secondary links */}
              <div className="flex gap-8">
                {PAGE_LINKS.map(({ label, href }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
                  >
                    <Link
                      href={href}
                      onClick={close}
                      className="text-sm font-medium uppercase tracking-widest text-white/50 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
