import { create } from 'zustand';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase';
import { getSession } from '@/features/auth/services/authService';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  initialize: () => Promise<void>;
  cleanup: () => void;
}

// Store the subscription outside to prevent multiple subscriptions
let authSubscription: { unsubscribe: () => void } | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => {
    const { session } = get();
    set({
      user,
      isAuthenticated: !!session && !!user,
    });
  },

  setSession: (session) => {
    const { user } = get();
    set({
      session,
      isAuthenticated: !!session && !!user,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  initialize: async () => {
    try {
      set({ isLoading: true });

      // Clean up existing subscription if any
      if (authSubscription) {
        authSubscription.unsubscribe();
        authSubscription = null;
      }

      // Restore session from storage
      const { session } = await getSession();

      if (session?.user) {
        set({
          user: session.user,
          session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }

      // Subscribe to auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          set({
            user: session.user,
            session,
            isAuthenticated: true,
          });
        } else {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
          });
        }
      });

      // Store subscription for cleanup
      authSubscription = subscription;
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  cleanup: () => {
    if (authSubscription) {
      authSubscription.unsubscribe();
      authSubscription = null;
    }
  },
}));
