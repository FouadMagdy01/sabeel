import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getItem, setItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';

import { DEFAULT_ADHAN_SOUND } from '../constants';
import {
  checkAndResyncNotificationLanguage,
  fetchYearlyPrayerTimes,
  getTodayKey,
  scheduleYearlyPrayerNotifications,
} from '../services';
import type { HijriDate, PrayerKey, YearlyPrayerData } from '../types';
import type { PrayerStatus } from '../utils';
import { deriveStatuses } from '../utils';

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

function getAdhanEnabled(): boolean {
  const result = getItem<boolean>(STORAGE_KEYS.prayers.adhanEnabled);
  if (result.success && typeof result.data === 'boolean') return result.data;
  return true;
}

function getAdhanSound(): string {
  const result = getItem<string>(STORAGE_KEYS.prayers.adhanSound);
  return result.success && result.data ? result.data : DEFAULT_ADHAN_SOUND;
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
    console.warn('[PrayerTimes] fetchWithLocation | user-prompting flow triggered');
    setIsLoading(!yearlyData);
    setError(null);
    setIsStale(false);

    // Step 1: Permission
    try {
      const permResponse = await Location.requestForegroundPermissionsAsync();
      console.warn('[PrayerTimes] requestPermission |', {
        status: permResponse.status,
        granted: permResponse.granted,
        canAskAgain: permResponse.canAskAgain,
        expires: permResponse.expires,
      });
      if (permResponse.status !== 'granted') {
        console.warn('[PrayerTimes] result | permission denied, hasCachedData:', !!yearlyData);
        if (!yearlyData) setError('location_denied');
        else setIsStale(true);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('[PrayerTimes] result | permission error:', err);
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
      console.warn('[PrayerTimes] location | source: "currentPosition", lat:', lat, 'lng:', lng);
    } catch {
      console.warn('[PrayerTimes] location | currentPosition failed, trying lastKnown');
      try {
        const last = await Location.getLastKnownPositionAsync();
        if (last) {
          lat = last.coords.latitude;
          lng = last.coords.longitude;
          console.warn('[PrayerTimes] location | source: "lastKnown", lat:', lat, 'lng:', lng);
        } else {
          console.warn('[PrayerTimes] result | no lastKnown position available');
          if (!yearlyData) setError('location_error');
          else setIsStale(true);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('[PrayerTimes] result | lastKnown error:', err);
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
      console.warn('[PrayerTimes] apiFetch | success: true, year:', year);
    } catch (err) {
      console.warn('[PrayerTimes] apiFetch | success: false, error:', err);
      if (!yearlyData) setError('fetch_error');
      else setIsStale(true);
    } finally {
      setIsLoading(false);
      console.warn('[PrayerTimes] result | isLoading: false, isStale:', isStale, 'error:', error);
    }
  };

  // ── On mount: prompt if no cached data, otherwise try silently ──
  const initialFetch = async () => {
    const hasCachedData = !!yearlyData;
    const cached = hasCachedData ? yearlyData : null;
    console.warn(
      '[PrayerTimes] initialFetch | hasCachedData:',
      hasCachedData,
      cached
        ? {
            fetchedAt: cached.fetchedAt,
            location: cached.location,
          }
        : null
    );

    // No cached data → prompt the user for location permission
    if (!hasCachedData) {
      console.warn('[PrayerTimes] initialFetch | no cache, prompting user');
      await fetchWithLocation();
      return;
    }

    // Has cached data → try silently without any prompts or dialogs
    const permResponse = await Location.getForegroundPermissionsAsync();
    console.warn('[PrayerTimes] silentPermissionCheck |', {
      status: permResponse.status,
      granted: permResponse.granted,
      canAskAgain: permResponse.canAskAgain,
      expires: permResponse.expires,
    });

    if (permResponse.status !== 'granted') {
      console.warn('[PrayerTimes] result | silent check denied, marking stale');
      setIsStale(true);
      setIsLoading(false);
      return;
    }

    const gpsEnabled = await Location.hasServicesEnabledAsync();
    console.warn('[PrayerTimes] gpsCheck | enabled:', gpsEnabled);

    if (!gpsEnabled) {
      console.warn('[PrayerTimes] result | GPS disabled, marking stale');
      setIsStale(true);
      setIsLoading(false);
      return;
    }

    // Permission granted & GPS on — use last known position to avoid system dialogs
    try {
      const lastKnown = await Location.getLastKnownPositionAsync();
      if (!lastKnown) {
        console.warn('[PrayerTimes] result | no lastKnown position in silent path');
        setIsStale(true);
        setIsLoading(false);
        return;
      }
      const lat = lastKnown.coords.latitude;
      const lng = lastKnown.coords.longitude;
      console.warn('[PrayerTimes] location | source: "lastKnown" (silent), lat:', lat, 'lng:', lng);

      const year = new Date().getFullYear();
      const data = await fetchYearlyPrayerTimes(lat, lng, year);
      saveCachedData(data);
      setYearlyData(data);
      setIsStale(false);
      setError(null);
      console.warn('[PrayerTimes] apiFetch | success: true (silent), year:', year);
    } catch (err) {
      console.warn('[PrayerTimes] apiFetch | success: false (silent), error:', err);
      setIsStale(true);
    } finally {
      setIsLoading(false);
      console.warn('[PrayerTimes] result | silent flow done, isStale:', isStale);
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
    const adhanEnabled = getAdhanEnabled();
    if (!adhanEnabled) return;
    const adhanSound = getAdhanSound();
    void scheduleYearlyPrayerNotifications(yearlyData, prayerNames, adhanSound);
  }, [yearlyData, prayerNames]);

  // ── Resync notification language on app open ──
  useEffect(() => {
    const adhanSound = getAdhanSound();
    void checkAndResyncNotificationLanguage(yearlyData, prayerNames, adhanSound);
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
