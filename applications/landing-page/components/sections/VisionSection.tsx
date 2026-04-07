'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { ScrollLink } from '@/components/ui/scroll-link';
import { useAnimationReady } from '@/hooks/use-animation-ready';

export function VisionSection() {
  const t = useTranslations('landing.vision');
  const { animated } = useAnimationReady();

  return (
    <section
      id="vision"
      aria-labelledby="vision-heading"
      className="vb-white relative overflow-hidden px-8 py-32 md:px-16 md:py-48"
    >
      <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
        {t('eyebrow')}
      </p>
      <motion.h2
        id="vision-heading"
        initial={animated ? { opacity: 0, y: 30 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-12 max-w-4xl font-display font-black text-black"
        style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: 1.1 }}
      >
        {t('headline.pre')}{' '}
        <span className="vb-underline">{t('headline.gradient')}</span>
      </motion.h2>

      <Button
        asChild
        className="h-12 rounded-sm bg-[#2B3AE7] px-8 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white hover:bg-[#2B3AE7]/90"
      >
        <ScrollLink targetId="final-cta">{t('intro')}</ScrollLink>
      </Button>
    </section>
  );
}
