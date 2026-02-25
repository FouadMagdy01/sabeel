import * as FileSystem from 'expo-file-system/legacy';
import { create } from 'zustand';

import i18n from '@/i18n/config';
import { usePlayerStore } from '@/features/quran/stores/playerStore';

import { resolveReciterNames } from '../services/mp3QuranApi';
import {
  addDownloadedSurah,
  deleteAllDownloadsForReciter,
  getDownloadedSurahsByReciter,
  removeDownloadedSurah,
} from '../services/libraryDatabase';
import {
  deleteAllForReciter,
  deleteSurah,
  downloadAllSurahs,
  downloadSurah,
  getLocalSurahPath,
  isSurahFileExists,
} from '../services/downloadManager';

interface DownloadProgress {
  progress: number;
  status: 'downloading' | 'completed' | 'error';
}

interface BulkDownloadState {
  reciterId: number;
  moshafId: number;
  completed: number;
  total: number;
  isActive: boolean;
}

interface ReciterNames {
  reciterNameAr: string;
  reciterNameEn: string;
  moshafNameAr: string;
  moshafNameEn: string;
}

interface DownloadStoreState {
  activeDownloads: Record<string, DownloadProgress>;
  bulkDownload: BulkDownloadState | null;
  cancelFlag: boolean;

  startSurahDownload: (
    reciterId: number,
    moshafId: number,
    surahId: number,
    server: string,
    surahList: string,
    names: ReciterNames
  ) => Promise<void>;

  startBulkDownload: (
    reciterId: number,
    moshafId: number,
    surahList: string,
    server: string,
    names: ReciterNames
  ) => Promise<void>;

  cancelBulkDownload: () => void;

  deleteSurahDownload: (reciterId: number, moshafId: number, surahId: number) => Promise<void>;

  deleteReciterDownloads: (reciterId: number, moshafId: number) => Promise<void>;
}

function makeKey(reciterId: number, moshafId: number, surahId: number): string {
  return `${String(reciterId)}:${String(moshafId)}:${String(surahId)}`;
}

export const useDownloadStore = create<DownloadStoreState>((set, get) => ({
  activeDownloads: {},
  bulkDownload: null,
  cancelFlag: false,

  startSurahDownload: async (reciterId, moshafId, surahId, server, surahList, names) => {
    const key = makeKey(reciterId, moshafId, surahId);

    // Skip if already downloading or downloaded
    const existing = get().activeDownloads[key];
    if (existing?.status === 'downloading') return;

    const fileExists = await isSurahFileExists(reciterId, moshafId, surahId);
    if (fileExists) return;

    set((state) => ({
      activeDownloads: {
        ...state.activeDownloads,
        [key]: { progress: 0, status: 'downloading' },
      },
    }));

    try {
      const resolvedNames = await resolveReciterNames(
        reciterId,
        moshafId,
        names.reciterNameAr || names.reciterNameEn,
        names.moshafNameAr || names.moshafNameEn,
        i18n.language
      );
      const { filePath, fileSize } = await downloadSurah(reciterId, moshafId, surahId, server);
      await addDownloadedSurah({
        reciterId,
        moshafId,
        surahId,
        ...resolvedNames,
        server,
        surahList,
        filePath,
        fileSize,
      });

      set((state) => ({
        activeDownloads: {
          ...state.activeDownloads,
          [key]: { progress: 1, status: 'completed' },
        },
      }));
    } catch (error) {
      console.log('[DownloadStore] startSurahDownload error:', error);
      set((state) => ({
        activeDownloads: {
          ...state.activeDownloads,
          [key]: { progress: 0, status: 'error' },
        },
      }));
    }
  },

  startBulkDownload: async (reciterId, moshafId, surahList, server, names) => {
    const surahIds = surahList.split(',').map(Number);
    const total = surahIds.length;

    const resolvedNames = await resolveReciterNames(
      reciterId,
      moshafId,
      names.reciterNameAr || names.reciterNameEn,
      names.moshafNameAr || names.moshafNameEn,
      i18n.language
    );

    set({
      cancelFlag: false,
      bulkDownload: { reciterId, moshafId, completed: 0, total, isActive: true },
    });

    await downloadAllSurahs(
      reciterId,
      moshafId,
      surahList,
      server,
      async (completed, _total, currentSurahId) => {
        set({
          bulkDownload: { reciterId, moshafId, completed, total, isActive: true },
        });

        // Record each downloaded surah in DB
        try {
          const filePath = getLocalSurahPath(reciterId, moshafId, currentSurahId);
          const info = await FileSystem.getInfoAsync(filePath);
          const fileSize = info.exists && 'size' in info ? (info.size ?? 0) : 0;

          await addDownloadedSurah({
            reciterId,
            moshafId,
            surahId: currentSurahId,
            ...resolvedNames,
            server,
            surahList,
            filePath,
            fileSize,
          });
        } catch {
          // Individual record error, continue
        }
      },
      () => get().cancelFlag
    );

    set({ bulkDownload: null });
  },

  cancelBulkDownload: () => {
    set({ cancelFlag: true });
  },

  deleteSurahDownload: async (reciterId, moshafId, surahId) => {
    try {
      // Stop player if this surah is currently playing
      const playerState = usePlayerStore.getState();
      if (
        playerState.playerSource === 'library' &&
        playerState.currentLibraryReciterId === reciterId &&
        playerState.currentMoshafId === moshafId &&
        playerState.currentSurahName === String(surahId)
      ) {
        await usePlayerStore.getState().stop();
      }

      await deleteSurah(reciterId, moshafId, surahId);
      await removeDownloadedSurah(reciterId, moshafId, surahId);

      const key = makeKey(reciterId, moshafId, surahId);
      set((state) => {
        const { [key]: _, ...rest } = state.activeDownloads;
        return { activeDownloads: rest };
      });

      // Clean up empty reciter directory if no surahs remain
      const remaining = await getDownloadedSurahsByReciter(reciterId, moshafId);
      if (remaining.length === 0) {
        await deleteAllForReciter(reciterId, moshafId);
      }
    } catch (error) {
      console.log('[DownloadStore] deleteSurahDownload error:', error);
    }
  },

  deleteReciterDownloads: async (reciterId, moshafId) => {
    try {
      // Stop player if this reciter is currently playing
      const playerState = usePlayerStore.getState();
      if (
        playerState.playerSource === 'library' &&
        playerState.currentLibraryReciterId === reciterId &&
        playerState.currentMoshafId === moshafId
      ) {
        await usePlayerStore.getState().stop();
      }

      await deleteAllForReciter(reciterId, moshafId);
      await deleteAllDownloadsForReciter(reciterId, moshafId);
    } catch (error) {
      console.log('[DownloadStore] deleteReciterDownloads error:', error);
    }
  },
}));
