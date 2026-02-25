import { Share } from 'react-native';

import type { Verse } from './quranTextDatabase';

export function shareAyah(verse: Verse, surahName: string): void {
  void Share.share({
    message: `${verse.text_uthmani}\n\n— ${surahName} (${String(verse.surah_id)}:${String(verse.ayah_number)})`,
  });
}

export function shareAyahWithTafseer(
  verse: Verse,
  surahName: string,
  tafseerName: string,
  tafseerText: string
): void {
  void Share.share({
    message: `${verse.text_uthmani}\n\n${tafseerName}:\n${tafseerText}\n\n— ${surahName} (${String(verse.surah_id)}:${String(verse.ayah_number)})`,
  });
}
