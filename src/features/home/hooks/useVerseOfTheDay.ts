import type { VerseData } from '../types';
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage';
import { useQuery } from '@tanstack/react-query';
import i18n from '@/i18n/config';
import { Language } from '@quranjs/api';
import { getQuranClient } from '@/integrations/quranApi';

interface CachedVerse {
  date: string;
  language: string;
  arabic: string;
  translation: string;
  reference: string;
  verseKey: string;
}

const FALLBACK_VERSE: VerseData = {
  arabic: '--',
  translation: '--',
  reference: '--',
};

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function getCachedVerse(language: string): CachedVerse | null {
  const result = getItem<CachedVerse>(STORAGE_KEYS.verseOfTheDay.cached);
  if (
    result.success &&
    result.data?.date === getTodayDateString() &&
    result.data?.language === language
  ) {
    return result.data;
  }
  return null;
}

async function fetchRandomVerse(language: string): Promise<VerseData> {
  // Check cache first
  const cached = getCachedVerse(language);
  if (cached) {
    return {
      arabic: cached.arabic,
      translation: cached.translation,
      reference: cached.reference,
    };
  }

  const isArabic = language === 'ar';
  const client = getQuranClient();

  const verse = await client.verses.findRandom({
    language: isArabic ? Language.ARABIC : Language.ENGLISH,
    translations: isArabic ? undefined : ['131'],
    fields: { textUthmani: true },
  });

  let cleanTranslation = '';
  if (!isArabic) {
    const translationText = verse.translations?.[0]?.text ?? '';
    cleanTranslation = translationText.replace(/<[^>]*>/g, '');
  }

  const today = getTodayDateString();

  const verseData: VerseData = {
    arabic: verse.textUthmani ?? '',
    translation: !isArabic && cleanTranslation ? `"${cleanTranslation}"` : '',
    reference: i18n.t('screens.home.verseOfTheDay.reference', { ref: verse.verseKey }),
  };

  // Cache in MMKV
  const cacheEntry: CachedVerse = {
    date: today,
    language,
    arabic: verseData.arabic,
    translation: verseData.translation,
    reference: verseData.reference,
    verseKey: verse.verseKey,
  };
  setItem(STORAGE_KEYS.verseOfTheDay.cached, cacheEntry);

  return verseData;
}

export function useVerseOfTheDay(): { verse: VerseData; isLoading: boolean } {
  const language = i18n.language;
  const { data, isLoading } = useQuery({
    queryKey: ['verseOfTheDay', getTodayDateString(), language],
    queryFn: () => fetchRandomVerse(language),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000,
    retry: 2,
    placeholderData: () => {
      const cached = getCachedVerse(language);
      if (cached) {
        return {
          arabic: cached.arabic,
          translation: cached.translation,
          reference: cached.reference,
        };
      }
      return undefined;
    },
  });

  return {
    verse: data ?? FALLBACK_VERSE,
    isLoading: isLoading && !data,
  };
}
