import type { InferenceRequest, InferenceResult } from './types'

export async function runVTON(request: InferenceRequest): Promise<InferenceResult> {
  const { Client, handle_file } = await import('@gradio/client')
  const client = await Client.connect(process.env.HF_SPACE_URL!, {
    hf_token: process.env.HF_API_TOKEN,
  } as Record<string, unknown>)

  const start = Date.now()

  // IDM-VTON expects:
  //   dict      = person/model image (background layer)
  //   garm_img  = garment image
  const modelFile = handle_file(request.modelUrl)
  const garmentFile = handle_file(request.garmentUrl)

  const result = await client.predict('/tryon', [
    { background: modelFile, layers: [], composite: null }, // dict (person image)
    garmentFile, // garm_img
    request.description ?? 'fashion garment', // garment_des
    true, // is_checked
    false, // is_checked_crop
    request.denoiseSteps ?? 30, // denoise_steps
    request.seed ?? 42, // seed
  ])
  const elapsed = Date.now() - start

  const data = result.data as { url: string }[]
  if (!data?.[0]?.url) {
    throw new Error('No image returned from model')
  }

  return {
    outputUrl: data[0].url,
    inferenceMs: elapsed,
  }
}
