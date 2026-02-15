import type { Session, User } from '@supabase/supabase-js';

// ---- Registration ----

export interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  dateOfBirth: string; // ISO date string: "YYYY-MM-DD"
}

export interface RegisterResponse {
  success: boolean;
  user_id: string;
  message: string;
}

// ---- Login ----

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  session: Session;
}

// ---- Profile ----

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string;
  email: string | null;
  country: string | null;
  date_of_birth: string | null;
  timezone: string | null;
  avatar_url: string | null;
  is_guest: boolean;
  created_at: string;
  updated_at: string;
}

// ---- Auth Context ----

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
