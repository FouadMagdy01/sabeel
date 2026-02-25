import type { AzkarItem } from '../types';

export const MOSQUE_DUAS: AzkarItem[] = [
  {
    id: 'mosque_entering',
    categoryId: 'mosque_duas',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allahummaftah li abwaba rahmatik',
    translationKey: 'screens.azkar.items.mosque_entering.translation',
    source: 'Sahih Muslim 713',
    sourceKey: 'screens.azkar.items.mosque_entering.source',
    repeatCount: 1,
  },
  {
    id: 'mosque_leaving',
    categoryId: 'mosque_duas',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: "Allahumma inni as'aluka min fadlik",
    translationKey: 'screens.azkar.items.mosque_leaving.translation',
    source: 'Sahih Muslim 713',
    sourceKey: 'screens.azkar.items.mosque_leaving.source',
    repeatCount: 1,
  },
  {
    id: 'mosque_between_adhan_iqama',
    categoryId: 'mosque_duas',
    arabic: 'الدُّعَاءُ بَيْنَ الْأَذَانِ وَالْإِقَامَةِ لَا يُرَدُّ',
    transliteration: "Ad-du'a'u baynal-adhani wal-iqamati la yurad",
    translationKey: 'screens.azkar.items.mosque_between_adhan_iqama.translation',
    source: 'Abu Dawud 521',
    sourceKey: 'screens.azkar.items.mosque_between_adhan_iqama.source',
    repeatCount: 1,
  },
  {
    id: 'mosque_after_adhan',
    categoryId: 'mosque_duas',
    arabic:
      'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    transliteration:
      "Allahumma Rabba hadhihid-da'watit-tammati was-salatil-qa'imah, ati Muhammadanil-wasilata wal-fadilah, wab'athhu maqaman mahmudanil-ladhi wa'adtah",
    translationKey: 'screens.azkar.items.mosque_after_adhan.translation',
    source: 'Sahih Al-Bukhari 614',
    sourceKey: 'screens.azkar.items.mosque_after_adhan.source',
    repeatCount: 1,
    virtue: 'screens.azkar.items.mosque_after_adhan.virtue',
  },
];
