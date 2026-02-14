import type {
  DownloadedAya,
  DownloadedReciter,
  DownloadedSura,
  FavoriteAya,
  FavoriteReciter,
  FavoriteSura,
  FeaturedReciter,
  RecommendedReciter,
} from '../types';

export const DUMMY_FAVORITE_SURAS: FavoriteSura[] = [
  { id: 18, name: 'Al-Kahf', translation: 'The Cave', versesCount: 110 },
  { id: 36, name: 'Ya-Sin', translation: 'Ya-Sin', versesCount: 83 },
  { id: 67, name: 'Al-Mulk', translation: 'The Sovereignty', versesCount: 30 },
  {
    id: 55,
    name: 'Ar-Rahman',
    translation: 'The Beneficent',
    versesCount: 78,
  },
  {
    id: 56,
    name: "Al-Waqi'a",
    translation: 'The Inevitable',
    versesCount: 96,
  },
];

export const DUMMY_FAVORITE_RECITERS: FavoriteReciter[] = [
  {
    id: '1',
    name: 'Mishary Rashid Al-Afasy',
    surasCount: 114,
    nationality: 'Kuwait',
  },
  {
    id: '2',
    name: 'Abdul Rahman Al-Sudais',
    surasCount: 114,
    nationality: 'Saudi Arabia',
  },
  {
    id: '3',
    name: 'Maher Al-Muaiqly',
    surasCount: 114,
    nationality: 'Saudi Arabia',
  },
  {
    id: '4',
    name: 'Saad Al-Ghamdi',
    surasCount: 114,
    nationality: 'Saudi Arabia',
  },
];

export const DUMMY_FEATURED_RECITERS: FeaturedReciter[] = [
  {
    id: 'f1',
    name: 'Mishary Rashid',
    style: "Hafs 'an 'Asim",
    isFeatured: true,
  },
  {
    id: 'f2',
    name: 'Abdul Rahman',
    style: 'Sudaissi',
    isFeatured: false,
  },
  {
    id: 'f3',
    name: 'Maher Muaiqly',
    style: "Hafs 'an 'Asim",
    isFeatured: false,
  },
];

export const DUMMY_RECOMMENDED_RECITERS: RecommendedReciter[] = [
  {
    id: 'r1',
    name: 'Saud Al-Shuraim',
    surasAvailable: 114,
    isStarred: false,
  },
  {
    id: 'r2',
    name: 'Yasser Al-Dosari',
    surasAvailable: 98,
    isStarred: true,
  },
  {
    id: 'r3',
    name: 'Islam Sobhi',
    surasAvailable: 45,
    isStarred: false,
  },
];

export const DUMMY_DOWNLOADED_SURAS: DownloadedSura[] = [
  {
    id: 1,
    name: 'Al-Fatiha',
    translation: 'The Opening',
    versesCount: 7,
    fileSize: '2.1 MB',
  },
  {
    id: 2,
    name: 'Al-Baqarah',
    translation: 'The Cow',
    versesCount: 286,
    fileSize: '45.3 MB',
  },
  {
    id: 36,
    name: 'Ya-Sin',
    translation: 'Ya-Sin',
    versesCount: 83,
    fileSize: '12.8 MB',
  },
  {
    id: 67,
    name: 'Al-Mulk',
    translation: 'The Sovereignty',
    versesCount: 30,
    fileSize: '5.4 MB',
  },
];

export const DUMMY_DOWNLOADED_RECITERS: DownloadedReciter[] = [
  {
    id: 'd1',
    name: 'Mishary Rashid Al-Afasy',
    surasCount: 114,
    nationality: 'Kuwait',
    totalSize: '1.2 GB',
  },
  {
    id: 'd2',
    name: 'Abdul Rahman Al-Sudais',
    surasCount: 60,
    nationality: 'Saudi Arabia',
    totalSize: '680 MB',
  },
  {
    id: 'd3',
    name: 'Maher Al-Muaiqly',
    surasCount: 30,
    nationality: 'Saudi Arabia',
    totalSize: '340 MB',
  },
];

export const DUMMY_DOWNLOADED_AYAS: DownloadedAya[] = [
  {
    id: 'da1',
    suraName: 'Al-Baqarah',
    suraNumber: 2,
    ayaNumber: 255,
    arabicText:
      '\u0627\u0644\u0644\u0651\u0647\u064F \u0644\u0627 \u0625\u0650\u0644\u0670\u0647\u064E \u0625\u0650\u0644\u0651\u0627 \u0647\u064F\u0648\u064E \u0627\u0644\u0652\u062D\u064E\u064A\u0651\u064F \u0627\u0644\u0652\u0642\u064E\u064A\u0651\u064F\u0648\u0645\u064F',
    translation:
      'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.',
  },
  {
    id: 'da2',
    suraName: 'Al-Ikhlas',
    suraNumber: 112,
    ayaNumber: 1,
    arabicText:
      '\u0642\u064F\u0644\u0652 \u0647\u064F\u0648\u064E \u0627\u0644\u0644\u0651\u0647\u064F \u0623\u064E\u062D\u064E\u062F\u064C',
    translation: 'Say, He is Allah, [who is] One.',
  },
];

export const DUMMY_FAVORITE_AYAS: FavoriteAya[] = [
  {
    id: '1',
    suraName: 'Al-Baqarah',
    suraNumber: 2,
    ayaNumber: 255,
    arabicText:
      '\u0627\u0644\u0644\u0651\u0647\u064F \u0644\u0627 \u0625\u0650\u0644\u0670\u0647\u064E \u0625\u0650\u0644\u0651\u0627 \u0647\u064F\u0648\u064E \u0627\u0644\u0652\u062D\u064E\u064A\u0651\u064F \u0627\u0644\u0652\u0642\u064E\u064A\u0651\u064F\u0648\u0645\u064F',
    translation:
      'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.',
  },
  {
    id: '2',
    suraName: 'Al-Ikhlas',
    suraNumber: 112,
    ayaNumber: 1,
    arabicText:
      '\u0642\u064F\u0644\u0652 \u0647\u064F\u0648\u064E \u0627\u0644\u0644\u0651\u0647\u064F \u0623\u064E\u062D\u064E\u062F\u064C',
    translation: 'Say, He is Allah, [who is] One.',
  },
  {
    id: '3',
    suraName: 'Ar-Rahman',
    suraNumber: 55,
    ayaNumber: 13,
    arabicText:
      '\u0641\u064E\u0628\u0650\u0623\u064E\u064A\u0651\u0650 \u0622\u0644\u0627\u0621\u0650 \u0631\u064E\u0628\u0651\u0650\u0643\u064F\u0645\u0627 \u062A\u064F\u0643\u064E\u0630\u0651\u0650\u0628\u0627\u0646\u0650',
    translation: 'So which of the favors of your Lord would you deny?',
  },
];
