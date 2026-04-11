import { createServerClient } from '@supabase/ssr'
import type { CookieOptions, SetAllCookies } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

interface CookieStore {
  getAll(): Array<{ name: string; value: string }>
  set(name: string, value: string, options?: CookieOptions): void
}

export function createServerSupabaseClient<
  Database,
  SchemaName extends string & keyof Omit<Database, '__InternalSupabase'> =
    'public' extends keyof Omit<Database, '__InternalSupabase'>
      ? 'public'
      : string & keyof Omit<Database, '__InternalSupabase'>,
>(
  url: string,
  key: string,
  cookieStore: CookieStore,
  options?: { schema?: string },
): SupabaseClient<Database, SchemaName> {
  return createServerClient<Database, SchemaName>(url, key, {
    ...(options?.schema ? { db: { schema: options.schema as any } } : {}),
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Server Component — can't write cookies; middleware handles the refresh
        }
      },
    },
  } as any)
}
