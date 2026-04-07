'use client'

import { Maximize, Minimize, Move, Ruler } from 'lucide-react'

import type { FitStyle } from '@/lib/generation-options'

import { cn } from '@/lib/utils/cn'

interface FitStyleSelectorProps {
  value: FitStyle
  onChange: (fit: FitStyle) => void
}

const FIT_OPTIONS = [
  { value: 'standard' as const, label: 'True to Size', icon: Ruler },
  { value: 'loose' as const, label: 'Loose', icon: Move },
  { value: 'oversized' as const, label: 'Oversized', icon: Maximize },
  { value: 'slim' as const, label: 'Slim', icon: Minimize },
]

export function FitStyleSelector({ value, onChange }: FitStyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {FIT_OPTIONS.map((fit) => {
        const isSelected = value === fit.value
        return (
          <button
            key={fit.value}
            type="button"
            onClick={() => onChange(fit.value)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-all',
              isSelected
                ? 'border-brand-gold bg-brand-gold/10 text-foreground ring-brand-gold/30 ring-1'
                : 'border-border text-muted-foreground hover:border-muted-foreground',
            )}
          >
            <fit.icon
              className={cn('h-4 w-4 shrink-0', isSelected ? 'text-brand-gold' : 'text-muted-foreground')}
            />
            {fit.label}
          </button>
        )
      })}
    </div>
  )
}
