import { GoogleGenAI } from '@google/genai'

import type { InferenceRequest, InferenceResult } from './types'

/**
 * Gemini Imagen provider — uses Google's multimodal model to generate
 * fashion try-on images via prompt engineering (adapted from aistudio reference app).
 *
 * Unlike IDM-VTON which composites garment onto model directly,
 * Gemini receives both images + a detailed text prompt describing the task.
 */
export async function runGeminiVTON(request: InferenceRequest): Promise<InferenceResult> {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY not configured')

  const ai = new GoogleGenAI({ apiKey })
  const start = Date.now()

  // Fetch both images and convert to base64
  const [garmentB64, modelB64] = await Promise.all([
    fetchAsBase64(request.garmentUrl),
    fetchAsBase64(request.modelUrl),
  ])

  // The description from buildPrompt() is already a rich Gemini prompt when aiProvider=gemini
  const prompt = request.description ?? buildGeminiPrompt('fashion garment')

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-image-generation',
    contents: {
      parts: [
        { inlineData: { data: garmentB64.data, mimeType: garmentB64.mimeType } },
        { inlineData: { data: modelB64.data, mimeType: modelB64.mimeType } },
        { text: prompt },
      ],
    },
    config: {
      responseModalities: ['image', 'text'],
    },
  })

  const elapsed = Date.now() - start

  const parts = response.candidates?.[0]?.content?.parts
  if (!parts || parts.length === 0) {
    const refusal = response.text?.trim()
    if (refusal) throw new Error(refusal)
    throw new Error('Gemini returned an empty response')
  }

  // Find the generated image in response parts
  for (const part of parts) {
    if (part.inlineData?.data) {
      // Convert base64 to a data URL for downstream upload
      const mimeType = part.inlineData.mimeType ?? 'image/png'
      const dataUrl = `data:${mimeType};base64,${part.inlineData.data}`
      return { outputUrl: dataUrl, inferenceMs: elapsed }
    }
  }

  // Check for text-only response (likely a refusal)
  for (const part of parts) {
    if (part.text) throw new Error(part.text)
  }

  throw new Error('Gemini did not return an image')
}

async function fetchAsBase64(url: string): Promise<{ data: string; mimeType: string }> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)

  const buffer = await res.arrayBuffer()
  const data = Buffer.from(buffer).toString('base64')
  const mimeType = res.headers.get('content-type') ?? 'image/jpeg'

  return { data, mimeType }
}

function buildGeminiPrompt(garmentDescription: string): string {
  return `You are given 2 images. Image 1 is the GARMENT. Image 2 is the MODEL (the person to wear the garment).

Your task is to generate a realistic fashion model photo:
1. **Isolate the Garment:** From Image 1, meticulously isolate the complete garment. CRITICAL: Do not modify or alter the design, shape, texture, or color of the garment. Preserve its original appearance exactly as shown.
2. **Place on Model:** Place the isolated garment onto the model from Image 2. Maintain the model's facial features, body proportions, and identity. The garment should drape naturally with accurate fabric folds, stitching, and material depth.
3. **Garment Details:** ${garmentDescription}
4. **Set the Scene:** Use a clean, minimalist studio background. Apply soft, diffused, realistic studio lighting.
5. **Final Aesthetic:** The final image must have a high-fashion, sophisticated editorial photography aesthetic. It must be indistinguishable from a real professional photograph, with realistic skin texture and natural lighting.

Output a single high-quality image only.`
}
