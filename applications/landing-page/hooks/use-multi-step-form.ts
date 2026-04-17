import { useState, useCallback, useEffect } from 'react'

import { useLocalStorage } from './use-local-storage'

import type { FormStep } from '@/lib/types/waitlist-form'

import { validateStep } from '@/lib/utils/form-validation'

export interface MultiStepFormReturn {
  currentStep: number
  totalSteps: number
  formData: Record<string, string>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isAnimating: boolean
  next: () => void
  previous: () => void
  goToStep: (step: number) => void
  updateField: (name: string, value: string) => void
  markFieldTouched: (name: string) => void
  validateCurrentStep: () => boolean
  setIsAnimating: (animating: boolean) => void
  resetForm: () => void
}

/**
 * Custom hook for managing multi-step form state and navigation.
 * Now persists form data to localStorage to prevent loss on refresh.
 *
 * @param steps - Array of form step configurations
 * @param storageKey - Key for localStorage persistence
 * @param initialData - Optional initial form data
 * @returns Form state and control functions
 */
export function useMultiStepForm(
  steps: FormStep[],
  storageKey = 'anaqio-form-data',
  initialData?: Record<string, string>
): MultiStepFormReturn {
  const [persistedData, setPersistedData] = useLocalStorage<Record<string, string>>(
    storageKey,
    initialData ?? {}
  )

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Record<string, string>>(persistedData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isAnimating, setIsAnimating] = useState(false)

  // Sync state to localStorage
  useEffect(() => {
    setPersistedData(formData)
  }, [formData, setPersistedData])

  const totalSteps = steps.length

  /**
   * Updates a form field value and clears its error
   */
  const updateField = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user types
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }, [])

  /**
   * Marks a field as touched (user has interacted with it)
   */
  const markFieldTouched = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  /**
   * Validates the current step
   * @returns true if validation passes, false otherwise
   */
  const validateCurrentStep = useCallback((): boolean => {
    const currentStepConfig = steps[currentStep - 1]
    const validationResult = validateStep(currentStepConfig, formData)

    if (!validationResult.isValid) {
      setErrors(validationResult.errors)
      // Mark all fields in current step as touched to show errors
      const stepFieldNames = currentStepConfig.fields.map((f) => f.name)
      setTouched((prev) => {
        const newTouched = { ...prev }
        stepFieldNames.forEach((name) => {
          newTouched[name] = true
        })
        return newTouched
      })
      return false
    }

    setErrors({})
    return true
  }, [currentStep, formData, steps])

  /**
   * Advances to the next step if validation passes
   */
  const next = useCallback(() => {
    if (currentStep < totalSteps && validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep, totalSteps, validateCurrentStep])

  /**
   * Goes back to the previous step
   */
  const previous = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  /**
   * Jumps to a specific step (within valid bounds)
   */
  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step)
      }
    },
    [totalSteps]
  )

  /**
   * Resets form data and clears localStorage
   */
  const resetForm = useCallback(() => {
    setFormData(initialData ?? {})
    setPersistedData(initialData ?? {})
    setErrors({})
    setTouched({})
    setCurrentStep(1)
  }, [initialData, setPersistedData])

  return {
    currentStep,
    totalSteps,
    formData,
    errors,
    touched,
    isAnimating,
    next,
    previous,
    goToStep,
    updateField,
    markFieldTouched,
    validateCurrentStep,
    setIsAnimating,
    resetForm,
  }
}
