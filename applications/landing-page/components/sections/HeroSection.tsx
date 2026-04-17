'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, ChevronDown } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRef } from 'react'

import { Button } from '@anaqio/ui'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { ScrollLink } from '@/components/ui/scroll-link'
import { useAnimationReady } from '@/hooks/use-animation-ready'
import { isRTL, type Locale } from '@/i18n/config'
import { charReveal, ease, wordReveal } from '@/lib/data/motion'

export function HeroSection() {
  const t = useTranslations('landing.hero')
  const locale = useLocale()
  const rtl = isRTL(locale as Locale)
  const sectionRef = useRef<HTMLElement>(null)
  const { reduced, tier, animated } = useAnimationReady()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const headlineY = useTransform(scrollYProgress, [0, 1], ['0px', '-40px'])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  const subheadlineWords = t('subheadline.a').split(' ')
  const proWords = t('headline.pro').split(' ')

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden"
    >
      <h1 id="hero-heading" className="sr-only">
        ANAQIO — {t('headline.pre')} {t('headline.pro')}
      </h1>
      <motion.div
        data-atom
        data-decorative
        aria-hidden="true"
        style={animated ? { scale: videoScale } : {}}
        className="pointer-events-none absolute inset-0 z-0 will-change-transform"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/hero-poster.jpg"
          className="h-full w-full object-cover brightness-[0.45] contrast-[1.05]"
        >
          <source src="/videos/hero-optimized.mp4" type="video/mp4" />
          <source src="/videos/16-9-hero-clip.webm" type="video/webm" />
        </video>
      </motion.div>
      {/* Layer 2: Content Column */}
      <div className="relative z-20 mx-auto flex w-full flex-1 flex-col items-center justify-center px-6 pt-24 text-center sm:px-12">
        {/* Atom A: pre — charReveal per character */}
        <motion.p
          data-atom
          aria-hidden="true"
          style={animated ? { y: headlineY } : {}}
          className="flex flex-wrap justify-center font-display font-light text-foreground"
        >
          {rtl
            ? t('headline.pre')
                .split(' ')
                .map((word, i) => (
                  <motion.span
                    key={`pre-word-${i}`}
                    data-atom
                    aria-hidden="true"
                    {...(animated ? wordReveal(reduced, i) : {})}
                    className="me-[0.22em] inline-block"
                    style={{ fontSize: 'clamp(3.5rem, 8vw, 9rem)' }}
                  >
                    {word}
                  </motion.span>
                ))
            : t('headline.pre')
                .split('')
                .map((char, i) => (
                  <motion.span
                    key={`pre-${char}-${i}`}
                    data-atom
                    aria-hidden="true"
                    {...(animated ? charReveal(reduced, i) : {})}
                    className="inline-block"
                    style={{
                      fontSize: 'clamp(3.5rem, 8vw, 9rem)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
        </motion.p>
        <p
          data-atom
          aria-hidden="true"
          className="flex flex-wrap justify-center font-display font-light italic"
        >
          {proWords.map((word, i) => (
            <motion.span
              key={`pro-${word}-${i}`}
              data-atom
              aria-hidden="true"
              initial={animated ? { y: 20, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.72 + i * 0.07, ease }}
              className="text-brand-gradient me-[0.25em] inline-block"
              style={{
                fontSize: 'clamp(2rem, 4vw, 4.5rem)',
                letterSpacing: '-0.01em',
              }}
            >
              {word}
            </motion.span>
          ))}
        </p>
        <p
          className="mt-8 text-sm leading-[1.8] text-muted-foreground sm:text-[0.93rem]"
          aria-hidden="true"
        >
          {subheadlineWords.map((word, i) => (
            <motion.span
              key={`sub-${word}-${i}`}
              data-atom
              initial={animated ? { y: 16, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 1.0 + i * 0.055, ease }}
              className="me-[0.3em] inline-block"
            >
              {word}
            </motion.span>
          ))}
        </p>
      </div>
      <div className="relative z-30 mb-12 mt-8 flex w-full flex-col items-center justify-center gap-4 px-6 sm:mb-16">
        <motion.div
          data-atom
          initial={animated ? { y: 20, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1, ease }}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton strength={tier === 'high' ? 0.35 : 0}>
            <Button
              variant="hero"
              asChild
              className="group h-12 gap-3 rounded-xl px-8 text-[0.7rem] font-semibold uppercase tracking-[0.18em]"
            >
              <ScrollLink targetId="final-cta">
                <span>{t('cta.act')}</span>
                <ArrowDownRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </ScrollLink>
            </Button>
          </MagneticButton>
          <Button
            variant="heroOutline"
            asChild
            className="h-11 gap-2 rounded-xl px-7 text-[0.7rem] font-medium uppercase tracking-[0.18em]"
          >
            <ScrollLink targetId="how-it-works">{t('cta.learn')}</ScrollLink>
          </Button>
        </motion.div>
      </div>
      <motion.div
        data-atom
        data-decorative
        aria-hidden="true"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-muted-foreground/40"
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </section>
  )
}
