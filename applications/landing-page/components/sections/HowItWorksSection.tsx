'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { useAnimationReady } from '@/hooks/use-animation-ready'

export function HowItWorksSection() {
  const t = useTranslations('landing.howItWorks')
  const steps = t.raw('steps') as Array<{
    num: string
    title: string
    body: string
  }>
  const { animated } = useAnimationReady()

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="vb-white relative overflow-hidden px-8 py-24 md:px-16"
    >
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
        {t('eyebrow')}
      </p>
      <h2
        id="how-it-works-heading"
        className="mb-20 max-w-xl font-display font-black text-black"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
      >
        {t('headline.pre')} <span className="vb-underline">{t('headline.gradient')}</span>
      </h2>

      <div className="flex flex-col divide-y divide-black/10">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={animated ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="grid grid-cols-[80px_1fr] gap-8 py-10 md:grid-cols-[120px_1fr]"
          >
            <p
              className="font-display font-black text-black/10"
              style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', lineHeight: 1 }}
            >
              {String(i + 1).padStart(2, '0')}
            </p>
            <div>
              <h3 className="mb-2 font-display text-xl font-bold text-black md:text-2xl">
                {step.title}
              </h3>
              <p className="text-sm text-black/60">{step.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
