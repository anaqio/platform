'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface StepTransitionProps {
  currentStep: number;
  direction: 'forward' | 'backward';
  children: ReactNode;
}

export function StepTransition({
  currentStep,
  direction,
  children,
}: StepTransitionProps) {
  // Animation variants based on direction
  const variants = {
    enter: {
      x: direction === 'forward' ? '100%' : '-100%',
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: direction === 'forward' ? '-100%' : '100%',
      opacity: 0,
    },
  };

  // Cubic bezier easing for smooth transitions
  const transition = {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={currentStep}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
