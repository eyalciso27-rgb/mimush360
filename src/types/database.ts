export type UserRole = 'admin' | 'editor' | 'viewer'

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'disqualified'
  | 'converted'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  slug: string
  title: string
  content: Record<string, unknown>
  is_published: boolean
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface Testimonial {
  id: string
  name: string
  content: string
  rating: number
  is_published: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  full_name: string | null
  phone: string | null
  email: string | null
  message: string | null
  source: string
  status: LeadStatus
  typeform_response_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  lead_notes?: LeadNote[]
}

export interface LeadNote {
  id: string
  lead_id: string
  content: string
  created_by: string
  created_at: string
  profile?: Pick<Profile, 'full_name' | 'email'>
}

export interface SiteSetting {
  id: string
  key: string
  value: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  profile?: Pick<Profile, 'full_name' | 'email'>
}

// Supabase Database type — matches @supabase/supabase-js v2 generic format
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: Page
        Insert: {
          id?: string
          slug: string
          title: string
          content?: Record<string, unknown>
          is_published?: boolean
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: Record<string, unknown>
          is_published?: boolean
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: Testimonial
        Insert: {
          id?: string
          name: string
          content: string
          rating?: number
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          content?: string
          rating?: number
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: Lead
        Insert: {
          id?: string
          full_name?: string | null
          phone?: string | null
          email?: string | null
          message?: string | null
          source?: string
          status?: LeadStatus
          typeform_response_id?: string | null
          metadata?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          email?: string | null
          message?: string | null
          source?: string
          status?: LeadStatus
          typeform_response_id?: string | null
          metadata?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_notes: {
        Row: Omit<LeadNote, 'profile'>
        Insert: {
          id?: string
          lead_id: string
          content: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          content?: string
          created_by?: string
          created_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: SiteSetting
        Insert: {
          id?: string
          key: string
          value?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: Omit<AuditLog, 'profile'>
        Insert: {
          id?: string
          user_id: string
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Record<string, unknown> | null
          created_at?: string
        }
        Update: Record<string, unknown>
        Relationships: []
      }
    }
    Views: Record<string, { Row: Record<string, unknown>; Relationships: [] }>
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>
    Enums: {
      user_role: UserRole
      lead_status: LeadStatus
    }
    CompositeTypes: Record<string, Record<string, unknown>>
  }
}
