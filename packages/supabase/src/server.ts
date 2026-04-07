import { createServerClient } from '@supabase/ssr'

interface CookieStore {
  getAll(): Array<{ name: string; value: string }>
  set(name: string, value: string, options?: Record<string, unknown>): void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createServerSupabaseClient<Database = any>(
  url: string,
  key: string,
  cookieStore: CookieStore,
  options?: { schema?: string },
) {
  return createServerClient<Database>(url, key, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(options?.schema ? { db: { schema: options.schema as any } } : {}),
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Record<string, unknown>),
          )
        } catch {
          // Server Component — can't write cookies; middleware handles the refresh
        }
      },
    },
  })
}
