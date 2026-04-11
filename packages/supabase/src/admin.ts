import { createClient } from '@supabase/supabase-js'

export function createAdminSupabaseClient<Database, SchemaName extends string = 'public'>(
  url: string,
  serviceRoleKey: string,
  options?: { schema?: string },
): any {
  return createClient(url, serviceRoleKey, {
    ...(options?.schema ? { db: { schema: options.schema } } : {}),
  })
}
