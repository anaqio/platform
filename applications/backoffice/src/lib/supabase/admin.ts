import { createAdminSupabaseClient } from '@anaqio/supabase/admin'

import type { Database } from '@/types/supabase-database'

// Function name kept as createAdminClient (not createClient) to distinguish from server client
export function createAdminClient() {
  return createAdminSupabaseClient<Database, 'public'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
