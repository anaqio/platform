import { createClient } from '@/lib/supabase/admin'

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
  const admin = createClient()
  const ext = contentType.split('/')[1] ?? 'webp'
  const path = `${ownerId}/${crypto.randomUUID()}.${ext}`

  const { error } = await admin.storage
    .from('garments')
    .upload(path, fileBuffer, { contentType, upsert: false })
  if (error) throw new Error(`[storage.upload] ${error.message}`)
  return path
}

export async function uploadOutput(outputUrl: string, ownerId: string): Promise<string> {
  let buffer: ArrayBuffer
  let contentType = 'image/webp'

  if (outputUrl.startsWith('data:')) {
    // Handle base64 data URLs (e.g. from Gemini)
    const match = outputUrl.match(/^data:([^;]+);base64,(.+)$/)
    if (!match) throw new Error('Invalid data URL format')
    contentType = match[1]
    buffer = Buffer.from(match[2], 'base64').buffer as ArrayBuffer
  } else {
    // Handle remote URLs (e.g. from HF Spaces)
    const response = await fetch(outputUrl)
    if (!response.ok) throw new Error(`Failed to fetch output image: ${response.status}`)
    buffer = await response.arrayBuffer()
  }

  const ext = contentType.split('/')[1] ?? 'webp'
  const admin = createClient()
  const path = `${ownerId}/${crypto.randomUUID()}.${ext}`

  const { error } = await admin.storage
    .from('outputs')
    .upload(path, buffer, { contentType, upsert: false })
  if (error) throw new Error(`[storage.uploadOutput] ${error.message}`)
  return path
}
