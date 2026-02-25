import * as FileSystem from 'expo-file-system/legacy';
import { unzip } from 'react-native-zip-archive';

import { getItem, removeItem, setItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';

export type DownloadStatus = 'idle' | 'downloading' | 'downloaded' | 'extracting' | 'ready';

const ZIP_URL =
  'https://qokrjtcvqaaycntyldkn.supabase.co/storage/v1/object/public/quran-assets/quran-pages.zip';

const PAGES_DIR = `${FileSystem.documentDirectory}quran-pages/`;
const ZIP_PATH = `${FileSystem.cacheDirectory}quran-pages.zip`;

let currentDownload: FileSystem.DownloadResumable | null = null;

function getPersistedStatus(): DownloadStatus {
  const result = getItem<string>(STORAGE_KEYS.quran.downloadStatus);
  return (result.data as DownloadStatus) ?? 'idle';
}

function persistStatus(status: DownloadStatus) {
  setItem(STORAGE_KEYS.quran.downloadStatus, status);
}

function clearResumeData() {
  removeItem(STORAGE_KEYS.quran.downloadResume);
}

async function deleteZipSilently() {
  try {
    await FileSystem.deleteAsync(ZIP_PATH, { idempotent: true });
  } catch {
    // ignore
  }
}

export async function arePagesReady(): Promise<boolean> {
  for (const page of [1, 302, 604]) {
    const info = await FileSystem.getInfoAsync(`${PAGES_DIR}${page}.png`);
    if (!info.exists) return false;
  }
  return true;
}

export function getPageUri(page: number): string {
  return `${PAGES_DIR}${page}.png`;
}

export async function getInitialStatus(): Promise<DownloadStatus> {
  const stored = getPersistedStatus();

  if (stored === 'ready') {
    if (await arePagesReady()) return 'ready';
    persistStatus('idle');
    clearResumeData();
    return 'idle';
  }

  if (stored === 'extracting' || stored === 'downloaded') {
    const zipInfo = await FileSystem.getInfoAsync(ZIP_PATH);
    if (zipInfo.exists) return 'downloaded';
    persistStatus('idle');
    clearResumeData();
    return 'idle';
  }

  // Any other state — reset to idle and clean up
  if (stored !== 'idle') {
    persistStatus('idle');
    clearResumeData();
    await deleteZipSilently();
  }

  return 'idle';
}

/**
 * Start a fresh download. Throws on failure.
 * Resolves normally on success. Throws 'cancelled' if cancelDownload() was called.
 */
export async function startDownload(onProgress: (progress: number) => void): Promise<void> {
  persistStatus('downloading');
  clearResumeData();
  await deleteZipSilently();

  const progressCallback: FileSystem.DownloadProgressCallback = (data) => {
    if (data.totalBytesExpectedToWrite > 0) {
      onProgress(data.totalBytesWritten / data.totalBytesExpectedToWrite);
    }
  };

  currentDownload = FileSystem.createDownloadResumable(ZIP_URL, ZIP_PATH, {}, progressCallback);

  let result: FileSystem.FileSystemDownloadResult | undefined;
  try {
    result = await currentDownload.downloadAsync();
  } catch (err) {
    currentDownload = null;
    // If download was cancelled via pauseAsync, it throws.
    // Check if we were cancelled:
    if (getPersistedStatus() === 'idle') {
      throw new Error('cancelled');
    }
    persistStatus('idle');
    throw err;
  }

  currentDownload = null;

  // pauseAsync() causes downloadAsync() to resolve with undefined
  if (!result) {
    // Check if we were cancelled
    if (getPersistedStatus() === 'idle') {
      throw new Error('cancelled');
    }
    persistStatus('idle');
    throw new Error('Download returned no result');
  }

  persistStatus('downloaded');
}

/**
 * Hard cancel. Stops the download, deletes partial file, resets state.
 */
export async function cancelDownload(): Promise<void> {
  // Reset state FIRST so startDownload knows it was cancelled
  persistStatus('idle');
  clearResumeData();

  const download = currentDownload;
  currentDownload = null;

  if (download) {
    try {
      await download.pauseAsync();
    } catch {
      // ignore — may throw if already finished
    }
  }

  await deleteZipSilently();
}

export async function extractPages(): Promise<void> {
  persistStatus('extracting');

  const dirInfo = await FileSystem.getInfoAsync(PAGES_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PAGES_DIR, { intermediates: true });
  }

  // Validate zip exists before extraction
  const zipInfo = await FileSystem.getInfoAsync(ZIP_PATH);
  if (!zipInfo.exists) {
    persistStatus('idle');
    throw new Error('Zip file not found');
  }

  try {
    await unzip(ZIP_PATH, PAGES_DIR);
  } catch {
    // react-native-zip-archive can crash with NullPointerException on Android
    // when rejection code is null. Clean up and reset state.
    await deleteZipSilently();
    persistStatus('idle');
    throw new Error('Extraction failed — the download may be corrupted. Please try again.');
  }

  // Verify extraction produced the expected files
  if (!(await arePagesReady())) {
    await deleteZipSilently();
    persistStatus('idle');
    throw new Error('Extraction incomplete — some pages are missing. Please try again.');
  }

  await FileSystem.deleteAsync(ZIP_PATH, { idempotent: true });

  persistStatus('ready');
}
