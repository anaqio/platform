import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { joinWaitlist } from '@/lib/actions/waitlist'
import { ERROR_MESSAGES } from '@/lib/constants/errors'
import { createClient } from '@/lib/supabase/server'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Capture after() callbacks so we can execute them in tests
let afterCallbacks: Array<() => void | Promise<void>> = []
vi.mock('next/server', () => ({
  after: (cb: () => void | Promise<void>) => {
    afterCallbacks.push(cb)
  },
}))

describe('joinWaitlist action', () => {
  let mockInsert: ReturnType<typeof vi.fn>
  let mockFrom: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Setup Supabase mocks
    mockInsert = vi.fn()
    mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })

    vi.mocked(createClient).mockResolvedValue({
      from: mockFrom,
    } as any)

    // Suppress console noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Reset after callbacks
    afterCallbacks = []
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should validate missing required fields', async () => {
    const formData = new FormData()
    // Missing email, full_name, role

    const result = await joinWaitlist(formData)

    expect(result.success).toBe(false)
    expect(result.message).toContain('valid email')
    expect(mockInsert).not.toHaveBeenCalled()
  })

  it('should validate short full_name', async () => {
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'A') // Too short
    formData.append('role', 'Brand')

    const result = await joinWaitlist(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Name is too short.')
  })

  it('should validate missing role', async () => {
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'John Doe')
    formData.append('role', '') // Empty role

    const result = await joinWaitlist(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Please select your role.')
  })

  it('should handle successful waitlist insertion', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'TEST@example.com')
    formData.append('full_name', ' John Doe ')
    formData.append('role', 'Brand')
    formData.append('company', ' ACME ')
    formData.append('aesthetic', 'Minimalist')

    const result = await joinWaitlist(formData)

    expect(result.success).toBe(true)
    expect(result.message).toContain("You're on the list!")

    // Verify insertion parameters
    expect(mockFrom).toHaveBeenCalledWith('waitlist')
    expect(mockInsert).toHaveBeenCalledWith({
      email: 'test@example.com',
      full_name: 'John Doe',
      role: 'Brand',
      company: 'ACME',
      preferences: { aesthetic: 'Minimalist' },
      source: 'home',
      utm_source: undefined,
      utm_medium: undefined,
      utm_campaign: undefined,
      utm_content: undefined,
      utm_term: undefined,
      referrer: undefined,
    })
  })

  it('should handle duplicate email error (code 23505)', async () => {
    mockInsert.mockResolvedValue({
      error: { code: '23505', message: 'Duplicate key' },
    })

    const formData = new FormData()
    formData.append('email', 'duplicate@example.com')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Stylist')

    const result = await joinWaitlist(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('This email is already on the waitlist!')
  })

  it('should handle generic database errors', async () => {
    mockInsert.mockResolvedValue({
      error: { code: '500', message: 'Generic error' },
    })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Stylist')

    const result = await joinWaitlist(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe(ERROR_MESSAGES.GENERIC)
    expect(console.error).toHaveBeenCalled()
  })

  it('should handle catastrophic exceptions (e.g. client failure)', async () => {
    vi.mocked(createClient).mockRejectedValue(new Error('Supabase client failed'))

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Stylist')

    const result = await joinWaitlist(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe(ERROR_MESSAGES.GENERIC)
    expect(console.error).toHaveBeenCalled()
  })

  it('includes source field in inserted row', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Brand')
    formData.append('source', 'hero')

    await joinWaitlist(formData)

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ source: 'hero' }))
  })

  it('defaults source to "home" when not provided', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Brand')

    await joinWaitlist(formData)

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ source: 'home' }))
  })

  it('lowercases email in the insert payload', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'UPPER@EXAMPLE.COM')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Brand')

    await joinWaitlist(formData)

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ email: 'upper@example.com' }))
  })

  it('forwards UTM fields in the insert payload', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Brand')
    formData.append('utm_source', 'google')
    formData.append('utm_medium', 'cpc')
    formData.append('utm_campaign', 'summer')
    formData.append('utm_content', 'banner1')
    formData.append('utm_term', 'fashion')
    formData.append('referrer', 'https://example.com')

    await joinWaitlist(formData)

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'summer',
        utm_content: 'banner1',
        utm_term: 'fashion',
        referrer: 'https://example.com',
      })
    )
  })

  it('normalizes empty or whitespace-only optional fields to null', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Brand')
    formData.append('company', '   ') // Whitespace-only
    formData.append('revenue_range', '') // Empty string

    await joinWaitlist(formData)

    // company and revenue_range are omitted from the payload when empty/whitespace
    const insertArg = mockInsert.mock.calls[0][0]
    expect(insertArg).not.toHaveProperty('company')
    expect(insertArg).not.toHaveProperty('revenue_range')
  })

  it('includes revenue_range in payload when provided', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Brand')
    formData.append('revenue_range', '10k-50k')

    await joinWaitlist(formData)

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ revenue_range: '10k-50k' }))
  })

  it('triggers Brevo welcome via after callback on success', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', mockFetch)
    process.env.BREVO_API_KEY = 'test-api-key'

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Brand')

    await joinWaitlist(formData)

    // Execute the after callback
    expect(afterCallbacks).toHaveLength(1)
    await afterCallbacks[0]()

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.brevo.com/v3/contacts',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'api-key': 'test-api-key',
        }),
        body: expect.stringContaining('test@example.com'),
      })
    )

    delete process.env.BREVO_API_KEY
    vi.unstubAllGlobals()
  })

  it('includes BREVO_LIST_ID in Brevo payload when set', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', mockFetch)
    process.env.BREVO_API_KEY = 'test-api-key'
    process.env.BREVO_LIST_ID = '42'

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Brand')

    await joinWaitlist(formData)

    // Execute the after callback
    await afterCallbacks[0]()

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.brevo.com/v3/contacts',
      expect.objectContaining({
        body: expect.stringContaining('"listIds":[42]'),
      })
    )

    delete process.env.BREVO_API_KEY
    delete process.env.BREVO_LIST_ID
    vi.unstubAllGlobals()
  })

  it('skips Brevo when BREVO_API_KEY is not set', async () => {
    mockInsert.mockResolvedValue({ error: null })

    delete process.env.BREVO_API_KEY

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Brand')

    await joinWaitlist(formData)

    // Execute the after callback
    await afterCallbacks[0]()

    // Should warn but not throw
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('BREVO_API_KEY is not set'))
  })

  it('handles Brevo fetch failure gracefully', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    vi.stubGlobal('fetch', mockFetch)
    process.env.BREVO_API_KEY = 'test-api-key'

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'Jane Doe')
    formData.append('role', 'Brand')

    await joinWaitlist(formData)

    // Execute the after callback — should not throw
    await afterCallbacks[0]()

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('[Brevo]'),
      expect.any(Error)
    )

    delete process.env.BREVO_API_KEY
    vi.unstubAllGlobals()
  })

  it('extracts first name from full_name for Brevo', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', mockFetch)
    process.env.BREVO_API_KEY = 'test-api-key'

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', 'John Doe')
    formData.append('role', 'Brand')

    await joinWaitlist(formData)

    await afterCallbacks[0]()

    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.attributes.FIRSTNAME).toBe('John')

    delete process.env.BREVO_API_KEY
    vi.unstubAllGlobals()
  })
})
