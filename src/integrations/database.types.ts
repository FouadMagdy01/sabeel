export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      challenges: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          description_ar: string | null;
          end_date: string;
          id: string;
          is_active: boolean | null;
          points: number;
          start_date: string;
          title: string;
          title_ar: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          description_ar?: string | null;
          end_date: string;
          id?: string;
          is_active?: boolean | null;
          points?: number;
          start_date: string;
          title: string;
          title_ar?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          description_ar?: string | null;
          end_date?: string;
          id?: string;
          is_active?: boolean | null;
          points?: number;
          start_date?: string;
          title?: string;
          title_ar?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      countries: {
        Row: {
          code: string;
          created_at: string;
          flag: string;
          id: string;
          name_ar: string;
          name_en: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          flag: string;
          id?: string;
          name_ar: string;
          name_en: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          flag?: string;
          id?: string;
          name_ar?: string;
          name_en?: string;
        };
        Relationships: [];
      };
      favorite_suras: {
        Row: {
          api_url: string | null;
          arabic_name: string | null;
          created_at: string;
          english_name: string | null;
          id: string;
          sura_number: number;
          user_id: string;
        };
        Insert: {
          api_url?: string | null;
          arabic_name?: string | null;
          created_at?: string;
          english_name?: string | null;
          id?: string;
          sura_number: number;
          user_id: string;
        };
        Update: {
          api_url?: string | null;
          arabic_name?: string | null;
          created_at?: string;
          english_name?: string | null;
          id?: string;
          sura_number?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      fcm_tokens: {
        Row: {
          created_at: string;
          device_info: Json | null;
          id: string;
          token: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          device_info?: Json | null;
          id?: string;
          token: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          device_info?: Json | null;
          id?: string;
          token?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      group_members: {
        Row: {
          group_id: string;
          id: string;
          is_admin: boolean | null;
          joined_at: string;
          role: string;
          user_id: string;
        };
        Insert: {
          group_id: string;
          id?: string;
          is_admin?: boolean | null;
          joined_at?: string;
          role?: string;
          user_id: string;
        };
        Update: {
          group_id?: string;
          id?: string;
          is_admin?: boolean | null;
          joined_at?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'group_members_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
        ];
      };
      group_points_config: {
        Row: {
          created_at: string;
          group_id: string;
          id: string;
          key: string;
          points: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          group_id: string;
          id?: string;
          key: string;
          points?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          group_id?: string;
          id?: string;
          key?: string;
          points?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'group_points_config_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
        ];
      };
      group_streaks: {
        Row: {
          created_at: string;
          current_streak: number;
          group_id: string;
          id: string;
          last_completion_date: string | null;
          longest_streak: number;
          streak_requirements: Json | null;
          total_points: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_streak?: number;
          group_id: string;
          id?: string;
          last_completion_date?: string | null;
          longest_streak?: number;
          streak_requirements?: Json | null;
          total_points?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_streak?: number;
          group_id?: string;
          id?: string;
          last_completion_date?: string | null;
          longest_streak?: number;
          streak_requirements?: Json | null;
          total_points?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'group_streaks_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
        ];
      };
      group_todo_completions: {
        Row: {
          completed_at: string;
          completion_date: string;
          group_id: string;
          id: string;
          points_earned: number;
          todo_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          completion_date?: string;
          group_id: string;
          id?: string;
          points_earned?: number;
          todo_id: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          completion_date?: string;
          group_id?: string;
          id?: string;
          points_earned?: number;
          todo_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'group_todo_completions_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_todo_completions_todo_id_fkey';
            columns: ['todo_id'];
            isOneToOne: false;
            referencedRelation: 'group_todos';
            referencedColumns: ['id'];
          },
        ];
      };
      group_todos: {
        Row: {
          created_at: string;
          created_by: string | null;
          custom_points: number;
          description: string | null;
          description_ar: string | null;
          group_id: string;
          id: string;
          is_active: boolean | null;
          title: string;
          title_ar: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          custom_points?: number;
          description?: string | null;
          description_ar?: string | null;
          group_id: string;
          id?: string;
          is_active?: boolean | null;
          title: string;
          title_ar?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          custom_points?: number;
          description?: string | null;
          description_ar?: string | null;
          group_id?: string;
          id?: string;
          is_active?: boolean | null;
          title?: string;
          title_ar?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'group_todos_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
        ];
      };
      groups: {
        Row: {
          country: string | null;
          created_at: string;
          created_by: string;
          description: string | null;
          id: string;
          invite_code: string | null;
          is_public: boolean | null;
          name: string;
          updated_at: string;
        };
        Insert: {
          country?: string | null;
          created_at?: string;
          created_by: string;
          description?: string | null;
          id?: string;
          invite_code?: string | null;
          is_public?: boolean | null;
          name: string;
          updated_at?: string;
        };
        Update: {
          country?: string | null;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          id?: string;
          invite_code?: string | null;
          is_public?: boolean | null;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      milestone_config: {
        Row: {
          bonus_points: number;
          created_at: string;
          days: number;
          id: string;
          label: string | null;
          label_ar: string | null;
          updated_at: string;
        };
        Insert: {
          bonus_points?: number;
          created_at?: string;
          days: number;
          id?: string;
          label?: string | null;
          label_ar?: string | null;
          updated_at?: string;
        };
        Update: {
          bonus_points?: number;
          created_at?: string;
          days?: number;
          id?: string;
          label?: string | null;
          label_ar?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      otp_codes: {
        Row: {
          code: string;
          created_at: string;
          email: string;
          expires_at: string;
          failed_attempts: number;
          id: string;
          new_email: string | null;
          type: string;
          verified: boolean;
        };
        Insert: {
          code: string;
          created_at?: string;
          email: string;
          expires_at: string;
          failed_attempts?: number;
          id?: string;
          new_email?: string | null;
          type: string;
          verified?: boolean;
        };
        Update: {
          code?: string;
          created_at?: string;
          email?: string;
          expires_at?: string;
          failed_attempts?: number;
          id?: string;
          new_email?: string | null;
          type?: string;
          verified?: boolean;
        };
        Relationships: [];
      };
      points_config: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          key: string;
          label: string;
          label_ar: string | null;
          points: number;
          updated_at: string;
        };
        Insert: {
          category?: string;
          created_at?: string;
          id?: string;
          key: string;
          label: string;
          label_ar?: string | null;
          points?: number;
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          key?: string;
          label?: string;
          label_ar?: string | null;
          points?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          age: number | null;
          avatar_url: string | null;
          country: string | null;
          created_at: string;
          date_of_birth: string | null;
          display_name: string;
          email: string | null;
          first_name: string | null;
          guest_created_at: string | null;
          id: string;
          is_guest: boolean | null;
          last_name: string | null;
          timezone: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          age?: number | null;
          avatar_url?: string | null;
          country?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          display_name: string;
          email?: string | null;
          first_name?: string | null;
          guest_created_at?: string | null;
          id?: string;
          is_guest?: boolean | null;
          last_name?: string | null;
          timezone?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          age?: number | null;
          avatar_url?: string | null;
          country?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          display_name?: string;
          email?: string | null;
          first_name?: string | null;
          guest_created_at?: string | null;
          id?: string;
          is_guest?: boolean | null;
          last_name?: string | null;
          timezone?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      report_attachments: {
        Row: {
          created_at: string;
          file_name: string | null;
          file_type: string | null;
          file_url: string;
          id: string;
          report_id: string;
        };
        Insert: {
          created_at?: string;
          file_name?: string | null;
          file_type?: string | null;
          file_url: string;
          id?: string;
          report_id: string;
        };
        Update: {
          created_at?: string;
          file_name?: string | null;
          file_type?: string | null;
          file_url?: string;
          id?: string;
          report_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'report_attachments_report_id_fkey';
            columns: ['report_id'];
            isOneToOne: false;
            referencedRelation: 'reports';
            referencedColumns: ['id'];
          },
        ];
      };
      report_messages: {
        Row: {
          created_at: string;
          id: string;
          is_admin_message: boolean;
          is_read: boolean;
          message: string;
          report_id: string;
          sender_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_admin_message?: boolean;
          is_read?: boolean;
          message: string;
          report_id: string;
          sender_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_admin_message?: boolean;
          is_read?: boolean;
          message?: string;
          report_id?: string;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'report_messages_report_id_fkey';
            columns: ['report_id'];
            isOneToOne: false;
            referencedRelation: 'reports';
            referencedColumns: ['id'];
          },
        ];
      };
      reports: {
        Row: {
          admin_response: string | null;
          created_at: string;
          description: string;
          has_unread_admin_messages: boolean | null;
          has_unread_status_update: boolean | null;
          has_unread_user_messages: boolean | null;
          id: string;
          last_status_before_update: string | null;
          responded_at: string | null;
          responded_by: string | null;
          status: Database['public']['Enums']['report_status'];
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          admin_response?: string | null;
          created_at?: string;
          description: string;
          has_unread_admin_messages?: boolean | null;
          has_unread_status_update?: boolean | null;
          has_unread_user_messages?: boolean | null;
          id?: string;
          last_status_before_update?: string | null;
          responded_at?: string | null;
          responded_by?: string | null;
          status?: Database['public']['Enums']['report_status'];
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          admin_response?: string | null;
          created_at?: string;
          description?: string;
          has_unread_admin_messages?: boolean | null;
          has_unread_status_update?: boolean | null;
          has_unread_user_messages?: boolean | null;
          id?: string;
          last_status_before_update?: string | null;
          responded_at?: string | null;
          responded_by?: string | null;
          status?: Database['public']['Enums']['report_status'];
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      todos: {
        Row: {
          created_at: string;
          created_by: string | null;
          custom_points: number | null;
          description: string | null;
          description_ar: string | null;
          id: string;
          is_active: boolean | null;
          points_config_key: string | null;
          title: string;
          title_ar: string | null;
          todo_type: Database['public']['Enums']['todo_type'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          custom_points?: number | null;
          description?: string | null;
          description_ar?: string | null;
          id?: string;
          is_active?: boolean | null;
          points_config_key?: string | null;
          title: string;
          title_ar?: string | null;
          todo_type?: Database['public']['Enums']['todo_type'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          custom_points?: number | null;
          description?: string | null;
          description_ar?: string | null;
          id?: string;
          is_active?: boolean | null;
          points_config_key?: string | null;
          title?: string;
          title_ar?: string | null;
          todo_type?: Database['public']['Enums']['todo_type'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'todos_points_config_key_fkey';
            columns: ['points_config_key'];
            isOneToOne: false;
            referencedRelation: 'points_config';
            referencedColumns: ['key'];
          },
        ];
      };
      user_challenges: {
        Row: {
          challenge_id: string;
          completed: boolean | null;
          completed_at: string | null;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          challenge_id: string;
          completed?: boolean | null;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          challenge_id?: string;
          completed?: boolean | null;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_challenges_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'challenges';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_challenges_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'public_challenges';
            referencedColumns: ['id'];
          },
        ];
      };
      user_personal_todo_completions: {
        Row: {
          completed_at: string;
          completion_date: string;
          id: string;
          personal_todo_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          completion_date?: string;
          id?: string;
          personal_todo_id: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          completion_date?: string;
          id?: string;
          personal_todo_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_personal_todo_completions_personal_todo_id_fkey';
            columns: ['personal_todo_id'];
            isOneToOne: false;
            referencedRelation: 'user_personal_todos';
            referencedColumns: ['id'];
          },
        ];
      };
      user_personal_todos: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database['public']['Enums']['app_role'];
          user_id?: string;
        };
        Relationships: [];
      };
      user_streaks: {
        Row: {
          created_at: string;
          current_streak: number;
          id: string;
          last_completion_date: string | null;
          longest_streak: number;
          streak_requirements: Json | null;
          total_points: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_streak?: number;
          id?: string;
          last_completion_date?: string | null;
          longest_streak?: number;
          streak_requirements?: Json | null;
          total_points?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_streak?: number;
          id?: string;
          last_completion_date?: string | null;
          longest_streak?: number;
          streak_requirements?: Json | null;
          total_points?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_todo_completions: {
        Row: {
          completed_at: string;
          completion_date: string;
          id: string;
          points_earned: number;
          todo_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          completion_date?: string;
          id?: string;
          points_earned?: number;
          todo_id: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          completion_date?: string;
          id?: string;
          points_earned?: number;
          todo_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_todo_completions_todo_id_fkey';
            columns: ['todo_id'];
            isOneToOne: false;
            referencedRelation: 'todos';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      public_challenges: {
        Row: {
          created_at: string | null;
          description: string | null;
          description_ar: string | null;
          end_date: string | null;
          id: string | null;
          is_active: boolean | null;
          points: number | null;
          start_date: string | null;
          title: string | null;
          title_ar: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          description_ar?: string | null;
          end_date?: string | null;
          id?: string | null;
          is_active?: boolean | null;
          points?: number | null;
          start_date?: string | null;
          title?: string | null;
          title_ar?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          description_ar?: string | null;
          end_date?: string | null;
          id?: string | null;
          is_active?: boolean | null;
          points?: number | null;
          start_date?: string | null;
          title?: string | null;
          title_ar?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      public_profiles: {
        Row: {
          avatar_url: string | null;
          country: string | null;
          display_name: string | null;
          user_id: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          country?: string | null;
          display_name?: string | null;
          user_id?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          country?: string | null;
          display_name?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      adjust_user_group_points:
        | { Args: { p_delta: number; p_user_id: string }; Returns: undefined }
        | {
            Args: { p_delta: number; p_group_id: string; p_user_id: string };
            Returns: undefined;
          };
      adjust_user_points:
        | { Args: { p_delta: number; p_user_id: string }; Returns: undefined }
        | {
            Args: {
              p_delta: number;
              p_update_groups?: boolean;
              p_user_id: string;
            };
            Returns: undefined;
          };
      cleanup_expired_otps: { Args: never; Returns: undefined };
      has_role: {
        Args: {
          _role: Database['public']['Enums']['app_role'];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_group_admin: {
        Args: { _group_id: string; _user_id: string };
        Returns: boolean;
      };
      is_group_member: {
        Args: { _group_id: string; _user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: 'admin' | 'moderator' | 'user';
      report_status: 'pending' | 'in_review' | 'resolved' | 'closed';
      todo_type: 'consistent' | 'admin' | 'personal' | 'group';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ['admin', 'moderator', 'user'],
      report_status: ['pending', 'in_review', 'resolved', 'closed'],
      todo_type: ['consistent', 'admin', 'personal', 'group'],
    },
  },
} as const;
