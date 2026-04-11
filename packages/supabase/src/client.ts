import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

export function createBrowserSupabaseClient<
  Database,
  SchemaName extends string & keyof Omit<Database, '__InternalSupabase'> =
    'public' extends keyof Omit<Database, '__InternalSupabase'>
      ? 'public'
      : string & keyof Omit<Database, '__InternalSupabase'>,
>(url: string, key: string, options?: { schema?: string }): SupabaseClient<Database, SchemaName> {
  return createBrowserClient<Database, SchemaName>(url, key, {
    ...(options?.schema ? { db: { schema: options.schema as any } } : {}),
  } as any)
}
