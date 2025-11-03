export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      blogs: {
        Row: {
          author_image_public_id: string | null
          author_image_url: string | null
          author_name: string | null
          author_profile_link: string | null
          body: Json | null
          category: string | null
          created_at: string
          featured_image_public_id: string | null
          featured_image_url: string | null
          id: string
          published_at: string | null
          read_time: number | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_image_public_id?: string | null
          author_image_url?: string | null
          author_name?: string | null
          author_profile_link?: string | null
          body?: Json | null
          category?: string | null
          created_at?: string
          featured_image_public_id?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          read_time?: number | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_image_public_id?: string | null
          author_image_url?: string | null
          author_name?: string | null
          author_profile_link?: string | null
          body?: Json | null
          category?: string | null
          created_at?: string
          featured_image_public_id?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          read_time?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          company_address: string | null
          company_description: string | null
          company_email: string
          company_name: string
          company_phone: string
          company_website: string | null
          created_at: string
          facebook_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          skype: string | null
          telegram: string | null
          twitter_url: string | null
          updated_at: string
          whatsapp: string | null
          youtube_url: string | null
        }
        Insert: {
          company_address?: string | null
          company_description?: string | null
          company_email: string
          company_name: string
          company_phone: string
          company_website?: string | null
          created_at?: string
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          skype?: string | null
          telegram?: string | null
          twitter_url?: string | null
          updated_at?: string
          whatsapp?: string | null
          youtube_url?: string | null
        }
        Update: {
          company_address?: string | null
          company_description?: string | null
          company_email?: string
          company_name?: string
          company_phone?: string
          company_website?: string | null
          created_at?: string
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          skype?: string | null
          telegram?: string | null
          twitter_url?: string | null
          updated_at?: string
          whatsapp?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      consultation_requests: {
        Row: {
          budget_range: string
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          message: string
          phone: string
          preferred_location: string
          type_of_inquiry: string
          updated_at: string
        }
        Insert: {
          budget_range?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          message?: string
          phone?: string
          preferred_location?: string
          type_of_inquiry?: string
          updated_at?: string
        }
        Update: {
          budget_range?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          message?: string
          phone?: string
          preferred_location?: string
          type_of_inquiry?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      property_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string | null
          name: string
          phone: string
          property_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          inquiry_type: string
          message?: string | null
          name: string
          phone: string
          property_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string | null
          name?: string
          phone?: string
          property_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          amenities: string[]
          area_unit: string
          area_value: number
          bathrooms: number
          bedrooms: number
          created_at: string
          description: string
          display_order: number
          features: string[]
          floor_number: number
          id: string
          is_deleted: boolean
          is_featured: boolean
          is_hot_property: boolean
          location: string
          parking_spaces: number
          price: number
          property_type: string
          status: string
          title: string
          updated_at: string
          view_count: number
          year_built: number
        }
        Insert: {
          amenities: string[]
          area_unit: string
          area_value: number
          bathrooms: number
          bedrooms: number
          created_at?: string
          description: string
          display_order: number
          features: string[]
          floor_number: number
          id?: string
          is_deleted?: boolean
          is_featured?: boolean
          is_hot_property?: boolean
          location: string
          parking_spaces: number
          price: number
          property_type: string
          status: string
          title: string
          updated_at?: string
          view_count: number
          year_built: number
        }
        Update: {
          amenities?: string[]
          area_unit?: string
          area_value?: number
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          description?: string
          display_order?: number
          features?: string[]
          floor_number?: number
          id?: string
          is_deleted?: boolean
          is_featured?: boolean
          is_hot_property?: boolean
          location?: string
          parking_spaces?: number
          price?: number
          property_type?: string
          status?: string
          title?: string
          updated_at?: string
          view_count?: number
          year_built?: number
        }
        Relationships: []
      }
      property_images: {
        Row: {
          created_at: string
          id: string
          image_alt: string
          image_url: string
          order: number
          property_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_alt: string
          image_url: string
          order: number
          property_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_alt?: string
          image_url?: string
          order?: number
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member_socials: {
        Row: {
          created_at: string
          id: string
          platform: string
          team_member_id: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          team_member_id: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          team_member_id?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_member"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member_statistics: {
        Row: {
          created_at: string
          experience: number
          id: string
          performance_rating: number
          properties_sold: number
          satisfied_clients: number
          team_member_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          experience?: number
          id?: string
          performance_rating?: number
          properties_sold?: number
          satisfied_clients?: number
          team_member_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          experience?: number
          id?: string
          performance_rating?: number
          properties_sold?: number
          satisfied_clients?: number
          team_member_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_member_statistics"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          email: string | null
          id: string
          image_public_id: string | null
          image_url: string | null
          is_active: boolean
          name: string
          personal_message: string | null
          phone: string | null
          slug: string
          specialization: string | null
          title: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order: number
          email?: string | null
          id?: string
          image_public_id?: string | null
          image_url?: string | null
          is_active?: boolean
          name: string
          personal_message?: string | null
          phone?: string | null
          slug?: string
          specialization?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          id?: string
          image_public_id?: string | null
          image_url?: string | null
          is_active?: boolean
          name?: string
          personal_message?: string | null
          phone?: string | null
          slug?: string
          specialization?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_section: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          image_url: string | null
          image_public_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          image_url?: string | null
          image_public_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          image_url?: string | null
          image_public_id?: string | null
          created_at?: string | null
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
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
