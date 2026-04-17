'use client'

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  animate,
  useTransform,
} from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import { AnaqioTypographyLogo } from '@/components/ui/anaqio-typography-logo'
import { useAnimationReady } from '@/hooks/use-animation-ready'
import { ease } from '@/lib/data/motion'
import {
  getConnectionTier,
  getBytesDecoded,
  getBytesTransferred,
  getSafetyTimeout,
  resolveStage,
} from '@/lib/loading-stages'
import { cn } from '@/lib/utils'

// ─── Component ───────────────────────────────────────────────────────────────
export default function Loading() {
  const t = useTranslations('loading')
  const [visible, setVisible] = useState(true)
  const { tier, animated } = useAnimationReady()

  // Performance optimization: use MotionValue for high-frequency updates
  const progressMv = useMotionValue(0)
  const progressTextRef = useRef<HTMLSpanElement>(null)
  const [currentStageKey, setCurrentStageKey] = useState(resolveStage(0).key)

  // Derived values for smooth updates without re-renders
  const scaleX = useTransform(progressMv, [0, 100], [0, 1])
  const widthPercent = useTransform(progressMv, (v) => `${v}%`)

  // Synchronize percentage text and stage state without full re-renders
  useMotionValueEvent(progressMv, 'change', (latest) => {
    const rounded = Math.round(latest)

    // Direct DOM update for percentage text
    if (progressTextRef.current) {
      progressTextRef.current.textContent = `${rounded}%`
    }

    // Update stage state only when it actually changes
    const stage = resolveStage(rounded)
    if (stage.key !== currentStageKey) {
      setCurrentStageKey(stage.key)
    }
  })

  useEffect(() => {
    const conn = getConnectionTier()
    const safetyMs = getSafetyTimeout(tier, conn)

    // duration: faster connections feel snappier
    const duration = conn === 'fast' ? 0.6 : conn === 'moderate' ? 0.8 : 1.2

    // ── Smooth eased animation toward target ──────────────────────────────
    const animateTo = (to: number, onDone?: () => void) => {
      if (!animated) {
        progressMv.set(to)
        onDone?.()
        return
      }

      animate(progressMv, to, {
        duration,
        ease: 'easeOut',
        onComplete: onDone,
      })
    }

    const complete = () => animateTo(100, () => setTimeout(() => setVisible(false), 350))

    // ── Initial jump — faster for faster connections ───────────────────────
    const initialJump = conn === 'fast' ? 28 : conn === 'moderate' ? 18 : 10
    animateTo(initialJump)

    // ── Real-time resource tracking via bytes ─────────────────────────────
    let expectedTotalBytes = 0

    const updateFromResources = () => {
      const transferred = getBytesTransferred()
      const decoded = getBytesDecoded()

      expectedTotalBytes = Math.max(expectedTotalBytes, decoded, transferred)

      if (expectedTotalBytes > 0 && transferred > 0) {
        const ratio = Math.min(0.85, transferred / expectedTotalBytes)
        const byteProgress = Math.round(initialJump + ratio * (85 - initialJump))
        if (byteProgress > progressMv.get()) animateTo(byteProgress)
      } else {
        const baseline = conn === 'fast' ? 18 : conn === 'moderate' ? 12 : 8
        const entries = performance.getEntriesByType('resource').length
        const countProgress = Math.min(85, progressMv.get() + (entries / baseline) * 25)
        if (countProgress > progressMv.get()) animateTo(countProgress)
      }
    }

    let po: PerformanceObserver | null = null
    try {
      po = new PerformanceObserver(() => updateFromResources())
      po.observe({ type: 'resource', buffered: true })
    } catch {
      // PerformanceObserver not supported
    }

    // ── DOM lifecycle milestones ──────────────────────────────────────────
    const onReadyState = () => {
      if (document.readyState === 'interactive' && progressMv.get() < 40) animateTo(40)
      if (document.readyState === 'complete') animateTo(90)
    }
    document.addEventListener('readystatechange', onReadyState)
    onReadyState()

    // ── Web fonts resolved (blocks first paint) ───────────────────────────
    document.fonts?.ready.then(() => {
      if (progressMv.get() < 85) animateTo(85)
    })

    // ── window.onload (all sub-resources including images) ────────────────
    if (document.readyState === 'complete') {
      complete()
    } else {
      window.addEventListener('load', complete, { once: true })
    }

    // ── Adaptive safety net ───────────────────────────────────────────────
    const safety = setTimeout(complete, safetyMs)

    return () => {
      document.removeEventListener('readystatechange', onReadyState)
      clearTimeout(safety)
      po?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const connTier = getConnectionTier()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-aq-ink"
          initial={{ opacity: 1 }}
          exit={
            animated
              ? {
                  opacity: 0,
                  scale: 1.03,
                  filter: 'blur(8px)',
                  transition: { duration: 0.65, ease },
                }
              : { opacity: 0, transition: { duration: 0.3 } }
          }
        >
          {/* ── Atmospheric glows (skip on low-tier) ──────────── */}
          {tier !== 'low' && (
            <div
              data-atom
              data-decorative
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aq-blue/[0.06] blur-[100px]" />
              <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-aq-purple/[0.06] blur-[100px]" />
            </div>
          )}

          {/* ── Eyebrow ────────────────────────────────────────── */}
          <motion.p
            data-atom
            className="relative z-10 mb-10 font-label text-[0.6rem] uppercase tracking-label text-muted-foreground/30"
            initial={animated ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('tagline')}
          </motion.p>

          {/* ── Logo with outline-fill animation ─────────────── */}
          <motion.div
            data-atom
            className="relative z-10"
            initial={animated ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <AnaqioTypographyLogo
              instanceId="anaqio-loading-logo"
              variant={animated ? 'outline-fill' : 'none'}
              progress={progressMv}
              className="min-w-screen/2 max-w-1/2 w-[80dvw] sm:w-72"
            />
          </motion.div>

          {/* ── Progress bar + stage labels ───────────────────── */}
          <motion.div
            data-atom
            className="relative z-10 mt-12 flex w-56 flex-col items-center gap-2.5 sm:w-72"
            initial={animated ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Track */}
            <div className="relative h-px w-full overflow-hidden rounded-full bg-border/10">
              {/* Glow layer */}
              {tier !== 'low' && (
                <motion.div
                  data-atom
                  data-decorative
                  aria-hidden="true"
                  className="bg-brand-gradient absolute -top-0.5 bottom-0 left-0 h-[3px] rounded-full blur-sm"
                  style={{ width: widthPercent, opacity: 0.5 }}
                />
              )}
              {/* Sharp fill */}
              <motion.div
                data-atom
                className="bg-brand-gradient absolute inset-y-0 left-0 w-full origin-left"
                style={{ scaleX }}
              />
            </div>

            {/* Stage label + connection dot + percentage */}
            <div className="flex w-full items-center justify-between">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentStageKey}
                  data-atom
                  className="font-label text-[0.58rem] uppercase tracking-label text-muted-foreground/35"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.18 }}
                >
                  {t(`stages.${currentStageKey}`)}
                </motion.span>
              </AnimatePresence>

              <div className="flex items-center gap-1.5">
                {/* Connection quality dot — hidden on low-tier to save paint */}
                {tier !== 'low' && (
                  <span
                    aria-label={`Connection: ${connTier}`}
                    title={connTier}
                    className={cn(
                      'inline-block h-1 w-1 rounded-full transition-colors',
                      connTier === 'fast'
                        ? 'bg-emerald-500/60'
                        : connTier === 'moderate'
                          ? 'bg-amber-500/60'
                          : 'bg-red-500/60'
                    )}
                  />
                )}
                <span
                  data-atom
                  className="font-label text-[0.58rem] tabular-nums tracking-label text-muted-foreground/35"
                  ref={progressTextRef}
                >
                  {Math.round(progressMv.get())}%
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
