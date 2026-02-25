import { useQuery } from '@tanstack/react-query';

import { fetchCollections } from '../services/sunnahApi';

export function useCollections() {
  return useQuery({
    queryKey: ['sunnah', 'collections'],
    queryFn: fetchCollections,
    staleTime: 24 * 60 * 60 * 1000,
    select: (data) => data.data,
  });
}
