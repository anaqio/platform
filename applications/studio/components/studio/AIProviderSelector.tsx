'use client'

import { Bot, Sparkles, Zap } from 'lucide-react'

import type { AIProvider } from '@/lib/generation-options'
import { cn } from '@/lib/utils/cn'

interface AIProviderSelectorProps {
  value: AIProvider
  onChange: (provider: AIProvider) => void
}

const PROVIDERS = [
  {
    value: 'idm_vton' as const,
    label: 'IDM-VTON',
    subtitle: 'Virtual Try-On',
    description: 'Composites garment onto model photo. Fast, specialized for try-on.',
    icon: Bot,
    badge: 'Free',
  },
  {
    value: 'fal_ai' as const,
    label: 'Leffa VTON',
    subtitle: 'fal.ai',
    description: 'Fast cloud-based virtual try-on. Reliable and high quality.',
    icon: Zap,
    badge: 'API Key',
  },
  {
    value: 'gemini' as const,
    label: 'Gemini Imagen',
    subtitle: 'Google AI',
    description: 'AI-generated studio shot with rich prompt control. Creative.',
    icon: Sparkles,
    badge: 'API Key',
  },
]

export function AIProviderSelector({ value, onChange }: AIProviderSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {PROVIDERS.map((provider) => {
        const isSelected = value === provider.value
        return (
          <button
            key={provider.value}
            type="button"
            onClick={() => onChange(provider.value)}
            className={cn(
              'relative flex flex-col gap-2 rounded-lg border p-4 text-left transition-all',
              isSelected
                ? 'border-brand-gold bg-brand-gold/10 ring-brand-gold/30 ring-1'
                : 'border-border hover:border-muted-foreground',
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <provider.icon
                  className={cn(
                    'h-4 w-4',
                    isSelected ? 'text-brand-gold' : 'text-muted-foreground',
                  )}
                />
                <span className="text-sm font-semibold">{provider.label}</span>
              </div>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-medium',
                  isSelected
                    ? 'bg-brand-gold/20 text-brand-gold'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {provider.badge}
              </span>
            </div>
            <span className="text-muted-foreground text-xs leading-relaxed">
              {provider.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
