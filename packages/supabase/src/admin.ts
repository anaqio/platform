import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

export function createAdminSupabaseClient<
  Database,
  SchemaName extends string & keyof Omit<Database, '__InternalSupabase'> =
    'public' extends keyof Omit<Database, '__InternalSupabase'>
      ? 'public'
      : string & keyof Omit<Database, '__InternalSupabase'>,
>(
  url: string,
  serviceRoleKey: string,
  options?: { schema?: string },
): SupabaseClient<Database, SchemaName> {
  return createClient<Database, SchemaName>(url, serviceRoleKey, {
    ...(options?.schema ? { db: { schema: options.schema as any } } : {}),
  } as any)
}
