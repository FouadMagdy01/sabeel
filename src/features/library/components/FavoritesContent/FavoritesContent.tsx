import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View, useWindowDimensions } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { TabView } from 'react-native-tab-view';

import { FavoriteReciterCard } from '../FavoriteReciterCard';
import { FavoriteSuraCard } from '../FavoriteSuraCard';
import { LibraryList } from '../LibraryList';
import { LibraryTabBar } from '../LibraryTabBar';

import {
  useFavoriteReciters,
  useFavoriteSurahs,
  useToggleFavoriteReciter,
  useToggleFavoriteSurah,
} from '../../hooks/useFavorites';

import type { FavoriteReciter, FavoriteSura } from '../../types';
import { styles } from './FavoritesContent.styles';

interface FavoritesContentProps {
  bottomPadding?: number;
}

export const FavoritesContent = ({ bottomPadding = 0 }: FavoritesContentProps) => {
  const { t, i18n } = useTranslation();
  const { theme } = useUnistyles();
  const layout = useWindowDimensions();
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  const { data: surahs, isLoading: loadingSurahs } = useFavoriteSurahs();
  const { data: reciters, isLoading: loadingReciters } = useFavoriteReciters();
  const toggleSurahFav = useToggleFavoriteSurah();
  const toggleReciterFav = useToggleFavoriteReciter();
  const playSurah = usePlayerStore((s) => s.playSurah);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const playerSource = usePlayerStore((s) => s.playerSource);
  const currentLibraryReciterId = usePlayerStore((s) => s.currentLibraryReciterId);
  const currentMoshafId = usePlayerStore((s) => s.currentMoshafId);
  const currentSurahName = usePlayerStore((s) => s.currentSurahName);
  const isPlayerPlaying = usePlayerStore((s) => s.isPlaying);

  const isArabic = i18n.language === 'ar';

  const isReciterCurrentlyPlaying = useCallback(
    (reciterId: number, moshafId: number) =>
      playerSource === 'library' &&
      currentLibraryReciterId === reciterId &&
      currentMoshafId === moshafId &&
      isPlayerPlaying,
    [playerSource, currentLibraryReciterId, currentMoshafId, isPlayerPlaying]
  );

  const isSurahCurrentlyPlaying = useCallback(
    (reciterId: number, moshafId: number, surahId: number) =>
      playerSource === 'library' &&
      currentLibraryReciterId === reciterId &&
      currentMoshafId === moshafId &&
      currentSurahName === String(surahId) &&
      isPlayerPlaying,
    [playerSource, currentLibraryReciterId, currentMoshafId, currentSurahName, isPlayerPlaying]
  );

  const handlePlaySura = useCallback(
    (sura: FavoriteSura) => {
      if (isSurahCurrentlyPlaying(sura.reciterId, sura.moshafId, sura.surahId)) {
        void togglePlayPause();
        return;
      }
      const reciterDisplayName = isArabic
        ? sura.reciterNameAr || sura.reciterNameEn
        : sura.reciterNameEn || sura.reciterNameAr;

      void playSurah(
        sura.surahId,
        sura.reciterId,
        sura.moshafId,
        reciterDisplayName,
        sura.server,
        sura.surahList
      );
    },
    [playSurah, togglePlayPause, isSurahCurrentlyPlaying, isArabic]
  );

  const handlePlayReciter = useCallback(
    (reciter: FavoriteReciter) => {
      if (isReciterCurrentlyPlaying(reciter.reciterId, reciter.moshafId)) {
        void togglePlayPause();
        return;
      }
      const reciterDisplayName = isArabic
        ? reciter.reciterNameAr || reciter.reciterNameEn
        : reciter.reciterNameEn || reciter.reciterNameAr;
      const surahIds = reciter.surahList.split(',').map(Number);
      if (surahIds.length > 0) {
        void playSurah(
          surahIds[0],
          reciter.reciterId,
          reciter.moshafId,
          reciterDisplayName,
          reciter.server,
          reciter.surahList
        );
      }
    },
    [playSurah, togglePlayPause, isReciterCurrentlyPlaying, isArabic]
  );

  const handleUnfavoriteSura = useCallback(
    (sura: FavoriteSura) => {
      toggleSurahFav.mutate({
        isFavorited: true,
        reciterId: sura.reciterId,
        moshafId: sura.moshafId,
        surahId: sura.surahId,
        reciterNameAr: sura.reciterNameAr,
        reciterNameEn: sura.reciterNameEn,
        moshafNameAr: sura.moshafNameAr,
        moshafNameEn: sura.moshafNameEn,
        server: sura.server,
        surahList: sura.surahList,
      });
    },
    [toggleSurahFav]
  );

  const handleSuraPress = useCallback(
    (sura: FavoriteSura) => {
      const reciterDisplayName = isArabic
        ? sura.reciterNameAr || sura.reciterNameEn
        : sura.reciterNameEn || sura.reciterNameAr;
      const moshafDisplayName = isArabic
        ? sura.moshafNameAr || sura.moshafNameEn
        : sura.moshafNameEn || sura.moshafNameAr;

      router.push({
        pathname: '/(main)/reciter-surahs',
        params: {
          reciterId: sura.reciterId,
          moshafId: sura.moshafId,
          reciterName: reciterDisplayName,
          moshafName: moshafDisplayName,
          server: sura.server,
          surahList: sura.surahList,
        },
      } as never);
    },
    [router, isArabic]
  );

  const handleUnfavoriteReciter = useCallback(
    (reciter: FavoriteReciter) => {
      toggleReciterFav.mutate({
        isFavorited: true,
        reciterId: reciter.reciterId,
        moshafId: reciter.moshafId,
        reciterName: reciter.reciterNameAr || reciter.reciterNameEn,
        moshafName: reciter.moshafNameAr || reciter.moshafNameEn,
        language: 'ar',
        server: reciter.server,
        surahList: reciter.surahList,
        surahTotal: reciter.surahTotal,
      });
    },
    [toggleReciterFav]
  );

  const handleReciterPress = useCallback(
    (reciter: FavoriteReciter) => {
      const reciterDisplayName = isArabic
        ? reciter.reciterNameAr || reciter.reciterNameEn
        : reciter.reciterNameEn || reciter.reciterNameAr;
      const moshafDisplayName = isArabic
        ? reciter.moshafNameAr || reciter.moshafNameEn
        : reciter.moshafNameEn || reciter.moshafNameAr;

      router.push({
        pathname: '/(main)/reciter-surahs',
        params: {
          reciterId: reciter.reciterId,
          moshafId: reciter.moshafId,
          reciterName: reciterDisplayName,
          moshafName: moshafDisplayName,
          server: reciter.server,
          surahList: reciter.surahList,
        },
      } as never);
    },
    [router, isArabic]
  );

  const emptyState = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Icon familyName="MaterialIcons" iconName="favorite-border" size={48} variant="muted" />
        <Typography size="sm" color="secondary" align="center">
          {t('screens.library.favorites.empty')}
        </Typography>
        <Typography size="xs" color="muted" align="center">
          {t('screens.library.favorites.emptyHint')}
        </Typography>
      </View>
    ),
    [t]
  );

  const routes = useMemo(
    () => [
      { key: 'suras', title: t('screens.library.subtabs.suras') },
      { key: 'reciters', title: t('screens.library.subtabs.reciters') },
    ],
    [t]
  );

  const renderScene = useCallback(
    ({ route }: { route: { key: string } }) => {
      switch (route.key) {
        case 'suras':
          if (loadingSurahs) {
            return (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={theme.colors.brand.primary} />
              </View>
            );
          }
          if (!surahs?.length) return emptyState;
          return (
            <LibraryList
              data={surahs}
              renderItem={({ item }: { item: FavoriteSura }) => (
                <FavoriteSuraCard
                  sura={item}
                  onPress={handleSuraPress}
                  onPlay={handlePlaySura}
                  onUnfavorite={handleUnfavoriteSura}
                  isPlaying={isSurahCurrentlyPlaying(item.reciterId, item.moshafId, item.surahId)}
                />
              )}
              keyExtractor={(item: FavoriteSura) => String(item.id)}
              bottomPadding={bottomPadding}
            />
          );
        case 'reciters':
          if (loadingReciters) {
            return (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={theme.colors.brand.primary} />
              </View>
            );
          }
          if (!reciters?.length) return emptyState;
          return (
            <LibraryList
              data={reciters}
              renderItem={({ item }: { item: FavoriteReciter }) => (
                <FavoriteReciterCard
                  reciter={item}
                  onPress={handleReciterPress}
                  onPlay={handlePlayReciter}
                  onUnfavorite={handleUnfavoriteReciter}
                  isPlaying={isReciterCurrentlyPlaying(item.reciterId, item.moshafId)}
                />
              )}
              keyExtractor={(item: FavoriteReciter) => String(item.id)}
              bottomPadding={bottomPadding}
            />
          );
        default:
          return null;
      }
    },
    [
      loadingSurahs,
      loadingReciters,
      surahs,
      reciters,
      emptyState,
      handleSuraPress,
      handlePlaySura,
      handleUnfavoriteSura,
      handleReciterPress,
      handlePlayReciter,
      handleUnfavoriteReciter,
      isSurahCurrentlyPlaying,
      isReciterCurrentlyPlaying,
      theme.colors.brand.primary,
      bottomPadding,
    ]
  );

  const renderTabBar = useCallback(
    (props: {
      navigationState: {
        index: number;
        routes: { key: string; title: string }[];
      };
    }) => (
      <LibraryTabBar
        routes={props.navigationState.routes}
        activeIndex={props.navigationState.index}
        onTabPress={setTabIndex}
      />
    ),
    []
  );

  return (
    <TabView
      navigationState={{ index: tabIndex, routes }}
      renderScene={renderScene}
      onIndexChange={setTabIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
};
