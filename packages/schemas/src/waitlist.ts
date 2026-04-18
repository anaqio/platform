import { z } from 'zod'

import { ERROR_MESSAGES } from './errors'
import { utmFieldsSchema } from './shared'

export const WaitlistSchema = z.object({
  email: z.string().min(1, 'Email is required.').email(ERROR_MESSAGES.VALID_EMAIL),
  full_name: z.string().min(2, ERROR_MESSAGES.NAME_REQUIRED).max(100),
  role: z.string().min(1, ERROR_MESSAGES.ROLE_REQUIRED),
  company: z
    .string()
    .max(100)
    .optional()
    .nullable()
    .transform((val) => (val?.trim() === '' ? null : val)),
  revenue_range: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val?.trim() === '' ? null : val)),
  aesthetic: z.string().optional(),
  source: z.string().default('home'),
  ...utmFieldsSchema,
})

export type WaitlistInput = z.infer<typeof WaitlistSchema>
