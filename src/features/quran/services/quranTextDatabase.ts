import { type SQLiteDatabase } from 'expo-sqlite';

export type Verse = {
  id: number;
  surah_id: number;
  ayah_number: number;
  verse_key: string;
  text_uthmani: string;
  juz_number: number;
  page_number: number;
};

export type Tafseer = {
  id: number;
  verse_id: number;
  tafseer_name: string;
  text: string;
};

export async function getVersesBySurah(db: SQLiteDatabase, surahId: number): Promise<Verse[]> {
  return db.getAllAsync<Verse>('SELECT * FROM verses WHERE surah_id = ? ORDER BY ayah_number', [
    surahId,
  ]);
}

export async function getVersesByPage(db: SQLiteDatabase, page: number): Promise<Verse[]> {
  return db.getAllAsync<Verse>(
    'SELECT * FROM verses WHERE page_number = ? ORDER BY surah_id, ayah_number',
    [page]
  );
}

export async function getVersesByJuz(db: SQLiteDatabase, juzNumber: number): Promise<Verse[]> {
  return db.getAllAsync<Verse>('SELECT * FROM verses WHERE juz_number = ? ORDER BY id', [
    juzNumber,
  ]);
}

export async function getTafseerForVerse(db: SQLiteDatabase, verseId: number): Promise<Tafseer[]> {
  return db.getAllAsync<Tafseer>('SELECT * FROM tafseer WHERE verse_id = ?', [verseId]);
}

export async function searchVerses(
  db: SQLiteDatabase,
  query: string,
  limit = 50
): Promise<Verse[]> {
  const pattern = `%${query}%`;
  return db.getAllAsync<Verse>(
    'SELECT * FROM verses WHERE text_uthmani LIKE ? ORDER BY id LIMIT ?',
    [pattern, limit]
  );
}

export async function getVerse(
  db: SQLiteDatabase,
  surahId: number,
  ayahNumber: number
): Promise<Verse | null> {
  return db.getFirstAsync<Verse>('SELECT * FROM verses WHERE surah_id = ? AND ayah_number = ?', [
    surahId,
    ayahNumber,
  ]);
}

export async function getPageForVerse(
  db: SQLiteDatabase,
  surahId: number,
  ayahNumber: number
): Promise<number | null> {
  const result = await db.getFirstAsync<{ page_number: number }>(
    'SELECT page_number FROM verses WHERE surah_id = ? AND ayah_number = ?',
    [surahId, ayahNumber]
  );
  return result?.page_number ?? null;
}
