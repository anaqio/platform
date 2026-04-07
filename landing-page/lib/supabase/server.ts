import { createServerSupabaseClient } from '@anaqio/supabase/server';
import { cookies } from 'next/headers';

import { env } from '@/lib/env';

/**
 * Don't put this client in a global variable — create a new client within
 * each function. Especially important with Fluid Compute.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    cookieStore
  );
}
