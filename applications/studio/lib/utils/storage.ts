import { createClient } from '@/lib/supabase/admin'

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const MANAGED_BUCKETS = {
  garments: {
    public: false,
    allowedMimeTypes: IMAGE_MIME_TYPES,
    fileSizeLimit: '10MB',
  },
  outputs: {
    public: false,
    allowedMimeTypes: IMAGE_MIME_TYPES,
    fileSizeLimit: '10MB',
  },
} as const

type ManagedBucket = keyof typeof MANAGED_BUCKETS

function isMissingBucketError(message: string) {
  return /not found|does not exist/i.test(message)
}

function isDuplicateBucketError(message: string) {
  return /already exists|duplicate/i.test(message)
}

async function ensureBucket(bucket: ManagedBucket) {
  const admin = createClient()
  const { error: bucketError } = await admin.storage.getBucket(bucket)

  if (!bucketError) {
    return admin
  }

  if (!isMissingBucketError(bucketError.message)) {
    throw new Error(`[storage.bucket] ${bucketError.message}`)
  }

  const { error: createError } = await admin.storage.createBucket(bucket, MANAGED_BUCKETS[bucket])
  if (createError && !isDuplicateBucketError(createError.message)) {
    throw new Error(`[storage.bucket] ${createError.message}`)
  }

  return admin
}

export async function getSignedUrl(bucket: string, path: string, expiresIn = 300) {
  const admin = createClient()
  const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, expiresIn)
  if (error) throw new Error(`[storage.signedUrl] ${error.message}`)
  return data.signedUrl
}

export async function uploadGarment(
  fileBuffer: ArrayBuffer,
  contentType: string,
  ownerId: string
): Promise<string> {
  const admin = await ensureBucket('garments')
  const ext = contentType.split('/')[1] ?? 'webp'
  const path = `${ownerId}/${crypto.randomUUID()}.${ext}`

  const { error } = await admin.storage
    .from('garments')
    .upload(path, fileBuffer, { contentType, upsert: false })
  if (error) throw new Error(`[storage.upload] ${error.message}`)
  return path
}

export async function uploadOutput(outputUrl: string, ownerId: string): Promise<string> {
  let fileBody: Uint8Array | ArrayBuffer
  let contentType = 'image/webp'

  if (outputUrl.startsWith('data:')) {
    // Handle base64 data URLs (e.g. from Gemini)
    const match = outputUrl.match(/^data:([^;]+);base64,(.+)$/)
    if (!match) throw new Error('Invalid data URL format')
    contentType = match[1]
    fileBody = Buffer.from(match[2], 'base64')
  } else {
    // Handle remote URLs (e.g. from HF Spaces)
    const response = await fetch(outputUrl)
    if (!response.ok) throw new Error(`Failed to fetch output image: ${response.status}`)
    fileBody = await response.arrayBuffer()
  }

  const ext = contentType.split('/')[1] ?? 'webp'
  const admin = await ensureBucket('outputs')
  const path = `${ownerId}/${crypto.randomUUID()}.${ext}`

  const { error } = await admin.storage
    .from('outputs')
    .upload(path, fileBody, { contentType, upsert: false })
  if (error) throw new Error(`[storage.uploadOutput] ${error.message}`)
  return path
}
