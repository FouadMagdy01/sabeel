import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useAuthStore } from './authStore';

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize auth state and subscription
    void useAuthStore.getState().initialize();

    // Cleanup subscription on unmount
    return () => {
      useAuthStore.getState().cleanup();
    };
  }, []); // Only run once on mount

  return <>{children}</>;
}

export const useAuth = () => useAuthStore();
