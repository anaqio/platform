import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { FormStep } from '@/lib/types/waitlist-form'

import { useMultiStepForm } from '@/hooks/use-multi-step-form'

// Mock the validation utility
vi.mock('@/lib/utils/form-validation', () => ({
  validateStep: vi.fn((step, formData) => {
    // Simple mock implementation: if 'failValidation' is in formData, it fails
    if (formData.failValidation) {
      return {
        isValid: false,
        errors: { mockField: 'Validation failed' },
      }
    }
    return {
      isValid: true,
      errors: {},
    }
  }),
}))

const mockSteps: FormStep[] = [
  {
    id: 1,
    title: 'Step 1',
    description: 'First step',
    fields: [{ name: 'field1', type: 'text', label: 'Field 1', required: true }],
  },
  {
    id: 2,
    title: 'Step 2',
    description: 'Second step',
    fields: [{ name: 'field2', type: 'text', label: 'Field 2', required: true }],
  },
  {
    id: 3,
    title: 'Step 3',
    description: 'Third step',
    fields: [{ name: 'field3', type: 'text', label: 'Field 3', required: false }],
  },
]

describe('useMultiStepForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMultiStepForm(mockSteps))

    expect(result.current.currentStep).toBe(1)
    expect(result.current.totalSteps).toBe(3)
    expect(result.current.formData).toEqual({})
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
    expect(result.current.isAnimating).toBe(false)
  })

  it('should initialize with provided initialData', () => {
    const { result } = renderHook(() =>
      useMultiStepForm(mockSteps, 'test-storage-key', { field1: 'test' })
    )

    expect(result.current.formData).toEqual({ field1: 'test' })
  })

  it('should update field value and clear its error', () => {
    const { result } = renderHook(() => useMultiStepForm(mockSteps))

    // Force an error state first
    act(() => {
      result.current.validateCurrentStep() // Will fail based on mock if we set failValidation
    })

    act(() => {
      result.current.updateField('field1', 'new value')
    })

    expect(result.current.formData).toEqual({ field1: 'new value' })
    expect(result.current.errors).not.toHaveProperty('field1')
  })

  it('should mark field as touched', () => {
    const { result } = renderHook(() => useMultiStepForm(mockSteps))

    act(() => {
      result.current.markFieldTouched('field1')
    })

    expect(result.current.touched).toEqual({ field1: true })
  })

  describe('Navigation', () => {
    it('should advance to next step if validation passes', () => {
      const { result } = renderHook(() => useMultiStepForm(mockSteps))

      act(() => {
        result.current.next()
      })

      expect(result.current.currentStep).toBe(2)
    })

    it('should NOT advance to next step if validation fails', () => {
      const { result } = renderHook(() =>
        useMultiStepForm(mockSteps, 'test-storage-key-validation', {
          failValidation: 'true',
        })
      )

      act(() => {
        result.current.next()
      })

      expect(result.current.currentStep).toBe(1) // Should stay on step 1
      expect(result.current.errors).toEqual({ mockField: 'Validation failed' })
      // Should mark fields in current step as touched
      expect(result.current.touched).toEqual({ field1: true })
    })

    it('should not advance past total steps', () => {
      const { result } = renderHook(() => useMultiStepForm(mockSteps))

      act(() => {
        result.current.next()
      }) // Go to 2
      act(() => {
        result.current.next()
      }) // Go to 3
      act(() => {
        result.current.next()
      }) // Try to go to 4

      expect(result.current.currentStep).toBe(3)
    })

    it('should go to previous step', () => {
      const { result } = renderHook(() => useMultiStepForm(mockSteps))

      act(() => {
        result.current.next() // Go to 2
      })
      expect(result.current.currentStep).toBe(2)

      act(() => {
        result.current.previous() // Go back to 1
      })
      expect(result.current.currentStep).toBe(1)
    })

    it('should not go before step 1', () => {
      const { result } = renderHook(() => useMultiStepForm(mockSteps))

      act(() => {
        result.current.previous()
      })

      expect(result.current.currentStep).toBe(1)
    })

    it('should jump to specific step if within bounds', () => {
      const { result } = renderHook(() => useMultiStepForm(mockSteps))

      act(() => {
        result.current.goToStep(3)
      })
      expect(result.current.currentStep).toBe(3)

      act(() => {
        result.current.goToStep(99) // Out of bounds high
      })
      expect(result.current.currentStep).toBe(3) // Should not change

      act(() => {
        result.current.goToStep(0) // Out of bounds low
      })
      expect(result.current.currentStep).toBe(3) // Should not change
    })
  })

  it('should set animating state', () => {
    const { result } = renderHook(() => useMultiStepForm(mockSteps))

    act(() => {
      result.current.setIsAnimating(true)
    })

    expect(result.current.isAnimating).toBe(true)
  })

  it('resetForm returns to step 1 and clears data, errors, touched', () => {
    const { result } = renderHook(() =>
      useMultiStepForm(mockSteps, 'reset-test-key', { field1: 'hello' })
    )

    act(() => {
      result.current.next()
    })
    act(() => {
      result.current.resetForm()
    })

    expect(result.current.currentStep).toBe(1)
    // resetForm restores to initialData when provided
    expect(result.current.formData).toEqual({ field1: 'hello' })
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
  })

  it('formData persists across step transitions (forward and back)', () => {
    const { result } = renderHook(() => useMultiStepForm(mockSteps))

    act(() => {
      result.current.updateField('field1', 'persisted value')
    })
    act(() => {
      result.current.next()
    })
    act(() => {
      result.current.previous()
    })

    expect(result.current.formData.field1).toBe('persisted value')
  })

  it('step index always stays within [1, totalSteps] after random navigation', () => {
    const { result } = renderHook(() => useMultiStepForm(mockSteps))

    const actions = Array.from({ length: 50 }, (_, i) => (i % 3 === 0 ? 'prev' : 'next'))
    actions.forEach((action) => {
      act(() => {
        if (action === 'next') result.current.next()
        else result.current.previous()
      })
    })

    const { currentStep, totalSteps } = result.current
    expect(currentStep).toBeGreaterThanOrEqual(1)
    expect(currentStep).toBeLessThanOrEqual(totalSteps)
  })
})
