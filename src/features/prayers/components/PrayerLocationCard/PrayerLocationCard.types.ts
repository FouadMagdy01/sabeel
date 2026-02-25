import type { HijriDate } from '../../types';

export interface PrayerLocationCardProps {
  locationName: string;
  date: Date;
  hijriDate: HijriDate | null;
  nextPrayer: string | null;
  nextPrayerTime: string;
  countdown: string;
}
