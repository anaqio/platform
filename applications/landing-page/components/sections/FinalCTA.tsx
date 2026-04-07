'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useAnimationReady } from '@/hooks/use-animation-ready';
import { Link } from '@/i18n/routing';
import { ease } from '@/lib/data/motion';

export function FinalCTA() {
  const t = useTranslations('landing.finalCta');
  const sectionRef = useRef<HTMLElement>(null);

  const { tier, animated } = useAnimationReady();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const headlineY = useTransform(scrollYProgress, [0, 0.4], ['60px', '0px']);
  const headlineOp = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      aria-labelledby="cta-heading"
      className="relative flex min-h-[50dvh] w-full flex-col items-center justify-center overflow-hidden px-4 py-16"
    >
      <h2 id="cta-heading" className="sr-only">
        {t('srHeading')}
      </h2>

      <div
        data-atom
        data-decorative
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aq-blue/20 blur-[120px]"
      />

      {/* Pre-headline atom */}
      <motion.p
        data-atom
        initial={animated ? { opacity: 0 } : false}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
        className="absolute top-[20%] font-label text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground"
      >
        {t('headline.pre')}
      </motion.p>

      {/* Headline atom */}
      <motion.div
        data-atom
        aria-hidden="true"
        style={animated ? { y: headlineY, opacity: headlineOp } : {}}
        className="absolute text-center font-display font-light leading-[0.95]"
      >
        <span
          className="text-brand-gradient"
          style={{ fontSize: 'clamp(2.5rem,6vw,6.5rem)' }}
        >
          {t('headline.gradient')}
        </span>
      </motion.div>

      {/* Magnetic CTA atom */}
      <motion.div
        data-atom
        initial={animated ? { y: 20, opacity: 0 } : false}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.2, ease }}
        className="absolute bottom-[22%] z-20 flex flex-col items-center"
      >
        <MagneticButton strength={tier === 'high' ? 0.35 : 0}>
          <Button
            variant="brand"
            asChild
            className="group relative flex h-14 items-center justify-center overflow-hidden rounded-full px-10 text-[0.75rem] font-bold uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_60px_rgba(37,99,235,0.5)]"
          >
            <Link href="/early-access">
              <span className="relative z-10">{t('cta.primary')}</span>
              {/* Glow ring inner overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 z-0 bg-gradient-to-r from-aq-blue/0 via-white/20 to-aq-blue/0 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </Link>
          </Button>
        </MagneticButton>
        {/*

          <p className="mt-8 font-label text-[0.65rem] uppercase tracking-wider text-muted-foreground/60 transition-colors hover:text-foreground/80">

            <ScrollLink targetId="how-it-works">{t('cta.tertiary')}</ScrollLink>
          </p>
          */}
      </motion.div>
    </section>
  );
}
