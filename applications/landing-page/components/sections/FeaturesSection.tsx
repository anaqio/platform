'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { useAnimationReady } from '@/hooks/use-animation-ready'

export function FeaturesSection() {
  const t = useTranslations('landing.features')
  const { animated, reduced } = useAnimationReady()

  const items = t.raw('items') as Array<{
    icon: string
    title: string
    description: string
  }>

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="vb-white relative overflow-hidden px-8 py-24 md:px-16"
    >
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
        {t('eyebrow')}
      </p>
      <h2
        id="features-heading"
        className="mb-16 max-w-2xl font-display font-black text-black"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
      >
        {t('heading.pre')} <span className="vb-underline">{t('heading.highlight')}</span>{' '}
        {t('heading.post')}
      </h2>

      <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: animated ? i * 0.1 : 0 }}
            className="bg-[#F5F5F0] p-8"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-[#2B3AE7] text-xl text-white">
              {feature.icon}
            </div>
            <h3 className="mb-2 font-display text-lg font-bold text-black">{feature.title}</h3>
            <p className="text-sm text-black/60">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
