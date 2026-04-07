import { createAdminSupabaseClient } from '@anaqio/supabase/admin'

// Function name kept as createAdminClient (not createClient) to distinguish from server client
export function createAdminClient() {
  return createAdminSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
