import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import { generateRequestSchema } from '../lib/generation-options'

// ── Unit tests ───────────────────────────────────────────────

describe('generateRequestSchema — aiProvider unit tests', () => {
  it('accepts aiProvider: gemini', () => {
    const result = generateRequestSchema.safeParse({
      garmentPath: 'garments/test.jpg',
      presetModelId: 'f-01-moderne',
      aiProvider: 'gemini',
    })
    expect(result.success).toBe(true)
  })

  it('rejects aiProvider: idm_vton', () => {
    const result = generateRequestSchema.safeParse({
      garmentPath: 'garments/test.jpg',
      presetModelId: 'f-01-moderne',
      aiProvider: 'idm_vton',
    })
    expect(result.success).toBe(false)
  })

  it('rejects aiProvider: fal_ai', () => {
    const result = generateRequestSchema.safeParse({
      garmentPath: 'garments/test.jpg',
      presetModelId: 'f-01-moderne',
      aiProvider: 'fal_ai',
    })
    expect(result.success).toBe(false)
  })

  it('accepts absent aiProvider', () => {
    const result = generateRequestSchema.safeParse({
      garmentPath: 'garments/test.jpg',
      presetModelId: 'f-01-moderne',
    })
    expect(result.success).toBe(true)
  })
})

// ── Property-based tests ─────────────────────────────────────

describe('generateRequestSchema — property tests', () => {
  // Feature: gemini-only-studio, Property 1: Gemini-only provider enforcement
  it('Property 1: rejects any aiProvider value that is not gemini', () => {
    // Validates: Requirements 1.6
    fc.assert(
      fc.property(
        fc.string().filter((s) => s !== 'gemini'),
        (nonGeminiValue) => {
          const result = generateRequestSchema.safeParse({
            garmentPath: 'x',
            presetModelId: 'y',
            aiProvider: nonGeminiValue,
          })
          expect(result.success).toBe(false)
        }
      )
    )
  })

  // Feature: gemini-only-studio, Property 2: Absent provider defaults to Gemini
  it('Property 2: absent aiProvider parses successfully, same as aiProvider: gemini', () => {
    // Validates: Requirements 1.5
    // Both absent and explicit 'gemini' must be accepted — the route treats them identically.
    // The schema uses z.literal('gemini').optional(), so absent omits the field in output
    // while explicit 'gemini' includes it; both are valid and the route defaults to gemini.
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        (garmentPath, presetModelId) => {
          const withoutProvider = generateRequestSchema.safeParse({ garmentPath, presetModelId })
          const withGemini = generateRequestSchema.safeParse({
            garmentPath,
            presetModelId,
            aiProvider: 'gemini',
          })

          // Both must succeed — absent provider is equivalent to gemini
          expect(withoutProvider.success).toBe(true)
          expect(withGemini.success).toBe(true)

          // The non-provider fields must be identical
          if (withoutProvider.success && withGemini.success) {
            expect(withoutProvider.data.garmentPath).toBe(withGemini.data.garmentPath)
            expect(withoutProvider.data.presetModelId).toBe(withGemini.data.presetModelId)
          }
        }
      )
    )
  })
})
