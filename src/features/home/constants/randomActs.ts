import type { IconFamilyName } from '../types';

export interface RandomActDefinition {
  id: string;
  titleKey: string;
  iconFamily: IconFamilyName;
  iconName: string;
  navigateTo?: string;
}

export const RANDOM_ACTS_POOL: RandomActDefinition[] = [
  {
    id: 'tasbeeh_100',
    titleKey: 'screens.home.dailyTodos.randomActsList.tasbeeh',
    iconFamily: 'MaterialIcons',
    iconName: 'touch-app',
    navigateTo: '/(main)/tasbeeh',
  },
  {
    id: 'read_quran_5',
    titleKey: 'screens.home.dailyTodos.randomActsList.readQuran',
    iconFamily: 'MaterialIcons',
    iconName: 'menu-book',
    navigateTo: '/(main)/quran-reader',
  },
  {
    id: 'salawat_100',
    titleKey: 'screens.home.dailyTodos.randomActsList.salawat',
    iconFamily: 'MaterialIcons',
    iconName: 'favorite',
    navigateTo: '/(main)/tasbeeh',
  },
  {
    id: 'surah_kahf',
    titleKey: 'screens.home.dailyTodos.randomActsList.surahKahf',
    iconFamily: 'MaterialIcons',
    iconName: 'auto-stories',
    navigateTo: '/(main)/quran-reader',
  },
  {
    id: 'istighfar_100',
    titleKey: 'screens.home.dailyTodos.randomActsList.istighfar',
    iconFamily: 'MaterialIcons',
    iconName: 'self-improvement',
    navigateTo: '/(main)/tasbeeh',
  },
  {
    id: 'morning_azkar',
    titleKey: 'screens.home.dailyTodos.randomActsList.morningAzkar',
    iconFamily: 'MaterialIcons',
    iconName: 'wb-sunny',
    navigateTo: '/(main)/(tabs)/azkar',
  },
  {
    id: 'evening_azkar',
    titleKey: 'screens.home.dailyTodos.randomActsList.eveningAzkar',
    iconFamily: 'MaterialIcons',
    iconName: 'nightlight-round',
    navigateTo: '/(main)/(tabs)/azkar',
  },
  {
    id: 'surah_mulk',
    titleKey: 'screens.home.dailyTodos.randomActsList.surahMulk',
    iconFamily: 'MaterialIcons',
    iconName: 'auto-stories',
    navigateTo: '/(main)/quran-reader',
  },
  {
    id: 'ayat_kursi',
    titleKey: 'screens.home.dailyTodos.randomActsList.ayatKursi',
    iconFamily: 'MaterialIcons',
    iconName: 'menu-book',
    navigateTo: '/(main)/quran-reader',
  },
  {
    id: 'sleep_azkar',
    titleKey: 'screens.home.dailyTodos.randomActsList.sleepAzkar',
    iconFamily: 'MaterialIcons',
    iconName: 'bedtime',
    navigateTo: '/(main)/(tabs)/azkar',
  },
  {
    id: 'la_ilaha_illa_allah',
    titleKey: 'screens.home.dailyTodos.randomActsList.tahleel',
    iconFamily: 'MaterialIcons',
    iconName: 'touch-app',
    navigateTo: '/(main)/tasbeeh',
  },
  {
    id: 'hawqala',
    titleKey: 'screens.home.dailyTodos.randomActsList.hawqala',
    iconFamily: 'MaterialIcons',
    iconName: 'touch-app',
    navigateTo: '/(main)/tasbeeh',
  },
];
