import { createBrowserClient } from '@supabase/ssr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createBrowserSupabaseClient<Database = any>(
  url: string,
  key: string,
  options?: { schema?: string },
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createBrowserClient<Database>(url, key, {
    ...(options?.schema ? { db: { schema: options.schema as any } } : {}),
  })
}
