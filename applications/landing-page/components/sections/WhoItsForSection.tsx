'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, LayoutGrid, Palette, Store } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useAnimationReady } from '@/hooks/use-animation-ready';
import { useInterval } from '@/hooks/use-interval';
import { slideInLeft, ease } from '@/lib/data/motion';

export function WhoItsForSection() {
  const t = useTranslations('landing.whoItsFor');
  const AUDIENCE_ICONS = [Store, Palette, Briefcase, LayoutGrid];
  const audiences = (
    t.raw('audiences') as Array<{ title: string; body: string }>
  ).map((a, i) => ({ ...a, icon: AUDIENCE_ICONS[i] }));
  const features = t.raw('features') as string[];

  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { reduced, animated } = useAnimationReady();

  useInterval(() => {
    if (!isHovered) setActive((a) => (a + 1) % audiences.length);
  }, 4000);

  const audience = audiences[active];
  const CurrentIcon = audience.icon;

  return (
    <section
      id="who-its-for"
      aria-labelledby="who-heading"
      className="relative flex min-h-screen flex-col justify-center px-4 pb-24 pt-32 sm:px-16 lg:pt-48"
    >
      <h2 id="who-heading" className="sr-only">
        {t('eyebrow')}: {t('headline.pre')} {t('headline.gradient')}
      </h2>

      <motion.div
        initial={animated ? { opacity: 0, y: 40 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto w-full max-w-6xl"
      >
        <p
          data-atom
          className="mb-6 font-label text-[0.65rem] uppercase tracking-label text-muted-foreground"
        >
          {t('eyebrow')}
        </p>

        <p
          data-atom
          aria-hidden="true"
          className="mb-16 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-tight"
        >
          {t('headline.pre')}{' '}
          <em className="text-brand-gradient not-italic">
            {t('headline.gradient')}
          </em>
        </p>

        {/* Tab Nav */}
        <div
          role="tablist"
          className="mb-12 flex flex-wrap gap-8 border-b border-border/40"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {audiences.map((a, i) => (
            <button
              key={a.title}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className="relative pb-4 font-label text-xs uppercase tracking-label text-muted-foreground transition-colors hover:text-foreground/80 aria-selected:text-foreground"
            >
              {a.title}
              {active === i && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 h-[2px] w-full bg-aq-blue"
                  transition={{ duration: 0.3, ease }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Canvas Panel */}
        <div
          className="relative min-h-[450px] w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={
                animated ? { opacity: 0, x: 20, filter: 'blur(10px)' } : false
              }
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={
                animated ? { opacity: 0, x: -20, filter: 'blur(10px)' } : {}
              }
              transition={{ duration: 0.4, ease }}
              className="relative rounded-[2.5rem] border border-border/10 bg-white/[0.02] p-8 backdrop-blur-md sm:p-16 md:w-[85%] lg:w-[75%]"
            >
              {/* Atmospheric Icon Atom - PINNED Right */}
              <motion.div
                aria-hidden="true"
                data-atom
                data-decorative
                initial={
                  animated ? { scale: 0.8, opacity: 0, rotate: -15 } : false
                }
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.1 }}
                className="absolute right-[-5%] top-[-10%] z-0 hidden text-aq-blue/[0.03] md:block lg:right-[-10%]"
                style={{ fontSize: 'clamp(10rem, 22vw, 20rem)' }}
              >
                <CurrentIcon strokeWidth={0.5} />
              </motion.div>

              <div className="relative z-10">
                <h3
                  data-atom
                  className="mb-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-foreground/90"
                >
                  {audience.title}
                </h3>
                <p
                  data-atom
                  className="mb-8 max-w-[44ch] font-body text-[0.95rem] leading-relaxed text-muted-foreground"
                >
                  {audience.body}
                </p>

                {/* Staggered Features List */}
                <div className="flex flex-col gap-4">
                  {features.map((f, i) => (
                    <motion.div
                      key={f}
                      data-atom
                      {...(animated ? slideInLeft(reduced, i) : {})}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="h-1.5 w-1.5 rounded-full bg-aq-blue"
                        aria-hidden="true"
                      />
                      <span className="font-label text-xs uppercase tracking-label text-foreground/70">
                        {f}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
