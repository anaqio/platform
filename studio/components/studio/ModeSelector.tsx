'use client'

import { Shirt, Users } from 'lucide-react'

import type { GenerationMode } from '@/lib/generation-options'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface ModeSelectorProps {
  value: GenerationMode
  onChange: (mode: GenerationMode) => void
}

const MODES = [
  {
    value: 'single_item' as const,
    label: 'Single Item',
    description: 'One garment on a model',
    icon: Shirt,
  },
  {
    value: 'full_outfit' as const,
    label: 'Full Outfit',
    description: 'Complete look styling',
    icon: Users,
  },
]

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as GenerationMode)
      }}
      className="grid w-full grid-cols-2 gap-3"
    >
      {MODES.map((mode) => (
        <ToggleGroupItem
          key={mode.value}
          value={mode.value}
          className="border-border data-[state=on]:border-brand-gold data-[state=on]:bg-brand-gold/10 flex h-auto flex-col items-center gap-2 rounded-lg border px-4 py-4"
        >
          <mode.icon className="h-5 w-5" />
          <span className="text-sm font-medium">{mode.label}</span>
          <span className="text-muted-foreground text-xs">{mode.description}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
