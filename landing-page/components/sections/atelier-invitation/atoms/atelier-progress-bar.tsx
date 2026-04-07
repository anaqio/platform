'use client';

import { motion } from 'framer-motion';

interface AtelierProgressBarProps {
  progress: number; // 0–100
}

export function AtelierProgressBar({ progress }: AtelierProgressBarProps) {
  return (
    <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-border/30">
      <motion.div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-aq-blue to-aq-purple"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}
