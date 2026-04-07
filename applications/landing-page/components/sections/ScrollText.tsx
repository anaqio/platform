import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { HeroSectionText } from '@/lib/data/hero';

export function ScrollText() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex(
        (prev) => (prev + 1) % HeroSectionText.supportLine.words.length
      );
    }, 2500);
    return () => clearInterval(wordInterval);
  }, []);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-muted-foreground/60"
    >
      Built for{' '}
      <span className="relative inline-flex justify-center">
        <span className="invisible" aria-hidden>
          agencies
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentWordIndex}
            initial={{ y: 8, opacity: 0, filter: 'blur(2px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -8, opacity: 0, filter: 'blur(2px)' }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="text-brand-gradient absolute left-0 top-0 w-full text-center italic"
          >
            {HeroSectionText.supportLine.words[currentWordIndex]}
          </motion.span>
        </AnimatePresence>
      </span>{' '}
      who need consistent, brand-safe visuals at scale.
    </motion.p>
  );
}
