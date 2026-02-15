import { supabase } from '@/integrations/supabase';
import type { LoginParams, LoginResponse, RegisterParams, UserProfile } from './authService.types';

/**
 * Register a new user using native Supabase auth.signUp
 * Profile and user_role are auto-created by database triggers
 */
export async function register(params: RegisterParams): Promise<void> {
  const { email, password, firstName, lastName, country, dateOfBirth } = params;

  // Compute display name
  const displayName = `${firstName} ${lastName}`.trim() || email;

  // Auto-detect timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Register using native Supabase auth with metadata
  // Database trigger will auto-create profile and user_role
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        display_name: displayName,
        country,
        date_of_birth: dateOfBirth,
        timezone,
      },
    },
  });
  if (error) {
    throw new Error(error.message || 'Registration failed');
  }

  // Check if email already exists (Supabase returns user with empty identities array)
  if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error('Email already registered');
  }

  // For email confirmation flow, user will be logged in after confirming email
  // For auto-confirm (email_confirm: true in trigger), user is already logged in
  // Session is stored in MMKV, onAuthStateChange will fire
}

/**
 * Log in a user with email and password
 */
export async function login(params: LoginParams): Promise<LoginResponse> {
  const { email, password } = params;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || 'Login failed');
  }

  if (!data.user || !data.session) {
    throw new Error('Invalid login response');
  }

  return {
    user: data.user,
    session: data.session,
  };
}

/**
 * Sign out the current user
 */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  // Ignore session_not_found errors (user already signed out)
  if (
    error &&
    !error.message?.includes('session_not_found') &&
    error.code !== 'session_not_found'
  ) {
    throw new Error(error.message || 'Logout failed');
  }

  // Local session is cleared by Supabase client
}

/**
 * Get the current session from storage
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message || 'Failed to get session');
  }

  return {
    session: data.session,
    user: data.session?.user ?? null,
  };
}

/**
 * Fetch user profile from the profiles table
 */
export async function getProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to fetch profile');
  }

  if (!data) {
    throw new Error('No profile found');
  }

  return data as UserProfile;
}
