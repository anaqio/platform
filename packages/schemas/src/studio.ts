import { z } from 'zod'

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
