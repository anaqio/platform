import { createBrowserSupabaseClient } from '@anaqio/supabase/client';

import { env } from '@/lib/env';

export function createClient() {
  return createBrowserSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  );
}
