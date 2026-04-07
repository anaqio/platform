import { createBrowserSupabaseClient } from '@anaqio/supabase/client'

export function createClient() {
  return createBrowserSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    { schema: 'landing' },
  )
}
