import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { generateRequestSchema } from '@/lib/generation-options'
import { runInference } from '@/lib/inference'
import { createClient as createAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { uploadOutput } from '@/lib/utils/storage'

export const maxDuration = 300

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isKiosk = process.env.NEXT_PUBLIC_KIOSK_MODE === 'true'
  if (!isKiosk && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Validate request body with zod
  const parsed = generateRequestSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { garmentPath, presetModelId, sessionId, description, denoiseSteps, aiProvider } =
    parsed.data

  if (aiProvider !== undefined && aiProvider !== 'gemini') {
    return NextResponse.json({ error: 'Only gemini provider is supported' }, { status: 400 })
  }

  const { data: generation, error: insertError } = await admin
    .from('generations')
    .insert({
      user_id: user?.id ?? null,
      session_id: sessionId ?? null,
      status: 'pending' as const,
      garment_path: garmentPath,
      preset_model_id: presetModelId,
      // DB constraint allows 'hf_spaces' | 'fal_ai' | 'gemini' (migration 20260319000002)
      // Cast needed until types are regenerated with `bun run db:types`
      inference_provider: 'gemini' as 'hf_spaces' | 'fal_ai',
    })
    .select('id')
    .single()

  if (insertError || !generation) {
    console.error('[generate] Insert error:', insertError)
    return NextResponse.json(
      {
        error: 'Failed to initiate generation',
        diagnostic: insertError?.message ?? 'Insert failed',
      },
      { status: 500 }
    )
  }

  // 2. Update to processing (Realtime fires)
  await admin
    .from('generations')
    .update({ status: 'processing' as const })
    .eq('id', generation.id)

  // 3. Get signed URL for garment
  const { data: garmentSigned, error: signedError } = await admin.storage
    .from('garments')
    .createSignedUrl(garmentPath, 300)

  if (signedError || !garmentSigned?.signedUrl) {
    const msg = signedError?.message ?? 'Could not read garment file'
    await admin
      .from('generations')
      .update({
        status: 'failed' as const,
        error_message: msg,
      })
      .eq('id', generation.id)
    return NextResponse.json({ error: 'Storage access error', diagnostic: msg }, { status: 500 })
  }

  // 4. Get preset model image URL (public bucket)
  const { data: preset, error: presetError } = await admin
    .from('preset_models')
    .select('preview_path')
    .eq('id', presetModelId)
    .single()

  if (presetError || !preset?.preview_path) {
    const msg = presetError?.message ?? 'Preset model not found'
    await admin
      .from('generations')
      .update({ status: 'failed' as const, error_message: msg })
      .eq('id', generation.id)
    return NextResponse.json({ error: 'Preset not found', diagnostic: msg }, { status: 404 })
  }

  const modelUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/presets/${preset.preview_path}`

  // 4b. Verify model image is reachable (presets bucket may be empty)
  try {
    const modelCheck = await fetch(modelUrl, { method: 'HEAD' })
    if (!modelCheck.ok) {
      const msg = `Preset model image not found: ${preset.preview_path} (${modelCheck.status})`
      console.error('[generate]', msg)
      await admin
        .from('generations')
        .update({ status: 'failed' as const, error_message: msg })
        .eq('id', generation.id)
      return NextResponse.json({ error: 'Model asset missing', diagnostic: msg }, { status: 404 })
    }
  } catch (e) {
    const msg = `Failed to verify model asset: ${String(e)}`
    return NextResponse.json(
      { error: 'Asset verification failed', diagnostic: msg },
      { status: 500 }
    )
  }

  // 5. Run inference
  const start = Date.now()
  try {
    const result = await runInference({
      garmentUrl: garmentSigned.signedUrl,
      modelUrl,
      description,
      denoiseSteps,
    })
    const inferenceMs = Date.now() - start

    // 6. Upload output to Storage
    const outputPath = await uploadOutput(result.outputUrl, user?.id ?? sessionId ?? 'anon')

    // Extract base64 and mimeType from the data: URL to seed the modification loop
    const dataUrlMatch = result.outputUrl.match(/^data:([^;]+);base64,(.+)$/)
    const outputMimeType = dataUrlMatch?.[1] ?? 'image/png'
    const outputBase64 = dataUrlMatch?.[2] ?? ''

    // 7. Mark completed (Realtime fires)
    await admin
      .from('generations')
      .update({
        status: 'completed' as const,
        output_path: outputPath,
        inference_ms: inferenceMs,
      })
      .eq('id', generation.id)

    return NextResponse.json({
      generationId: generation.id,
      outputPath,
      outputBase64,
      outputMimeType,
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Inference failed'
    console.error('[generate] Inference error:', errorMessage, err)
    await admin
      .from('generations')
      .update({
        status: 'failed' as const,
        error_message: errorMessage,
        inference_ms: Date.now() - start,
      })
      .eq('id', generation.id)
    return NextResponse.json(
      {
        error: 'AI generation failed',
        diagnostic: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(err) : undefined,
      },
      { status: 500 }
    )
  }
}
