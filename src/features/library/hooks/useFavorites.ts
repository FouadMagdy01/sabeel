import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import {
  addFavoriteReciter,
  addFavoriteSurah,
  getAllFavoriteReciters,
  getAllFavoriteSurahs,
  isReciterFavorited,
  isSurahFavorited,
  removeFavoriteReciter,
  removeFavoriteSurah,
} from '../services/libraryDatabase';
import { resolveReciterNames } from '../services/mp3QuranApi';

const FAVORITE_SURAHS_KEY = ['favoriteSurahs'] as const;
const FAVORITE_RECITERS_KEY = ['favoriteReciters'] as const;

export function useFavoriteSurahs() {
  return useQuery({
    queryKey: FAVORITE_SURAHS_KEY,
    queryFn: getAllFavoriteSurahs,
  });
}

export function useFavoriteReciters() {
  return useQuery({
    queryKey: FAVORITE_RECITERS_KEY,
    queryFn: getAllFavoriteReciters,
  });
}

export function useIsSurahFavorited(reciterId: number, moshafId: number, surahId: number) {
  return useQuery({
    queryKey: ['isSurahFavorited', reciterId, moshafId, surahId],
    queryFn: () => isSurahFavorited(reciterId, moshafId, surahId),
  });
}

export function useIsReciterFavorited(reciterId: number, moshafId: number) {
  return useQuery({
    queryKey: ['isReciterFavorited', reciterId, moshafId],
    queryFn: () => isReciterFavorited(reciterId, moshafId),
  });
}

export function useToggleFavoriteSurah() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      isFavorited: boolean;
      reciterId: number;
      moshafId: number;
      surahId: number;
      reciterNameAr: string;
      reciterNameEn: string;
      moshafNameAr: string;
      moshafNameEn: string;
      server: string;
      surahList: string;
    }) => {
      if (params.isFavorited) {
        await removeFavoriteSurah(params.reciterId, params.moshafId, params.surahId);
      } else {
        await addFavoriteSurah(params);
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: FAVORITE_SURAHS_KEY });
      void queryClient.invalidateQueries({
        queryKey: ['isSurahFavorited', variables.reciterId, variables.moshafId, variables.surahId],
      });
    },
  });
}

export function useToggleFavoriteReciter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      isFavorited: boolean;
      reciterId: number;
      moshafId: number;
      reciterName: string;
      moshafName: string;
      language: string;
      server: string;
      surahList: string;
      surahTotal: number;
    }) => {
      if (params.isFavorited) {
        await removeFavoriteReciter(params.reciterId, params.moshafId);
      } else {
        const names = await resolveReciterNames(
          params.reciterId,
          params.moshafId,
          params.reciterName,
          params.moshafName,
          params.language
        );
        await addFavoriteReciter({
          reciterId: params.reciterId,
          moshafId: params.moshafId,
          ...names,
          server: params.server,
          surahList: params.surahList,
          surahTotal: params.surahTotal,
        });
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: FAVORITE_RECITERS_KEY });
      void queryClient.invalidateQueries({
        queryKey: ['isReciterFavorited', variables.reciterId, variables.moshafId],
      });
    },
  });
}

export function useFavoriteSurahIds(reciterId: number, moshafId: number) {
  const { data: surahs } = useFavoriteSurahs();

  const isFavorited = useCallback(
    (surahId: number): boolean => {
      if (!surahs) return false;
      return surahs.some(
        (s) => s.reciterId === reciterId && s.moshafId === moshafId && s.surahId === surahId
      );
    },
    [surahs, reciterId, moshafId]
  );

  return { isFavorited };
}
