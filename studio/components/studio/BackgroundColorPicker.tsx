'use client'

import { Check } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

interface BackgroundColorPickerProps {
  value: string
  onChange: (color: string) => void
}

const PRESETS = [
  { value: 'White', hex: '#ffffff', border: true },
  { value: 'Warm Beige', hex: '#D2B48C' },
  { value: 'Cool Grey', hex: '#9CA3AF' },
  { value: 'Soft Pink', hex: '#F9A8D4' },
  { value: 'Sky Blue', hex: '#7DD3FC' },
  { value: 'Olive Green', hex: '#6B7C3E' },
  { value: 'Burnt Orange', hex: '#CC5500' },
  { value: 'Rich Maroon', hex: '#800000' },
  { value: 'Deep Navy', hex: '#1E3A5F' },
  { value: 'Charcoal', hex: '#36454F' },
]

export function BackgroundColorPicker({ value, onChange }: BackgroundColorPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {PRESETS.map((preset) => {
        const isSelected = value === preset.value
        return (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange(preset.value)}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className={cn(
                'relative flex h-9 w-9 items-center justify-center rounded-full transition-all',
                isSelected
                  ? 'ring-brand-gold scale-110 ring-2 ring-offset-2 ring-offset-background'
                  : 'hover:scale-105',
                preset.border && !isSelected && 'border-border border',
              )}
              style={{ backgroundColor: preset.hex }}
            >
              {isSelected && (
                <Check
                  className={cn(
                    'h-4 w-4',
                    ['White', 'Warm Beige', 'Soft Pink', 'Sky Blue'].includes(preset.value)
                      ? 'text-zinc-800'
                      : 'text-white',
                  )}
                  strokeWidth={3}
                />
              )}
            </div>
            <span
              className={cn(
                'text-[10px] leading-tight',
                isSelected ? 'text-brand-gold font-medium' : 'text-muted-foreground',
              )}
            >
              {preset.value}
            </span>
          </button>
        )
      })}
    </div>
  )
}
