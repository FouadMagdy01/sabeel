import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { fetchRewayat } from '../services';

export function useRewayat() {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ['rewayat', i18n.language],
    queryFn: () => fetchRewayat(i18n.language),
  });
}
