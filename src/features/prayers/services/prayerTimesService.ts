import axios from 'axios';

import type { DayPrayerTimes, HijriDate, YearlyPrayerData } from '../types';

const BASE_URL = 'https://api.aladhan.com/v1/calendar';
function getHijriAdjustment(): number {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz === 'Africa/Cairo') return -1;
  return 0;
}

interface AlAdhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AlAdhanHijriMonth {
  number: number;
  en: string;
  ar: string;
}

interface AlAdhanHijriWeekday {
  en: string;
  ar: string;
}

interface AlAdhanHijri {
  day: string;
  month: AlAdhanHijriMonth;
  year: string;
  weekday: AlAdhanHijriWeekday;
}

interface AlAdhanDate {
  gregorian: { date: string };
  hijri: AlAdhanHijri;
}

interface AlAdhanDayData {
  timings: AlAdhanTimings;
  date: AlAdhanDate;
}

interface AlAdhanYearResponse {
  code: number;
  status: string;
  data: Record<string, AlAdhanDayData[]>;
}

function stripTimezone(time: string): string {
  return time.replace(/\s*\(.*\)$/, '').trim();
}

function mapHijriDate(hijri: AlAdhanHijri): HijriDate {
  return {
    day: hijri.day,
    month: { number: hijri.month.number, en: hijri.month.en, ar: hijri.month.ar },
    year: hijri.year,
    weekday: { en: hijri.weekday.en, ar: hijri.weekday.ar },
  };
}

function mapDayData(day: AlAdhanDayData): DayPrayerTimes {
  const { timings, date } = day;
  return {
    Fajr: stripTimezone(timings.Fajr),
    Sunrise: stripTimezone(timings.Sunrise),
    Dhuhr: stripTimezone(timings.Dhuhr),
    Asr: stripTimezone(timings.Asr),
    Maghrib: stripTimezone(timings.Maghrib),
    Isha: stripTimezone(timings.Isha),
    date: date.gregorian.date,
    hijri: date.hijri ? mapHijriDate(date.hijri) : null,
  };
}

export async function fetchYearlyPrayerTimes(
  latitude: number,
  longitude: number,
  year: number
): Promise<YearlyPrayerData> {
  const url = `${BASE_URL}/${year}`;
  const adjustment = getHijriAdjustment();
  const params = { latitude, longitude, calendarMethod: 'MATHEMATICAL', adjustment };

  const { data: json } = await axios.get<AlAdhanYearResponse>(url, { params });

  const data: Record<string, DayPrayerTimes> = {};
  for (const monthDays of Object.values(json.data)) {
    for (const day of monthDays) {
      const mapped = mapDayData(day);
      data[mapped.date] = mapped;
    }
  }

  return {
    data,
    location: { latitude, longitude },
    fetchedAt: new Date().toISOString(),
    year,
  };
}

export function getTodayKey(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}
