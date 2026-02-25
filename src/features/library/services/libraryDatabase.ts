import { File } from 'expo-file-system/next';
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import type { DownloadedSura, FavoriteReciter, FavoriteSura } from '../types';

const DB_NAME = 'library_favorites.db';
let dbInstance: SQLiteDatabase | null = null;

export async function getLibraryDb(): Promise<SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  dbInstance = await openDatabaseAsync(DB_NAME);
  await initTables(dbInstance);
  return dbInstance;
}

async function initTables(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorite_surahs (
      id INTEGER PRIMARY KEY,
      reciter_id INTEGER NOT NULL,
      moshaf_id INTEGER NOT NULL,
      surah_id INTEGER NOT NULL,
      reciter_name_ar TEXT NOT NULL,
      reciter_name_en TEXT NOT NULL,
      moshaf_name_ar TEXT NOT NULL,
      moshaf_name_en TEXT NOT NULL,
      server TEXT NOT NULL,
      surah_list TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE(reciter_id, moshaf_id, surah_id)
    );

    CREATE TABLE IF NOT EXISTS favorite_reciters (
      id INTEGER PRIMARY KEY,
      reciter_id INTEGER NOT NULL,
      moshaf_id INTEGER NOT NULL,
      reciter_name_ar TEXT NOT NULL,
      reciter_name_en TEXT NOT NULL,
      moshaf_name_ar TEXT NOT NULL,
      moshaf_name_en TEXT NOT NULL,
      server TEXT NOT NULL,
      surah_list TEXT NOT NULL,
      surah_total INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE(reciter_id, moshaf_id)
    );

    CREATE TABLE IF NOT EXISTS downloaded_surahs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reciter_id INTEGER NOT NULL,
      moshaf_id INTEGER NOT NULL,
      surah_id INTEGER NOT NULL,
      reciter_name_ar TEXT NOT NULL,
      reciter_name_en TEXT NOT NULL,
      moshaf_name_ar TEXT NOT NULL,
      moshaf_name_en TEXT NOT NULL,
      server TEXT NOT NULL,
      surah_list TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      UNIQUE(reciter_id, moshaf_id, surah_id)
    );
  `);
}

// ─── Favorite Surahs ──────────────────────────────────────

function buildFavoriteSurahId(reciterId: number, moshafId: number, surahId: number): number {
  return reciterId * 1000000 + moshafId * 1000 + surahId;
}

export async function addFavoriteSurah(params: {
  reciterId: number;
  moshafId: number;
  surahId: number;
  reciterNameAr: string;
  reciterNameEn: string;
  moshafNameAr: string;
  moshafNameEn: string;
  server: string;
  surahList: string;
}): Promise<void> {
  try {
    const db = await getLibraryDb();
    const id = buildFavoriteSurahId(params.reciterId, params.moshafId, params.surahId);
    await db.runAsync(
      `INSERT OR REPLACE INTO favorite_surahs
       (id, reciter_id, moshaf_id, surah_id, reciter_name_ar, reciter_name_en,
        moshaf_name_ar, moshaf_name_en, server, surah_list, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      params.reciterId,
      params.moshafId,
      params.surahId,
      params.reciterNameAr,
      params.reciterNameEn,
      params.moshafNameAr,
      params.moshafNameEn,
      params.server,
      params.surahList,
      Date.now()
    );
  } catch (error) {
    console.log('[FavoritesDB] addFavoriteSurah error:', error);
    throw error;
  }
}

export async function removeFavoriteSurah(
  reciterId: number,
  moshafId: number,
  surahId: number
): Promise<void> {
  try {
    const db = await getLibraryDb();
    await db.runAsync(
      'DELETE FROM favorite_surahs WHERE reciter_id = ? AND moshaf_id = ? AND surah_id = ?',
      reciterId,
      moshafId,
      surahId
    );
  } catch (error) {
    console.log('[FavoritesDB] removeFavoriteSurah error:', error);
    throw error;
  }
}

export async function isSurahFavorited(
  reciterId: number,
  moshafId: number,
  surahId: number
): Promise<boolean> {
  try {
    const db = await getLibraryDb();
    const row = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM favorite_surahs WHERE reciter_id = ? AND moshaf_id = ? AND surah_id = ?',
      reciterId,
      moshafId,
      surahId
    );
    return (row?.count ?? 0) > 0;
  } catch (error) {
    console.log('[FavoritesDB] isSurahFavorited error:', error);
    return false;
  }
}

