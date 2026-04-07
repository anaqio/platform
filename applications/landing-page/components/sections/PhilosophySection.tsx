'use client';

import { useScroll } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { ScrollWord } from './atoms/scroll-word';

import { useAnimationReady } from '@/hooks/use-animation-ready';

export function PhilosophySection() {
  const t = useTranslations('landing.philosophy');
  const sectionRef = useRef<HTMLElement>(null);
  const { animated } = useAnimationReady();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });

  const words = t('body').split(' ');
  const wordCount = words.length;

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      aria-labelledby="philosophy-heading"
      className="relative flex min-h-[120vh] flex-col items-center justify-center overflow-hidden px-4 md:px-16"
    >
      <h2 id="philosophy-heading" className="sr-only">
        {t('eyebrow')}
      </h2>

      {/* Atmospheric Atom */}
      <span
        data-atom
        data-decorative
        aria-hidden="true"
        className="absolute right-[5%] top-[40%] select-none font-display font-light leading-none text-foreground opacity-[0.04]"
        style={{ fontSize: 'clamp(8rem, 15vw, 15rem)' }}
      >
        .
      </span>

      <div className="relative z-10 mx-auto max-w-5xl text-left">
        {words.map((word, i) => {
          const start = i / wordCount;
          const end = start + 3 / wordCount;

          return (
            <ScrollWord
              key={`${word}-${i}`}
              word={word}
              start={start}
              end={end}
              scrollYProgress={scrollYProgress}
              animated={animated}
            />
          );
        })}
      </div>
    </section>
  );
}
