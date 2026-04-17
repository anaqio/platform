import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

import { ease } from '@/lib/data/motion'
import { NANOBANANA_VISUALS } from '@/lib/data/nanobanana-assets'

export function StepAtom({
  step,
  index,
  animated,
}: {
  step: { num: string; title: string; body: string }
  index: number
  animated: boolean
}) {
  const ref = useRef(null)

  const inView = useInView(ref, {
    once: true,
    margin: `0px 0px -${10 + (index % 4) * 5}% 0px` as NonNullable<
      Parameters<typeof useInView>[1]
    >['margin'],
  })

  return (
    <motion.div
      ref={ref}
      data-atom
      animate={
        animated && !inView
          ? { opacity: 0.15, filter: 'blur(6px)', y: 20 }
          : { opacity: 1, filter: 'blur(0px)', y: 0 }
      }
      transition={{ duration: 0.7, ease }}
      className="flex flex-col gap-5 sm:max-w-[280px]"
    >
      <motion.span
        animate={animated && inView ? { boxShadow: '0 0 0 8px hsl(var(--primary) / 0)' } : {}}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-aq-blue/10 font-display font-light text-aq-blue ring-1 ring-border"
        style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.8rem)' }}
      >
        {step.num}
      </motion.span>

      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h3 className="font-display text-[clamp(1.4rem,2.5vw,1.8rem)] font-light text-foreground">
            {step.title}
          </h3>
          <p className="font-body text-[0.95rem] leading-relaxed text-muted-foreground">
            {step.body}
          </p>
        </div>

        {/* Visual Representations */}
        <div className="relative mt-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-border/10 bg-card/5 backdrop-blur-md">
          {index === 0 && (
            <Image
              src={NANOBANANA_VISUALS.fashion.silk}
              alt="Upload stage"
              fill
              className="object-cover opacity-40 grayscale transition-all duration-700 group-hover:opacity-60 group-hover:grayscale-0"
            />
          )}
          {index === 1 && (
            <Image
              src={NANOBANANA_VISUALS.studio.arches}
              alt="Style definition"
              fill
              className="object-cover opacity-40 grayscale transition-all duration-700 group-hover:opacity-60 group-hover:grayscale-0"
            />
          )}
          {index === 2 && (
            <Image
              src={NANOBANANA_VISUALS.studio.riad}
              alt="AI generation"
              fill
              className="object-cover opacity-40 grayscale transition-all duration-700 group-hover:opacity-60 group-hover:grayscale-0"
            />
          )}
          {index === 3 && (
            <Image
              src={NANOBANANA_VISUALS.fashion.emerald}
              alt="Scaling"
              fill
              className="object-cover opacity-40 grayscale transition-all duration-700 group-hover:opacity-60 group-hover:grayscale-0"
            />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
        </div>
      </div>
    </motion.div>
  )
}
