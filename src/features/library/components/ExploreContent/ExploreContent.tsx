import { Button } from '@/common/components/Button';
import { Typography } from '@/common/components/Typography';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, ScrollView, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { useReciters } from '../../hooks/useReciters';
import { useRewayat } from '../../hooks/useRewayat';
import type { Reciter, Rewayah } from '../../types/api.types';
import { MoshafSelectionSheet } from '../MoshafSelectionSheet';
import { ReciterCard } from '../ReciterCard';
import { RewayahCard } from '../RewayahCard';
import { styles } from './ExploreContent.styles';

const RECITERS_PREVIEW_COUNT = 8;

interface ExploreContentProps {
  bottomPadding?: number;
}

const ExploreContent: React.FC<ExploreContentProps> = ({ bottomPadding = 0 }) => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const router = useRouter();
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const moshafSheetRef = useRef<BottomSheetModal>(null);

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

  const previewReciters = reciters?.slice(0, RECITERS_PREVIEW_COUNT);

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
            <ReciterCard key={reciter.id} reciter={reciter} onPress={handleReciterPress} />
          ))}
        </View>
      )}

      <MoshafSelectionSheet
        ref={moshafSheetRef}
        reciterName={selectedReciter?.name ?? ''}
        moshafList={selectedReciter?.moshaf ?? []}
        onSelect={handleMoshafSelect}
      />
    </ScrollView>
  );
};

export default ExploreContent;
