import type { DayPrayerTimes, PrayerKey } from '../types';
import { PRAYER_KEYS } from '../types';

export interface PrayerStatus {
  name: PrayerKey;
  time: string;
  status: 'completed' | 'current' | 'upcoming';
}

export function toMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function deriveStatuses(today: DayPrayerTimes): {
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
