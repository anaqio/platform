'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

import type { SelectOption } from '@/lib/types/waitlist-form'

import { cn } from '@/lib/utils'

interface AtelierSelectInputProps {
  value: string
  options: SelectOption[]
  placeholder: string
  disabled?: boolean
  hasError: boolean
  error: string | null
  onChange: (value: string) => void
  ref?: React.Ref<HTMLSelectElement>
}

export function AtelierSelectInput({
  value,
  options,
  placeholder,
  disabled,
  hasError,
  error,
  onChange,
  ref,
}: AtelierSelectInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <select
          ref={ref}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-14 w-full appearance-none rounded-xl border bg-background/40 px-5 pr-10',
            'text-base text-foreground shadow-sm transition-colors',
            'focus:border-aq-blue/50 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            value ? 'border-aq-blue/30' : 'border-border/40',
            hasError && 'border-destructive/50'
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="ml-1 text-xs font-medium text-destructive"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
