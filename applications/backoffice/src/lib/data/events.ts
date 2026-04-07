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

export interface EventStats {
  total: number
  active: number
  upcoming: number
  past: number
}

export function computeEventStats(events: Event[]): EventStats {
  const now = new Date()
  return {
    total: events.length,
    active: events.filter((e) => e.is_active).length,
    upcoming: events.filter((e) => e.start_at && new Date(e.start_at) > now).length,
    past: events.filter((e) => e.end_at && new Date(e.end_at) < now).length,
  }
}
