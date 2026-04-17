// ─────────────────────────────────────────────────────────────────────────────
// Auto-generated Supabase TypeScript types
// Project: anaqio-coming-soom (fslmfiqbhziayxxfsrpz)
// Generated: 2026-04-07
// Regenerate: bun run db:types
// ─────────────────────────────────────────────────────────────────────────────

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      atelier_invitations: {
        Row: {
          created_at: string
          email: string
          entity_name: string
          id: string
          invited_at: string | null
          notes: string | null
          referral_source: string | null
          revenue_range: string | null
          role: string
          source: string
          status: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email: string
          entity_name: string
          id?: string
          invited_at?: string | null
          notes?: string | null
          referral_source?: string | null
          revenue_range?: string | null
          role: string
          source?: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          entity_name?: string
          id?: string
          invited_at?: string | null
          notes?: string | null
          referral_source?: string | null
          revenue_range?: string | null
          role?: string
          source?: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          budget_mad: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean
          meta: Json
          name: string
          platform: string | null
          slug: string
          start_date: string | null
          target_audience: Json
          type: string
          updated_at: string
        }
        Insert: {
          budget_mad?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          meta?: Json
          name: string
          platform?: string | null
          slug: string
          start_date?: string | null
          target_audience?: Json
          type?: string
          updated_at?: string
        }
        Update: {
          budget_mad?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          meta?: Json
          name?: string
          platform?: string | null
          slug?: string
          start_date?: string | null
          target_audience?: Json
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          inquiry_type: string
          message: string
          referrer: string | null
          status: string
          subject: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          inquiry_type: string
          message: string
          referrer?: string | null
          status?: string
          subject: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          inquiry_type?: string
          message?: string
          referrer?: string | null
          status?: string
          subject?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      generations: {
        Row: {
          created_at: string
          error_message: string | null
          garment_path: string
          id: string
          inference_ms: number | null
          inference_provider: string | null
          metadata: Json | null
          output_path: string | null
          preset_model_id: string
          session_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          garment_path: string
          id?: string
          inference_ms?: number | null
          inference_provider?: string | null
          metadata?: Json | null
          output_path?: string | null
          preset_model_id: string
          session_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          garment_path?: string
          id?: string
          inference_ms?: number | null
          inference_provider?: string | null
          metadata?: Json | null
          output_path?: string | null
          preset_model_id?: string
          session_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'generations_preset_model_id_fkey'
            columns: ['preset_model_id']
            isOneToOne: false
            referencedRelation: 'preset_models'
            referencedColumns: ['id']
          },
        ]
      }
      preset_models: {
        Row: {
          active: boolean | null
          created_at: string
          gender: string | null
          id: string
          label: string
          label_ar: string | null
          preview_path: string
          sort_order: number | null
          style_tags: string[] | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          gender?: string | null
          id: string
          label: string
          label_ar?: string | null
          preview_path: string
          sort_order?: number | null
          style_tags?: string[] | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          gender?: string | null
          id?: string
          label?: string
          label_ar?: string | null
          preview_path?: string
          sort_order?: number | null
          style_tags?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          plan: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          plan?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          plan?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          invited_at: string | null
          lead_score: number
          notes: string | null
          preferences: Json
          referrer: string | null
          revenue_range: string | null
          role: string
          source: string
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          invited_at?: string | null
          lead_score?: number
          notes?: string | null
          preferences?: Json
          referrer?: string | null
          revenue_range?: string | null
          role?: string
          source?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          invited_at?: string | null
          lead_score?: number
          notes?: string | null
          preferences?: Json
          referrer?: string | null
          revenue_range?: string | null
          role?: string
          source?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      waitlist_campaign_attribution: {
        Row: {
          attributed_at: string
          campaign_id: string
          waitlist_id: string
        }
        Insert: {
          attributed_at?: string
          campaign_id: string
          waitlist_id: string
        }
        Update: {
          attributed_at?: string
          campaign_id?: string
          waitlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'waitlist_campaign_attribution_campaign_id_fkey'
            columns: ['campaign_id']
            isOneToOne: false
            referencedRelation: 'campaign_signup_stats'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'waitlist_campaign_attribution_campaign_id_fkey'
            columns: ['campaign_id']
            isOneToOne: false
            referencedRelation: 'campaigns'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'waitlist_campaign_attribution_waitlist_id_fkey'
            columns: ['waitlist_id']
            isOneToOne: false
            referencedRelation: 'waitlist'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      campaign_signup_stats: {
        Row: {
          avg_lead_score: number | null
          budget_mad: number | null
          end_date: string | null
          first_signup_at: string | null
          id: string | null
          is_active: boolean | null
          last_signup_at: string | null
          name: string | null
          platform: string | null
          signups_active: number | null
          signups_invited: number | null
          signups_total: number | null
          slug: string | null
          start_date: string | null
          type: string | null
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
