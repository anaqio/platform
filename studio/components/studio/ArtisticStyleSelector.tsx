'use client'

import { Camera, Clapperboard, Feather, Minimize2, Sun } from 'lucide-react'

import type { ArtisticStyle } from '@/lib/generation-options'

import { cn } from '@/lib/utils/cn'

interface ArtisticStyleSelectorProps {
  value: ArtisticStyle
  onChange: (style: ArtisticStyle) => void
}

const STYLES = [
  {
    value: 'default' as const,
    label: 'Classic',
    description: 'Clean studio shot',
    icon: Camera,
  },
  {
    value: 'cinematic' as const,
    label: 'Cinematic',
    description: 'Dramatic lighting',
    icon: Clapperboard,
  },
  {
    value: 'ethereal' as const,
    label: 'Ethereal',
    description: 'Soft & dreamy',
    icon: Feather,
  },
  {
    value: 'minimalist' as const,
    label: 'Minimalist',
    description: 'High-key, clean',
    icon: Minimize2,
  },
  {
    value: 'street' as const,
    label: 'Street',
    description: 'Bold shadows',
    icon: Sun,
  },
]

export function ArtisticStyleSelector({ value, onChange }: ArtisticStyleSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {STYLES.map((style) => {
        const isSelected = value === style.value
        return (
          <button
            key={style.value}
            type="button"
            onClick={() => onChange(style.value)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 transition-all',
              isSelected
                ? 'border-brand-gold bg-brand-gold/10 ring-brand-gold/30 ring-1'
                : 'border-border hover:border-muted-foreground',
            )}
          >
            <style.icon
              className={cn(
                'h-4 w-4',
                isSelected ? 'text-brand-gold' : 'text-muted-foreground',
              )}
            />
            <span className="text-[11px] font-medium leading-tight">{style.label}</span>
          </button>
        )
      })}
    </div>
  )
}
