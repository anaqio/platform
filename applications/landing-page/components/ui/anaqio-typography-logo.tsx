'use client'

import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import * as React from 'react'

import { cn } from '@/lib/utils'

export type LogoAnimationVariant =
  | 'none'
  | 'stagger'
  | 'outline'
  | 'outline-fill'
  | 'spin'
  | 'spring-hover'
  | 'cinematic-reveal'
  | 'breathing'
  | 'lock-in'

export interface AnaqioTypographyLogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: LogoAnimationVariant
  /**
   * Loading progress (0–100). Only used when `variant="outline-fill"`.
   * Phase 1 (0–40%): stroke draws on via pathLength.
   * Phase 2 (40–100%): fill fades in, stroke fades out.
   */
  progress?: number | MotionValue<number>
  /**
   * Stable instance ID for SVG gradient namespacing.
   * Pass a static string when the component is rendered after dynamic imports
   * to avoid React hydration mismatches caused by useId() counter drift.
   */
  instanceId?: string
  animated?: boolean
}

const letterPaths = [
  {
    id: 'letter-e',
    gradientId: 'e',
    label: 'A',
    d: 'm118 357-41-99h16l10 26h46l12-26h14l-41 100h-6l-4 1zm8-14 19-47h-37z',
  },
  {
    id: 'letter-b',
    gradientId: 'b',
    label: 'N',
    d: 'M282 358v-76l-56 76h-13V258h15v76l56-76h13v99l-1 1z',
  },
  {
    id: 'letter-d',
    gradientId: 'd',
    label: 'A',
    d: 'M382 358h-6l-41-100h14l10 26h46l11-26h15l-40 98-6 2zm1-15 18-47h-37z',
  },
  {
    id: 'letter-a',
    gradientId: 'a',
    label: 'Q',
    d: 'M507 358c-56-3-62-86-9-99l-13-9 1-5 4 3q16 4 34-5c13-5 27-10 41-3l10 10q0 3-2 3l-8-6c-15-5-33 7-48 9h-14l4 1h7c68 7 60 101-2 101zm1-89c-42 4-42 72-2 77 28 3 41-17 41-38 0-20-12-39-35-39z',
  },
  { id: 'letter-f', gradientId: 'f', label: 'I', d: 'M606 358V258h13v100z' },
  {
    id: 'letter-c',
    gradientId: 'c',
    label: 'O',
    d: 'M667 288c12-33 59-42 83-17 26 26 16 76-22 86l-14 2c-35 0-60-35-47-71m44-19c-43 3-43 72-2 77 27 3 41-18 41-38s-12-39-36-39z',
  },
]

const gradientConfigs: { id: string; transform: string }[] = [
  { id: 'a', transform: 'matrix(114 0 0 -114 461 298)' },
  { id: 'b', transform: 'matrix(83 0 0 -83 213 308)' },
  { id: 'c', transform: 'matrix(101 0 0 -101 664 308)' },
  { id: 'd', transform: 'matrix(96 0 0 -96 335 308)' },
  { id: 'e', transform: 'matrix(97 0 0 -97 77 308)' },
  { id: 'f', transform: 'matrix(13 0 0 -13 606 308)' },
]

const gradientStops = [
  { offset: '0', color: '#3f57af' },
  { offset: '.1', color: '#3f57af' },
  { offset: '.3', color: '#484da9' },
  { offset: '.4', color: '#484da9' },
  { offset: '.7', color: '#6049a8' },
  { offset: '1', color: '#6f47a7' },
]

function LogoGradientDefs({ instanceId }: { instanceId: string }) {
  return (
    <>
      {gradientConfigs.map((g) => (
        <linearGradient
          key={g.id}
          id={`${instanceId}-${g.id}`}
          x1="0"
          x2="1"
          y1="0"
          y2="0"
          gradientTransform={g.transform}
          gradientUnits="userSpaceOnUse"
          spreadMethod="pad"
        >
          {gradientStops.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      ))}
    </>
  )
}

function StaticLetters({ instanceId }: { instanceId: string }) {
  return (
    <>
      {letterPaths.map((l) => (
        <path
          key={l.id}
          fill={`url(#${instanceId}-${l.gradientId})`}
          d={l.d}
          transform="matrix(1 0 0 -1 0 794)"
        />
      ))}
    </>
  )
}

// ─── Variant: Stagger Fade-Up ───────────────────────────────────────────────
function StaggerLetters({ instanceId }: { instanceId: string }) {
  return (
    <>
      {letterPaths.map((l, i) => (
        <motion.g
          key={l.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: i * 0.08,
          }}
        >
          <path
            fill={`url(#${instanceId}-${l.gradientId})`}
            d={l.d}
            transform="matrix(1 0 0 -1 0 794)"
          />
        </motion.g>
      ))}
    </>
  )
}

function OutlineFillLetter({
  letter,
  index,
  instanceId,
  progressMv,
}: {
  letter: (typeof letterPaths)[number]
  index: number
  instanceId: string
  progressMv: ReturnType<typeof useMotionValue<number>>
}) {
  const staggerStart = index * 0.04 // 0, 0.04, 0.08 … max ~0.24
  const strokeEnd = 0.4
  const pathLength = useTransform(progressMv, [staggerStart * 100, strokeEnd * 100], [0, 1])
  const strokeOpacity = useTransform(progressMv, [40, 70], [1, 0])
  const fillOpacity = useTransform(progressMv, [40, 80], [0, 1])

  return (
    <g>
      <motion.path
        d={letter.d}
        transform="matrix(1 0 0 -1 0 794)"
        fill="none"
        stroke="#484da9"
        strokeWidth="1.5"
        style={{ pathLength, opacity: strokeOpacity }}
      />
      <motion.path
        d={letter.d}
        transform="matrix(1 0 0 -1 0 794)"
        fill={`url(#${instanceId}-${letter.gradientId})`}
        style={{ opacity: fillOpacity }}
      />
    </g>
  )
}

