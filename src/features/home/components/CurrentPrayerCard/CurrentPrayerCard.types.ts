import type { PrayerData, PrayerName } from '../../types';

export interface CurrentPrayerCardProps {
  prayers: PrayerData[];
  currentPrayer: PrayerName | null;
  nextPrayer: PrayerName | null;
  countdown: string;
  isStale?: boolean;
  onRefresh?: () => void;
}
