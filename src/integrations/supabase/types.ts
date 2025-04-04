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
      energy_data: {
        Row: {
          created_at: string
          electricity_surplus: number
          end_date: string
          grid_consumption: number
          id: string
          self_consumed_energy: number
          solar_production: number
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          electricity_surplus: number
          end_date: string
          grid_consumption: number
          id?: string
          self_consumed_energy: number
          solar_production: number
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          electricity_surplus?: number
          end_date?: string
          grid_consumption?: number
          id?: string
          self_consumed_energy?: number
          solar_production?: number
          start_date?: string
          user_id?: string
        }
        Relationships: []
      }
      "kidcash-children": {
        Row: {
          allowance: number | null
          birthdate: string
          created_at: string | null
          email: string | null
          family_id: string
          id: string
          name: string
          photo_url: string | null
        }
        Insert: {
          allowance?: number | null
          birthdate: string
          created_at?: string | null
          email?: string | null
          family_id: string
          id?: string
          name: string
          photo_url?: string | null
        }
        Update: {
          allowance?: number | null
          birthdate?: string
          created_at?: string | null
          email?: string | null
          family_id?: string
          id?: string
          name?: string
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kidcash-children_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "kidcash-families"
            referencedColumns: ["id"]
          },
        ]
      }
      "kidcash-families": {
        Row: {
          created_at: string | null
          id: string
          name: string
          notifications_enabled: boolean
          owner_id: string
          payment_day: string
          periodicity: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          notifications_enabled?: boolean
          owner_id: string
          payment_day: string
          periodicity: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          notifications_enabled?: boolean
          owner_id?: string
          payment_day?: string
          periodicity?: string
        }
        Relationships: []
      }
      "kidcash-payment-history": {
        Row: {
          amount: number
          child_id: string
          created_at: string | null
          id: string
          notes: string | null
          payment_date: string
        }
        Insert: {
          amount: number
          child_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
        }
        Update: {
          amount?: number
          child_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "kidcash-payment-history_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "kidcash-children"
            referencedColumns: ["id"]
          },
        ]
      }
      "kidcash-payments": {
        Row: {
          amount: number
          child_id: string
          created_at: string | null
          id: string
          notes: string | null
          payment_date: string
          type: string
        }
        Insert: {
          amount: number
          child_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          type?: string
        }
        Update: {
          amount?: number
          child_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "kidcash-payments_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "kidcash-children"
            referencedColumns: ["id"]
          },
        ]
      }
      "kidcash-tasks": {
        Row: {
          amount: number
          archived_date: string | null
          assigned_to: string
          closed_date: string | null
          completed_date: string | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          recurring: string | null
          recurring_days: string[] | null
          recurring_frequency: number | null
          status: string
          title: string
        }
        Insert: {
          amount: number
          archived_date?: string | null
          assigned_to: string
          closed_date?: string | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          recurring?: string | null
          recurring_days?: string[] | null
          recurring_frequency?: number | null
          status?: string
          title: string
        }
        Update: {
          amount?: number
          archived_date?: string | null
          assigned_to?: string
          closed_date?: string | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          recurring?: string | null
          recurring_days?: string[] | null
          recurring_frequency?: number | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "kidcash-tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "kidcash-children"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          created_at: string | null
          day_of_week: string
          id: string
          meal_type: string
          recipe_id: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: string
          id?: string
          meal_type: string
          recipe_id: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: string
          id?: string
          meal_type?: string
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menus_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      module_data: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          module_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          module_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          module_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_data_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          config: Json | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          route: string | null
          title: string
          type: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          route?: string | null
          title: string
          type?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          route?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      recipes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          imageUrl: string | null
          ingredients: Json | null
          nutriScore: string | null
          nutritionalValues: Json | null
          preparationSteps: Json | null
          prepTime: string | null
          tags: string[] | null
          title: string
          totalTime: string | null
          utensils: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          imageUrl?: string | null
          ingredients?: Json | null
          nutriScore?: string | null
          nutritionalValues?: Json | null
          preparationSteps?: Json | null
          prepTime?: string | null
          tags?: string[] | null
          title: string
          totalTime?: string | null
          utensils?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          imageUrl?: string | null
          ingredients?: Json | null
          nutriScore?: string | null
          nutritionalValues?: Json | null
          preparationSteps?: Json | null
          prepTime?: string | null
          tags?: string[] | null
          title?: string
          totalTime?: string | null
          utensils?: Json | null
        }
        Relationships: []
      }
      user_modules: {
        Row: {
          created_at: string
          id: string
          module_id: string
          position: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          module_id: string
          position?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          module_id?: string
          position?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_modules_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          photo_url: string | null
          role: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          photo_url?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          photo_url?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      shopping_list: {
        Row: {
          ingredient_name: string | null
          quantities: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      user_has_role: {
        Args: {
          required_role: Database["public"]["Enums"]["famileezy_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      famileezy_role: "admin" | "premium" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
