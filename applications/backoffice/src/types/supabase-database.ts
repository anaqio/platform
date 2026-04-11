// ─────────────────────────────────────────────────────────────────────────────
// Supabase TypeScript types for backoffice
// Project: anaqio-platform (consolidated multi-schema)
// Schemas: landing (waitlist, campaigns, events), public (views)
// Generated: 2026-04-10
// Regenerate: supabase gen types typescript --project-id anaqio-platform --schema landing --schema public
// ─────────────────────────────────────────────────────────────────────────────

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '17.2'
  }
  landing: {
    Tables: {
      waitlist: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          company: string | null
          revenue_range: string | null
          preferences: Json
          source: string
          referrer: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_term: string | null
          country: string | null
          city: string | null
          status: string
          lead_score: number
          invited_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: string
          company?: string | null
          revenue_range?: string | null
          preferences?: Json
          source?: string
          referrer?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          country?: string | null
          city?: string | null
          status?: string
          lead_score?: number
          invited_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          company?: string | null
          revenue_range?: string | null
          preferences?: Json
          source?: string
          referrer?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          country?: string | null
          city?: string | null
          status?: string
          lead_score?: number
          invited_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          type: string
          platform: string | null
          start_date: string | null
          end_date: string | null
          budget_mad: number | null
          target_audience: Json
          meta: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          type?: string
          platform?: string | null
          start_date?: string | null
          end_date?: string | null
          budget_mad?: number | null
          target_audience?: Json
          meta?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          type?: string
          platform?: string | null
          start_date?: string | null
          end_date?: string | null
          budget_mad?: number | null
          target_audience?: Json
          meta?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      waitlist_campaign_attribution: {
        Row: {
          waitlist_id: string
          campaign_id: string
          attributed_at: string
        }
        Insert: {
          waitlist_id: string
          campaign_id: string
          attributed_at?: string
        }
        Update: {
          waitlist_id?: string
          campaign_id?: string
          attributed_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          type: string
          venue: string | null
          city: string | null
          country: string
          start_at: string | null
          end_at: string | null
          capacity: number | null
          registration_url: string | null
          campaign_id: string | null
          is_active: boolean
          meta: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          type?: string
          venue?: string | null
          city?: string | null
          country?: string
          start_at?: string | null
          end_at?: string | null
          capacity?: number | null
          registration_url?: string | null
          campaign_id?: string | null
          is_active?: boolean
          meta?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          type?: string
          venue?: string | null
          city?: string | null
          country?: string
          start_at?: string | null
          end_at?: string | null
          capacity?: number | null
          registration_url?: string | null
          campaign_id?: string | null
          is_active?: boolean
          meta?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_overview: {
        Row: {
          id: string | null
          email: string | null
          full_name: string | null
          studio_user_id: string | null
          studio_plan: string | null
          studio_joined_at: string | null
          waitlist_id: string | null
          waitlist_status: string | null
          waitlist_role: string | null
          company: string | null
          lead_score: number | null
          utm_source: string | null
          utm_campaign: string | null
          waitlist_joined_at: string | null
        }
      }
      campaign_signup_stats: {
        Row: {
          id: string | null
          name: string | null
          slug: string | null
          type: string | null
          platform: string | null
          is_active: boolean | null
          budget_mad: number | null
          start_date: string | null
          end_date: string | null
          signups_total: number | null
          signups_invited: number | null
          signups_active: number | null
          avg_lead_score: number | null
          first_signup_at: string | null
          last_signup_at: string | null
        }
      }
      generation_stats: {
        Row: {
          user_id: string | null
          email: string | null
          plan: string | null
          total_generations: number | null
          completed: number | null
          failed: number | null
          avg_inference_ms: number | null
          last_generation_at: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
