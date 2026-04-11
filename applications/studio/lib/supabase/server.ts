import { cookies } from 'next/headers'
import { createServerSupabaseClient } from '@anaqio/supabase/server'

import type { Database } from '@/types/supabase'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerSupabaseClient<Database, 'studio'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    cookieStore,
    { schema: 'studio' },
  )
}
