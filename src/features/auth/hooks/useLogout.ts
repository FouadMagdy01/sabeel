import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../services/authService';

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      // Clear all React Query cache on successful logout
      queryClient.clear();
    },
  });
}
