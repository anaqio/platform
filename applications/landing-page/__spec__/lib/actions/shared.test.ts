import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { utmFieldsSchema, type UtmFields } from '@/lib/actions/shared'

const TestSchema = z.object({
  email: z.string(),
  ...utmFieldsSchema,
})

describe('utmFieldsSchema', () => {
  it('accepts all UTM fields as optional strings', () => {
    const result = TestSchema.safeParse({
      email: 'test@example.com',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'summer_sale',
      utm_content: 'banner',
      utm_term: 'fashion',
      referrer: 'https://example.com',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.utm_source).toBe('google')
      expect(result.data.utm_medium).toBe('cpc')
      expect(result.data.utm_campaign).toBe('summer_sale')
      expect(result.data.utm_content).toBe('banner')
      expect(result.data.utm_term).toBe('fashion')
      expect(result.data.referrer).toBe('https://example.com')
    }
  })

  it('accepts all UTM fields as null', () => {
    const result = TestSchema.safeParse({
      email: 'test@example.com',
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      referrer: null,
    })

    expect(result.success).toBe(true)
  })

  it('accepts omitted UTM fields', () => {
    const result = TestSchema.safeParse({
      email: 'test@example.com',
    })

    expect(result.success).toBe(true)
  })

  it('rejects utm_source exceeding 100 characters', () => {
    const result = TestSchema.safeParse({
      email: 'test@example.com',
      utm_source: 'a'.repeat(101),
    })

    expect(result.success).toBe(false)
  })

  it('rejects utm_medium exceeding 100 characters', () => {
    const result = TestSchema.safeParse({
      email: 'test@example.com',
      utm_medium: 'a'.repeat(101),
    })

    expect(result.success).toBe(false)
  })

  it('rejects utm_campaign exceeding 100 characters', () => {
    const result = TestSchema.safeParse({
      email: 'test@example.com',
      utm_campaign: 'a'.repeat(101),
    })

    expect(result.success).toBe(false)
  })

  it('rejects utm_content exceeding 100 characters', () => {
    const result = TestSchema.safeParse({
      email: 'test@example.com',
      utm_content: 'a'.repeat(101),
    })

    expect(result.success).toBe(false)
  })

  it('rejects utm_term exceeding 100 characters', () => {
    const result = TestSchema.safeParse({
      email: 'test@example.com',
      utm_term: 'a'.repeat(101),
    })

    expect(result.success).toBe(false)
  })

  it('rejects referrer exceeding 500 characters', () => {
    const result = TestSchema.safeParse({
      email: 'test@example.com',
      referrer: 'a'.repeat(501),
    })

    expect(result.success).toBe(false)
  })

  it('accepts referrer at exactly 500 characters', () => {
    const result = TestSchema.safeParse({
      email: 'test@example.com',
      referrer: 'a'.repeat(500),
    })

    expect(result.success).toBe(true)
  })

  it('accepts utm_source at exactly 100 characters', () => {
    const result = TestSchema.safeParse({
      email: 'test@example.com',
      utm_source: 'a'.repeat(100),
    })

    expect(result.success).toBe(true)
  })

  it('rejects non-string UTM values', () => {
    const result = TestSchema.safeParse({
      email: 'test@example.com',
      utm_source: 123,
    })

    expect(result.success).toBe(false)
  })

  it('UtmFields type is inferred correctly', () => {
    // Compile-time check: UtmFields should contain the UTM keys
    const fields: UtmFields = {
      utm_source: 'test',
      utm_medium: null,
      utm_campaign: undefined,
      utm_content: undefined,
      utm_term: undefined,
      referrer: undefined,
    }

    expect(fields.utm_source).toBe('test')
    expect(fields.utm_medium).toBeNull()
  })
})
