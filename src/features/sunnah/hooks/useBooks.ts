import { useQuery } from '@tanstack/react-query';

import { fetchBooks } from '../services/sunnahApi';

export function useBooks(collectionName: string) {
  return useQuery({
    queryKey: ['sunnah', 'books', collectionName],
    queryFn: () => fetchBooks(collectionName),
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!collectionName,
    select: (data) => data.data,
  });
}
