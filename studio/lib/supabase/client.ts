import { createBrowserSupabaseClient } from '@anaqio/supabase/client'

import type { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}
