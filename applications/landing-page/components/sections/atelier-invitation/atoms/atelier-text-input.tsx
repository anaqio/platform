'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { forwardRef } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface AtelierTextInputProps {
  type: 'email' | 'tel' | 'text'
  value: string
  placeholder?: string
  disabled?: boolean
  hasError: boolean
  error: string | null
  enterHint: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export const AtelierTextInput = forwardRef<HTMLInputElement, AtelierTextInputProps>(
  function AtelierTextInput(
    { type, value, placeholder, disabled, hasError, error, enterHint, onChange, onKeyDown },
    ref
  ) {
    return (
      <div className="flex flex-col gap-2" onKeyDown={onKeyDown}>
        <Input
          ref={ref}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'off'}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-14 rounded-xl border-border/40 bg-background/40 px-5 text-base',
            'placeholder:text-muted-foreground/30',
            'transition-all focus:border-aq-blue/50',
            value && 'border-aq-blue/30',
            hasError && 'border-destructive/50'
          )}
        />

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

        <p className="ml-1 text-xs text-muted-foreground/40">{enterHint}</p>
      </div>
    )
  }
)
