import { createClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAdminSupabaseClient<Database = any>(
  url: string,
  serviceRoleKey: string,
  options?: { auth?: { autoRefreshToken?: boolean; persistSession?: boolean } },
) {
  return createClient<Database>(url, serviceRoleKey, options)
}
