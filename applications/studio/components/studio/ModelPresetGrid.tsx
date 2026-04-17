'use client'

import type { Database } from '@/types/supabase'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/badge'

type PresetModel = Database['public']['Tables']['preset_models']['Row']

interface ModelPresetGridProps {
  presets: PresetModel[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ModelPresetGrid({ presets, selectedId, onSelect }: ModelPresetGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {presets.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(preset.id)}
          className={cn(
            'group relative overflow-hidden rounded-lg border-2 transition-all',
            selectedId === preset.id
              ? 'border-primary ring-primary/20 ring-2'
              : 'border-border hover:border-primary/50'
          )}
        >
          <div className="bg-muted relative flex aspect-[3/4] items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/presets/${preset.preview_path}`}
              alt={preset.label}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <span className="text-muted-foreground z-0 text-2xl">
              {preset.gender === 'female' ? '👩' : '👨'}
            </span>
          </div>
          <div className="p-2 text-left">
            <p className="truncate text-xs font-medium">{preset.label}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {preset.style_tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="px-1 py-0 text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
