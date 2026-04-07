import { createClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAdminSupabaseClient<Database = any>(
  url: string,
  serviceRoleKey: string,
  options?: {
    schema?: string
    auth?: { autoRefreshToken?: boolean; persistSession?: boolean }
  },
) {
  const { schema, ...clientOptions } = options ?? {}
  return createClient<Database>(url, serviceRoleKey, {
    ...clientOptions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(schema ? { db: { schema: schema as any } } : {}),
  })
}
