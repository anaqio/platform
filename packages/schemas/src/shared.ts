import { z } from 'zod'

export const utmFieldsSchema = {
  utm_source: z.string().max(100).optional().nullable(),
  utm_medium: z.string().max(100).optional().nullable(),
  utm_campaign: z.string().max(100).optional().nullable(),
  utm_content: z.string().max(100).optional().nullable(),
  utm_term: z.string().max(100).optional().nullable(),
  referrer: z.string().max(500).optional().nullable(),
} as const

export type UtmFields = z.infer<z.ZodObject<typeof utmFieldsSchema>>
