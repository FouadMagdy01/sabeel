export interface HijriDate {
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
  weekday: { en: string; ar: string };
}

export interface DayPrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  date: string;
  hijri: HijriDate | null;
}

export interface YearlyPrayerData {
  data: Record<string, DayPrayerTimes>;
  location: { latitude: number; longitude: number };
  fetchedAt: string;
  year: number;
}

export type PrayerKey = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export const PRAYER_KEYS: PrayerKey[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const NOTIFIABLE_PRAYERS: PrayerKey[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
