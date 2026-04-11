import { createServerSupabaseClient } from '@anaqio/supabase/server';
import { cookies } from 'next/headers';

import { env } from '@/lib/env';
import type { Database } from '@/lib/types/database';

/**
 * Don't put this client in a global variable — create a new client within
 * each function. Especially important with Fluid Compute.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    cookieStore
  );
}
