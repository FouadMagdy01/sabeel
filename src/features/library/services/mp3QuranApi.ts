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
