import { z } from 'zod'

export const WaitlistSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Please provide a valid email address.'),
  full_name: z.string().min(2, 'Name is too short.').max(100, 'Name is too long.'),
  role: z.string().min(1, 'Please select your role.'),
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
  utm_source: z.string().max(100).optional().nullable(),
  utm_medium: z.string().max(100).optional().nullable(),
  utm_campaign: z.string().max(100).optional().nullable(),
  utm_content: z.string().max(100).optional().nullable(),
  utm_term: z.string().max(100).optional().nullable(),
  referrer: z.string().max(500).optional().nullable(),
})

export type WaitlistInput = z.infer<typeof WaitlistSchema>
