import * as FileSystem from 'expo-file-system/legacy';

const BASE_DIR = `${FileSystem.documentDirectory ?? ''}library-audio`;

function padSurahId(surahId: number): string {
  return String(surahId).padStart(3, '0');
}

function getReciterDir(reciterId: number, moshafId: number): string {
  return `${BASE_DIR}/${String(reciterId)}/${String(moshafId)}`;
}

export function getLocalSurahPath(reciterId: number, moshafId: number, surahId: number): string {
  return `${getReciterDir(reciterId, moshafId)}/${padSurahId(surahId)}.mp3`;
}

export async function isSurahFileExists(
  reciterId: number,
  moshafId: number,
  surahId: number
): Promise<boolean> {
  try {
    const path = getLocalSurahPath(reciterId, moshafId, surahId);
    const info = await FileSystem.getInfoAsync(path);
    return info.exists;
  } catch {
    return false;
  }
}

async function ensureDirectoryExists(dir: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

export async function downloadSurah(
  reciterId: number,
  moshafId: number,
  surahId: number,
  server: string
): Promise<{ filePath: string; fileSize: number }> {
  const dir = getReciterDir(reciterId, moshafId);
  await ensureDirectoryExists(dir);

  const filePath = getLocalSurahPath(reciterId, moshafId, surahId);
  const url = `${server}${padSurahId(surahId)}.mp3`;

  const downloadResult = await FileSystem.downloadAsync(url, filePath);

  if (downloadResult.status !== 200) {
    // Clean up partial download
    try {
      await FileSystem.deleteAsync(filePath, { idempotent: true });
    } catch {
      // Ignore cleanup errors
    }
    throw new Error(`[DownloadManager] HTTP ${String(downloadResult.status)} for ${url}`);
  }

  const info = await FileSystem.getInfoAsync(filePath);
  const fileSize = info.exists && 'size' in info ? (info.size ?? 0) : 0;

  return { filePath, fileSize };
}

export async function downloadAllSurahs(
  reciterId: number,
  moshafId: number,
  surahList: string,
  server: string,
  onProgress: (completed: number, total: number, currentSurahId: number) => void | Promise<void>,
  shouldCancel: () => boolean
): Promise<{ completed: number; total: number }> {
  const surahIds = surahList.split(',').map(Number);
  const total = surahIds.length;
  let completed = 0;

  for (const surahId of surahIds) {
    if (shouldCancel()) {
      console.warn('[DownloadManager] Bulk download cancelled');
      return { completed, total };
    }

    // Skip already downloaded
    const exists = await isSurahFileExists(reciterId, moshafId, surahId);
    if (exists) {
      completed++;
      await onProgress(completed, total, surahId);
      continue;
    }

    try {
      await downloadSurah(reciterId, moshafId, surahId, server);
      completed++;
      await onProgress(completed, total, surahId);
    } catch (error) {
      console.warn('[DownloadManager] Failed to download surah', surahId, error);
      // Continue with next surah on individual failure
    }
  }

  return { completed, total };
}

export async function deleteSurah(
  reciterId: number,
  moshafId: number,
  surahId: number
): Promise<void> {
  try {
    const filePath = getLocalSurahPath(reciterId, moshafId, surahId);
    await FileSystem.deleteAsync(filePath, { idempotent: true });
  } catch (error) {
    console.warn('[DownloadManager] deleteSurah error:', error);
  }
}

export async function deleteAllForReciter(reciterId: number, moshafId: number): Promise<void> {
  try {
    const dir = getReciterDir(reciterId, moshafId);
    await FileSystem.deleteAsync(dir, { idempotent: true });
  } catch (error) {
    console.warn('[DownloadManager] deleteAllForReciter error:', error);
  }
}
