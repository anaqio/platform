import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

interface CookieStore {
  getAll(): Array<{ name: string; value: string }>
  set(name: string, value: string, options?: CookieOptions): void
}

export function createServerSupabaseClient<Database>(
  url: string,
  key: string,
  cookieStore: CookieStore,
  options?: { schema?: string },
): SupabaseClient<Database> {
  return createServerClient<Database>(url, key, {
    ...(options?.schema ? { db: { schema: options.schema } } : {}),
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
        }
      },
    },
  } as any) as SupabaseClient<Database>
}
