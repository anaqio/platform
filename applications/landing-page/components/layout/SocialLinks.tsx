'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { socialLinks } from '@/lib/data/navigation'

/**
 * SocialLinks component — intentionally NOT internationalized.
 *
 * All social media links point to external URLs (target="_blank") with
 * platform names as aria-labels (Twitter, Instagram, LinkedIn, etc.).
 * These are universal brand names that don't require translation.
 *
 * Adding i18n here would add complexity without user-facing benefit.
 */
export function SocialLinks() {
  return (
    <div className="flex w-full flex-wrap justify-center gap-4 sm:justify-between sm:gap-5 md:gap-6">
      {socialLinks.map((s) => (
        <motion.div key={s.label} whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.5 }}>
          <Link
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-transparent transition-all duration-300"
          >
            {/* Brand Gradient Hover Background */}
            <div className="bg-brand-gradient absolute inset-0 -z-10 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <s.Icon width={32} height={32} className="relative z-10" />
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
