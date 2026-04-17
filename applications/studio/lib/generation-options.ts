import { z } from 'zod/v4'

// ── Zod schemas ──────────────────────────────────────────────

export const generationModeSchema = z.enum(['single_item', 'full_outfit'])
export const imageQualitySchema = z.enum(['draft', 'standard', 'high'])
export const aiProviderSchema = z.literal('gemini')
export const fitStyleSchema = z.enum(['standard', 'loose', 'oversized', 'slim'])
export const artisticStyleSchema = z.enum([
  'default',
  'cinematic',
  'ethereal',
  'minimalist',
  'street',
])

export const generationOptionsSchema = z.object({
  mode: generationModeSchema,
  description: z.string().max(200).default(''),
  backgroundColor: z.string().default('Cool Grey'),
  quality: imageQualitySchema,
  aiProvider: aiProviderSchema,
  fitStyle: fitStyleSchema,
  artisticStyle: artisticStyleSchema,
  presetModelId: z.string().default(''),
  fashionPose: z.string().default(''),
})

/** Zod schema for the /api/generate request body */
export const generateRequestSchema = z.object({
  garmentPath: z.string().min(1),
  presetModelId: z.string().min(1),
  sessionId: z.string().nullable().optional(),
  description: z.string().optional(),
  denoiseSteps: z.number().int().min(1).max(100).optional(),
  aiProvider: z.literal('gemini').optional(),
})

// ── Inferred types ───────────────────────────────────────────

export type GenerationMode = z.infer<typeof generationModeSchema>
export type ImageQuality = z.infer<typeof imageQualitySchema>
export type AIProvider = z.infer<typeof aiProviderSchema>
export type FitStyle = z.infer<typeof fitStyleSchema>
export type ArtisticStyle = z.infer<typeof artisticStyleSchema>
export type GenerationOptions = z.infer<typeof generationOptionsSchema>
export type GenerateRequest = z.infer<typeof generateRequestSchema>

// ── Constants ────────────────────────────────────────────────

export const QUALITY_STEPS: Record<ImageQuality, number> = {
  draft: 15,
  standard: 30,
  high: 50,
}

export const DEFAULT_OPTIONS: GenerationOptions = {
  mode: 'single_item',
  description: '',
  backgroundColor: 'Cool Grey',
  quality: 'standard',
  aiProvider: 'gemini',
  fitStyle: 'standard',
  artisticStyle: 'default',
  presetModelId: '',
  fashionPose: '',
}

// ── Prompt templates (adapted from aistudio reference) ───────

const FIT_STYLE_PROMPTS: Record<FitStyle, string> = {
  standard:
    'The garment should have a standard, true-to-size fit. It must drape naturally on the model as intended by its design.',
  loose:
    'The garment must have a loose, relaxed fit. It should show extra fabric, soft draping, and comfortable folds. Avoid a tight or form-fitting look.',
  oversized:
    'The garment must have an intentionally oversized fit. It should appear fashionably large on the model, with exaggerated draping, dropped shoulders (if applicable), and voluminous folds.',
  slim: "The garment must have a slim, close-to-the-body fit. It should contour the model's shape while still allowing for natural movement and minimal folds.",
}

export const BACKGROUND_PROMPTS: Record<string, string> = {
  White: 'a seamless, pure white studio background',
  'Warm Beige': 'a seamless, warm beige studio background',
  'Cool Grey': 'a seamless, gradient cool grey studio background',
  'Soft Pink': 'a seamless, soft pastel pink studio background',
  'Sky Blue': 'a seamless, light sky blue studio background',
  'Olive Green': 'a seamless, muted olive green studio background',
  'Burnt Orange': 'a seamless, warm burnt orange studio background',
  'Rich Maroon': 'a seamless, rich maroon studio background',
  'Deep Navy': 'a seamless, deep navy blue studio background',
  Charcoal: 'a seamless, dark charcoal grey studio background',
}

