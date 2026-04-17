'use server'

import { z } from 'zod'

import { ERROR_MESSAGES } from '@/lib/constants/errors'
import { createClient } from '@/lib/supabase/server'

const AtelierInvitationSchema = z.object({
  email: z.string().min(1, 'Please provide an email address.').email(ERROR_MESSAGES.VALID_EMAIL),
  entity_name: z.string().min(2, 'Name is too short.').max(100, 'Name is too long.'),
  role: z.string().min(1, 'Please select your role.'),
  whatsapp: z.string().max(20).optional().nullable(),
  revenue_range: z.string().optional().nullable(),
  referral_source: z.string().optional().nullable(),
  source: z.string().default('early-access'),
})

export async function requestAtelierInvitation(formData: FormData) {
  const rawData = {
    email: formData.get('email')?.toString().trim() ?? '',
    entity_name: formData.get('entity_name')?.toString().trim() ?? '',
    role: formData.get('role')?.toString().trim() ?? '',
    whatsapp: formData.get('whatsapp')?.toString().trim() ?? null,
    revenue_range: formData.get('revenue_range')?.toString().trim() ?? null,
    referral_source: formData.get('referral_source')?.toString().trim() ?? null,
    source: formData.get('source')?.toString().trim() ?? 'early-access',
  }

  const validated = AtelierInvitationSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0].message,
    }
  }

  const { email, entity_name, role, whatsapp, revenue_range, referral_source, source } =
    validated.data

  try {
    const supabase = await createClient()

    const { error } = await supabase.from('atelier_invitations').insert({
      email: email.toLowerCase(),
      entity_name: entity_name.trim(),
      role,
      whatsapp: whatsapp?.trim() ?? null,
      revenue_range: revenue_range ?? null,
      referral_source: referral_source ?? null,
      source,
    })

    if (error) {
      if (error.code === '23505') {
        return {
          success: false,
          message: 'This email has already requested an invitation.',
        }
      }
      console.error('Atelier invitation insert error:', error)
      return {
        success: false,
        message: ERROR_MESSAGES.GENERIC,
      }
    }

    return {
      success: true,
      message: "Your request has been received. We'll be in touch soon.",
    }
  } catch (err) {
    console.error('Atelier invitation error:', err)
    return {
      success: false,
      message: ERROR_MESSAGES.GENERIC,
    }
  }
}
