import { Building2, Compass, Mail, Phone, TrendingUp, User } from 'lucide-react'
import { createElement, type ReactNode } from 'react'

import type { AtelierIconName } from '@/lib/data/atelier-invitation'
import type { Variants } from 'framer-motion'

const iconClass = 'h-6 w-6'

export const ICONS: Record<AtelierIconName, ReactNode> = {
  Mail: createElement(Mail, { className: iconClass }),
  Building2: createElement(Building2, { className: iconClass }),
  Phone: createElement(Phone, { className: iconClass }),
  User: createElement(User, { className: iconClass }),
  TrendingUp: createElement(TrendingUp, { className: iconClass }),
  Compass: createElement(Compass, { className: iconClass }),
}

export const SLIDE_VARIANTS: Variants = {
  enter: (dir: number) => ({ y: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? -60 : 60, opacity: 0 }),
}

export const SLIDE_TRANSITION = {
  duration: 0.35,
  ease: [0.32, 0, 0.18, 1] as const,
}
