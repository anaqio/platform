import { createBrowserClient } from '@supabase/ssr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createBrowserSupabaseClient<Database = any>(url: string, key: string) {
  return createBrowserClient<Database>(url, key)
}
