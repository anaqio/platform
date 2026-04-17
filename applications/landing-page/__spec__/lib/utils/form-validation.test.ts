import { describe, expect, it } from 'vitest'

import type { FormStep } from '@/lib/types/waitlist-form'

import { sanitizeEmail, validateEmail, validateStep } from '@/lib/utils/form-validation'

describe('form-validation', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name+tag@company.co.uk')).toBe(true)
      expect(validateEmail('professional@email.com')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@example')).toBe(false)
      expect(validateEmail('test space@example.com')).toBe(false)
      expect(validateEmail('not-an-email')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('sanitizeEmail', () => {
    it('should convert email to lowercase', () => {
      expect(sanitizeEmail('Test@Example.com')).toBe('test@example.com')
      expect(sanitizeEmail('USER@COMPANY.CO.UK')).toBe('user@company.co.uk')
    })

    it('should trim whitespace from start and end', () => {
      expect(sanitizeEmail('  test@example.com  ')).toBe('test@example.com')
      expect(sanitizeEmail('\ttest@example.com\n')).toBe('test@example.com')
    })

    it('should handle both lowercase conversion and trimming simultaneously', () => {
      expect(sanitizeEmail('  Test@Example.com  ')).toBe('test@example.com')
    })
  })

  describe('validateStep', () => {
    const mockStep: FormStep = {
      id: 1,
      title: 'Identity',
      description: "Let's start",
      fields: [
        { name: 'fullName', type: 'text', label: 'Full Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'company', type: 'text', label: 'Company', required: false },
      ],
    }

    it('should return valid for correct required fields', () => {
      const formData = {
        fullName: 'John Doe',
        email: 'john@example.com',
      }
      const result = validateStep(mockStep, formData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should return invalid if required fields are missing', () => {
      const formData = {
        email: 'john@example.com',
      }
      const result = validateStep(mockStep, formData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveProperty('fullName', 'Full Name is required')
    })

    it('should return invalid if required fields are empty or whitespace', () => {
      const formData = {
        fullName: '   ',
        email: 'john@example.com',
      }
      const result = validateStep(mockStep, formData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveProperty('fullName', 'Full Name is required')
    })

    it('should return invalid for incorrect email format', () => {
      const formData = {
        fullName: 'John Doe',
        email: 'not-an-email',
      }
      const result = validateStep(mockStep, formData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveProperty('email', 'Please enter a valid email address')
    })

    it('should return invalid if text field is too short', () => {
      const formData = {
        fullName: 'J',
        email: 'john@example.com',
      }
      const result = validateStep(mockStep, formData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveProperty('fullName', 'Full Name is too short')
    })

    it('should allow valid optional fields', () => {
      const formData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        company: 'ACME Corp',
      }
      const result = validateStep(mockStep, formData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should skip validation for empty optional fields', () => {
      const formData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        company: '',
      }
      const result = validateStep(mockStep, formData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should validate non-empty optional fields according to their type', () => {
      const formData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        company: 'A', // Too short for type 'text'
      }
      const result = validateStep(mockStep, formData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveProperty('company', 'Company is too short')
    })

    it('does not mutate the input formData object (purity)', () => {
      const formData = Object.freeze({
        fullName: 'John Doe',
        email: 'john@example.com',
      })
      expect(() => validateStep(mockStep, formData as Record<string, string>)).not.toThrow()
    })
  })
})
