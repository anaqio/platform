import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { z } from 'zod/v4'

import { createClient } from '@/lib/supabase/server'

export const maxDuration = 300

const modifyRequestSchema = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.string().min(1),
  modificationPrompt: z.string().min(1).max(500),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isKiosk = process.env.NEXT_PUBLIC_KIOSK_MODE === 'true'
  if (!isKiosk && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = modifyRequestSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { imageBase64, mimeType, modificationPrompt } = parsed.data

  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_AI_API_KEY not configured' }, { status: 500 })
  }

  const ai = new GoogleGenAI({ apiKey })

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-image-generation',
      contents: {
        parts: [{ inlineData: { data: imageBase64, mimeType } }, { text: modificationPrompt }],
      },
      config: {
        responseModalities: ['image', 'text'],
      },
    })

    const parts = response.candidates?.[0]?.content?.parts
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          return NextResponse.json({
            imageBase64: part.inlineData.data,
            mimeType: part.inlineData.mimeType ?? 'image/png',
          })
        }
      }

      // Text-only response is likely a refusal
      for (const part of parts) {
        if (part.text) {
          return NextResponse.json({ error: part.text }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ error: 'Gemini did not return an image' }, { status: 500 })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Inference failed'
    console.error('[modify] Gemini error:', errorMessage, err)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
