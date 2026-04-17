'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { useAnimationReady } from '@/hooks/use-animation-ready'

export function SegmentsSection() {
  const t = useTranslations('landing.segments')
  const { animated } = useAnimationReady()

  const items = t.raw('items') as Array<{
    icon: string
    name: string
    role: string
    problem: string
    solution: string
  }>

  return (
    <section
      id="segments"
      aria-labelledby="segments-heading"
      className="vb-white relative overflow-hidden px-8 py-24 md:px-16"
    >
      <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2
          id="segments-heading"
          className="font-display font-black text-black"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          {t('heading.pre')} <span className="vb-underline">{t('heading.highlight')}</span>{' '}
          {t('heading.post')}
        </h2>
        <p className="max-w-md text-sm text-black/60">{t('subheading')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((seg, i) => (
          <motion.div
            key={seg.name}
            initial={animated ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-[#EBEBEB] p-8 transition-colors hover:bg-[#2B3AE7]"
          >
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 group-hover:text-white/50">
              {t('labels.segment')}
            </p>
            <h3 className="font-display text-xl font-bold text-black group-hover:text-white">
              {seg.name}
            </h3>
            <p className="mt-1 text-sm text-black/60 group-hover:text-white/70">{seg.role}</p>
            <div className="mt-4 space-y-2">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 group-hover:text-white/40">
                  {t('labels.problem')}
                </p>
                <p className="text-sm text-black/60 group-hover:text-white/70">{seg.problem}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 group-hover:text-white/40">
                  {t('labels.solution')}
                </p>
                <p className="text-sm text-black/60 group-hover:text-white/70">{seg.solution}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