const ARTISTIC_STYLE_TEMPLATES: Record<string, string> = {
  cinematic:
    'An ultra-realistic, stunning, high-fashion photograph of {{MODEL_PLACEHOLDER}} wearing the garment. The composition is centered. Dramatic, cinematic lighting from the upper right creates intense, warm highlights and ethereal, glowing rim light effect that sharply contrasts with cooler shadows. The background is {{BACKGROUND_PLACEHOLDER}}. The overall aesthetic is clean, modern, and elegant, rendered with photorealistic precision, emphasizing the delicate texture and luxurious feel of the fabric, achieved with a shallow depth of field. The final image must be indistinguishable from a real photograph.',
  ethereal:
    'An ultra-realistic, highly detailed, ethereal, high-fashion studio shot of {{MODEL_PLACEHOLDER}} wearing the exquisite garment. The entire scene is bathed in soft, diffused, high-key overhead lighting. Surrounding the model are numerous delicate, abstract, petal-like fabric elements, fluttering around. The background is a vast, flowing cascade of smooth fabric that is {{BACKGROUND_PLACEHOLDER}}. The image exudes a sense of purity, lightness, and elegant motion, rendered with hyperrealistic detail. The final image must be indistinguishable from a real photograph.',
  minimalist:
    'An ultra-realistic, high-key, minimalist studio product photograph of {{MODEL_PLACEHOLDER}} wearing the garment, dynamically posed. The garment exhibits natural folds and creases. The composition features the model against a clean, seamless background which is {{BACKGROUND_PLACEHOLDER}}. Soft, diffused professional studio lighting illuminates the garment from above and slightly in front, creating subtle volumetric shadows. A soft, elongated shadow is cast beneath the model. Shot with a shallow depth of field, sharp focus, evoking a clean, contemporary aesthetic. The final image must be indistinguishable from a real photograph.',
  street:
    'An ultra-realistic, full-body, high-fashion studio shot of {{MODEL_PLACEHOLDER}}, dynamically posed. The background is a clean, minimalist seamless studio setup which is {{BACKGROUND_PLACEHOLDER}}. Dramatic, high-contrast, directional natural light originates from the upper left, casting intricate, sharp, elongated shadow patterns resembling palm fronds or window blinds across the entire background and subtly onto the subject. The lighting creates strong specular highlights on the fabric. The overall aesthetic is modern, clean, editorial, and sophisticated with a strong focus on light and shadow play. The final image must be indistinguishable from a real photograph.',
}

const QUALITY_PROMPTS: Record<ImageQuality, string> = {
  draft: 'Generate a high-quality image suitable for web use.',
  standard:
    'Generate a very high-quality, high-resolution image with sharp details, suitable for high-end web displays and digital catalogs.',
  high: 'Generate an ultra-high resolution, print-quality photograph (e.g., 300 DPI, 4K resolution) with extremely fine details, sharp focus, and no digital artifacts. The image must be suitable for large format printing.',
}

/**
 * Rich model descriptions for Gemini prompt engineering.
 * Keyed by preset_models.id — used to describe the model in text
 * so Gemini maintains identity consistency.
 */
export const MODEL_DESCRIPTIONS: Record<string, string> = {
  'f-01-moderne':
    'an ultra-realistic female model with long, wavy brown hair, light skin, and a neutral, professional fashion expression. The image must be in sharp focus with high-resolution details. She has realistic skin texture with natural pores, natural hair strands, and expressive facial features. Her appearance should be indistinguishable from a real professional photograph. CRITICAL: Maintain the same facial features and identity for this model across all generated images.',
  'f-02-kaftan':
    'an ultra-realistic female model of Moroccan ethnicity with beautiful traditional features, styled elegantly. She has long, dark, wavy hair, warm skin tones, and a serene, confident expression. The image must be in sharp focus with high-resolution details. She has realistic skin texture with natural pores, natural hair strands, and expressive facial features. Her appearance should be indistinguishable from a real professional photograph. CRITICAL: Maintain the same facial features and identity for this model across all generated images.',
  'f-03-casual':
    'an ultra-realistic female model with a blonde ponytail, freckles, and a playful yet professional attitude. The image must be in sharp focus with high-resolution details. She has realistic skin texture with natural pores, natural hair strands, and expressive facial features. Her appearance should be indistinguishable from a real professional photograph. CRITICAL: Maintain the same facial features and identity for this model across all generated images.',
  'm-01-moderne':
    'a male model with short, styled brown hair, olive skin, and a serious, high-fashion expression. The image must be in sharp focus with high-resolution details.',
  'm-02-jellaba':
    'a male model of North African ethnicity with short dark hair, warm brown skin, and a confident, dignified expression. The image must be in sharp focus with high-resolution details. CRITICAL: Maintain the same facial features and identity for this model across all generated images.',
}

