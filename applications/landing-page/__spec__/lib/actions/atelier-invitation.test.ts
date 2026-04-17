import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { requestAtelierInvitation } from '@/lib/actions/atelier-invitation'
import { ERROR_MESSAGES } from '@/lib/constants/errors'
import { createClient } from '@/lib/supabase/server'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('requestAtelierInvitation action', () => {
  let mockInsert: ReturnType<typeof vi.fn>
  let mockFrom: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockInsert = vi.fn()
    mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })

    vi.mocked(createClient).mockResolvedValue({
      from: mockFrom,
    } as any)

    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('validates missing required email', async () => {
    const formData = new FormData()
    formData.append('entity_name', 'Test Entity')
    formData.append('role', 'Designer')

    const result = await requestAtelierInvitation(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Please provide an email address.')
    expect(mockInsert).not.toHaveBeenCalled()
  })

  it('validates empty email', async () => {
    const formData = new FormData()
    formData.append('email', '')
    formData.append('entity_name', 'Test Entity')
    formData.append('role', 'Designer')

    const result = await requestAtelierInvitation(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Please provide an email address.')
  })

  it('validates invalid email format', async () => {
    const formData = new FormData()
    formData.append('email', 'not-an-email')
    formData.append('entity_name', 'Test Entity')
    formData.append('role', 'Designer')

    const result = await requestAtelierInvitation(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe(ERROR_MESSAGES.VALID_EMAIL)
  })

  it('validates short entity_name', async () => {
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('entity_name', 'A')
    formData.append('role', 'Designer')

    const result = await requestAtelierInvitation(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Name is too short.')
  })

  it('validates long entity_name', async () => {
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('entity_name', 'A'.repeat(101))
    formData.append('role', 'Designer')

    const result = await requestAtelierInvitation(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Name is too long.')
  })

  it('validates missing role', async () => {
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('entity_name', 'Test Entity')
    formData.append('role', '')

    const result = await requestAtelierInvitation(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Please select your role.')
  })

  it('handles successful invitation request', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'TEST@example.com')
    formData.append('entity_name', ' Test Entity ')
    formData.append('role', 'Designer')
    formData.append('whatsapp', '+212600000000')
    formData.append('revenue_range', '1M-5M')
    formData.append('referral_source', 'google')
    formData.append('source', 'early-access')

    const result = await requestAtelierInvitation(formData)

    expect(result.success).toBe(true)
    expect(result.message).toContain('received')

    expect(mockFrom).toHaveBeenCalledWith('atelier_invitations')
    expect(mockInsert).toHaveBeenCalledWith({
      email: 'test@example.com',
      entity_name: 'Test Entity',
      role: 'Designer',
      whatsapp: '+212600000000',
      revenue_range: '1M-5M',
      referral_source: 'google',
      source: 'early-access',
    })
  })

  it('defaults source to early-access', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('entity_name', 'Test Entity')
    formData.append('role', 'Designer')

    await requestAtelierInvitation(formData)

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ source: 'early-access' }))
  })

  it('lowercases email in the insert payload', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'UPPER@EXAMPLE.COM')
    formData.append('entity_name', 'Test Entity')
    formData.append('role', 'Designer')

    await requestAtelierInvitation(formData)

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ email: 'upper@example.com' }))
  })

  it('normalizes null optional fields', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('entity_name', 'Test Entity')
    formData.append('role', 'Designer')

    await requestAtelierInvitation(formData)

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        whatsapp: null,
        revenue_range: null,
        referral_source: null,
      })
    )
  })

  it('handles duplicate email error (code 23505)', async () => {
    mockInsert.mockResolvedValue({
      error: { code: '23505', message: 'Duplicate key' },
    })

    const formData = new FormData()
    formData.append('email', 'duplicate@example.com')
    formData.append('entity_name', 'Test Entity')
    formData.append('role', 'Designer')

    const result = await requestAtelierInvitation(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('This email has already requested an invitation.')
  })

  it('handles generic database errors', async () => {
    mockInsert.mockResolvedValue({
      error: { code: '500', message: 'Server error' },
    })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('entity_name', 'Test Entity')
    formData.append('role', 'Designer')

    const result = await requestAtelierInvitation(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe(ERROR_MESSAGES.GENERIC)
    expect(console.error).toHaveBeenCalled()
  })

  it('handles catastrophic exceptions (e.g. client failure)', async () => {
    vi.mocked(createClient).mockRejectedValue(new Error('Supabase client failed'))

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('entity_name', 'Test Entity')
    formData.append('role', 'Designer')

    const result = await requestAtelierInvitation(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe(ERROR_MESSAGES.GENERIC)
    expect(console.error).toHaveBeenCalled()
  })

  it('trims whitespace from entity_name in insert payload', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('entity_name', '  My Brand  ')
    formData.append('role', 'Designer')

    await requestAtelierInvitation(formData)

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ entity_name: 'My Brand' }))
  })

  it('trims whatsapp value in insert payload', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('entity_name', 'Test Entity')
    formData.append('role', 'Designer')
    formData.append('whatsapp', '  +212600000000  ')

    await requestAtelierInvitation(formData)

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ whatsapp: '+212600000000' }))
  })
})