function OutlineFillLetters({
  instanceId,
  progress,
}: {
  instanceId: string
  progress?: number | MotionValue<number>
}) {
  const initialValue = React.useMemo(() => {
    if (typeof progress === 'number') return progress
    if (progress && 'get' in progress) return progress.get()
    return 0
  }, [progress])

  const internalProgressMv = useMotionValue(initialValue)

  // Sync the MotionValue when the progress prop changes (if it's a number)
  React.useEffect(() => {
    if (typeof progress === 'number') {
      internalProgressMv.set(progress)
    }
  }, [progress, internalProgressMv])

  const progressMv = progress && typeof progress !== 'number' ? progress : internalProgressMv

  return (
    <>
      {letterPaths.map((l, i) => (
        <OutlineFillLetter
          key={l.id}
          letter={l}
          index={i}
          instanceId={instanceId}
          progressMv={progressMv}
        />
      ))}
    </>
  )
}

function OutlineLetters({ instanceId: _instanceId }: { instanceId: string }) {
  return (
    <>
      {letterPaths.map((l, i) => (
        <motion.path
          key={`outline-only-${l.id}`}
          d={l.d}
          transform="matrix(1 0 0 -1 0 794)"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.9}
          strokeWidth="1.6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: {
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: i * 0.05,
            },
            opacity: { duration: 0.3, delay: i * 0.05 },
          }}
        />
      ))}
    </>
  )
}

function SpinLetters({ instanceId }: { instanceId: string }) {
  return (
    <motion.g
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
      style={{ transformOrigin: '50% 50%' }}
    >
      <StaticLetters instanceId={instanceId} />
    </motion.g>
  )
}

function SpringHoverLetters({ instanceId }: { instanceId: string }) {
  return (
    <motion.g
      whileHover={{ scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      style={{ transformOrigin: '50% 50%' }}
    >
      {letterPaths.map((l, i) => (
        <motion.g
          key={l.id}
          whileHover={{ y: -8 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 12,
            delay: i * 0.03,
          }}
        >
          <path
            fill={`url(#${instanceId}-${l.gradientId})`}
            d={l.d}
            transform="matrix(1 0 0 -1 0 794)"
          />
        </motion.g>
      ))}
    </motion.g>
  )
}

function CinematicRevealLetters({ instanceId }: { instanceId: string }) {
  return (
    <>
      {letterPaths.map((l, i) => (
        <motion.g
          key={l.id}
          initial={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.3 + i * 0.1,
          }}
        >
          <path
            fill={`url(#${instanceId}-${l.gradientId})`}
            d={l.d}
            transform="matrix(1 0 0 -1 0 794)"
          />
        </motion.g>
      ))}
    </>
  )
}

function BreathingLetters({ instanceId }: { instanceId: string }) {
  return (
    <motion.g
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
      style={{ transformOrigin: '50% 50%' }}
    >
      <StaticLetters instanceId={instanceId} />
    </motion.g>
  )
}

function LockInLetters({ instanceId }: { instanceId: string }) {
  return (
    <>
      {letterPaths.map((l, i) => (
        <motion.g
          key={l.id}
          initial={{ opacity: 0, scale: 1.5, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 20,
            delay: 0.15 + i * 0.07,
          }}
          style={{ transformOrigin: '50% 50%' }}
        >
          <path
            fill={`url(#${instanceId}-${l.gradientId})`}
            d={l.d}
            transform="matrix(1 0 0 -1 0 794)"
          />
        </motion.g>
      ))}
    </>
  )
}

export function AnaqioTypographyLogo({
  variant,
  progress = 0,
  instanceId: instanceIdProp,
  className,
  animated = false,
  ...props
}: AnaqioTypographyLogoProps) {
  // Backwards compat: `animated` maps to 'stagger'
  const resolvedVariant: LogoAnimationVariant = variant ?? (animated ? 'stagger' : 'none')

  // Unique instance id so multiple logos on a page don't clash gradient ids.
  // useId() can drift when dynamic (ssr:false) imports add extra hook calls
  // client-side — pass instanceId prop for stable usages (e.g. Footer watermark).
  const generatedId = React.useId().replace(/:/g, '')
  const instanceId = instanceIdProp ?? generatedId

  const renderLetters = () => {
    switch (resolvedVariant) {
      case 'stagger':
        return <StaggerLetters instanceId={instanceId} />
      case 'outline':
        return <OutlineLetters instanceId={instanceId} />
      case 'outline-fill':
        return <OutlineFillLetters instanceId={instanceId} progress={progress} />
      case 'spin':
        return <SpinLetters instanceId={instanceId} />
      case 'spring-hover':
        return <SpringHoverLetters instanceId={instanceId} />
      case 'cinematic-reveal':
        return <CinematicRevealLetters instanceId={instanceId} />
      case 'breathing':
        return <BreathingLetters instanceId={instanceId} />
      case 'lock-in':
        return <LockInLetters instanceId={instanceId} />
      default:
        return <StaticLetters instanceId={instanceId} />
    }
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="60 380 720 200"
      className={cn('h-auto w-full', className)}
      role="img"
      aria-label="ANAQIO"
      {...props}
    >
      <defs>
        <LogoGradientDefs instanceId={instanceId} />
      </defs>
      {renderLetters()}
    </svg>
  )
}
