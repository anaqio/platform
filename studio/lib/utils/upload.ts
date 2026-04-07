const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateGarmentFile(file: File): ValidationResult {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP.` }
  }
  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: ${MAX_SIZE_MB}MB.`,
    }
  }
  return { valid: true }
}
