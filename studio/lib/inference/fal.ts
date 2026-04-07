import { fal } from '@fal-ai/client'

import type { InferenceRequest, InferenceResult } from './types'

/**
 * fal.ai Leffa Virtual Try-On provider.
 * Uses fal-ai/leffa/virtual-tryon — a dedicated VTON model.
 * Accepts image URLs directly (no base64 conversion needed).
 */
export async function runFalVTON(request: InferenceRequest): Promise<InferenceResult> {
  const key = process.env.FAL_KEY
  if (!key) throw new Error('FAL_KEY not configured')

  fal.config({ credentials: key })

  const start = Date.now()

  const result = await fal.subscribe('fal-ai/leffa/virtual-tryon', {
    input: {
      human_image_url: request.modelUrl,
      garment_image_url: request.garmentUrl,
      garment_type: 'upper_body' as const,
      num_inference_steps: request.denoiseSteps ?? 30,
      guidance_scale: 2.5,
      seed: request.seed ?? 42,
      output_format: 'png' as const,
    },
  })

  const elapsed = Date.now() - start

  const imageUrl = result.data?.image?.url
  if (!imageUrl) {
    throw new Error('fal.ai did not return an image')
  }

  return { outputUrl: imageUrl, inferenceMs: elapsed }
}
