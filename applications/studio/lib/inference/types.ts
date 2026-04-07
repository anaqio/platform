export interface InferenceRequest {
  garmentUrl: string
  modelUrl: string
  description?: string
  seed?: number
  denoiseSteps?: number
}

export interface InferenceResult {
  outputUrl: string
  inferenceMs?: number
}
