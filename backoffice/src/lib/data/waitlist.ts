import type { WaitlistUser, WaitlistStatus } from "@/types/database";

import { createClient } from "@/lib/supabase/server";

export async function getWaitlistUsers(filters?: {
  status?: WaitlistStatus;
  search?: string;
}): Promise<WaitlistUser[]> {
  const supabase = await createClient();

  let query = supabase
    .from("waitlist")
    .select(
      "id, email, full_name, role, company, revenue_range, preferences, source, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term, country, city, status, lead_score, invited_at, notes, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as WaitlistUser[];
}

export async function getWaitlistStats() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("waitlist")
    .select("status, created_at");

  if (error) throw error;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const stats = {
    total: data.length,
    pending: 0,
    invited: 0,
    active: 0,
    unsubscribed: 0,
    this_week: 0,
  };

  for (const row of data) {
    const s = row.status as WaitlistStatus;
    if (s in stats) stats[s]++;
    if (new Date(row.created_at) >= weekAgo) stats.this_week++;
  }

  return stats;
}
