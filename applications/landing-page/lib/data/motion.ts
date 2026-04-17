/**
 * Shared Framer Motion animation helpers.
 *
 * Each function accepts the result of `useReducedMotion()` as its first
 * argument so that animations are disabled automatically for users who
 * prefer reduced motion.  Spread the return value directly onto any
 * `motion.*` element:
 *
 *   const reduced = useReducedMotion();
 *   <motion.div {...fadeUp(reduced)}>…</motion.div>
 */

export const ease = [0.16, 1, 0.3, 1] as const

type Reduced = boolean | null

/** Fade-up for section headings and large blocks. */
export const fadeUp = (reduced: Reduced, delay = 0) => ({
  initial: reduced ? false : { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' as const },
  transition: { duration: 0.7, delay, ease },
})

/** Staggered fade-up for grid cards and list items. */
export const fadeUpCard = (reduced: Reduced, index = 0) => ({
  initial: reduced ? false : { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' as const },
  transition: { duration: 0.5, delay: index * 0.1, ease },
})

/** Opacity-only fade for footnotes and subtle reveals. */
export const fadeIn = (reduced: Reduced, delay = 0) => ({
  initial: reduced ? false : { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease },
})

/** Horizontal slide-in for list rows (e.g. vision points). */
export const slideInLeft = (reduced: Reduced, index = 0) => ({
  initial: reduced ? false : { opacity: 0, x: -16 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-60px' as const },
  transition: { duration: 0.5, delay: index * 0.1, ease },
})

// Clip-path wipe from right to left
export const clipReveal = (reduced: Reduced, delay = 0) => ({
  initial: reduced ? false : { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  whileInView: { clipPath: 'inset(0 0% 0 0)', opacity: 1 },
  viewport: { once: true, margin: '-60px' as const },
  transition: { duration: 0.9, delay, ease },
})

// 3D card flip on Y axis
export const flipReveal = (reduced: Reduced, index = 0) => ({
  initial: reduced ? false : { rotateY: 20, opacity: 0, scale: 0.97 },
  whileInView: { rotateY: 0, opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-60px' as const },
  transition: { duration: 0.7, delay: index * 0.12, ease },
  style: { perspective: '1200px', transformStyle: 'preserve-3d' as const },
})

// Character-level rotate-X reveal (for headline letters)
export const charReveal = (reduced: Reduced, index = 0) => ({
  initial: reduced ? false : { rotateX: 80, opacity: 0, y: 12 },
  animate: { rotateX: 0, opacity: 1, y: 0 },
  transition: { duration: 0.55, delay: index * 0.045, ease },
  style: {
    display: 'inline-block',
    transformOrigin: 'bottom center',
    perspective: '600px',
  },
})

// Word-level rotate-X reveal (for Arabic/RTL where char splitting breaks ligatures)
export const wordReveal = (reduced: Reduced, index = 0) => ({
  initial: reduced ? false : { rotateX: 60, opacity: 0, y: 16 },
  animate: { rotateX: 0, opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: index * 0.12, ease },
  style: {
    display: 'inline-block',
    transformOrigin: 'bottom center',
    perspective: '600px',
  },
})

// Scatter converge — atom starts offset from multiple axes
/**
 * Marquee scroll animation: continuous horizontal scroll loop.
 * @param reduced - from useReducedMotion()
 * @returns Framer Motion animation config for 40s linear loop
 */
export function marqueeScroll(reduced: boolean | null) {
  if (reduced) {
    return {} // no animation on reduced motion
  }
  return {
    x: [0, -1000],
    transition: {
      duration: 40,
      ease: 'linear' as const,
      repeat: Infinity,
    },
  }
}

/**
 * Marquee hover pause: pause animation on hover.
 * @returns Framer Motion whileHover config
 */
export function marqueeOnHover() {
  return {
    x: 0,
    transition: { duration: 0.3 },
  }
}

/**
 * Segment reveal: staggered entrance from below with fade.
 * @param reduced - from useReducedMotion()
 * @param index - item index for delay calculation
 * @returns Framer Motion animation config for whileInView
 */
export function segmentReveal(reduced: boolean | null, index: number) {
  if (reduced) {
    return { opacity: 1, y: 0 }
  }
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay: index * 0.1,
      ease,
    },
    viewport: { once: true, margin: '0px 0px -100px 0px' },
  }
}

/**
 * Pricing card hover: scale and lift effect.
 * @returns Framer Motion whileHover config
 */
export function pricingCardHover() {
  return {
    scale: 1.02,
    y: -8,
    transition: { duration: 0.3, ease },
  }
}

export const scatterIn = (reduced: Reduced, x = 0, y = 60, delay = 0) => ({
  initial: reduced ? false : { x, y, opacity: 0 },
  whileInView: { x: 0, y: 0, opacity: 1 },
  viewport: { once: true, margin: '-80px' as const },
  transition: { duration: 0.8, delay, ease },
})
