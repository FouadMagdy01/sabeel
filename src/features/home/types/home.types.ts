export type PrayerName = 'Fajr' | 'Shrouk' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export type PrayerStatus = 'completed' | 'current' | 'upcoming';

export interface PrayerData {
  name: PrayerName;
  time: string;
  status: PrayerStatus;
}

export interface StatsData {
  dayStreak: number;
  totalPoints: number;
  bestStreak: number;
}

export type AzkarType = 'Morning' | 'Evening' | 'Night';
export type AzkarStatus = 'completed' | 'uncompleted';

export interface AzkarData {
  type: AzkarType;
  status: AzkarStatus;
}

export type RandomActStatus = 'completed' | 'unlocked' | 'locked';

export type IconFamilyName =
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'FontAwesome6'
  | 'Fontisto'
  | 'Foundation'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

export interface RandomActData {
  id: string;
  title: string;
  iconFamily: IconFamilyName;
  iconName: string;
  status: RandomActStatus;
}

export interface VerseData {
  arabic: string;
  translation: string;
  reference: string;
}
