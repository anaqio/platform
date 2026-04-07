'use server'

import { revalidatePath } from 'next/cache'

import type { CampaignCreate } from '@/types/database'
import { createLandingAdminClient } from '@/lib/supabase/landing'

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createCampaign(data: Omit<CampaignCreate, 'slug'> & { slug?: string }) {
  const supabase = createLandingAdminClient()

  const slug = data.slug || `${slugify(data.name)}-${Date.now()}`

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .insert({
      name: data.name,
      slug,
      type: data.type,
      platform: data.platform ?? null,
      description: data.description ?? null,
      start_date: data.start_date ?? null,
      end_date: data.end_date ?? null,
      budget_mad: data.budget_mad ?? null,
      is_active: data.is_active ?? true,
    })
    .select('id, name, slug')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/campaigns')
  return campaign
}

export async function toggleCampaignActive(id: string, isActive: boolean) {
  const supabase = createLandingAdminClient()

  const { error } = await supabase.from('campaigns').update({ is_active: isActive }).eq('id', id)

  if (error) throw new Error(`[campaigns.update] ${error.message}`)

  revalidatePath('/campaigns')
}
