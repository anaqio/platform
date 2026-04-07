'use client';

import { motion } from 'framer-motion';

import type { Segment } from '@/lib/data/segments-section';

import { useAnimationReady } from '@/hooks/use-animation-ready';
import { slideInLeft } from '@/lib/data/motion';

interface SegmentCardAtomProps {
  segment: Segment;
  index?: number;
}

export function SegmentCardAtom({ segment, index = 0 }: SegmentCardAtomProps) {
  const { reduced } = useAnimationReady();

  return (
    <motion.div
      {...slideInLeft(reduced, index)}
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
      className="group flex gap-4 rounded-lg border border-border bg-card p-5 transition-all hover:border-aq-blue/60 hover:shadow-md"
    >
      <div className="shrink-0 text-4xl">{segment.icon}</div>

      <div className="min-w-0 flex-1">
        <div>
          <h3 className="font-semibold text-foreground">{segment.name}</h3>
          <p className="text-xs font-medium text-muted-foreground">
            {segment.role}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          whileHover={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-3 space-y-2 overflow-hidden"
        >
          <div className="border-l-2 border-aq-blue/30 pl-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Problem
            </p>
            <p className="text-sm text-foreground/80">{segment.problem}</p>
          </div>

          <div className="border-l-2 border-aq-purple/30 pl-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Solution
            </p>
            <p className="text-sm font-medium text-aq-purple">
              {segment.solution}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
