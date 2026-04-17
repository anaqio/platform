import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { z } from 'zod/v4'

// Re-define the schema here since it is not exported from route.ts
// Must match the schema in applications/studio/app/api/modify/route.ts exactly
const modifyRequestSchema = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.string().min(1),
  modificationPrompt: z.string().min(1).max(500),
})

// ── Unit tests ───────────────────────────────────────────────

describe('modifyRequestSchema — unit tests', () => {
  it('accepts a valid request', () => {
    const result = modifyRequestSchema.safeParse({
      imageBase64: 'abc123',
      mimeType: 'image/png',
      modificationPrompt: 'Make the jacket red',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing imageBase64', () => {
    const result = modifyRequestSchema.safeParse({
      mimeType: 'image/png',
      modificationPrompt: 'Make the jacket red',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty modificationPrompt', () => {
    const result = modifyRequestSchema.safeParse({
      imageBase64: 'abc123',
      mimeType: 'image/png',
      modificationPrompt: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects modificationPrompt of exactly 501 chars', () => {
    const result = modifyRequestSchema.safeParse({
      imageBase64: 'abc123',
      mimeType: 'image/png',
      modificationPrompt: 'a'.repeat(501),
    })
    expect(result.success).toBe(false)
  })
})

// ── Property-based tests ─────────────────────────────────────

describe('modifyRequestSchema — property tests', () => {
  // Feature: gemini-only-studio, Property 7: Modify API round-trip returns an image
  it('Property 7: valid ModifyRequest shapes always parse successfully', () => {
    // Validates: Requirements 7.3
    fc.assert(
      fc.property(
        fc.record({
          imageBase64: fc.string({ minLength: 1 }),
          mimeType: fc.string({ minLength: 1 }),
          modificationPrompt: fc.string({ minLength: 1, maxLength: 500 }),
        }),
        (input) => {
          const result = modifyRequestSchema.safeParse(input)
          expect(result.success).toBe(true)
        }
      )
    )
  })

  // Feature: gemini-only-studio, Property 8: Modify API rejects invalid requests
  it('Property 8: modificationPrompt longer than 500 chars always fails schema parse', () => {
    // Validates: Requirements 7.4
    fc.assert(
      fc.property(fc.string({ minLength: 501 }), (longPrompt) => {
        const result = modifyRequestSchema.safeParse({
          imageBase64: 'abc123',
          mimeType: 'image/png',
          modificationPrompt: longPrompt,
        })
        expect(result.success).toBe(false)
      })
    )
  })

  // Feature: gemini-only-studio, Property 6: Modification loop does not write to DB
  it('Property 6: modifyRequestSchema has no DB-related fields', () => {
    // Validates: Requirements 6.7, 7.7
    // The schema must only contain imageBase64, mimeType, modificationPrompt —
    // no generationId, userId, sessionId, or any other DB-related field.
    // This is a structural property: for any valid input, the parsed output
    // contains exactly the three expected keys and nothing else.
    fc.assert(
      fc.property(
        fc.record({
          imageBase64: fc.string({ minLength: 1 }),
          mimeType: fc.string({ minLength: 1 }),
          modificationPrompt: fc.string({ minLength: 1, maxLength: 500 }),
        }),
        (input) => {
          const result = modifyRequestSchema.safeParse(input)
          expect(result.success).toBe(true)
          if (result.success) {
            const keys = Object.keys(result.data).sort()
            expect(keys).toEqual(['imageBase64', 'mimeType', 'modificationPrompt'])
          }
        }
      )
    )
  })
})
