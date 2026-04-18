import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { uploadGarment } from '@/lib/utils/storage'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isKiosk = process.env.NEXT_PUBLIC_KIOSK_MODE === 'true'
  if (!isKiosk && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('garment')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No garment file provided' }, { status: 400 })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
  }

  try {
    const buffer = await file.arrayBuffer()
    const ownerId = user?.id ?? 'anon'
    const garmentPath = await uploadGarment(buffer, file.type, ownerId)
    return NextResponse.json({ garmentPath })
  } catch (err) {
    console.error('[upload-api] Failure:', err)
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Upload failed',
        details: process.env.NODE_ENV === 'development' ? String(err) : undefined,
      },
      { status: 500 }
    )
  }
}
