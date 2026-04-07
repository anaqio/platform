'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { useAnimationReady } from '@/hooks/use-animation-ready';

export function ResultsSection() {
  const t = useTranslations('landing.results');
  const { animated } = useAnimationReady();

  const items = t.raw('items') as Array<{
    metric: string;
    traditional: string;
    anaqio: string;
    improvement: string;
  }>;

  return (
    <section
      id="results"
      aria-labelledby="results-heading"
      className="vb-blue relative overflow-hidden px-8 py-24 md:px-16"
    >
      <p className="mb-16 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
        {t('eyebrow')}
      </p>

      <h2 id="results-heading" className="sr-only">
        {t('eyebrow')}
      </h2>

      <div className="grid grid-cols-1 divide-y divide-white/10 border-t border-white/10 sm:grid-cols-3">
        {items.map((s, i) => (
          <motion.div
            key={s.metric}
            initial={animated ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border-b border-white/10 px-8 py-12 last:border-r-0 sm:border-b-0 sm:border-r"
          >
            <p
              className="overflow-hidden font-display font-black text-white"
              style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', lineHeight: 1 }}
            >
              {s.anaqio}
            </p>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
              {s.metric}
            </p>
            <p className="mt-2 text-sm text-white/40 line-through">
              {s.traditional}
            </p>
            <p className="mt-1 text-sm font-semibold text-white/70">
              {s.improvement}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
