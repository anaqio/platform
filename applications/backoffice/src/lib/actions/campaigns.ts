'use server'

import { revalidatePath } from 'next/cache'

import type { CampaignCreate } from '@/types/database'
import { createAdminClient } from '@/lib/supabase/admin'

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createCampaign(data: Omit<CampaignCreate, 'slug'> & { slug?: string }) {
  const supabase = createAdminClient()

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