// Fallback for unknown preset IDs
const DEFAULT_MODEL_DESCRIPTION =
  'an ultra-realistic fashion model. The image must be in sharp focus with high-resolution details. Realistic skin texture with natural pores and expressive facial features.'

// ── Prompt builder ───────────────────────────────────────────

/**
 * Builds a rich, detailed Gemini prompt string from the selected options.
 */
export function buildPrompt(options: GenerationOptions): string {
  const bg = BACKGROUND_PROMPTS[options.backgroundColor] ?? BACKGROUND_PROMPTS['Cool Grey']
  const fit = FIT_STYLE_PROMPTS[options.fitStyle]
  const quality = QUALITY_PROMPTS[options.quality]
  const userDesc = options.description.trim()
  const modelDesc = MODEL_DESCRIPTIONS[options.presetModelId] ?? DEFAULT_MODEL_DESCRIPTION

  // If an artistic style template is selected, use it instead of the default prompt
  if (options.artisticStyle !== 'default') {
    const template = ARTISTIC_STYLE_TEMPLATES[options.artisticStyle]
    if (template) {
      const basePrompt = template
        .replace('{{MODEL_PLACEHOLDER}}', modelDesc)
        .replace('{{BACKGROUND_PLACEHOLDER}}', bg)

      const parts = [
        'You are given 2 images. Image 1 is the GARMENT. Image 2 is the MODEL (the person to wear the garment).',
        '',
        `From the garment image, first meticulously isolate the complete garment. CRITICAL: Do not modify or alter the design, shape, texture, or color of the garment. Preserve its original appearance exactly as shown. Then, place it on the model from Image 2, maintaining the model's facial features and identity.`,
        '',
        basePrompt,
        '',
        `${quality} The garment fit is critical: ${fit.toLowerCase()}`,
      ]

      if (options.fashionPose) {
        parts.push(`The model must be in the following pose: ${options.fashionPose}.`)
      }

      if (userDesc) {
        parts.push(`Additional garment details: ${userDesc}`)
      }

      parts.push('', 'Output a single high-quality image only.')
      return parts.join('\n')
    }
  }

  // Default artistic style: structured step-by-step prompt
  const modelInstruction = `Place the isolated garment onto the model from Image 2. The model is described as: "${modelDesc}". Maintain the model's facial features, body proportions, and identity. The garment should drape naturally with accurate fabric folds, stitching, and material depth.`

  const lines = [
    'You are given 2 images. Image 1 is the GARMENT. Image 2 is the MODEL (the person to wear the garment).',
    '',
    'Your task is to generate a realistic fashion model photo.',
    'CRITICAL: Do not modify or alter the design, shape, texture, or color of the garment. Preserve its original appearance exactly as shown.',
    '',
    '1. **Isolate the Garment:** From Image 1, meticulously isolate the complete garment, preserving every detail.',
    `2. **Place on Model:** ${modelInstruction}`,
    `3. **Define Garment Fit:** ${fit}`,
  ]

  let step = 4
  if (options.fashionPose) {
    lines.push(
      `${step}. **Pose:** The model must be in the following pose: ${options.fashionPose}.`
    )
    step++
  }
  if (userDesc) {
    lines.push(`${step}. **Garment Details:** ${userDesc}`)
    step++
  }

  lines.push(
    `${step}. **Set the Scene:** Place the model in ${bg}. Use soft, diffused, realistic studio lighting.`,
    `${step + 1}. **Final Aesthetic:** The final image must have a high-fashion, sophisticated editorial photography aesthetic. It must be indistinguishable from a real professional photograph, with realistic skin texture and natural lighting. ${quality}`,
    '',
    'Output a single high-quality image only.'
  )

  return lines.join('\n')
}
