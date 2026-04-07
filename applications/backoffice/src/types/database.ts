// ── Waitlist ────────────────────────────────────────────

export type WaitlistStatus = 'pending' | 'invited' | 'active' | 'unsubscribed'

export interface WaitlistUser {
  id: string
  email: string
  full_name: string | null
  role: string
  company: string | null
  revenue_range: string | null
  preferences: Record<string, unknown>
  source: string
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  country: string | null
  city: string | null
  status: WaitlistStatus
  lead_score: number
  invited_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// ── Campaigns ──────────────────────────────────────────

export type CampaignType =
  | 'email'
  | 'social'
  | 'influencer'
  | 'paid'
  | 'organic'
  | 'referral'
  | 'seo'
  | 'smo'

export type CampaignPlatform =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'google'
  | 'linkedin'
  | 'x'
  | 'whatsapp'
  | 'email'
  | 'other'

export interface Campaign {
  id: string
  name: string
  slug: string
  description: string | null
  type: CampaignType
  platform: CampaignPlatform | null
  start_date: string | null
  end_date: string | null
  budget_mad: number | null
  target_audience: Record<string, unknown>
  meta: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── Campaign Signup Stats (view) ───────────────────────

export interface CampaignSignupStats {
  id: string
  name: string
  slug: string
  type: CampaignType
  platform: CampaignPlatform | null
  is_active: boolean
  budget_mad: number | null
  start_date: string | null
  end_date: string | null
  signups_total: number
  signups_invited: number
  signups_active: number
  avg_lead_score: number | null
  first_signup_at: string | null
  last_signup_at: string | null
}

// ── Campaign Create ────────────────────────────────────

export interface CampaignCreate {
  name: string
  slug: string
  type: CampaignType
  platform?: CampaignPlatform | null
  description?: string | null
  start_date?: string | null
  end_date?: string | null
  budget_mad?: number | null
  is_active?: boolean
}

// ── Events ─────────────────────────────────────────────

export type EventType =
  | 'fashion_show'
  | 'expo'
  | 'launch'
  | 'workshop'
  | 'webinar'
  | 'pop_up'
  | 'other'

export interface Event {
  id: string
  name: string
  slug: string
  description: string | null
  type: EventType
  venue: string | null
  city: string | null
  country: string
  start_at: string | null
  end_at: string | null
  capacity: number | null
  registration_url: string | null
  campaign_id: string | null
  is_active: boolean
  meta: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface EventCreate {
  name: string
  slug: string
  type: EventType
  description?: string | null
  venue?: string | null
  city?: string | null
  country?: string
  start_at?: string | null
  end_at?: string | null
  capacity?: number | null
  registration_url?: string | null
  campaign_id?: string | null
  is_active?: boolean
}

// ── Dashboard ──────────────────────────────────────────

export interface DashboardStats {
  total: number
  pending: number
  invited: number
  active: number
  unsubscribed: number
  this_week: number
}
