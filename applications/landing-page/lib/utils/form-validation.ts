import type { FormStep, ValidationResult } from '@/lib/types/waitlist-form'

/**
 * Validates an email address using standard email regex
 * @param email - Email address to validate
 * @returns true if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitizes an email address by converting to lowercase and trimming whitespace
 * @param email - Email address to sanitize
 * @returns Sanitized email address
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

/**
 * Validates all fields in a form step
 * @param step - Form step configuration
 * @param formData - Current form data
 * @returns ValidationResult with isValid flag and errors map
 */
export function validateStep(step: FormStep, formData: Record<string, string>): ValidationResult {
  const errors: Record<string, string> = {}
  let isValid = true

  for (const field of step.fields) {
    const value = formData[field.name]

    // Check required fields
    if (field.required && (!value || value.trim() === '')) {
      errors[field.name] = `${field.label} is required`
      isValid = false
      continue
    }

    // Skip validation for empty optional fields
    if (!value || value.trim() === '') {
      continue
    }

    // Type-specific validation
    if (field.type === 'email') {
      if (!validateEmail(value)) {
        errors[field.name] = 'Please enter a valid email address'
        isValid = false
      }
    }

    if (field.type === 'text') {
      if (value.length < 2) {
        errors[field.name] = `${field.label} is too short`
        isValid = false
      }
    }
  }

  return { isValid, errors }
}
