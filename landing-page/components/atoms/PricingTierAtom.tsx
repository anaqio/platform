'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import type { PricingTier } from '@/lib/data/pricing-section';

import { useAnimationReady } from '@/hooks/use-animation-ready';
import { fadeUpCard, ease } from '@/lib/data/motion';

interface PricingTierAtomProps {
  tier: PricingTier;
  index?: number;
}

export function PricingTierAtom({ tier, index = 0 }: PricingTierAtomProps) {
  const { reduced } = useAnimationReady();

  return (
    <motion.div
      {...fadeUpCard(reduced, index)}
      whileHover={
        tier.highlighted ? { y: -8, transition: { duration: 0.3, ease } } : {}
      }
      className={`group relative flex flex-col rounded-xl border transition-all ${
        tier.highlighted
          ? 'border-aq-blue bg-gradient-to-b from-aq-blue/5 to-transparent shadow-xl ring-1 ring-aq-blue/20'
          : 'border-border bg-card'
      }`}
    >
      {tier.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-gradient-to-r from-aq-blue to-aq-purple px-3 py-1 text-xs font-semibold text-white">
            Popular
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 border-b border-border p-6">
        <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
        <p className="text-sm text-muted-foreground">{tier.description}</p>

        <div className="flex items-baseline gap-1">
          {typeof tier.price === 'number' ? (
            <>
              <span className="text-4xl font-bold text-foreground">
                {tier.price.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {tier.currency} / {tier.period}
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-foreground">
              {tier.price}
            </span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full rounded-lg px-4 py-3 font-semibold transition-all ${
            tier.highlighted
              ? 'bg-gradient-to-r from-aq-blue to-aq-purple text-white hover:shadow-lg'
              : 'border border-border text-foreground hover:bg-muted'
          }`}
        >
          {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
        </motion.button>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <ul className="space-y-3">
          {tier.features.map((feature, idx) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="flex items-start gap-3"
            >
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-aq-blue" />
              <span className="text-sm text-foreground/80">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
