'use client'

import { motion } from 'framer-motion'

import type { Feature } from '@/lib/data/features-section'

import { useAnimationReady } from '@/hooks/use-animation-ready'
import { fadeUpCard } from '@/lib/data/motion'

interface FeatureCardAtomProps {
  feature: Feature
  index?: number
}

export function FeatureCardAtom({ feature, index = 0 }: FeatureCardAtomProps) {
  const { reduced } = useAnimationReady()

  return (
    <motion.div
      {...fadeUpCard(reduced, index)}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        data-feature-icon
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-aq-blue/10 text-4xl"
      >
        {feature.icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
      </div>
      <motion.div
        className="h-px w-0 bg-gradient-to-r from-aq-blue to-aq-purple"
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
