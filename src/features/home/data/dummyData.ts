import type { AzkarData, PrayerData, RandomActData, StatsData, VerseData } from '../types';

export const DUMMY_STATS: StatsData = {
  dayStreak: 12,
  totalPoints: 2450,
  bestStreak: 18,
};

export const DUMMY_PRAYERS: PrayerData[] = [
  { name: 'Fajr', time: '05:30 AM', status: 'completed' },
  { name: 'Sunrise', time: '06:45 AM', status: 'completed' },
  { name: 'Dhuhr', time: '12:15 PM', status: 'completed' },
  { name: 'Asr', time: '03:30 PM', status: 'current' },
  { name: 'Maghrib', time: '06:00 PM', status: 'upcoming' },
  { name: 'Isha', time: '07:30 PM', status: 'upcoming' },
];

export const DUMMY_AZKAR: AzkarData[] = [
  { type: 'Morning', categoryId: 'morning_azkar', status: 'completed' },
  { type: 'Evening', categoryId: 'evening_azkar', status: 'uncompleted' },
];

export const DUMMY_RANDOM_ACTS: RandomActData[] = [
  {
    id: '1',
    title: 'Sadaqah',
    iconFamily: 'MaterialIcons',
    iconName: 'volunteer-activism',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Kind Word',
    iconFamily: 'MaterialIcons',
    iconName: 'sentiment-satisfied',
    status: 'unlocked',
  },
  {
    id: '3',
    title: 'Gratitude',
    iconFamily: 'MaterialIcons',
    iconName: 'self-improvement',
    status: 'unlocked',
  },
];

export const DUMMY_VERSE: VerseData = {
  arabic: 'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
  translation: '"Indeed, with hardship comes ease."',
  reference: 'Surah Ash-Sharh 94:6',
};

export const CURRENT_PRAYER_COUNTDOWN = '02:14:05';
