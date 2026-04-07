import type { InferenceRequest, InferenceResult } from './types'

export type { InferenceRequest, InferenceResult }

export type InferenceProvider = 'hf_spaces' | 'gemini' | 'fal_ai'

export async function runInference(
  request: InferenceRequest,
  provider?: InferenceProvider,
): Promise<InferenceResult> {
  const resolved = provider ?? (process.env.INFERENCE_PROVIDER as InferenceProvider) ?? 'hf_spaces'

  switch (resolved) {
    case 'hf_spaces': {
      const { runVTON } = await import('./hf-spaces')
      return runVTON(request)
    }
    case 'gemini': {
      const { runGeminiVTON } = await import('./gemini')
      return runGeminiVTON(request)
    }
    case 'fal_ai': {
      const { runFalVTON } = await import('./fal')
      return runFalVTON(request)
    }
    default:
      throw new Error(`Unknown inference provider: ${resolved}`)
  }
}
