import i18n from '@/i18n/config';
import { Language, QuranClient } from '@quranjs/api';

let client: QuranClient | null = null;

export function getQuranClient(): QuranClient {
  client ??= new QuranClient({
    clientId: 'd62248e9-7f70-417b-b236-7e2e76ef774f',
    clientSecret: '3n9otUnCllRxoDm.~tajWU-opI',
    defaults: {
      language: i18n.language === 'ar' ? Language.ARABIC : Language.ENGLISH,
    },
  });
  return client;
}

export function resolveAudioUrl(url: string): string {
  let resolved: string;
  if (url.startsWith('//')) {
    resolved = `https:${url}`;
  } else {
    resolved = `https://audio.qurancdn.com/${url}`;
  }
  return resolved;
}
