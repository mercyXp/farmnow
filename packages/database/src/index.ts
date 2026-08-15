export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Fk<Col extends string, Table extends string> = {
  foreignKeyName: string;
  columns: [Col];
  isOneToOne: false;
  referencedRelation: Table;
  referencedColumns: ["id"];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          full_name: string;
          role: Database["public"]["Enums"]["app_role"];
          is_active: boolean;
          must_change_password: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          full_name?: string;
          role?: Database["public"]["Enums"]["app_role"];
          is_active?: boolean;
          must_change_password?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      settings: {
        Row: { key: string; value: string; updated_at: string };
        Insert: { key: string; value: string; updated_at?: string };
        Update: { key?: string; value?: string; updated_at?: string };
        Relationships: [];
      };
      lookup_options: {
        Row: { id: string; list_name: string; value: string; sort_order: number };
        Insert: { id?: string; list_name: string; value: string; sort_order?: number };
        Update: Partial<Database["public"]["Tables"]["lookup_options"]["Insert"]>;
        Relationships: [];
      };
      houses: {
        Row: {
          id: string;
          code: string;
          capacity: number;
          location_zone: string;
          status: "Active" | "Inactive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          capacity: number;
          location_zone: string;
          status: "Active" | "Inactive";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["houses"]["Insert"]>;
        Relationships: [];
      };
      breeds: {
        Row: {
          id: string;
          name: string;
          standard_fcr: number;
          standard_adg_g: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          standard_fcr: number;
          standard_adg_g: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["breeds"]["Insert"]>;
        Relationships: [];
      };
      feed_types: {
        Row: {
          id: string;
          name: string;
          stage: string;
          unit_cost_per_kg: number;
          standard_bag_weight_kg: number;
          min_stock_kg: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          stage: string;
          unit_cost_per_kg: number;
          standard_bag_weight_kg: number;
          min_stock_kg: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["feed_types"]["Insert"]>;
        Relationships: [];
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          contact: string | null;
          email: string | null;
          category: string;
          lead_time_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact?: string | null;
          email?: string | null;
          category: string;
          lead_time_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["suppliers"]["Insert"]>;
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          name: string;
          contact: string | null;
          address: string | null;
          price_tier: string;
          payment_terms: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact?: string | null;
          address?: string | null;
          price_tier: string;
          payment_terms: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          type: string;
          dosage_unit: string;
          withdrawal_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          dosage_unit: string;
          withdrawal_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      employees: {
        Row: {
          id: string;
          name: string;
          position: string;
          contact_number: string | null;
          nrc: string | null;
          date_hired: string | null;
          salary_zmw: number | null;
          status: "Active" | "Inactive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          position: string;
          contact_number?: string | null;
          nrc?: string | null;
          date_hired?: string | null;
          salary_zmw?: number | null;
          status: "Active" | "Inactive";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["employees"]["Insert"]>;
        Relationships: [];
      };
      flocks: {
        Row: {
          id: string;
          code: string;
          house_id: string;
          breed_id: string;
          supplier_id: string;
          placed_date: string;
          initial_bird_count: number;
          expected_dispatch_date: string;
          status: "Active" | "Closed";
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code?: string;
          house_id: string;
          breed_id: string;
          supplier_id: string;
          placed_date: string;
          initial_bird_count: number;
          expected_dispatch_date: string;
          status?: "Active" | "Closed";
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["flocks"]["Insert"]>;
        Relationships: [
          Fk<"house_id", "houses">,
          Fk<"breed_id", "breeds">,
          Fk<"supplier_id", "suppliers">,
        ];
      };
      mortality_entries: {
        Row: {
          id: string;
          code: string;
          flock_id: string;
          entry_date: string;
          mortality_count: number;
          cause: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code?: string;
          flock_id: string;
          entry_date: string;
          mortality_count: number;
          cause: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["mortality_entries"]["Insert"]>;
        Relationships: [Fk<"flock_id", "flocks">];
      };
      feed_consumption: {
        Row: {
          id: string;
          code: string;
          flock_id: string;
          feed_type_id: string;
          entry_date: string;
          kg_used: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code?: string;
          flock_id: string;
          feed_type_id: string;
          entry_date: string;
          kg_used: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["feed_consumption"]["Insert"]>;
        Relationships: [Fk<"flock_id", "flocks">, Fk<"feed_type_id", "feed_types">];
      };
      feed_purchases: {
        Row: {
          id: string;
          code: string;
          purchase_date: string;
          supplier_id: string;
          feed_type_id: string;
          number_of_bags: number;
          bag_weight_kg: number;
          unit_cost_per_bag: number;
          invoice_no: string;
          payment_method: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code?: string;
          purchase_date: string;
          supplier_id: string;
          feed_type_id: string;
          number_of_bags: number;
          bag_weight_kg: number;
          unit_cost_per_bag: number;
          invoice_no: string;
          payment_method: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["feed_purchases"]["Insert"]>;
        Relationships: [Fk<"supplier_id", "suppliers">, Fk<"feed_type_id", "feed_types">];
      };
      weekly_weights: {
        Row: {
          id: string;
          code: string;
          flock_id: string;
          entry_date: string;
          week_no: number;
          sample_size: number;
          avg_body_weight_g: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code?: string;
          flock_id: string;
          entry_date: string;
          week_no: number;
          sample_size: number;
          avg_body_weight_g: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["weekly_weights"]["Insert"]>;
        Relationships: [Fk<"flock_id", "flocks">];
      };
      health_entries: {
        Row: {
          id: string;
          code: string;
          flock_id: string;
          product_id: string;
          entry_date: string;
          dosage_given: string;
          route: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code?: string;
          flock_id: string;
          product_id: string;
          entry_date: string;
          dosage_given: string;
          route: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["health_entries"]["Insert"]>;
        Relationships: [Fk<"flock_id", "flocks">, Fk<"product_id", "products">];
      };
      medicine_lots: {
        Row: {
          id: string;
          code: string;
          flock_id: string;
          product_id: string;
          supplier_id: string;
          lot_number: string;
          expiry_date: string;
          quantity_received: number;
          quantity_used: number;
          unit_cost: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code?: string;
          flock_id: string;
          product_id: string;
          supplier_id: string;
          lot_number: string;
          expiry_date: string;
          quantity_received: number;
          quantity_used?: number;
          unit_cost: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["medicine_lots"]["Insert"]>;
        Relationships: [Fk<"flock_id", "flocks">, Fk<"product_id", "products">, Fk<"supplier_id", "suppliers">];
      };
      sales: {
        Row: {
          id: string;
          code: string;
          flock_id: string;
          customer_id: string;
          entry_date: string;
          birds_dispatched: number;
          live_weight_kg: number;
          price_per_kg: number;
          price_per_bird: number;
          transport_cost: number;
          amount_paid: number;
          invoice_no: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code?: string;
          flock_id: string;
          customer_id: string;
          entry_date: string;
          birds_dispatched: number;
          live_weight_kg: number;
          price_per_kg: number;
          price_per_bird?: number;
          transport_cost?: number;
          amount_paid?: number;
          invoice_no: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sales"]["Insert"]>;
        Relationships: [Fk<"flock_id", "flocks">, Fk<"customer_id", "customers">];
      };
      expenses: {
        Row: {
          id: string;
          code: string;
          flock_id: string | null;
          supplier_id: string | null;
          entry_date: string;
          category: string;
          quantity: number;
          unit_cost: number;
          payment_method: string;
          payment_ref: string;
          approved_by: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code?: string;
          flock_id?: string | null;
          supplier_id?: string | null;
          entry_date: string;
          category: string;
          quantity: number;
          unit_cost: number;
          payment_method: string;
          payment_ref?: string;
          approved_by?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["expenses"]["Insert"]>;
        Relationships: [Fk<"flock_id", "flocks">, Fk<"supplier_id", "suppliers">];
      };
      other_income: {
        Row: {
          id: string;
          code: string;
          entry_date: string;
          source: string;
          description: string;
          amount: number;
          payment_method: string;
          received_by: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code?: string;
          entry_date: string;
          source: string;
          description: string;
          amount: number;
          payment_method: string;
          received_by: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["other_income"]["Insert"]>;
        Relationships: [];
      };
      environment_readings: {
        Row: {
          id: string;
          code: string;
          house_id: string;
          entry_date: string;
          reading_time: string;
          temperature_c: number;
          humidity_pct: number;
          ammonia_ppm: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code?: string;
          house_id: string;
          entry_date: string;
          reading_time: string;
          temperature_c: number;
          humidity_pct: number;
          ammonia_ppm: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["environment_readings"]["Insert"]>;
        Relationships: [Fk<"house_id", "houses">];
      };
      daily_routines: {
        Row: {
          id: string;
          code: string;
          flock_id: string;
          employee_id: string | null;
          entry_date: string;
          temperature_c: number;
          humidity_pct: number;
          water_available: "Yes" | "No";
          feed_available: "Yes" | "No";
          drinkers_cleaned: "Yes" | "No";
          litter_condition: string;
          ventilation: string;
          sick_birds_observed: number;
          notes: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code?: string;
          flock_id: string;
          employee_id?: string | null;
          entry_date: string;
          temperature_c: number;
          humidity_pct: number;
          water_available: "Yes" | "No";
          feed_available: "Yes" | "No";
          drinkers_cleaned: "Yes" | "No";
          litter_condition: string;
          ventilation: string;
          sick_birds_observed?: number;
          notes?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["daily_routines"]["Insert"]>;
        Relationships: [Fk<"flock_id", "flocks">, Fk<"employee_id", "employees">];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          old_data: Json | null;
          new_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
      generated_reports: {
        Row: {
          id: string;
          report_type: "flock" | "mortality" | "financial";
          flock_id: string | null;
          storage_path: string;
          file_name: string;
          generated_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_type: "flock" | "mortality" | "financial";
          flock_id?: string | null;
          storage_path: string;
          file_name: string;
          generated_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["generated_reports"]["Insert"]>;
        Relationships: [Fk<"flock_id", "flocks">];
      };
      entry_counters: {
        Row: { prefix: string; last_value: number };
        Insert: { prefix: string; last_value?: number };
        Update: { prefix?: string; last_value?: number };
        Relationships: [];
      };
    };
    Views: {
      v_flock_kpis: {
        Row: {
          flock_id: string;
          flock_code: string;
          house_code: string;
          breed_name: string;
          standard_fcr: number;
          standard_adg_g: number;
          placed_date: string;
          status: "Active" | "Closed";
          days_on_farm: number;
          initial_birds: number;
          total_mortality: number;
          current_birds: number;
          remaining_birds: number;
          livability_pct: number;
          total_feed_kg: number;
          total_feed_cost: number;
          latest_weight_date: string | null;
          latest_avg_weight_g: number;
          fcr: number;
          adg_g: number;
          total_expenses: number;
          medicine_cost: number;
          total_sales_value: number;
          birds_sold: number;
          cost_per_bird: number;
          cost_per_kg: number;
          estimated_profit: number;
          breakeven_price_per_bird: number;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      v_feed_stock: {
        Row: {
          feed_type_id: string;
          feed_name: string;
          opening_kg: number;
          purchased_kg: number;
          used_kg: number;
          balance_kg: number;
          min_stock_kg: number;
          alert: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      v_medicine_lots: {
        Row: Database["public"]["Tables"]["medicine_lots"]["Row"] & {
          balance: number;
          total_cost: number;
          expiry_status: "EXPIRED" | "EXPIRING SOON" | "OK";
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
    };
    Functions: {
      next_entry_code: { Args: { p_prefix: string }; Returns: string };
      flock_remaining: {
        Args: { p_flock_id: string; p_exclude_mortality?: string | null; p_exclude_sale?: string | null };
        Returns: number;
      };
      app_role: { Args: Record<PropertyKey, never>; Returns: Database["public"]["Enums"]["app_role"] };
      is_app_user: { Args: Record<PropertyKey, never>; Returns: boolean };
      role_in: { Args: { roles: Database["public"]["Enums"]["app_role"][] }; Returns: boolean };
      clear_must_change_password: { Args: Record<PropertyKey, never>; Returns: undefined };
    };
    Enums: {
      app_role: "superadmin" | "admin" | "manager" | "supervisor" | "accountant" | "entry_clerk";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type Views<T extends keyof Database["public"]["Views"]> = Database["public"]["Views"][T]["Row"];
export type FlockKpi = Database["public"]["Views"]["v_flock_kpis"]["Row"];
export type FeedStock = Database["public"]["Views"]["v_feed_stock"]["Row"];
