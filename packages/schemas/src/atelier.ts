import { z } from 'zod'

export const AtelierInvitationSchema = z.object({
  email: z
    .string()
    .min(1, 'Please provide an email address.')
    .email('Please provide a valid email address.'),
  entity_name: z.string().min(2, 'Name is too short.').max(100, 'Name is too long.'),
  role: z.string().min(1, 'Please select your role.'),
  whatsapp: z.string().max(20).optional().nullable(),
  revenue_range: z.string().optional().nullable(),
  referral_source: z.string().optional().nullable(),
  source: z.string().default('early-access'),
})

export type AtelierInvitationInput = z.infer<typeof AtelierInvitationSchema>
