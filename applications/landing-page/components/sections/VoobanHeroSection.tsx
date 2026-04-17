'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useLayoutEffect, useRef, useState } from 'react'

import { AnaqioTypographyLogo } from '../ui/anaqio-typography-logo'

import { AnaqioLogo } from '@/components/ui/AnaqioLogo'
import { Button } from '@anaqio/ui'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { ScrollLink } from '@/components/ui/scroll-link'
import { useAnimationReady } from '@/hooks/use-animation-ready'

export function VoobanHeroSection() {
  const t = useTranslations('landing.hero')
  const { animated, tier, mounted } = useAnimationReady()
  const sectionRef = useRef<HTMLElement>(null)

  // Viewport pixel dimensions for Framer Motion (pure numbers — no CSS functions in useTransform)
  // Lazy initializers read from window on client; SSR gets safe defaults.
  const [vw, setVw] = useState(1920)
  const [vh, setVh] = useState(1080)

  useLayoutEffect(() => {
    if (!mounted) return
    setVw(window.innerWidth)
    setVh(window.innerHeight)

    const onResize = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [mounted])

  const startW = Math.min(336, vw * 0.85)
  const startH = Math.min(640, vh * 0.7)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const videoWidth = useTransform(scrollYProgress, [0, 0.5], [startW, vw])
  const videoHeight = useTransform(scrollYProgress, [0, 0.5], [startH, vh])
  const videoRadius = useTransform(scrollYProgress, [0, 0.5], [16, 0])
  const videoY = useTransform(scrollYProgress, [0, 0.5], [0, -40])

  const eyebrowOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const wordmarkOpacity = useTransform(scrollYProgress, [0.3, 0.5], [1, 0])

  const cardHeaderOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const cardTickerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative h-[250vh] bg-gradient-to-b from-[#2b548e] from-25% via-10% to-[#b9c1c7] to-30%"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center overflow-hidden">
        <h1 id="hero-heading" className="sr-only">
          ANAQIO — {t('headline.pre')} {t('headline.pro')}
        </h1>

        {/* ── Eyebrow ── */}
        <motion.div
          style={animated ? { opacity: eyebrowOpacity } : {}}
          className="relative z-20 flex w-full items-center gap-3 px-8 pt-20 md:px-12 md:pt-24"
        >
          <div className="h-px w-6 bg-white/60" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
            {t('eyebrow')}
          </span>
        </motion.div>

        <div className="relative z-10 flex flex-1 items-center justify-center">
          <motion.div
            style={
              animated
                ? {
                    width: videoWidth,
                    height: videoHeight,
                    borderRadius: videoRadius,
                    y: videoY,
                  }
                : {
                    width: startW,
                    height: startH,
                    borderRadius: 16,
                  }
            }
            className="relative overflow-hidden bg-[#0d0d0d] shadow-[0_32px_80px_rgba(0,0,0,0.4)]"
          >
            <motion.div
              style={animated ? { opacity: cardHeaderOpacity } : {}}
              className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40"
            >
              <span>Atelier</span>
              <span>ANAQIO</span>
            </motion.div>
            <div className="absolute inset-0">
              <video
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/media/images/hero-poster.jpg"
              >
                <source src="/media/videos/hero.mp4" type="video/mp4" />
              </video>
            </div>

            <motion.div
              style={animated ? { opacity: cardTickerOpacity } : {}}
              className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden bg-[#fdfdfd]/80 py-3 text-neutral-900 backdrop-blur-sm"
            >
              <motion.div
                className="flex whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-900"
                animate={animated ? { x: [0, -400] } : {}}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="mr-8">
                    Mode Anaqio &nbsp;·&nbsp; Atelier VestIa By ANAQIO &nbsp;·&nbsp;
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── CTAs — absolute above wordmark, fade as scroll begins ── */}
        <motion.div
          style={animated ? { opacity: ctaOpacity } : {}}
          className="absolute bottom-24 left-0 right-0 z-20 flex items-center justify-center gap-4"
        >
          <MagneticButton strength={tier === 'high' ? 0.35 : 0}>
            <Button
              asChild
              className="h-11 gap-2 rounded-sm bg-white px-7 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#2B3AE7] hover:bg-white/90"
            >
              <ScrollLink targetId="final-cta">
                <span>{t('cta.act')}</span>
                <ArrowDownRight className="h-3 w-3" />
              </ScrollLink>
            </Button>
          </MagneticButton>
          <Button
            asChild
            variant="ghost"
            className="h-11 rounded-sm border border-white/30 px-7 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/10"
          >
            <ScrollLink targetId="how-it-works">{t('cta.learn')}</ScrollLink>
          </Button>
        </motion.div>

        <motion.div
          style={animated ? { opacity: wordmarkOpacity } : {}}
          className="pointer-events-none absolute -bottom-5 left-0 right-0 -z-20 flex justify-center"
        >
          <AnaqioTypographyLogo variant="outline" />
        </motion.div>
      </div>
    </section>
  )
}
