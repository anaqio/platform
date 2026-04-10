import { z } from 'zod'

export const modifyRequestSchema = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.string().min(1),
  modificationPrompt: z.string().min(1).max(500),
})
