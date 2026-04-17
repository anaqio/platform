'use client'
import { type HTMLMotionProps, motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'

import { useDeviceTier } from '@/hooks/use-device-tier'
import { useIsTouch } from '@/hooks/use-is-touch'

export interface MagneticButtonProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  // Add spring for smooth reset and movement
  const x = useSpring(rawX, { stiffness: 400, damping: 30 })
  const y = useSpring(rawY, { stiffness: 400, damping: 30 })

  const tier = useDeviceTier()
  const isTouch = useIsTouch()

  const effectiveStrength = tier === 'high' && !isTouch ? strength : 0

  const handleMouseMove = (e: React.MouseEvent) => {
    if (effectiveStrength === 0 || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left - rect.width / 2) * effectiveStrength)
    rawY.set((e.clientY - rect.top - rect.height / 2) * effectiveStrength)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={effectiveStrength > 0 ? { x, y } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
