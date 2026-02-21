import { Button } from '@/common/components/Button';
import { IconButton } from '@/common/components/IconButton';
import { SearchInput } from '@/common/components/SearchInput';
import { Typography } from '@/common/components/Typography';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, I18nManager, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { useReciters } from '../../hooks/useReciters';
import type { Reciter } from '../../types/api.types';
import type { FilterSortState } from '../../types/filter.types';
import { sortReciters } from '../../utils/reciterFilters';
import { FilterSortDrawer } from '../FilterSortDrawer';
import { MoshafSelectionSheet } from '../MoshafSelectionSheet';
import { ReciterCard } from '../ReciterCard';
import { styles } from './AllRecitersScreen.styles';

interface AllRecitersScreenProps {
  initialRewayaId?: number;
}

const AllRecitersScreen: React.FC<AllRecitersScreenProps> = ({ initialRewayaId }) => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterSortState, setFilterSortState] = useState<FilterSortState>({
    rewayahId: initialRewayaId ?? null,
    sortOption: 'name-asc',
  });
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const moshafSheetRef = useRef<BottomSheetModal>(null);

  const { data: reciters, isLoading, error, refetch } = useReciters(filterSortState.rewayahId);

  const processedReciters = useMemo(() => {
    if (!reciters) return [];

    let result = reciters;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((reciter) => reciter.name.toLowerCase().includes(query));
    }

    return sortReciters(result, filterSortState.sortOption);
  }, [reciters, searchQuery, filterSortState.sortOption]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleOpenDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleApplyFilter = useCallback((state: FilterSortState) => {
    setFilterSortState(state);
  }, []);

  const handleResetFilter = useCallback(() => {
    setFilterSortState({ rewayahId: null, sortOption: 'name-asc' });
  }, []);

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

  const renderItem = useCallback(
    ({ item }: { item: Reciter }) => <ReciterCard reciter={item} onPress={handleReciterPress} />,
    [handleReciterPress]
  );

  const keyExtractor = useCallback((item: Reciter) => String(item.id), []);

  const isEmpty = isLoading || !!error || processedReciters.length === 0;

  const listEmptyComponent = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand.primary} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Typography size="sm" color="error">
            {t('screens.library.explore.allReciters.error')}
          </Typography>
          <Button variant="contained" size="small" onPress={() => refetch()}>
            {t('screens.library.explore.allReciters.retry')}
          </Button>
        </View>
      );
    }
    return (
      <View style={styles.centerContainer}>
        <Typography size="sm" color="secondary">
          {t('screens.library.explore.allReciters.noResults')}
        </Typography>
      </View>
    );
  }, [isLoading, error, theme.colors.brand.primary, t, refetch]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton
          familyName="MaterialIcons"
          iconName={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
          variant="ghost"
          size="medium"
          onPress={() => router.back()}
        />
        <Typography size="lg" weight="bold" style={styles.headerTitle}>
          {t('screens.library.explore.allReciters.title')}
        </Typography>
        <IconButton
          familyName="MaterialIcons"
          iconName="filter-list"
          variant="ghost"
          size="medium"
          onPress={handleOpenDrawer}
        />
      </View>

      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('screens.library.explore.allReciters.searchPlaceholder')}
          onClear={handleClear}
        />
      </View>

      <FlatList
        data={isLoading || error ? [] : processedReciters}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={isEmpty ? styles.listContentGrow : styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={15}
        initialNumToRender={12}
        windowSize={5}
      />

      {isDrawerOpen && (
        <View style={styles.blurOverlay}>
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={Platform.OS === 'ios' ? 40 : 25}
            tint="dark"
            style={styles.blur}
          />
        </View>
      )}

      <FilterSortDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        filterSortState={filterSortState}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />

      <MoshafSelectionSheet
        ref={moshafSheetRef}
        reciterName={selectedReciter?.name ?? ''}
        moshafList={selectedReciter?.moshaf ?? []}
        onSelect={handleMoshafSelect}
      />
    </View>
  );
};

export default AllRecitersScreen;
