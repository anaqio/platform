'use client';

import { motion, useReducedMotion } from 'framer-motion';

import type { MarqueeItem } from '@/lib/data/marquee-content';

import { marqueeOnHover, marqueeScroll } from '@/lib/data/motion';

interface MarqueeTickerAtomProps {
  items: MarqueeItem[];
  background?: string;
  textColor?: string;
}

export function MarqueeTickerAtom({
  items,
  background = 'bg-foreground/5',
  textColor = 'text-foreground',
}: MarqueeTickerAtomProps) {
  const reduced = useReducedMotion();
  const duplicatedItems = [...items, ...items];

  return (
    <div className={`overflow-hidden ${background}`}>
      <motion.div
        className="flex items-center px-6 py-4"
        animate={marqueeScroll(reduced)}
        whileHover={marqueeOnHover()}
      >
        {duplicatedItems.map((item, idx) => (
          <div
            key={`${item.text}-${idx}`}
            data-marquee-item
            className="flex shrink-0 items-center gap-3 whitespace-nowrap"
          >
            <span className="text-xl">{item.emoji}</span>
            <span
              className={`text-sm font-semibold uppercase tracking-wide ${textColor}`}
            >
              {item.text}
            </span>
            <span className="mx-4 text-foreground/20">·</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
