import { useMemo, useState } from 'react';

import { getItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';

import type { DayPrayerTimes, HijriDate, PrayerKey, YearlyPrayerData } from '../types';
import { PRAYER_KEYS } from '../types';
import type { PrayerStatus } from '../utils';
import { deriveStatuses } from '../utils';

interface UseDayPrayersReturn {
  prayers: PrayerStatus[];
  currentPrayer: PrayerKey | null;
  nextPrayer: PrayerKey | null;
  countdown: string;
  hijriDate: HijriDate | null;
  dayData: DayPrayerTimes | null;
}

function getTodayDateKey(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function isDateInPast(dateKey: string): boolean {
  const [dd, mm, yyyy] = dateKey.split('-').map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
}

function isDateInFuture(dateKey: string): boolean {
  const [dd, mm, yyyy] = dateKey.split('-').map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date > today;
}

export function useDayPrayers(dateKey: string): UseDayPrayersReturn {
  const [tick] = useState(0);
  const todayKey = getTodayDateKey();
  const isToday = dateKey === todayKey;

  const yearlyData = useMemo(() => {
    const result = getItem<YearlyPrayerData>(STORAGE_KEYS.prayers.yearlyData);
    return result.success && result.data ? result.data : null;
  }, []);

  const dayData = useMemo(() => {
    if (!yearlyData) return null;
    return yearlyData.data[dateKey] ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearlyData, dateKey, tick]);

  const result = useMemo(() => {
    if (!dayData) {
      return {
        prayers: [] as PrayerStatus[],
        currentPrayer: null as PrayerKey | null,
        nextPrayer: null as PrayerKey | null,
        countdown: '--:--',
      };
    }

    if (isToday) {
      const derived = deriveStatuses(dayData);
      return {
        prayers: derived.prayers,
        currentPrayer: derived.current,
        nextPrayer: derived.next,
        countdown: derived.countdown,
      };
    }

    if (isDateInPast(dateKey)) {
      return {
        prayers: PRAYER_KEYS.map((key) => ({
          name: key,
          time: dayData[key],
          status: 'completed' as const,
        })),
        currentPrayer: null as PrayerKey | null,
        nextPrayer: null as PrayerKey | null,
        countdown: '--:--',
      };
    }

    if (isDateInFuture(dateKey)) {
      return {
        prayers: PRAYER_KEYS.map((key) => ({
          name: key,
          time: dayData[key],
          status: 'upcoming' as const,
        })),
        currentPrayer: null as PrayerKey | null,
        nextPrayer: null as PrayerKey | null,
        countdown: '--:--',
      };
    }

    return {
      prayers: [] as PrayerStatus[],
      currentPrayer: null as PrayerKey | null,
      nextPrayer: null as PrayerKey | null,
      countdown: '--:--',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayData, isToday, dateKey, tick]);

  return {
    ...result,
    hijriDate: dayData?.hijri ?? null,
    dayData,
  };
}
