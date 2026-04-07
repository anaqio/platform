'use server';

import { z } from 'zod';

import { utmFieldsSchema } from '@/lib/actions/shared';
import { ERROR_MESSAGES } from '@/lib/constants/errors';
import { createClient } from '@/lib/supabase/server';

const NotifySchema = z.object({
  email: z.email(ERROR_MESSAGES.VALID_EMAIL),
  ...utmFieldsSchema,
});

/**
 * Lightweight email-only notify action for the Coming Soon page.
 * Inserts into the waitlist table with minimal fields.
 * full_name is intentionally null for quick signups — the DB schema allows it.
 * UTM params are collected client-side and passed as hidden form inputs.
 */
export async function notifyMe(formData: FormData) {
  const parsed = NotifySchema.safeParse({
    email: formData.get('email'),
    utm_source: formData.get('utm_source') ?? null,
    utm_medium: formData.get('utm_medium') ?? null,
    utm_campaign: formData.get('utm_campaign') ?? null,
    utm_content: formData.get('utm_content') ?? null,
    utm_term: formData.get('utm_term') ?? null,
    referrer: formData.get('referrer') ?? null,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }

  const {
    email,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    referrer,
  } = parsed.data;

  try {
    const supabase = await createClient();

    const { error } = await supabase.from('waitlist').insert({
      email: email.toLowerCase().trim(),
      full_name: null,
      role: 'interested',
      source: 'coming-soon',
      utm_source: utm_source ?? null,
      utm_medium: utm_medium ?? null,
      utm_campaign: utm_campaign ?? null,
      utm_content: utm_content ?? null,
      utm_term: utm_term ?? null,
      referrer: referrer ?? null,
    });

    if (error) {
      if (error.code === '23505') {
        return {
          success: false,
          message: 'This email is already on the list.',
        };
      }
      console.error('Notify insert error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.GENERIC_SHORT,
      };
    }

    return {
      success: true,
      message: "You're in. We'll reach out when the studio opens.",
    };
  } catch (err) {
    console.error('Notify error:', err);
    return {
      success: false,
      message: ERROR_MESSAGES.GENERIC_SHORT,
    };
  }
}
