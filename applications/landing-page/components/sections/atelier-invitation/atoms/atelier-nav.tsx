'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Button } from '@anaqio/ui'

interface AtelierNavProps {
  isFirstStep: boolean
  isLastStep: boolean
  isSelectStep: boolean
  isPending: boolean
  prevAriaLabel: string
  continueLabel: string
  submitLabel: string
  sendingLabel: string
  onBack: () => void
  onContinue: () => void
}

export function AtelierNav({
  isFirstStep,
  isLastStep,
  isSelectStep,
  isPending,
  prevAriaLabel,
  continueLabel,
  submitLabel,
  sendingLabel,
  onBack,
  onContinue,
}: AtelierNavProps) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onBack}
        disabled={isFirstStep || isPending}
        className="h-12 w-12 rounded-xl text-muted-foreground disabled:opacity-0"
        aria-label={prevAriaLabel}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {!isSelectStep && (
        <Button
          type="button"
          variant="brand"
          onClick={onContinue}
          disabled={isPending}
          className="h-12 flex-1 rounded-xl text-base font-semibold shadow-lg shadow-aq-blue/20 sm:flex-none sm:px-10"
        >
          {isPending ? (
            sendingLabel
          ) : isLastStep ? (
            submitLabel
          ) : (
            <span className="flex items-center gap-2">
              {continueLabel}
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      )}
    </div>
  )
}
