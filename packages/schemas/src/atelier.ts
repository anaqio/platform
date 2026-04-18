import { z } from 'zod'

import { ERROR_MESSAGES } from './errors'

export const AtelierInvitationSchema = z.object({
  email: z.string().min(1, 'Please provide an email address.').email(ERROR_MESSAGES.VALID_EMAIL),
  entity_name: z.string().min(2, ERROR_MESSAGES.NAME_REQUIRED).max(100),
  role: z.string().min(1, ERROR_MESSAGES.ROLE_REQUIRED),
  whatsapp: z.string().max(20).optional().nullable(),
  revenue_range: z.string().optional().nullable(),
  referral_source: z.string().optional().nullable(),
  source: z.string().default('early-access'),
})

export type AtelierInvitationInput = z.infer<typeof AtelierInvitationSchema>
