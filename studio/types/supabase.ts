// Placeholder — regenerate with: npm run db:types
// Run after applying migrations to get the real types.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          plan: string
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          plan?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          plan?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      preset_models: {
        Row: {
          id: string
          created_at: string
          label: string
          label_ar: string | null
          preview_path: string
          gender: string | null
          style_tags: string[]
          active: boolean
          sort_order: number
        }
        Insert: {
          id: string
          created_at?: string
          label: string
          label_ar?: string | null
          preview_path: string
          gender?: string | null
          style_tags?: string[]
          active?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          label?: string
          label_ar?: string | null
          preview_path?: string
          gender?: string | null
          style_tags?: string[]
          active?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      generations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string | null
          session_id: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          garment_path: string
          preset_model_id: string
          output_path: string | null
          inference_provider: 'hf_spaces' | 'fal_ai'
          inference_ms: number | null
          error_message: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          session_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          garment_path: string
          preset_model_id: string
          output_path?: string | null
          inference_provider?: 'hf_spaces' | 'fal_ai'
          inference_ms?: number | null
          error_message?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          session_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          garment_path?: string
          preset_model_id?: string
          output_path?: string | null
          inference_provider?: 'hf_spaces' | 'fal_ai'
          inference_ms?: number | null
          error_message?: string | null
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: 'generations_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'generations_preset_model_id_fkey'
            columns: ['preset_model_id']
            isOneToOne: false
            referencedRelation: 'preset_models'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
