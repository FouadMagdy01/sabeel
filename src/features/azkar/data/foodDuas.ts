import type { AzkarItem } from '../types';

export const FOOD_DUAS: AzkarItem[] = [
  {
    id: 'food_before_eating',
    categoryId: 'food_duas',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translationKey: 'screens.azkar.items.food_before_eating.translation',
    source: 'Abu Dawud 3:347',
    sourceKey: 'screens.azkar.items.food_before_eating.source',
    repeatCount: 1,
  },
  {
    id: 'food_forgetting_bismillah',
    categoryId: 'food_duas',
    arabic: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
    transliteration: 'Bismillahi awwalahu wa akhirah',
    translationKey: 'screens.azkar.items.food_forgetting_bismillah.translation',
    source: 'Abu Dawud 3:347',
    sourceKey: 'screens.azkar.items.food_forgetting_bismillah.source',
    repeatCount: 1,
  },
  {
    id: 'food_after_eating',
    categoryId: 'food_duas',
    arabic:
      'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration:
      "Alhamdulillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
    translationKey: 'screens.azkar.items.food_after_eating.translation',
    source: 'Abu Dawud 4:189',
    sourceKey: 'screens.azkar.items.food_after_eating.source',
    repeatCount: 1,
    virtue: 'screens.azkar.items.food_after_eating.virtue',
  },
  {
    id: 'food_guest_dua',
    categoryId: 'food_duas',
    arabic: 'اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ، وَاغْفِرْ لَهُمْ وَارْحَمْهُمْ',
    transliteration: 'Allahumma barik lahum fima razaqtahum, waghfir lahum warhamhum',
    translationKey: 'screens.azkar.items.food_guest_dua.translation',
    source: 'Sahih Muslim 2042',
    sourceKey: 'screens.azkar.items.food_guest_dua.source',
    repeatCount: 1,
  },
];
