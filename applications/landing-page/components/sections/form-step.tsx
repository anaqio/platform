'use client'

import { memo } from 'react'

import type { FormStepProps } from '@/lib/types/waitlist-form'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const FormStep = memo(function FormStep({
  step,
  formData,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormStepProps) {
  return (
    <div className="space-y-5">
      {/* Step title and description */}
      <div className="mb-6 space-y-2 text-center">
        <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        {step.fields.map((field) => {
          const fieldValue = formData[field.name] ?? ''
          const fieldError = errors[field.name]
          const fieldId = `${step.id}-${field.name}`

          return (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={fieldId}
                className="ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >
                {field.label}
              </label>

              {/* Text and Email inputs */}
              {(field.type === 'text' || field.type === 'email') && (
                <Input
                  id={fieldId}
                  type={field.type}
                  name={field.name}
                  value={fieldValue}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={disabled}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  onBlur={() => onBlur(field.name)}
                  className={cn(
                    'h-12 rounded-xl border-white/10 bg-background/40',
                    'placeholder:text-muted-foreground/30',
                    'px-4 transition-all focus:border-aq-blue/50',
                    fieldError && 'border-destructive/50'
                  )}
                  aria-invalid={!!fieldError}
                  aria-describedby={fieldError ? `${fieldId}-error` : undefined}
                />
              )}

              {/* Select dropdown */}
              {field.type === 'select' && (
                <select
                  id={fieldId}
                  name={field.name}
                  value={fieldValue}
                  required={field.required}
                  disabled={disabled}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  onBlur={() => onBlur(field.name)}
                  className={cn(
                    'flex h-12 w-full rounded-xl border border-white/10',
                    'bg-background/40 px-4 py-2 text-sm shadow-sm',
                    'transition-colors focus:border-aq-blue/50 focus:outline-none',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'appearance-none text-foreground',
                    fieldError && 'border-destructive/50'
                  )}
                  aria-invalid={!!fieldError}
                  aria-describedby={fieldError ? `${fieldId}-error` : undefined}
                >
                  <option value="" disabled>
                    {field.placeholder ?? `Select ${field.label}`}
                  </option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {/* Error message */}
              {fieldError && (
                <p
                  id={`${fieldId}-error`}
                  className="ml-1 text-xs font-medium text-destructive"
                  role="alert"
                >
                  {fieldError}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})
