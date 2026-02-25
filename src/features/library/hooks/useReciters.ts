import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { fetchReciters } from '../services';

export function useReciters(rewayaId?: number | null) {
  const { i18n } = useTranslation();
  const rewaya = rewayaId ?? undefined;

  return useQuery({
    queryKey: ['reciters', i18n.language, rewaya],
    queryFn: () => fetchReciters(i18n.language, rewaya),
  });
}
