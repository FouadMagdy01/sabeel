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

/**
 * Strip Arabic diacritics and normalize characters for search.
 * Must mirror the SQL normalization in ensureSearchColumn().
 */
function normalizeArabic(text: string): string {
  // Remove Arabic diacritics (tashkeel), tatweel, and Quranic annotation marks
  let result = text.replace(/[\u0640\u064B-\u0658\u065B-\u065E\u0670\u06D6-\u06ED]/g, '');
  // Normalize alef variants (أ إ آ ٱ) → ا
  result = result.replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627');
  // Normalize teh marbuta (ة) → ه
  result = result.replace(/\u0629/g, '\u0647');
  // Normalize alef maksura (ى) → ي
  result = result.replace(/\u0649/g, '\u064A');
  return result;
}

/** Track which db instances have been migrated this session */
const migratedDbs = new WeakSet<SQLiteDatabase>();

/**
 * Ensure the text_plain column exists for diacritics-free search.
 * Runs once per db instance per app session.
 */
async function ensureSearchColumn(db: SQLiteDatabase): Promise<void> {
  if (migratedDbs.has(db)) return;

  const columns = await db.getAllAsync<{ name: string }>("PRAGMA table_info('verses')");
  const hasColumn = columns.some((col) => col.name === 'text_plain');

  if (!hasColumn) {
    await db.execAsync('ALTER TABLE verses ADD COLUMN text_plain TEXT');

    // Build normalized text using chained REPLACE calls in SQL.
    // This strips diacritics, tatweel, and normalizes alef/teh/ya variants.
    const diacriticChars = [
      '\u0640', // tatweel
      '\u064B',
      '\u064C',
      '\u064D',
      '\u064E',
      '\u064F',
      '\u0650',
      '\u0651',
      '\u0652',
      '\u0653',
      '\u0654',
      '\u0655',
      '\u0656',
      '\u0657',
      '\u0658',
      '\u065B',
      '\u065C',
      '\u065D',
      '\u065E',
      '\u0670', // superscript alef
      '\u06D6',
      '\u06D7',
      '\u06D8',
      '\u06D9',
      '\u06DA',
      '\u06DB',
      '\u06DC',
      '\u06DD',
      '\u06DE',
      '\u06DF',
      '\u06E0',
      '\u06E1',
      '\u06E2',
      '\u06E3',
      '\u06E4',
      '\u06E5',
      '\u06E6',
      '\u06E7',
      '\u06E8',
      '\u06E9',
      '\u06EA',
      '\u06EB',
      '\u06EC',
      '\u06ED',
    ];

    // Build nested REPLACE: start from text_uthmani, strip each diacritical mark
    let expr = 'text_uthmani';
    for (const ch of diacriticChars) {
      expr = `REPLACE(${expr}, '${ch}', '')`;
    }
    // Normalize alef variants → ا
    expr = `REPLACE(${expr}, '\u0622', '\u0627')`; // آ
    expr = `REPLACE(${expr}, '\u0623', '\u0627')`; // أ
    expr = `REPLACE(${expr}, '\u0625', '\u0627')`; // إ
    expr = `REPLACE(${expr}, '\u0671', '\u0627')`; // ٱ
    // Normalize teh marbuta → ه
    expr = `REPLACE(${expr}, '\u0629', '\u0647')`;
    // Normalize alef maksura → ي
    expr = `REPLACE(${expr}, '\u0649', '\u064A')`;

    await db.execAsync(`UPDATE verses SET text_plain = ${expr}`);
    await db.execAsync('CREATE INDEX IF NOT EXISTS idx_verses_text_plain ON verses(text_plain)');
  }

  migratedDbs.add(db);
}

export async function searchVerses(
  db: SQLiteDatabase,
  query: string,
  limit = 50
): Promise<Verse[]> {
  await ensureSearchColumn(db);
  const normalizedQuery = normalizeArabic(query);
  const pattern = `%${normalizedQuery}%`;
  return db.getAllAsync<Verse>('SELECT * FROM verses WHERE text_plain LIKE ? ORDER BY id LIMIT ?', [
    pattern,
    limit,
  ]);
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
