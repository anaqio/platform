/**
 * ANAQIO Design Tokens
 * Single source of truth for brand identity and UI consistency.
 */

export const colors = {
  brand: {
    blue: '#2563EB',
    purple: '#7C3AED',
    indigo: '#3F57AF', // Heritage Deep (30% secondary candidate)
    gold: '#D4AF37', // Burnished Gold (10% accent candidate)
    white: '#F8FAFC',
    ink: '#0F172A', // Textured Black (60% dominant candidate)
    slate: '#334155',
    muted: '#94A3B8',
    border: '#E2E8F0',
    surface: '#F1F5F9',
  },
  gradient: {
    start: '#3F57AF',
    mid1: '#484DA9',
    mid2: '#6049A8',
    end: '#6F47A7',
  },
  // 60-30-10 Tone Mapping
  tones: {
    dominant: '#0F172A', // 60%
    secondary: '#3F57AF', // 30%
    accent: '#D4AF37', // 10%
  },
} as const

export const typography = {
  family: {
    display: 'var(--font-cormorant)',
    ui: 'var(--font-dm-sans)',
    body: 'var(--font-dm-sans)',
    editorial: 'var(--font-instrument-serif)',
    label: 'var(--font-dm-sans)',
    wordmark: 'Georgia, serif',
  },
  tracking: {
    display: '0.01em',
    editorial: '0.04em',
    label: '0.3em',
    wide: '0.4em',
  },
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
} as const

export const motion = {
  duration: {
    fast: 150,
    base: 250,
    slow: 400,
    cinematic: 800,
  },
  easing: {
    out: [0.22, 1, 0.36, 1],
    inOut: [0.4, 0, 0.2, 1],
    smooth: [0.16, 1, 0.3, 1],
  },
} as const

export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '999px',
} as const
