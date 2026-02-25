import type { TasbeehPhrase } from '../types';

export const TASBEEH_PHRASES: TasbeehPhrase[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    translationKey: 'screens.tasbeeh.phrases.subhanallah',
    defaultTarget: 33,
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translationKey: 'screens.tasbeeh.phrases.alhamdulillah',
    defaultTarget: 33,
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translationKey: 'screens.tasbeeh.phrases.allahuakbar',
    defaultTarget: 34,
  },
  {
    id: 'lailahaillallah',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illallah',
    translationKey: 'screens.tasbeeh.phrases.lailahaillallah',
    defaultTarget: 100,
  },
  {
    id: 'subhanallahwabihamdih',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdihi',
    translationKey: 'screens.tasbeeh.phrases.subhanallahwabihamdih',
    defaultTarget: 100,
  },
  {
    id: 'subhanallahilazeem',
    arabic: 'سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: "SubhanAllahi al-'Azeem",
    translationKey: 'screens.tasbeeh.phrases.subhanallahilazeem',
    defaultTarget: 100,
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translationKey: 'screens.tasbeeh.phrases.astaghfirullah',
    defaultTarget: 100,
  },
  {
    id: 'lahawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    translationKey: 'screens.tasbeeh.phrases.lahawla',
    defaultTarget: 100,
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    transliteration: 'Allahumma salli ala Muhammad',
    translationKey: 'screens.tasbeeh.phrases.salawat',
    defaultTarget: 100,
  },
  {
    id: 'hasbiyallah',
    arabic: 'حَسْبِيَ اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: "Hasbiyallahu wa ni'mal wakeel",
    translationKey: 'screens.tasbeeh.phrases.hasbiyallah',
    defaultTarget: 100,
  },
];

export const PRESET_TARGETS = [33, 34, 100, 500, 1000] as const;

export const INFINITE_TARGET = 0;
