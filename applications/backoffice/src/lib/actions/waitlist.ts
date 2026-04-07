'use server'

import { revalidatePath } from 'next/cache'

import type { WaitlistStatus, WaitlistUser } from '@/types/database'
import { createLandingAdminClient } from '@/lib/supabase/landing'

export async function updateWaitlistStatus(id: string, status: WaitlistStatus) {
  const supabase = createLandingAdminClient()

  const update: Partial<Pick<WaitlistUser, 'status' | 'invited_at'>> = { status }
  if (status === 'invited') update.invited_at = new Date().toISOString()

  const { error } = await supabase.from('waitlist').update(update).eq('id', id)

  if (error) throw new Error(`[waitlist.update] ${error.message}`)

  revalidatePath('/crm')
  revalidatePath('/dashboard')
}

export async function exportWaitlistCSV(filters?: {
  status?: WaitlistStatus
  search?: string
}): Promise<string> {
  const supabase = createLandingAdminClient()

  let query = supabase
    .from('waitlist')
    .select(
      'email, full_name, role, company, revenue_range, source, utm_source, utm_medium, utm_campaign, country, city, status, lead_score, invited_at, created_at',
    )
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.search) {
    query = query.or(
      `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`,
    )
  }

  const { data, error } = await query
  if (error) throw new Error(`[waitlist.export] ${error.message}`)

  const headers = [
    'Email',
    'Name',
    'Role',
    'Company',
    'Revenue Range',
    'Source',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    'Country',
    'City',
    'Status',
    'Lead Score',
    'Invited At',
    'Signed Up',
  ]

  const escape = (v: unknown) => {
    if (v == null) return ''
    const s = String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
  }

  const rows = data.map((u) =>
    [
      u.email,
      u.full_name,
      u.role,
      u.company,
      u.revenue_range,
      u.source,
      u.utm_source,
      u.utm_medium,
      u.utm_campaign,
      u.country,
      u.city,
      u.status,
      u.lead_score,
      u.invited_at,
      u.created_at,
    ]
      .map(escape)
      .join(','),
  )

  return [headers.join(','), ...rows].join('\n')
}
