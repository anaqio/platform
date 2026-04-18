import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { uploadGarment, uploadOutput } from '../lib/utils/storage'

const mockGetBucket = vi.fn()
const mockCreateBucket = vi.fn()
const mockUpload = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/lib/supabase/admin', () => ({
  createClient: vi.fn(() => ({
    storage: {
      getBucket: mockGetBucket,
      createBucket: mockCreateBucket,
      from: mockFrom,
    },
  })),
}))

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'fixed-uuid') })
  mockFrom.mockReturnValue({ upload: mockUpload })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('storage uploads', () => {
  it('creates the garments bucket on demand before uploading', async () => {
    mockGetBucket.mockResolvedValueOnce({
      data: null,
      error: { message: 'Bucket not found' },
    })
    mockCreateBucket.mockResolvedValueOnce({ data: { id: 'garments' }, error: null })
    mockUpload.mockResolvedValueOnce({ data: { path: 'owner-1/fixed-uuid.png' }, error: null })

    const path = await uploadGarment(new ArrayBuffer(8), 'image/png', 'owner-1')

    expect(path).toBe('owner-1/fixed-uuid.png')
    expect(mockGetBucket).toHaveBeenCalledWith('garments')
    expect(mockCreateBucket).toHaveBeenCalledWith(
      'garments',
      expect.objectContaining({
        public: false,
        fileSizeLimit: '10MB',
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      })
    )
    expect(mockFrom).toHaveBeenCalledWith('garments')
    expect(mockUpload).toHaveBeenCalledWith(
      'owner-1/fixed-uuid.png',
      expect.any(ArrayBuffer),
      expect.objectContaining({
        contentType: 'image/png',
        upsert: false,
      })
    )
  })

  it('creates the outputs bucket on demand before uploading generated data URLs', async () => {
    mockGetBucket.mockResolvedValueOnce({
      data: null,
      error: { message: 'Bucket does not exist' },
    })
    mockCreateBucket.mockResolvedValueOnce({ data: { id: 'outputs' }, error: null })
    mockUpload.mockResolvedValueOnce({ data: { path: 'owner-2/fixed-uuid.png' }, error: null })

    const path = await uploadOutput('data:image/png;base64,aGVsbG8=', 'owner-2')

    expect(path).toBe('owner-2/fixed-uuid.png')
    expect(mockGetBucket).toHaveBeenCalledWith('outputs')
    expect(mockCreateBucket).toHaveBeenCalledWith(
      'outputs',
      expect.objectContaining({
        public: false,
        fileSizeLimit: '10MB',
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      })
    )
    expect(mockFrom).toHaveBeenCalledWith('outputs')
    expect(mockUpload).toHaveBeenCalledWith(
      'owner-2/fixed-uuid.png',
      expect.anything(),
      expect.objectContaining({
        contentType: 'image/png',
        upsert: false,
      })
    )
    expect(Buffer.from(mockUpload.mock.calls[0][1] as Uint8Array).toString('utf8')).toBe('hello')
  })
})
