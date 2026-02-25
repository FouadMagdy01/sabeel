import type { PrayerStatus } from '../../utils';

export interface PrayersListProps {
  prayers: PrayerStatus[];
  prayerNames: Record<string, string>;
  countdown?: string;
}
