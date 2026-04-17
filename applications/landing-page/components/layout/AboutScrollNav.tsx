'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

const SECTION_IDS = [
  'about-hero',
  'about-problem',
  'about-solution',
  'about-morocco',
  'about-team',
  'about-cta',
] as const

type SectionId = (typeof SECTION_IDS)[number]

const SECTION_LABEL_KEYS: Record<SectionId, string> = {
  'about-hero': 'intro',
  'about-problem': 'problem',
  'about-solution': 'solution',
  'about-morocco': 'morocco',
  'about-team': 'team',
  'about-cta': 'join',
}

export function AboutScrollNav() {
  const t = useTranslations('scrollNav')
  const [active, setActive] = useState<string>('about-hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px 0px 0px' }
    )

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      aria-label="About page sections"
      className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-5 rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-4 py-8 shadow-2xl backdrop-blur-md xl:flex"
    >
      {SECTION_IDS.map((id) => {
        const label = t(SECTION_LABEL_KEYS[id] as never)
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            aria-label={`Jump to ${label}`}
            aria-current={active === id ? 'true' : undefined}
            className="group flex w-full items-center justify-end gap-4"
          >
            {/* Label — visible on hover or when active */}
            <span
              className={cn(
                'text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ease-out',
                active === id
                  ? 'animate-gradient bg-gradient-to-r from-aq-blue via-aq-purple to-aq-blue bg-[length:200%_auto] bg-clip-text text-transparent opacity-100'
                  : 'text-muted-foreground opacity-0 transition-transform group-hover:opacity-100'
              )}
            >
              {label}
            </span>

            {/* Dot */}
            <span
              className={cn(
                'block rounded-full transition-all duration-500 ease-out',
                active === id
                  ? 'h-3 w-3 bg-aq-blue shadow-[0_0_12px_2px_rgba(63,87,175,0.6)]'
                  : 'h-1.5 w-1.5 bg-muted-foreground/30 group-hover:bg-muted-foreground/70'
              )}
            />
          </button>
        )
      })}
    </nav>
  )
}
