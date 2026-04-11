import { createBrowserSupabaseClient } from '@anaqio/supabase/client';

import { env } from '@/lib/env';
import type { Database } from '@/lib/types/database';

export function createClient() {
  return createBrowserSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  );
}
