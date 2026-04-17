'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { HeroCTAs } from './atoms/HeroCTAs'
import { HeroText } from './atoms/HeroText'
import { HeroVideoPlayer } from './atoms/HeroVideoPlayer'

import { useAnimationReady } from '@/hooks/use-animation-ready'

export function VideoHeroSection() {
  const t = useTranslations('landing.hero')
  const sectionRef = useRef<HTMLElement>(null)
  const { reduced, tier, animated } = useAnimationReady()

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background"
    >
      <h1 id="hero-heading" className="sr-only">
        ANAQIO — {t('headline.pre')} {t('headline.pro')}
      </h1>

      {/* Background — linear gradient matching video blue (#3d70b8 → #6096d2) */}
      <div
        data-atom
        data-decorative
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#3d70b8]/75 via-[#3d70b8]/40 via-[#6096d2]/20 to-transparent"
      />
      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col-reverse items-center justify-center gap-8 px-6 pt-20 sm:px-12 lg:flex-row lg:items-center lg:gap-12 lg:pt-24">
        <div className="flex w-full flex-col items-center lg:w-7/12 lg:items-start">
          <HeroText animated={animated} reduced={!!reduced} />
          <HeroCTAs animated={animated} tier={tier} />
        </div>
        <HeroVideoPlayer />
      </div>
      {/* Bottom bleed — fades hero into the section below */}
      <div
        data-atom
        data-decorative
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-40 bg-gradient-to-b from-transparent to-background"
      />

      <motion.div
        data-atom
        data-decorative
        aria-hidden="true"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 z-50 -translate-x-1/2 text-muted-foreground/40"
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </section>
  )
}
