import type { AzkarItem } from '../types';

function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\u0622/g, '\u0627')
    .replace(/\u0623/g, '\u0627')
    .replace(/\u0625/g, '\u0627')
    .toLowerCase();
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/['-]/g, '');
}

export function searchAzkar(
  items: AzkarItem[],
  query: string,
  getTranslation: (key: string) => string
): AzkarItem[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const normalizedQuery = normalizeText(trimmed);
  const arabicQuery = normalizeArabic(trimmed);

  return items.filter((item) => {
    const matchArabic = normalizeArabic(item.arabic).includes(arabicQuery);
    const matchTransliteration = normalizeText(item.transliteration).includes(normalizedQuery);
    const matchTranslation = normalizeText(getTranslation(item.translationKey)).includes(
      normalizedQuery
    );

    return matchArabic || matchTransliteration || matchTranslation;
  });
}
