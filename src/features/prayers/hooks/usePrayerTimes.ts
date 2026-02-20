import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getItem, setItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';

import {
  checkAndResyncNotificationLanguage,
  fetchYearlyPrayerTimes,
  getTodayKey,
  scheduleYearlyPrayerNotifications,
} from '../services';
import type { DayPrayerTimes, HijriDate, PrayerKey, YearlyPrayerData } from '../types';
import { PRAYER_KEYS } from '../types';

interface PrayerStatus {
  name: PrayerKey;
  time: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface UsePrayerTimesReturn {
  todayPrayers: PrayerStatus[];
  currentPrayer: PrayerKey | null;
  nextPrayer: PrayerKey | null;
  countdown: string;
  hijriDate: HijriDate | null;
  isLoading: boolean;
  isStale: boolean;
  error: string | null;
  refresh: () => void;
}

// ─── helpers ────────────────────────────────────────────────────────

function toMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function deriveStatuses(today: DayPrayerTimes): {
  prayers: PrayerStatus[];
  current: PrayerKey | null;
  next: PrayerKey | null;
  countdown: string;
} {
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();

  const entries = PRAYER_KEYS.map((key) => ({
    key,
    minutes: toMinutes(today[key]),
  }));

  let currentIdx = -1;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (nowMin >= entries[i].minutes) {
      currentIdx = i;
      break;
    }
  }

  const current: PrayerKey | null = currentIdx >= 0 ? entries[currentIdx].key : null;

  let next: PrayerKey | null;
  if (currentIdx === -1) {
    next = 'Fajr';
  } else if (currentIdx < entries.length - 1) {
    next = entries[currentIdx + 1].key;
  } else {
    next = 'Fajr';
  }

  let countdown = '--:--';
  const nextMinutes = next ? toMinutes(today[next]) : -1;
  if (nextMinutes >= 0) {
    let diff = nextMinutes - nowMin;
    if (diff <= 0) diff += 24 * 60;
    countdown = `${String(Math.floor(diff / 60)).padStart(2, '0')}:${String(diff % 60).padStart(2, '0')}`;
  }

  const prayers: PrayerStatus[] = PRAYER_KEYS.map((key, i) => {
    if (i === currentIdx) return { name: key, time: today[key], status: 'current' as const };
    if (currentIdx >= 0 && i < currentIdx)
      return { name: key, time: today[key], status: 'completed' as const };
    return { name: key, time: today[key], status: 'upcoming' as const };
  });

  return { prayers, current, next, countdown };
}

function loadCachedData(): YearlyPrayerData | null {
  const result = getItem<YearlyPrayerData>(STORAGE_KEYS.prayers.yearlyData);
  if (result.success && result.data) {
    return result.data;
  }
  return null;
}

function saveCachedData(data: YearlyPrayerData): void {
  setItem(STORAGE_KEYS.prayers.yearlyData, data);
}

// ─── main hook ──────────────────────────────────────────────────────

const LOCATION_TIMEOUT = 10_000;

export function usePrayerTimes(): UsePrayerTimesReturn {
  const { t } = useTranslation();
  const [tick, setTick] = useState(0);
  const [yearlyData, setYearlyData] = useState<YearlyPrayerData | null>(loadCachedData);
  const [isLoading, setIsLoading] = useState(!yearlyData);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const didMount = useRef(false);

  // ── Fetch with location (prompts user for GPS) ──
  const fetchWithLocation = async () => {
    setIsLoading(!yearlyData);
    setError(null);
    setIsStale(false);

    // Step 1: Permission
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!yearlyData) setError('location_denied');
        else setIsStale(true);
        setIsLoading(false);
        return;
      }
    } catch {
      if (!yearlyData) setError('location_error');
      else setIsStale(true);
      setIsLoading(false);
      return;
    }

    // Step 2: Location
    let lat: number;
    let lng: number;
    try {
      const position = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), LOCATION_TIMEOUT)
        ),
      ]);
      lat = position.coords.latitude;
      lng = position.coords.longitude;
    } catch {
      try {
        const last = await Location.getLastKnownPositionAsync();
        if (last) {
          lat = last.coords.latitude;
          lng = last.coords.longitude;
        } else {
          if (!yearlyData) setError('location_error');
          else setIsStale(true);
          setIsLoading(false);
          return;
        }
      } catch {
        if (!yearlyData) setError('location_error');
        else setIsStale(true);
        setIsLoading(false);
        return;
      }
    }

    // Step 3: Fetch from API
    const year = new Date().getFullYear();
    try {
      const data = await fetchYearlyPrayerTimes(lat, lng, year);
      saveCachedData(data);
      setYearlyData(data);
      setError(null);
      setIsStale(false);
    } catch {
      if (!yearlyData) setError('fetch_error');
      else setIsStale(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ── On mount: prompt if no cached data, otherwise try silently ──
  const initialFetch = async () => {
    const hasCachedData = !!yearlyData;

    // No cached data → prompt the user for location permission
    if (!hasCachedData) {
      await fetchWithLocation();
      return;
    }

    // Has cached data → try silently without any prompts or dialogs
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== 'granted') {
      setIsStale(true);
      setIsLoading(false);
      return;
    }

    const gpsEnabled = await Location.hasServicesEnabledAsync();

    if (!gpsEnabled) {
      setIsStale(true);
      setIsLoading(false);
      return;
    }

    // Permission granted & GPS on — use last known position to avoid system dialogs
    try {
      const lastKnown = await Location.getLastKnownPositionAsync();
      if (!lastKnown) {
        setIsStale(true);
        setIsLoading(false);
        return;
      }
      const lat = lastKnown.coords.latitude;
      const lng = lastKnown.coords.longitude;

      const year = new Date().getFullYear();
      const data = await fetchYearlyPrayerTimes(lat, lng, year);
      saveCachedData(data);
      setYearlyData(data);
      setIsStale(false);
      setError(null);
    } catch {
      setIsStale(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;
    void initialFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Build localized prayer names ──
  const prayerNames = useMemo<Record<PrayerKey, string>>(
    () => ({
      Fajr: t('prayers.names.Fajr'),
      Sunrise: t('prayers.names.Sunrise'),
      Dhuhr: t('prayers.names.Dhuhr'),
      Asr: t('prayers.names.Asr'),
      Maghrib: t('prayers.names.Maghrib'),
      Isha: t('prayers.names.Isha'),
    }),
    [t]
  );

  // ── Schedule notifications on every new data ──
  useEffect(() => {
    if (!yearlyData) return;
    void scheduleYearlyPrayerNotifications(yearlyData, prayerNames);
  }, [yearlyData, prayerNames]);

  // ── Resync notification language on app open ──
  useEffect(() => {
    void checkAndResyncNotificationLanguage(yearlyData, prayerNames);
  }, [prayerNames, yearlyData]);

  // ── Tick every minute for countdown ──
  useEffect(() => {
    const id = setInterval(() => setTick((p) => p + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Derive today's data ──
  const todayKey = getTodayKey();
  const today = useMemo(() => {
    if (!yearlyData) return null;
    return yearlyData.data[todayKey] ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearlyData, tick]);

  const derived = useMemo(() => {
    if (!today) return null;
    return deriveStatuses(today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, tick]);

  return {
    todayPrayers: derived?.prayers ?? [],
    currentPrayer: derived?.current ?? null,
    nextPrayer: derived?.next ?? null,
    countdown: derived?.countdown ?? '--:--',
    hijriDate: today?.hijri ?? null,
    isLoading,
    isStale,
    error,
    refresh: () => {
      void fetchWithLocation();
    },
  };
}
