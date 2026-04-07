import { createAdminSupabaseClient } from '@anaqio/supabase/admin'

/**
 * Admin client scoped to the `landing` schema.
 * Use this for all reads/writes to landing.waitlist, landing.campaigns, etc.
 * The service_role key bypasses RLS — never expose to the browser.
 */
export function createLandingAdminClient() {
  return createAdminSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      schema: 'landing',
      auth: { autoRefreshToken: false, persistSession: false },
    },
  )
}
