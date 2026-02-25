import type { PrayerKey } from '../../types';

export interface PrayerTimeRowProps {
  name: PrayerKey;
  displayName: string;
  time: string;
  status: 'completed' | 'current' | 'upcoming';
  countdown?: string;
}
