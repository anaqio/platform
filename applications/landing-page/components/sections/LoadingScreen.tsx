'use client';

import { motion } from 'framer-motion';

import Loading from '@/app/[locale]/loading';
import { ease } from '@/lib/data/motion';

interface LoadingScreenProps {
  /** Called when the loading animation completes (progress bar full). */
  onComplete: () => void;
  /** Whether to skip animations (reduced motion or low-tier device). */
  animated: boolean;
}

/**
 * Full-screen dark loading screen with centered ANAQIO logo and a thin
 * progress bar that fills over ~1.8s, then triggers the exit callback.
 */
export function LoadingScreen({ onComplete, animated }: LoadingScreenProps) {
  return (
    <motion.div
      data-atom
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      exit={animated ? { opacity: 0, scale: 1.02 } : { opacity: 0 }}
      transition={{ duration: 0.6, ease }}
    >
      <Loading />

      {/* Tagline */}
      <motion.p
        data-atom
        className="mt-6 font-label text-xs uppercase tracking-label text-muted-foreground"
        initial={animated ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6, ease }}
      >
        AI Fashion Studio
      </motion.p>

      {/* Progress bar */}
      <div
        data-atom
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-border/20"
      >
        <motion.div
          className="h-full origin-left bg-aq-blue"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={onComplete}
        />
      </div>
    </motion.div>
  );
}
