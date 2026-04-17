'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { useAnimationReady } from '@/hooks/use-animation-ready'

export function ProblemSection() {
  const t = useTranslations('landing.problem')
  const { animated } = useAnimationReady()

  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="vb-blue relative overflow-hidden px-8 py-32 md:px-16 md:py-48"
    >
      {/* Small label */}
      <motion.p
        initial={animated ? { opacity: 0, y: 10 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50"
      >
        {t('eyebrow')}
      </motion.p>

      {/* Large editorial statement */}
      <motion.h2
        id="problem-heading"
        initial={animated ? { opacity: 0, y: 30 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="max-w-5xl font-display font-black text-white"
        style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: 1.1 }}
      >
        {t('visualHeadline.line1')}{' '}
        <span className="vb-underline">{t('visualHeadline.line2')}</span>
      </motion.h2>
    </section>
  )
}
