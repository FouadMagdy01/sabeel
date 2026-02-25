import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View, useWindowDimensions } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { TabView } from 'react-native-tab-view';

import { DownloadedReciterCard } from '../DownloadedReciterCard';
import { DownloadedSuraCard } from '../DownloadedSuraCard';
import { LibraryList } from '../LibraryList';
import { LibraryTabBar } from '../LibraryTabBar';

import {
  useDownloadActions,
  useDownloadedReciters,
  useDownloadedSurahs,
} from '../../hooks/useDownloads';

import type { DownloadedReciter, DownloadedSura } from '../../types';
import { styles } from './DownloadsContent.styles';

export const DownloadsContent = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useUnistyles();
  const layout = useWindowDimensions();
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  const { data: surahs, isLoading: loadingSurahs } = useDownloadedSurahs();
  const { data: reciters, isLoading: loadingReciters } = useDownloadedReciters();
  const { deleteSurahDownload, deleteReciterDownloads } = useDownloadActions();
  const playSurah = usePlayerStore((s) => s.playSurah);

  const isArabic = i18n.language === 'ar';

  const handlePlaySura = useCallback(
    (sura: DownloadedSura) => {
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
    [playSurah, isArabic]
  );

  const handleDeleteSura = useCallback(
    (sura: DownloadedSura) => {
      void deleteSurahDownload(sura.reciterId, sura.moshafId, sura.surahId);
    },
    [deleteSurahDownload]
  );

  const handlePlayReciter = useCallback(
    (reciter: DownloadedReciter) => {
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
    [playSurah, isArabic]
  );

  const handleDeleteReciter = useCallback(
    (reciter: DownloadedReciter) => {
      void deleteReciterDownloads(reciter.reciterId, reciter.moshafId);
    },
    [deleteReciterDownloads]
  );

  const handleReciterPress = useCallback(
    (reciter: DownloadedReciter) => {
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
        <Icon familyName="MaterialIcons" iconName="download" size={48} variant="muted" />
        <Typography size="sm" color="secondary" align="center">
          {t('screens.library.downloads.empty')}
        </Typography>
        <Typography size="xs" color="muted" align="center">
          {t('screens.library.downloads.emptyHint')}
        </Typography>
      </View>
    ),
    [t, styles.emptyContainer]
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
              renderItem={({ item }: { item: DownloadedSura }) => (
                <DownloadedSuraCard
                  sura={item}
                  onPlay={handlePlaySura}
                  onDelete={handleDeleteSura}
                />
              )}
              keyExtractor={(item: DownloadedSura) => String(item.id)}
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
              renderItem={({ item }: { item: DownloadedReciter }) => (
                <DownloadedReciterCard
                  reciter={item}
                  onPress={handleReciterPress}
                  onPlay={handlePlayReciter}
                  onDelete={handleDeleteReciter}
                />
              )}
              keyExtractor={(item: DownloadedReciter) =>
                `${String(item.reciterId)}:${String(item.moshafId)}`
              }
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
      handlePlaySura,
      handleDeleteSura,
      handleReciterPress,
      handlePlayReciter,
      handleDeleteReciter,
      styles.loadingContainer,
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
