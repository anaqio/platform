import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

export function createBrowserSupabaseClient<Database>(
  url: string,
  key: string,
  options?: { schema?: string },
): SupabaseClient<Database> {
  return createBrowserClient<Database>(url, key, {
    ...(options?.schema ? { db: { schema: options.schema } } : {}),
  } as any) as SupabaseClient<Database>
}
