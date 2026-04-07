import { createServerSupabaseClient } from '@anaqio/supabase/server'
import { cookies } from 'next/headers'


export async function createClient() {
  const cookieStore = await cookies()
  return createServerSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    cookieStore,
  )
}
