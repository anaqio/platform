'use server'

import { after } from 'next/server'
import { z } from 'zod'

import { utmFieldsSchema } from '@/lib/actions/shared'
import { ERROR_MESSAGES } from '@/lib/constants/errors'
import { createClient } from '@/lib/supabase/server'

const WaitlistSchema = z.object({
  email: z.email(ERROR_MESSAGES.VALID_EMAIL),
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
  ...utmFieldsSchema,
})

/**
 * Fire-and-forget: create/update Brevo contact + send a welcome event.
 * Silently skips if BREVO_API_KEY is not set.
 */
async function triggerBrevoWelcome(email: string, firstName: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.warn('[Brevo] BREVO_API_KEY is not set — skipping welcome trigger')
    return
  }

  try {
    // Upsert the contact into Brevo
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: firstName },
        // Add to the Anaqio waitlist list if BREVO_LIST_ID is configured
        ...(process.env.BREVO_LIST_ID ? { listIds: [Number(process.env.BREVO_LIST_ID)] } : {}),
        updateEnabled: true,
      }),
    })
  } catch (err) {
    // Non-fatal — Brevo failure must never block the user
    console.error('[Brevo] Failed to trigger welcome sequence:', err)
  }
}

export async function joinWaitlist(formData: FormData) {
  const validatedFields = WaitlistSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.issues[0].message,
    }
  }

  const {
    email,
    full_name,
    role,
    company,
    revenue_range,
    aesthetic,
    source,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    referrer,
  } = validatedFields.data

  try {
    const supabase = await createClient()

    type WaitlistPayload = {
      email: string
      full_name: string
      role: string
      preferences: { aesthetic?: string }
      source: string
      utm_source?: string | null
      utm_medium?: string | null
      utm_campaign?: string | null
      utm_content?: string | null
      utm_term?: string | null
      referrer?: string | null
      company?: string | null
      revenue_range?: string | null
    }

    const payload: WaitlistPayload = {
      email: email.toLowerCase().trim(),
      full_name: full_name.trim(),
      role: role,
      preferences: aesthetic ? { aesthetic } : {},
      source: source,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      referrer,
    }

    const trimmedCompany = company?.trim()
    if (trimmedCompany) {
      payload.company = trimmedCompany
    }

    if (revenue_range) {
      payload.revenue_range = revenue_range
    }

    const { error } = await supabase.from('waitlist').insert(payload)

    if (error) {
      if (error.code === '23505') {
        return {
          success: false,
          message: 'This email is already on the waitlist!',
        }
      }
      console.error('Waitlist insert error:', error)
      return {
        success: false,
        message: ERROR_MESSAGES.GENERIC,
      }
    }

    // Fire Brevo welcome sequence after response is sent
    after(() =>
      triggerBrevoWelcome(
        email.toLowerCase().trim(),
        full_name.trim().split(' ')[0] ?? full_name.trim()
      )
    )

    return {
      success: true,
      message: "You're on the list! We'll be in touch soon.",
    }
  } catch (err) {
    console.error('Waitlist error:', err)
    return {
      success: false,
      message: ERROR_MESSAGES.GENERIC,
    }
  }
}
