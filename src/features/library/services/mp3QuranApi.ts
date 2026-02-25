import axios from 'axios';

import type { Reciter, Rewayah } from '../types/api.types';

const BASE_URL = 'https://mp3quran.net/api/v3';

function mapAppLang(lang: string): string {
  return lang === 'ar' ? 'ar' : 'eng';
}

export async function fetchRewayat(language: string): Promise<Rewayah[]> {
  const apiLang = mapAppLang(language);
  const response = await axios.get<{ riwayat: Rewayah[] }>(`${BASE_URL}/riwayat`, {
    params: { language: apiLang },
  });
  return response.data.riwayat;
}

export async function fetchReciters(language: string, rewayaId?: number): Promise<Reciter[]> {
  const apiLang = mapAppLang(language);
  const params: Record<string, string | number> = { language: apiLang };
  if (rewayaId != null) {
    params.rewaya = rewayaId;
  }
  const response = await axios.get<{ reciters: Reciter[] }>(`${BASE_URL}/reciters`, { params });
  return response.data.reciters;
}

export async function fetchReciterById(
  reciterId: number,
  language: string
): Promise<Reciter | undefined> {
  const reciters = await fetchReciters(language);
  return reciters.find((r) => r.id === reciterId);
}

export interface BilingualNames {
  reciterNameAr: string;
  reciterNameEn: string;
  moshafNameAr: string;
  moshafNameEn: string;
}

export async function resolveReciterNames(
  reciterId: number,
  moshafId: number,
  currentName: string,
  currentMoshafName: string,
  currentLang: string
): Promise<BilingualNames> {
  const isArabic = currentLang === 'ar';
  const otherLang = isArabic ? 'en' : 'ar';

  try {
    const otherReciter = await fetchReciterById(reciterId, otherLang);
    const otherMoshaf = otherReciter?.moshaf.find((m) => m.id === moshafId);

    const otherName = otherReciter?.name ?? currentName;
    const otherMoshafName = otherMoshaf?.name ?? currentMoshafName;

    return {
      reciterNameAr: isArabic ? currentName : otherName,
      reciterNameEn: isArabic ? otherName : currentName,
      moshafNameAr: isArabic ? currentMoshafName : otherMoshafName,
      moshafNameEn: isArabic ? otherMoshafName : currentMoshafName,
    };
  } catch {
    return {
      reciterNameAr: currentName,
      reciterNameEn: currentName,
      moshafNameAr: currentMoshafName,
      moshafNameEn: currentMoshafName,
    };
  }
}
