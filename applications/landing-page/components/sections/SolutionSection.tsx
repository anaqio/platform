'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { useAnimationReady } from '@/hooks/use-animation-ready'

export function SolutionSection() {
  const t = useTranslations('landing.solution')
  const pipeline = (t.raw('pipeline') as Array<{ stage: string; label: string; body: string }>).map(
    (p, i) => ({
      ...p,
      id: i,
    })
  )

  const { animated } = useAnimationReady()

  return (
    <section
      id="solution"
      aria-labelledby="solution-heading"
      className="vb-blue relative overflow-hidden px-8 py-24 md:px-16"
    >
      {/* Two-col header */}
      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
            {t('eyebrow')}
          </p>
          <h2
            id="solution-heading"
            className="font-display font-black text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
          >
            {t('headline.pre')} <span className="vb-underline">{t('headline.gradient')}</span>{' '}
            {t('headline.post')}
          </h2>
          <p className="mt-4 max-w-md text-base text-white/60">{t('stat.anaqio.label')}</p>
        </div>
      </div>

      {/* Pipeline cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pipeline.map((stage, i) => (
          <motion.div
            key={stage.label}
            initial={animated ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
          >
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">
              {stage.stage}
            </p>
            <h3 className="font-display text-xl font-bold text-white">{stage.label}</h3>
            <p className="mt-2 text-sm text-white/60">{stage.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
