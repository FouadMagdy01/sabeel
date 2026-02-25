import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchHadiths } from '../services/sunnahApi';

export function useHadiths(collectionName: string, bookNumber: string) {
  return useInfiniteQuery({
    queryKey: ['sunnah', 'hadiths', collectionName, bookNumber],
    queryFn: ({ pageParam }) => fetchHadiths(collectionName, bookNumber, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    enabled: !!collectionName && !!bookNumber,
  });
}
