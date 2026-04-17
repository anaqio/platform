'use client'

import { motion } from 'framer-motion'
import { Move3D, Ruler, ShieldCheck, Sun, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useAnimationReady } from '@/hooks/use-animation-ready'

export function WhyAnaqioSection() {
  const t = useTranslations('landing.whyAnaqio')
  const POINT_ICONS = [Ruler, Move3D, Sun, Zap, ShieldCheck]
  const points = (t.raw('points') as Array<{ title: string; body: string }>).map((p, i) => ({
    ...p,
    icon: POINT_ICONS[i],
  }))

  const { animated } = useAnimationReady()

  return (
    <section
      id="why-anaqio"
      aria-labelledby="why-heading"
      className="vb-blue relative overflow-hidden px-8 py-24 md:px-16"
    >
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
        {t('eyebrow')}
      </p>
      <h2
        id="why-heading"
        className="mb-4 font-display font-black text-white"
        style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
      >
        {t('headline.pre')} <span className="vb-underline">{t('headline.gradient')}</span>{' '}
        {t('headline.post')}
      </h2>
      <p className="mb-20 max-w-lg text-base text-white/60">{t('footer')}</p>

      {/* Benefit grid — dark tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point, i) => (
          <motion.div
            key={point.title}
            initial={animated ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-xl bg-white/10 p-6"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-white/15 text-white">
              <point.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="font-display text-lg font-bold text-white">{point.title}</p>
            <p className="mt-2 text-sm text-white/60">{point.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
