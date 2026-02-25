import { useMemo } from 'react';

import { GENERAL_DUAS } from '../data';
import type { AzkarItem } from '../types';

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function useDuaOfTheDay(): AzkarItem | null {
  return useMemo(() => {
    if (GENERAL_DUAS.length === 0) return null;
    const dayOfYear = getDayOfYear();
    const index = dayOfYear % GENERAL_DUAS.length;
    return GENERAL_DUAS[index] ?? null;
  }, []);
}
