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
      bookings: {
        Row: {
          booking_date: string | null
          created_at: string | null
          id: string
          package_id: string | null
          passengers: number
          status: string | null
          total_price: number
          user_id: string | null
        }
        Insert: {
          booking_date?: string | null
          created_at?: string | null
          id?: string
          package_id?: string | null
          passengers: number
          status?: string | null
          total_price: number
          user_id?: string | null
        }
        Update: {
          booking_date?: string | null
          created_at?: string | null
          id?: string
          package_id?: string | null
          passengers?: number
          status?: string | null
          total_price?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "travel_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          id: string
          max_uses: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          max_uses?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          max_uses?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          base_price: number
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          event_type: string
          id: string
          image_url: string | null
          location: string
          max_price: number | null
          name: string
          start_date: string
        }
        Insert: {
          base_price: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          event_type: string
          id?: string
          image_url?: string | null
          location: string
          max_price?: number | null
          name: string
          start_date: string
        }
        Update: {
          base_price?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          event_type?: string
          id?: string
          image_url?: string | null
          location?: string
          max_price?: number | null
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      flights: {
        Row: {
          aircraft_type: string | null
          airline: string
          arrival_city: string
          arrival_time: string
          available_seats: number
          base_price: number
          created_at: string | null
          departure_city: string
          departure_time: string
          flight_number: string
          id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aircraft_type?: string | null
          airline: string
          arrival_city: string
          arrival_time: string
          available_seats: number
          base_price: number
          created_at?: string | null
          departure_city: string
          departure_time: string
          flight_number: string
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aircraft_type?: string | null
          airline?: string
          arrival_city?: string
          arrival_time?: string
          available_seats?: number
          base_price?: number
          created_at?: string | null
          departure_city?: string
          departure_time?: string
          flight_number?: string
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      movie_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      movies: {
        Row: {
          base_price: number
          category_id: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          image_url: string | null
          language_id: string | null
          rating: number | null
          release_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          base_price: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          image_url?: string | null
          language_id?: string | null
          rating?: number | null
          release_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          image_url?: string | null
          language_id?: string | null
          rating?: number | null
          release_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movies_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "movie_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movies_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          created_at: string | null
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          id: string
          image_url: string | null
          title: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          title: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          title?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      payment_details: {
        Row: {
          account_last_four: string | null
          bank_name: string | null
          card_brand: string | null
          card_expiry: string | null
          card_last_four: string | null
          created_at: string | null
          id: string
          ifsc_code: string | null
          method_type: Database["public"]["Enums"]["payment_method_type"]
          payment_id: string | null
          transaction_reference: string | null
          updated_at: string | null
          upi_id: string | null
        }
        Insert: {
          account_last_four?: string | null
          bank_name?: string | null
          card_brand?: string | null
          card_expiry?: string | null
          card_last_four?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          method_type: Database["public"]["Enums"]["payment_method_type"]
          payment_id?: string | null
          transaction_reference?: string | null
          updated_at?: string | null
          upi_id?: string | null
        }
        Update: {
          account_last_four?: string | null
          bank_name?: string | null
          card_brand?: string | null
          card_expiry?: string | null
          card_last_four?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          method_type?: Database["public"]["Enums"]["payment_method_type"]
          payment_id?: string | null
          transaction_reference?: string | null
          updated_at?: string | null
          upi_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_details_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          id: string
          payment_date: string | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          receipt_url: string | null
          ticket_url: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          receipt_url?: string | null
          ticket_url?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          receipt_url?: string | null
          ticket_url?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "unified_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          date_of_birth: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          date_of_birth?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          item_id: string
          item_type: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          item_id: string
          item_type: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      seats: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          price: number
          seat_number: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          price: number
          seat_number: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          price?: number
          seat_number?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seats_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_bookings: {
        Row: {
          booking_date: string | null
          created_at: string | null
          discount_amount: number | null
          event_id: string | null
          id: string
          payment_status: string | null
          promo_code: string | null
          seat_id: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_date?: string | null
          created_at?: string | null
          discount_amount?: number | null
          event_id?: string | null
          id?: string
          payment_status?: string | null
          promo_code?: string | null
          seat_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_date?: string | null
          created_at?: string | null
          discount_amount?: number | null
          event_id?: string | null
          id?: string
          payment_status?: string | null
          promo_code?: string | null
          seat_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_bookings_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "seats"
            referencedColumns: ["id"]
          },
        ]
      }
      train_routes: {
        Row: {
          arrival_station: string
          arrival_time: string
          available_seats: number
          base_price: number
          created_at: string | null
          departure_station: string
          departure_time: string
          id: string
          status: string | null
          train_name: string
          train_number: string
          train_type: string
          updated_at: string | null
        }
        Insert: {
          arrival_station: string
          arrival_time: string
          available_seats: number
          base_price: number
          created_at?: string | null
          departure_station: string
          departure_time: string
          id?: string
          status?: string | null
          train_name: string
          train_number: string
          train_type: string
          updated_at?: string | null
        }
        Update: {
          arrival_station?: string
          arrival_time?: string
          available_seats?: number
          base_price?: number
          created_at?: string | null
          departure_station?: string
          departure_time?: string
          id?: string
          status?: string | null
          train_name?: string
          train_number?: string
          train_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      travel_packages: {
        Row: {
          active: boolean | null
          created_at: string | null
          created_by: string | null
          description: string
          destination: string
          end_date: string
          id: string
          image_url: string | null
          price: number
          start_date: string
          updated_at: string | null
          vijayawada: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description: string
          destination: string
          end_date: string
          id?: string
          image_url?: string | null
          price: number
          start_date: string
          updated_at?: string | null
          vijayawada?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          destination?: string
          end_date?: string
          id?: string
          image_url?: string | null
          price?: number
          start_date?: string
          updated_at?: string | null
          vijayawada?: string | null
        }
        Relationships: []
      }
      unified_bookings: {
        Row: {
          booking_date: string | null
          booking_type: string
          created_at: string | null
          id: string
          item_id: string
          seat_number: string | null
          ticket_status: Database["public"]["Enums"]["ticket_status"] | null
          total_amount: number
          travel_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_date?: string | null
          booking_type: string
          created_at?: string | null
          id?: string
          item_id: string
          seat_number?: string | null
          ticket_status?: Database["public"]["Enums"]["ticket_status"] | null
          total_amount: number
          travel_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_date?: string | null
          booking_type?: string
          created_at?: string | null
          id?: string
          item_id?: string
          seat_number?: string | null
          ticket_status?: Database["public"]["Enums"]["ticket_status"] | null
          total_amount?: number
          travel_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          item_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          item_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string | null
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
      booking_status: "pending" | "confirmed" | "cancelled" | "failed"
      payment_method_type:
        | "upi"
        | "credit_card"
        | "debit_card"
        | "bank_transfer"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      ticket_status: "booked" | "cancelled" | "completed" | "expired"
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
