import { Button } from '@/common/components/Button';
import { Typography } from '@/common/components/Typography';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, ScrollView, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { usePlayerStore } from '@/features/quran/stores/playerStore';
import { useFavoriteReciters, useToggleFavoriteReciter } from '../../hooks/useFavorites';
import { useReciters } from '../../hooks/useReciters';
import { useRewayat } from '../../hooks/useRewayat';
import type { Moshaf, Reciter, Rewayah } from '../../types/api.types';
import { MoshafSelectionSheet } from '../MoshafSelectionSheet';
import { ReciterCard } from '../ReciterCard';
import { RewayahCard } from '../RewayahCard';
import { styles } from './ExploreContent.styles';

const FEATURED_RECITER_IDS = [51, 106, 123, 54, 112, 118, 121, 92];

interface ExploreContentProps {
  bottomPadding?: number;
}

const ExploreContent: React.FC<ExploreContentProps> = ({ bottomPadding = 0 }) => {
  const { t, i18n } = useTranslation();
  const { theme } = useUnistyles();
  const router = useRouter();
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [sheetAction, setSheetAction] = useState<'navigate' | 'play'>('navigate');
  const moshafSheetRef = useRef<BottomSheetModal>(null);
  const { data: favoriteReciters } = useFavoriteReciters();
  const playSurah = usePlayerStore((s) => s.playSurah);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const isPlayerPlaying = usePlayerStore((s) => s.isPlaying);
  const isPlayerVisible = usePlayerStore((s) => s.isVisible);
  const playerSource = usePlayerStore((s) => s.playerSource);
  const currentLibraryReciterId = usePlayerStore((s) => s.currentLibraryReciterId);
  const currentMoshafId = usePlayerStore((s) => s.currentMoshafId);
  const toggleReciterFav = useToggleFavoriteReciter();

  const {
    data: rewayat,
    isLoading: rewayatLoading,
    error: rewayatError,
    refetch: refetchRewayat,
  } = useRewayat();
  const {
    data: reciters,
    isLoading: recitersLoading,
    error: recitersError,
    refetch: refetchReciters,
  } = useReciters();

  const previewReciters = reciters?.filter((r) => FEATURED_RECITER_IDS.includes(r.id));

  const handleRewayahPress = useCallback(
    (rewayah: Rewayah) => {
      router.push({
        pathname: '/(main)/reciters',
        params: { rewayaId: String(rewayah.id) },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    },
    [router]
  );

  const renderRewayahItem = useCallback(
    ({ item }: { item: Rewayah }) => <RewayahCard rewayah={item} onPress={handleRewayahPress} />,
    [handleRewayahPress]
  );

  const rewayahKeyExtractor = useCallback((item: Rewayah) => String(item.id), []);

  const handleSeeAllReciters = useCallback(() => {
    router.push('/(main)/reciters');
  }, [router]);

  const navigateToSurahs = useCallback(
    (reciter: Reciter, moshaf: Reciter['moshaf'][number]) => {
      router.push({
        pathname: '/(main)/reciter-surahs',
        params: {
          reciterId: String(reciter.id),
          moshafId: String(moshaf.id),
          reciterName: reciter.name,
          moshafName: moshaf.name,
          server: moshaf.server,
          surahList: moshaf.surah_list,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    },
    [router]
  );

  const handleReciterPress = useCallback(
    (reciter: Reciter) => {
      if (reciter.moshaf.length > 1) {
        setSelectedReciter(reciter);
        setSheetAction('navigate');
        moshafSheetRef.current?.present();
      } else if (reciter.moshaf[0]) {
        navigateToSurahs(reciter, reciter.moshaf[0]);
      }
    },
    [navigateToSurahs]
  );

  const handleMoshafSelect = useCallback(
    (moshaf: Reciter['moshaf'][number]) => {
      if (selectedReciter) {
        navigateToSurahs(selectedReciter, moshaf);
      }
    },
    [selectedReciter, navigateToSurahs]
  );

  const playMoshaf = useCallback(
    (reciter: Reciter, moshaf: Moshaf) => {
      const surahIds = moshaf.surah_list.split(',').map(Number);
      const firstSurahId = surahIds[0];
      console.warn('[ExploreContent] playMoshaf called', {
        reciterId: reciter.id,
        moshafId: moshaf.id,
        firstSurahId,
        server: moshaf.server,
        surahCount: surahIds.length,
      });
      if (firstSurahId) {
        void playSurah(
          firstSurahId,
          reciter.id,
          moshaf.id,
          reciter.name,
          moshaf.server,
          moshaf.surah_list
        );
      } else {
        console.warn(
          '[ExploreContent] playMoshaf — no firstSurahId from surah_list:',
          moshaf.surah_list
        );
      }
    },
    [playSurah]
  );

  const isReciterCurrent = useCallback(
    (reciterId: number): boolean => {
      const result =
        isPlayerVisible && playerSource === 'library' && currentLibraryReciterId === reciterId;
      console.warn('[ExploreContent] isReciterCurrent', {
        reciterId,
        playerSource,
        currentLibraryReciterId,
        isPlayerVisible,
        result,
      });
      return result;
    },
    [isPlayerVisible, playerSource, currentLibraryReciterId]
  );

  const isReciterCurrentlyPlaying = useCallback(
    (reciterId: number): boolean => {
      return isReciterCurrent(reciterId) && isPlayerPlaying;
    },
    [isReciterCurrent, isPlayerPlaying]
  );

  const handlePlayReciter = useCallback(
    (reciter: Reciter) => {
      console.warn('[ExploreContent] handlePlayReciter', {
        reciterId: reciter.id,
        reciterName: reciter.name,
        moshafCount: reciter.moshaf.length,
      });

      // For multi-moshaf reciters, always show the sheet (even if current)
      if (reciter.moshaf.length > 1) {
        console.warn('[ExploreContent] multiple moshaf, showing sheet');
        setSelectedReciter(reciter);
        setSheetAction('play');
        moshafSheetRef.current?.present();
      } else if (reciter.moshaf[0]) {
        // Single moshaf — toggle if already current, otherwise start playing
        if (isReciterCurrent(reciter.id)) {
          console.warn('[ExploreContent] single moshaf, reciter is current, toggling play/pause');
          void togglePlayPause();
        } else {
          console.warn('[ExploreContent] single moshaf, calling playMoshaf');
          playMoshaf(reciter, reciter.moshaf[0]);
        }
      } else {
        console.warn('[ExploreContent] no moshaf available for reciter', reciter.id);
      }
    },
    [isReciterCurrent, togglePlayPause, playMoshaf]
  );

  const handleMoshafPlay = useCallback(
    (moshaf: Moshaf) => {
      if (!selectedReciter) return;
      // If this exact moshaf is already current, toggle play/pause
      if (isReciterCurrent(selectedReciter.id) && currentMoshafId === moshaf.id) {
        void togglePlayPause();
      } else {
        playMoshaf(selectedReciter, moshaf);
      }
    },
    [selectedReciter, playMoshaf, isReciterCurrent, currentMoshafId, togglePlayPause]
  );

  const isReciterFavorited = useCallback(
    (reciterId: number, moshafId: number): boolean => {
      if (!favoriteReciters) return false;
      return favoriteReciters.some((r) => r.reciterId === reciterId && r.moshafId === moshafId);
    },
    [favoriteReciters]
  );

  const handleFavoriteToggle = useCallback(
    (reciter: Reciter) => {
      if (reciter.moshaf.length > 1) {
        setSelectedReciter(reciter);
        moshafSheetRef.current?.present();
        return;
      }

      const moshaf = reciter.moshaf[0];
      if (!moshaf) return;

      const isFav = isReciterFavorited(reciter.id, moshaf.id);

      toggleReciterFav.mutate({
        isFavorited: isFav,
        reciterId: reciter.id,
        moshafId: moshaf.id,
        reciterName: reciter.name,
        moshafName: moshaf.name,
        language: i18n.language,
        server: moshaf.server,
        surahList: moshaf.surah_list,
        surahTotal: moshaf.surah_total,
      });
    },
    [i18n.language, isReciterFavorited, toggleReciterFav]
  );

  const handleMoshafFavoriteToggle = useCallback(
    (moshaf: Moshaf) => {
      if (!selectedReciter) return;

      const isFav = isReciterFavorited(selectedReciter.id, moshaf.id);

      toggleReciterFav.mutate({
        isFavorited: isFav,
        reciterId: selectedReciter.id,
        moshafId: moshaf.id,
        reciterName: selectedReciter.name,
        moshafName: moshaf.name,
        language: i18n.language,
        server: moshaf.server,
        surahList: moshaf.surah_list,
        surahTotal: moshaf.surah_total,
      });
    },
    [i18n.language, isReciterFavorited, selectedReciter, toggleReciterFav]
  );

  const isMoshafPlaying = useCallback(
    (moshafId: number): boolean => {
      if (!selectedReciter) return false;
      return (
        isReciterCurrent(selectedReciter.id) && currentMoshafId === moshafId && isPlayerPlaying
      );
    },
    [selectedReciter, isReciterCurrent, currentMoshafId, isPlayerPlaying]
  );

  const isMoshafFavorited = useCallback(
    (moshafId: number): boolean => {
      if (!selectedReciter) return false;
      return isReciterFavorited(selectedReciter.id, moshafId);
    },
    [isReciterFavorited, selectedReciter]
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sectionHeader}>
        <Typography size="md" weight="bold">
          {t('screens.library.explore.rewayat')}
        </Typography>
      </View>

      {rewayatLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.brand.primary} />
        </View>
      ) : rewayatError ? (
        <View style={styles.errorContainer}>
          <Typography size="sm" color="error">
            {t('screens.library.explore.error')}
          </Typography>
          <Button variant="transparent" size="small" onPress={() => refetchRewayat()}>
            {t('screens.library.explore.retry')}
          </Button>
        </View>
      ) : (
        <FlatList
          data={rewayat}
          renderItem={renderRewayahItem}
          keyExtractor={rewayahKeyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        />
      )}

      <View style={styles.recommendedHeader}>
        <Typography size="md" weight="bold">
          {t('screens.library.explore.reciters')}
        </Typography>
        <Button variant="transparent" size="small" onPress={handleSeeAllReciters}>
          {t('screens.library.explore.seeAll')}
        </Button>
      </View>

      {recitersLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.brand.primary} />
        </View>
      ) : recitersError ? (
        <View style={styles.errorContainer}>
          <Typography size="sm" color="error">
            {t('screens.library.explore.error')}
          </Typography>
          <Button variant="transparent" size="small" onPress={() => refetchReciters()}>
            {t('screens.library.explore.retry')}
          </Button>
        </View>
      ) : (
        <View style={styles.recommendedSection}>
          {previewReciters?.map((reciter: Reciter) => (
            <ReciterCard
              key={reciter.id}
              reciter={reciter}
              onPress={handleReciterPress}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorited={isReciterFavorited(reciter.id, reciter.moshaf[0]?.id ?? 0)}
              onPlay={handlePlayReciter}
              isPlaying={isReciterCurrentlyPlaying(reciter.id)}
            />
          ))}
        </View>
      )}

      <MoshafSelectionSheet
        ref={moshafSheetRef}
        reciterName={selectedReciter?.name ?? ''}
        moshafList={selectedReciter?.moshaf ?? []}
        onSelect={handleMoshafSelect}
        onFavoriteToggle={handleMoshafFavoriteToggle}
        isMoshafFavorited={isMoshafFavorited}
        onPlay={sheetAction === 'play' ? handleMoshafPlay : undefined}
        isMoshafPlaying={sheetAction === 'play' ? isMoshafPlaying : undefined}
      />
    </ScrollView>
  );
};

export default ExploreContent;
