import type { CampaignSignupStats } from '@/types/database'
import { createAdminClient } from '@/lib/supabase/admin'

export async function getCampaignStats(): Promise<CampaignSignupStats[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('campaign_signup_stats')
    .select(
      'id, name, slug, type, platform, is_active, budget_mad, start_date, end_date, signups_total, signups_invited, signups_active, avg_lead_score, first_signup_at, last_signup_at',
    )
    .order('signups_total', { ascending: false })

  if (error) throw error
  return data as CampaignSignupStats[]
}
