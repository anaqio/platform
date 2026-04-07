'use client'

import { Crown, Sparkles, Zap } from 'lucide-react'

import type { ImageQuality } from '@/lib/generation-options'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface QualitySelectorProps {
  value: ImageQuality
  onChange: (quality: ImageQuality) => void
}

const QUALITIES = [
  {
    value: 'draft' as const,
    label: 'Draft',
    detail: '~15s',
    icon: Zap,
  },
  {
    value: 'standard' as const,
    label: 'Standard',
    detail: '~30s',
    icon: Sparkles,
  },
  {
    value: 'high' as const,
    label: 'High',
    detail: '~60s',
    icon: Crown,
  },
]

export function QualitySelector({ value, onChange }: QualitySelectorProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as ImageQuality)
      }}
      className="grid w-full grid-cols-3 gap-2"
    >
      {QUALITIES.map((q) => (
        <ToggleGroupItem
          key={q.value}
          value={q.value}
          className="border-border data-[state=on]:border-brand-gold data-[state=on]:bg-brand-gold/10 flex h-auto flex-col items-center gap-1 rounded-lg border px-3 py-3"
        >
          <q.icon className="h-4 w-4" />
          <span className="text-xs font-medium">{q.label}</span>
          <span className="text-muted-foreground text-[10px]">{q.detail}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
