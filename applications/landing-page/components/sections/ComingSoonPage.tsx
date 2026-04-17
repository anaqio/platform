'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { type Phase } from './Phase'
import { SocialLinks } from '../layout/SocialLinks'
import { NotifyForm } from './atoms/notify'

import { LocaleSwitcher } from '@/components/locale-switcher'
import { LoadingScreen } from '@/components/sections/LoadingScreen'
import AbstractBackground from '@/components/ui/AbstractBackground'
import { AnaqioTypographyLogo } from '@/components/ui/anaqio-typography-logo'
import { PerspectiveGrid } from '@/components/ui/PerspectiveGrid'
import { useAnimationReady } from '@/hooks/use-animation-ready'
import { Link } from '@/i18n/routing'
import { ease, fadeIn, fadeUp } from '@/lib/data/motion'

// ─── Main Component ──────────────────────────────────────────────────────────

export function ComingSoonPage() {
  const t = useTranslations('comingSoon')
  const { reduced, animated } = useAnimationReady()

  const [phase, setPhase] = useState<Phase>('loading')

  const handleLoadingComplete = useCallback(() => {
    setPhase('reveal')
  }, [])

  return (
    <>
      {/* Ambient background — z-0 */}
      <div data-atom data-decorative aria-hidden="true" className="fixed inset-0 z-0">
        <AbstractBackground />
      </div>

      {/* Hero gradient overlay — z-0 */}
      <div
        data-atom
        data-decorative
        aria-hidden="true"
        className="hero-gradient fixed inset-0 z-0"
      />

      {/* Perspective floor grid — z-10, sits above bg, below content */}
      <PerspectiveGrid className="fixed inset-x-0 bottom-0 z-10 h-[30vh] opacity-20" />

      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <LoadingScreen key="loader" onComplete={handleLoadingComplete} animated={animated} />
        )}
      </AnimatePresence>

      {/* Main coming soon content */}
      <AnimatePresence>
        {phase === 'reveal' && (
          <motion.main
            id="main-content"
            key="coming-soon"
            initial={animated ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease }}
            className="relative z-20 flex min-h-[100dvh] flex-col items-center justify-center px-6 pb-24 pt-16 sm:h-[calc(100vh-4rem)] sm:pb-32 sm:pt-20"
          >
            {/* Locale switcher — top-right atom */}
            <motion.div
              data-atom
              className="absolute right-6 top-4 z-30 sm:right-8 sm:top-6"
              {...fadeIn(reduced, 0.3)}
            >
              <LocaleSwitcher />
            </motion.div>

            {/* Atmospheric Background Text */}
            <motion.div
              data-atom
              data-decorative
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center opacity-[0.015] mix-blend-overlay"
              initial={animated ? { scale: 0.6, opacity: 0 } : false}
              animate={{ scale: 0.75, opacity: 0.02 }}
              transition={{ duration: 2, ease: 'easeOut' }}
            >
              <h2 className="w-full whitespace-nowrap px-[3vw] text-center font-display text-[12vw] font-black uppercase leading-none tracking-tighter text-foreground">
                {t('hero.tagline')}
              </h2>
            </motion.div>

            {/* SEO backbone */}
            <h1 className="sr-only">ANAQIO — AI Fashion Studio Coming Soon</h1>

            {/* Logo wordmark — top center */}
            <motion.div data-atom className="z-20 mb-12 w-[min(80vw,600px)]" {...fadeUp(reduced)}>
              <AnaqioTypographyLogo
                instanceId="anaqio-coming-soon-logo"
                variant="none"
                aria-label="ANAQIO"
              />
            </motion.div>
            <div className="pointer-events-none inset-0 z-0 flex h-auto items-center justify-center">
              <span className="bg-brand-gradient animate-shimmer leading select-none whitespace-nowrap bg-clip-text font-display text-5xl font-light text-transparent mix-blend-plus-lighter [text-shadow:0_20px_80px_rgba(37,99,235,0.4)]">
                {t('hero.tagline')}
              </span>
            </div>
            <motion.div
              data-atom
              className="relative z-20 mt-8 max-w-[46ch] text-left font-body text-base leading-relaxed text-muted-foreground sm:text-justify sm:text-lg"
              {...fadeUp(reduced, 0.1)}
            >
              <p className="text-base font-bold sm:text-lg">{t('hero.main')}</p>
              <p className="mt-2 text-sm italic sm:mt-1 sm:text-base">{t('hero.sub1')}</p>
              <p className="mt-2 text-right text-sm italic sm:mt-1 sm:text-base">
                {t('hero.sub2')}
              </p>
            </motion.div>

            {/* Notify me form */}
            <motion.div
              data-atom
              className="z-30 mt-8 w-full max-w-md sm:mt-10"
              {...fadeUp(reduced, 0.15)}
            >
              <NotifyForm animated={animated} />
              {/* ── Social media links ────────────────────────────── */}
              <motion.div
                data-atom
                className="relative z-10 mt-8 flex w-full flex-col items-center justify-around gap-6 sm:mt-10 sm:gap-8"
                initial={animated ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <SocialLinks />
                <motion.div
                  data-atom
                  data-decorative
                  aria-hidden="true"
                  className="z-10 mt-6 h-px w-16 bg-aq-blue/30 sm:mt-16"
                  {...fadeIn(reduced, 0.2)}
                />
              </motion.div>
            </motion.div>

            <footer className="absolute bottom-4 w-full px-6 text-center sm:bottom-8">
              {/* Footer note */}
              <motion.div
                data-atom
                className="z-20 mt-6 flex flex-col items-center justify-center gap-2 font-label text-[10px] uppercase tracking-label text-muted-foreground/50 sm:flex-row sm:gap-4 sm:text-xs"
                {...fadeIn(reduced, 0.25)}
              >
                <div className="flex items-center justify-center gap-2">
                  <p>{t('footer.launch')}</p>
                  <span className="hidden sm:inline">&middot;</span>
                  <p className="hidden sm:block">
                    <Link href="/" className="transition-colors hover:text-foreground">
                      {t('footer.copyright')}
                    </Link>
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <p className="sm:hidden">
                    <Link href="/" className="transition-colors hover:text-foreground">
                      {t('footer.copyright')}
                    </Link>
                  </p>
                  <span className="sm:hidden">&middot;</span>
                  <Link href="/about" className="transition-colors hover:text-foreground">
                    {t('footer.links.about')}
                  </Link>
                  <Link href="/terms" className="transition-colors hover:text-foreground">
                    {t('footer.links.terms')}
                  </Link>
                  <Link href="/privacy" className="transition-colors hover:text-foreground">
                    {t('footer.links.policy')}
                  </Link>
                  <Link href="/legal-mentions" className="transition-colors hover:text-foreground">
                    {t('footer.links.legal')}
                  </Link>
                </div>
              </motion.div>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  )
}
