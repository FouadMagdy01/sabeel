import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../services/authService';
import { useAuth } from '@/providers/auth';

export function useProfile() {
  const auth = useAuth();
  const userId = auth?.user?.id;

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    profile,
    isLoading,
    error,
  };
}
