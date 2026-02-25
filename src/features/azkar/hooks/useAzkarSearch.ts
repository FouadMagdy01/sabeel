import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ALL_AZKAR_ITEMS } from '../data';
import type { AzkarItem } from '../types';
import { searchAzkar } from '../utils';

interface UseAzkarSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: AzkarItem[];
  clearSearch: () => void;
  isSearching: boolean;
}

export function useAzkarSearch(): UseAzkarSearchReturn {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchAzkar(ALL_AZKAR_ITEMS, query, (key) => t(key as never));
  }, [query, t]);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  const isSearching = query.trim().length > 0;

  return { query, setQuery, results, clearSearch, isSearching };
}
