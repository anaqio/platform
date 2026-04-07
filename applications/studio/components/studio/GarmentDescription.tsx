'use client'

import { Textarea } from '@/components/ui/textarea'

interface GarmentDescriptionProps {
  value: string
  onChange: (value: string) => void
}

export function GarmentDescription({ value, onChange }: GarmentDescriptionProps) {
  return (
    <div className="space-y-2">
      <Textarea
        placeholder="e.g. fine accordion pleats on the skirt, silk texture, slim fit..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        maxLength={200}
        className="resize-none"
      />
      <p className="text-muted-foreground text-right text-xs">{value.length}/200</p>
    </div>
  )
}
