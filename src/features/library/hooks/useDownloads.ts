import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import {
  getAllDownloadedSurahs,
  getDownloadedSurahsByReciter,
  isSurahDownloaded,
} from '../services/libraryDatabase';
import { useDownloadStore } from '../stores/downloadStore';
import type { DownloadedReciter } from '../types';

const DOWNLOADED_SURAHS_KEY = ['downloadedSurahs'] as const;
const DOWNLOADED_RECITERS_KEY = ['downloadedReciters'] as const;

export function useDownloadedSurahs() {
  return useQuery({
    queryKey: DOWNLOADED_SURAHS_KEY,
    queryFn: getAllDownloadedSurahs,
  });
}

export function useDownloadedReciters() {
  return useQuery<DownloadedReciter[]>({
    queryKey: DOWNLOADED_RECITERS_KEY,
    queryFn: async () => {
      const surahs = await getAllDownloadedSurahs();
      const reciterMap = new Map<string, DownloadedReciter>();

      for (const surah of surahs) {
        const key = `${String(surah.reciterId)}:${String(surah.moshafId)}`;
        const existing = reciterMap.get(key);
        if (existing) {
          existing.surasCount++;
          existing.totalSize += surah.fileSize;
        } else {
          reciterMap.set(key, {
            reciterId: surah.reciterId,
            moshafId: surah.moshafId,
            reciterNameAr: surah.reciterNameAr,
            reciterNameEn: surah.reciterNameEn,
            moshafNameAr: surah.moshafNameAr,
            moshafNameEn: surah.moshafNameEn,
            server: surah.server,
            surahList: surah.surahList,
            surasCount: 1,
            totalSize: surah.fileSize,
          });
        }
      }

      return Array.from(reciterMap.values());
    },
  });
}

export function useIsSurahDownloaded(reciterId: number, moshafId: number, surahId: number) {
  return useQuery({
    queryKey: ['isSurahDownloaded', reciterId, moshafId, surahId],
    queryFn: () => isSurahDownloaded(reciterId, moshafId, surahId),
  });
}

export function useDownloadedSurahIds(reciterId: number, moshafId: number) {
  const { data: surahs } = useQuery({
    queryKey: ['downloadedSurahsByReciter', reciterId, moshafId],
    queryFn: () => getDownloadedSurahsByReciter(reciterId, moshafId),
  });

  const isDownloaded = useCallback(
    (surahId: number): boolean => {
      if (!surahs) return false;
      return surahs.some((s) => s.surahId === surahId);
    },
    [surahs]
  );

  return { isDownloaded, surahs };
}

export function useDownloadProgress(reciterId: number, moshafId: number, surahId: number) {
  const key = `${String(reciterId)}:${String(moshafId)}:${String(surahId)}`;
  return useDownloadStore((state) => state.activeDownloads[key]);
}

export function useBulkDownloadProgress() {
  return useDownloadStore((state) => state.bulkDownload);
}

export function useInvalidateDownloads() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: DOWNLOADED_SURAHS_KEY });
    void queryClient.invalidateQueries({ queryKey: DOWNLOADED_RECITERS_KEY });
    void queryClient.invalidateQueries({ queryKey: ['downloadedSurahsByReciter'] });
    void queryClient.invalidateQueries({ queryKey: ['isSurahDownloaded'] });
  }, [queryClient]);
}

export function useDownloadActions() {
  const startSurahDownload = useDownloadStore((s) => s.startSurahDownload);
  const startBulkDownload = useDownloadStore((s) => s.startBulkDownload);
  const cancelBulkDownload = useDownloadStore((s) => s.cancelBulkDownload);
  const deleteSurahDownload = useDownloadStore((s) => s.deleteSurahDownload);
  const deleteReciterDownloads = useDownloadStore((s) => s.deleteReciterDownloads);
  const invalidate = useInvalidateDownloads();

  return {
    startSurahDownload: async (...args: Parameters<typeof startSurahDownload>) => {
      await startSurahDownload(...args);
      invalidate();
    },
    startBulkDownload: async (...args: Parameters<typeof startBulkDownload>) => {
      await startBulkDownload(...args);
      invalidate();
    },
    cancelBulkDownload,
    deleteSurahDownload: async (...args: Parameters<typeof deleteSurahDownload>) => {
      await deleteSurahDownload(...args);
      invalidate();
    },
    deleteReciterDownloads: async (...args: Parameters<typeof deleteReciterDownloads>) => {
      await deleteReciterDownloads(...args);
      invalidate();
    },
  };
}
