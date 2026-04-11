import { createAdminSupabaseClient } from '@anaqio/supabase/admin'

import type { Database } from '@/types/supabase'

export function createClient() {
  return createAdminSupabaseClient<Database, 'studio'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
