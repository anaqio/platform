'use server'

import { revalidatePath } from 'next/cache'

import type { EventCreate, EventType } from '@/types/database'
import { createAdminClient } from '@/lib/supabase/admin'

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createEvent(data: Omit<EventCreate, 'slug'> & { slug?: string }) {
  const supabase = createAdminClient()

  const slug = data.slug || `${slugify(data.name)}-${Date.now()}`

  const { data: event, error } = await supabase
    .from('events')
    .insert({
      name: data.name,
      slug,
      type: data.type,
      description: data.description ?? null,
      venue: data.venue ?? null,
      city: data.city ?? null,
      country: data.country ?? 'MA',
      start_at: data.start_at ?? null,
      end_at: data.end_at ?? null,
      capacity: data.capacity ?? null,
      registration_url: data.registration_url ?? null,
      campaign_id: data.campaign_id ?? null,
      is_active: data.is_active ?? true,
    })
    .select('id, name, slug')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/events')
  return event
}

export async function toggleEventActive(id: string, isActive: boolean) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('events').update({ is_active: isActive }).eq('id', id)

  if (error) throw new Error(`[events.update] ${error.message}`)

  revalidatePath('/events')
}

export async function updateEventType(id: string, type: EventType) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('events').update({ type }).eq('id', id)

  if (error) throw new Error(`[events.update] ${error.message}`)

  revalidatePath('/events')
}
