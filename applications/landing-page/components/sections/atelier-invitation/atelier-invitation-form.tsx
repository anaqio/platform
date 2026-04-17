'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRef, useState, useTransition, useCallback, useEffect, useMemo } from 'react'

import { AtelierNav } from './atoms/atelier-nav'
import { AtelierProgressBar } from './atoms/atelier-progress-bar'
import { AtelierQuestion } from './atoms/atelier-question'
import { AtelierSelectInput } from './atoms/atelier-select-input'
import { AtelierStepCounter } from './atoms/atelier-step-counter'
import { AtelierSuccess } from './atoms/atelier-success'
import { AtelierTextInput } from './atoms/atelier-text-input'

import { requestAtelierInvitation } from '@/lib/actions/atelier-invitation'
import { ICONS, SLIDE_TRANSITION, SLIDE_VARIANTS } from '@/lib/data/atelier-form-data'
import { ATELIER_STEP_CONFIGS } from '@/lib/data/atelier-invitation'
import { DataManager } from '@/lib/utils/data-manager'
import { sanitizeEmail, validateEmail } from '@/lib/utils/form-validation'

interface RawStepTranslation {
  question: string
  hint?: string
  placeholder?: string
  errors?: Record<string, string>
  options?: Record<string, string>
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AtelierInvitationForm() {
  const t = useTranslations('atelierInvitation')

  // Build per-step translated content from configs + raw translation data
  const stepContent = useMemo(
    () =>
      ATELIER_STEP_CONFIGS.map((cfg) => {
        const raw = DataManager<RawStepTranslation>(t, `steps.${cfg.id}`)
        return {
          question: raw.question,
          hint: raw.hint ?? '',
          placeholder: raw.placeholder ?? '',
          errorRequired: raw.errors?.required ?? '',
          errorInvalid: raw.errors?.invalid,
          errorTooShort: raw.errors?.tooShort,
          options: cfg.optionValues
            ? cfg.optionValues.map((v) => ({
                value: v,
                label: raw.options?.[v] ?? v,
              }))
            : [],
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // t is stable; memoize once on mount
  )

  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [values, setValues] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const inputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)

  const config = ATELIER_STEP_CONFIGS[stepIndex]
  const content = stepContent[stepIndex]
  const totalSteps = ATELIER_STEP_CONFIGS.length
  const progress = (stepIndex / totalSteps) * 100
  const isLastStep = stepIndex === totalSteps - 1
  const currentValue = values[config.id] ?? ''

  // Auto-focus when step changes
  useEffect(() => {
    // Prevent auto-focus on initial mount to avoid stealing scroll from the top of the page
    if (stepIndex === 0) return

    const timer = setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
      selectRef.current?.focus({ preventScroll: true })
    }, 380)
    return () => clearTimeout(timer)
  }, [stepIndex])

  const validateCurrent = useCallback((): string | null => {
    if (config.required && !currentValue.trim()) {
      return content.errorRequired || t('ui.fieldRequired')
    }
    if (config.type === 'email' && currentValue && !validateEmail(currentValue)) {
      return content.errorInvalid ?? t('ui.fieldRequired')
    }
    if (config.type === 'text' && currentValue && currentValue.trim().length < 2) {
      return content.errorTooShort ?? t('ui.fieldRequired')
    }
    return null
  }, [config, content, currentValue, t])

  const advance = useCallback(() => {
    const err = validateCurrent()
    if (err) {
      setError(err)
      return
    }
    setError(null)
    if (stepIndex < totalSteps - 1) {
      setDirection(1)
      setStepIndex((i) => i + 1)
    }
  }, [validateCurrent, stepIndex, totalSteps])

  const goBack = useCallback(() => {
    if (stepIndex > 0) {
      setError(null)
      setDirection(-1)
      setStepIndex((i) => i - 1)
    }
  }, [stepIndex])

  const handleChange = useCallback(
    (value: string) => {
      setValues((prev) => ({ ...prev, [config.id]: value }))
      setError(null)
    },
    [config.id]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && config.type !== 'select') {
      e.preventDefault()
      if (isLastStep) {
        handleSubmit()
      } else {
        advance()
      }
    }
  }

  const handleSubmit = useCallback(() => {
    const err = validateCurrent()
    if (err) {
      setError(err)
      return
    }
    setError(null)

    const formData = new FormData()
    formData.append('source', 'early-access')
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, key === 'email' ? sanitizeEmail(value) : value)
    })

    startTransition(async () => {
      const result = await requestAtelierInvitation(formData)
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.message)
      }
    })
  }, [validateCurrent, values, startTransition])

  const handleSelectChange = useCallback(
    (value: string) => {
      handleChange(value)
      if (!value) return
      setError(null)
      setTimeout(() => {
        if (isLastStep) {
          handleSubmit()
        } else {
          setDirection(1)
          setStepIndex((i) => i + 1)
        }
      }, 320)
    },
    [handleChange, handleSubmit, isLastStep]
  )

  if (submitted) {
    return <AtelierSuccess title={t('success.title')} description={t('success.desc')} />
  }

  return (
    <article className="flex w-full flex-col gap-0">
      <AtelierProgressBar progress={progress} />

      <AtelierStepCounter
        current={stepIndex + 1}
        total={totalSteps}
        isOptional={!config.required}
        skipLabel={t('ui.skip')}
        onSkip={isLastStep ? handleSubmit : advance}
      />

      {/* Slide area */}
      <div className="relative mt-8 min-h-[260px] overflow-hidden sm:min-h-[240px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={config.id}
            custom={direction}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SLIDE_TRANSITION}
            className="flex flex-col gap-6"
          >
            <AtelierQuestion
              icon={ICONS[config.iconName]}
              hint={content.hint || undefined}
              question={content.question}
            />

            {config.type === 'select' ? (
              <AtelierSelectInput
                ref={selectRef}
                value={currentValue}
                options={content.options}
                placeholder={t('ui.selectPlaceholder')}
                disabled={isPending}
                hasError={!!error}
                error={error}
                onChange={handleSelectChange}
              />
            ) : (
              <AtelierTextInput
                ref={inputRef}
                type={config.type}
                value={currentValue}
                placeholder={content.placeholder || undefined}
                disabled={isPending}
                hasError={!!error}
                error={error}
                enterHint={t('ui.enterHint')}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AtelierNav
        isFirstStep={stepIndex === 0}
        isLastStep={isLastStep}
        isSelectStep={config.type === 'select'}
        isPending={isPending}
        prevAriaLabel={t('ui.prevAriaLabel')}
        continueLabel={t('ui.continue')}
        submitLabel={t('ui.requestInvitation')}
        sendingLabel={t('ui.sending')}
        onBack={goBack}
        onContinue={isLastStep ? handleSubmit : advance}
      />
    </article>
  )
}
