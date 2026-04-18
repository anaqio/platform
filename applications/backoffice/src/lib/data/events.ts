import type { Event } from '@/types/database'
import { createAdminClient } from '@/lib/supabase/admin'

export async function getEvents(): Promise<Event[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('events')
    .select(
      'id, name, slug, description, type, venue, city, country, start_at, end_at, capacity, registration_url, campaign_id, is_active, meta, created_at, updated_at',
    )
    .order('start_at', { ascending: false, nullsFirst: false })

  if (error) throw new Error(`[events.select] ${error.message}`)
  return data as Event[]
}

export { computeEventStats } from './event-stats'
export type { EventStats } from './event-stats'
