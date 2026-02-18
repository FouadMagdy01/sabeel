import { type SQLiteDatabase } from 'expo-sqlite';

export type AyahBound = {
  id: number;
  page: number;
  sura: number;
  ayah: number;
  line: number;
  min_x: number;
  max_x: number;
  min_y: number;
  max_y: number;
  img_width: number;
};

export async function getAyahBoundsForPage(db: SQLiteDatabase, page: number): Promise<AyahBound[]> {
  const results = await db.getAllAsync<AyahBound>(
    'SELECT * FROM ayah_bounds WHERE page = ? ORDER BY line, sura, ayah',
    [page]
  );
  return results;
}