export async function getAllFavoriteSurahs(): Promise<FavoriteSura[]> {
  try {
    const db = await getLibraryDb();
    const rows = await db.getAllAsync<{
      id: number;
      reciter_id: number;
      moshaf_id: number;
      surah_id: number;
      reciter_name_ar: string;
      reciter_name_en: string;
      moshaf_name_ar: string;
      moshaf_name_en: string;
      server: string;
      surah_list: string;
      created_at: number;
    }>('SELECT * FROM favorite_surahs ORDER BY created_at DESC');

    return rows.map((row) => ({
      id: row.id,
      reciterId: row.reciter_id,
      moshafId: row.moshaf_id,
      surahId: row.surah_id,
      reciterNameAr: row.reciter_name_ar,
      reciterNameEn: row.reciter_name_en,
      moshafNameAr: row.moshaf_name_ar,
      moshafNameEn: row.moshaf_name_en,
      server: row.server,
      surahList: row.surah_list,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.log('[FavoritesDB] getAllFavoriteSurahs error:', error);
    return [];
  }
}

// ─── Favorite Reciters ──────────────────────────────────────

function buildFavoriteReciterId(reciterId: number, moshafId: number): number {
  return reciterId * 1000 + moshafId;
}

export async function addFavoriteReciter(params: {
  reciterId: number;
  moshafId: number;
  reciterNameAr: string;
  reciterNameEn: string;
  moshafNameAr: string;
  moshafNameEn: string;
  server: string;
  surahList: string;
  surahTotal: number;
}): Promise<void> {
  try {
    const db = await getLibraryDb();
    const id = buildFavoriteReciterId(params.reciterId, params.moshafId);
    await db.runAsync(
      `INSERT OR REPLACE INTO favorite_reciters
       (id, reciter_id, moshaf_id, reciter_name_ar, reciter_name_en,
        moshaf_name_ar, moshaf_name_en, server, surah_list, surah_total, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      params.reciterId,
      params.moshafId,
      params.reciterNameAr,
      params.reciterNameEn,
      params.moshafNameAr,
      params.moshafNameEn,
      params.server,
      params.surahList,
      params.surahTotal,
      Date.now()
    );
  } catch (error) {
    console.log('[FavoritesDB] addFavoriteReciter error:', error);
    throw error;
  }
}

export async function removeFavoriteReciter(reciterId: number, moshafId: number): Promise<void> {
  try {
    const db = await getLibraryDb();
    await db.runAsync(
      'DELETE FROM favorite_reciters WHERE reciter_id = ? AND moshaf_id = ?',
      reciterId,
      moshafId
    );
  } catch (error) {
    console.log('[FavoritesDB] removeFavoriteReciter error:', error);
    throw error;
  }
}

export async function isReciterFavorited(reciterId: number, moshafId: number): Promise<boolean> {
  try {
    const db = await getLibraryDb();
    const row = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM favorite_reciters WHERE reciter_id = ? AND moshaf_id = ?',
      reciterId,
      moshafId
    );
    return (row?.count ?? 0) > 0;
  } catch (error) {
    console.log('[FavoritesDB] isReciterFavorited error:', error);
    return false;
  }
}

export async function getAllFavoriteReciters(): Promise<FavoriteReciter[]> {
  try {
    const db = await getLibraryDb();
    const rows = await db.getAllAsync<{
      id: number;
      reciter_id: number;
      moshaf_id: number;
      reciter_name_ar: string;
      reciter_name_en: string;
      moshaf_name_ar: string;
      moshaf_name_en: string;
      server: string;
      surah_list: string;
      surah_total: number;
      created_at: number;
    }>('SELECT * FROM favorite_reciters ORDER BY created_at DESC');

    return rows.map((row) => ({
      id: row.id,
      reciterId: row.reciter_id,
      moshafId: row.moshaf_id,
      reciterNameAr: row.reciter_name_ar,
      reciterNameEn: row.reciter_name_en,
      moshafNameAr: row.moshaf_name_ar,
      moshafNameEn: row.moshaf_name_en,
      server: row.server,
      surahList: row.surah_list,
      surahTotal: row.surah_total,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.log('[FavoritesDB] getAllFavoriteReciters error:', error);
    return [];
  }
}

// ─── Downloaded Surahs ──────────────────────────────────────

export async function addDownloadedSurah(params: {
  reciterId: number;
  moshafId: number;
  surahId: number;
  reciterNameAr: string;
  reciterNameEn: string;
  moshafNameAr: string;
  moshafNameEn: string;
  server: string;
  surahList: string;
  filePath: string;
  fileSize: number;
}): Promise<void> {
  try {
    const db = await getLibraryDb();
    await db.runAsync(
      `INSERT OR REPLACE INTO downloaded_surahs
       (reciter_id, moshaf_id, surah_id, reciter_name_ar, reciter_name_en,
        moshaf_name_ar, moshaf_name_en, server, surah_list, file_path, file_size, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params.reciterId,
      params.moshafId,
      params.surahId,
      params.reciterNameAr,
      params.reciterNameEn,
      params.moshafNameAr,
      params.moshafNameEn,
      params.server,
      params.surahList,
      params.filePath,
      params.fileSize,
      Date.now()
    );
  } catch (error) {
    console.log('[DownloadsDB] addDownloadedSurah error:', error);
    throw error;
  }
}

export async function removeDownloadedSurah(
  reciterId: number,
  moshafId: number,
  surahId: number
): Promise<void> {
  try {
    const db = await getLibraryDb();
    await db.runAsync(
      'DELETE FROM downloaded_surahs WHERE reciter_id = ? AND moshaf_id = ? AND surah_id = ?',
      reciterId,
      moshafId,
      surahId
    );
  } catch (error) {
    console.log('[DownloadsDB] removeDownloadedSurah error:', error);
    throw error;
  }
}

export async function isSurahDownloaded(
  reciterId: number,
  moshafId: number,
  surahId: number
): Promise<boolean> {
  try {
    const db = await getLibraryDb();
    const row = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM downloaded_surahs WHERE reciter_id = ? AND moshaf_id = ? AND surah_id = ?',
      reciterId,
      moshafId,
      surahId
    );
    return (row?.count ?? 0) > 0;
  } catch (error) {
    console.log('[DownloadsDB] isSurahDownloaded error:', error);
    return false;
  }
}

export async function getAllDownloadedSurahs(): Promise<DownloadedSura[]> {
  try {
    const db = await getLibraryDb();
    const rows = await db.getAllAsync<{
      id: number;
      reciter_id: number;
      moshaf_id: number;
      surah_id: number;
      reciter_name_ar: string;
      reciter_name_en: string;
      moshaf_name_ar: string;
      moshaf_name_en: string;
      server: string;
      surah_list: string;
      file_path: string;
      file_size: number;
      created_at: number;
    }>('SELECT * FROM downloaded_surahs ORDER BY created_at DESC');

    return rows.map((row) => ({
      id: row.id,
      reciterId: row.reciter_id,
      moshafId: row.moshaf_id,
      surahId: row.surah_id,
      reciterNameAr: row.reciter_name_ar,
      reciterNameEn: row.reciter_name_en,
      moshafNameAr: row.moshaf_name_ar,
      moshafNameEn: row.moshaf_name_en,
      server: row.server,
      surahList: row.surah_list,
      filePath: row.file_path,
      fileSize: row.file_size,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.log('[DownloadsDB] getAllDownloadedSurahs error:', error);
    return [];
  }
}

export async function getDownloadedSurahsByReciter(
  reciterId: number,
  moshafId: number
): Promise<DownloadedSura[]> {
  try {
    const db = await getLibraryDb();
    const rows = await db.getAllAsync<{
      id: number;
      reciter_id: number;
      moshaf_id: number;
      surah_id: number;
      reciter_name_ar: string;
      reciter_name_en: string;
      moshaf_name_ar: string;
      moshaf_name_en: string;
      server: string;
      surah_list: string;
      file_path: string;
      file_size: number;
      created_at: number;
    }>(
      'SELECT * FROM downloaded_surahs WHERE reciter_id = ? AND moshaf_id = ? ORDER BY surah_id ASC',
      reciterId,
      moshafId
    );

    return rows.map((row) => ({
      id: row.id,
      reciterId: row.reciter_id,
      moshafId: row.moshaf_id,
      surahId: row.surah_id,
      reciterNameAr: row.reciter_name_ar,
      reciterNameEn: row.reciter_name_en,
      moshafNameAr: row.moshaf_name_ar,
      moshafNameEn: row.moshaf_name_en,
      server: row.server,
      surahList: row.surah_list,
      filePath: row.file_path,
      fileSize: row.file_size,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.log('[DownloadsDB] getDownloadedSurahsByReciter error:', error);
    return [];
  }
}

export async function deleteAllDownloadsForReciter(
  reciterId: number,
  moshafId: number
): Promise<void> {
  try {
    const db = await getLibraryDb();
    await db.runAsync(
      'DELETE FROM downloaded_surahs WHERE reciter_id = ? AND moshaf_id = ?',
      reciterId,
      moshafId
    );
  } catch (error) {
    console.log('[DownloadsDB] deleteAllDownloadsForReciter error:', error);
    throw error;
  }
}

export async function getDownloadedSurahPath(
  reciterId: number,
  moshafId: number,
  surahId: number
): Promise<string | null> {
  try {
    const db = await getLibraryDb();
    const row = await db.getFirstAsync<{ file_path: string }>(
      'SELECT file_path FROM downloaded_surahs WHERE reciter_id = ? AND moshaf_id = ? AND surah_id = ?',
      reciterId,
      moshafId,
      surahId
    );
    if (!row?.file_path) return null;

    // Verify the file actually exists on disk (stale DB entries can reference deleted files)
    const file = new File(row.file_path);
    if (!file.exists) {
      // Clean up stale DB entry
      await db.runAsync(
        'DELETE FROM downloaded_surahs WHERE reciter_id = ? AND moshaf_id = ? AND surah_id = ?',
        reciterId,
        moshafId,
        surahId
      );
      return null;
    }

    return row.file_path;
  } catch (error) {
    console.log('[DownloadsDB] getDownloadedSurahPath error:', error);
    return null;
  }
}
