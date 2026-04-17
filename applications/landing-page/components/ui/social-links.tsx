'use client'

import { Instagram, Linkedin } from 'lucide-react'

import { cn } from '@/lib/utils'

// ─── TikTok Icon (not available in lucide-react) ───────────────────────────
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}

// ─── Social Links Data ─────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/anaqio.studio/',
    icon: Instagram,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@anaqio',
    icon: TikTokIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/anaqio',
    icon: Linkedin,
  },
] as const

// ─── Component ──────────────────────────────────────────────────────────────
interface SocialLinksProps {
  className?: string
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <nav aria-label="Social media links" className={cn('flex gap-5', className)}>
      {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-muted-foreground/40 transition-colors hover:text-muted-foreground/80 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aq-blue"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </nav>
  )
}
