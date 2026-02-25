import { Button } from '@/common/components/Button';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { SearchInput } from '@/common/components/SearchInput';
import { Typography } from '@/common/components/Typography';
import { useReaderBottomPadding } from '@/hooks/useBottomPadding';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import { spacingV } from '@/theme/metrics';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Surah } from '../../data/surahData';
import { getSurahById } from '../../data/surahData';
import { useDownloadStore } from '../../stores/downloadStore';
import {
  useDownloadActions,
  useDownloadedSurahIds,
  useBulkDownloadProgress,
} from '../../hooks/useDownloads';
import {
  useFavoriteSurahIds,
  useIsReciterFavorited,
  useToggleFavoriteReciter,
  useToggleFavoriteSurah,
} from '../../hooks/useFavorites';
import { SurahListItem } from '../SurahListItem';
import { PROFILE_HEIGHT, styles } from './ReciterSurahsScreen.styles';
import type { ReciterSurahsScreenProps } from './ReciterSurahsScreen.types';

const AnimatedFlatList = Animated.FlatList;

const SCROLL_THRESHOLD = PROFILE_HEIGHT;

const ReciterSurahsScreen: React.FC<ReciterSurahsScreenProps> = ({
  reciterId,
  moshafId,
  reciterName,
  moshafName,
  server,
  surahList,
}) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPadding = useReaderBottomPadding();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useSharedValue(0);

  // Determine bilingual names: use current lang as primary, empty for the other
  const isArabic = i18n.language === 'ar';
  const reciterNameAr = isArabic ? reciterName : '';
  const reciterNameEn = isArabic ? '' : reciterName;
  const moshafNameAr = isArabic ? moshafName : '';
  const moshafNameEn = isArabic ? '' : moshafName;

  // Favorites
  const { data: isReciterFav } = useIsReciterFavorited(reciterId, moshafId);
  const { isFavorited: isSurahFav } = useFavoriteSurahIds(reciterId, moshafId);
  const toggleReciterFav = useToggleFavoriteReciter();
  const toggleSurahFav = useToggleFavoriteSurah();

  // Downloads
  const { isDownloaded: isSurahDl } = useDownloadedSurahIds(reciterId, moshafId);
  const { startSurahDownload, startBulkDownload, cancelBulkDownload } = useDownloadActions();
  const bulkProgress = useBulkDownloadProgress();
  const activeDownloads = useDownloadStore((s) => s.activeDownloads);

  // Player
  const playSurah = usePlayerStore((s) => s.playSurah);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);

  const surahs = useMemo(() => {
    const ids = surahList.split(',').map(Number);
    const result: Surah[] = [];
    for (const id of ids) {
      const surah = getSurahById(id);
      if (surah) {
        result.push(surah);
      }
    }
    return result;
  }, [surahList]);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs;

    const query = searchQuery.toLowerCase().trim();
    return surahs.filter(
      (surah) =>
        surah.nameArabic.includes(query) ||
        surah.nameSimple.toLowerCase().includes(query) ||
        surah.translatedName.name.toLowerCase().includes(query)
    );
  }, [surahs, searchQuery]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handlePlayPress = useCallback(
    (surah: Surah) => {
      const state = usePlayerStore.getState();
      const isSurahCurrent =
        state.isVisible &&
        state.playerSource === 'library' &&
        state.currentLibraryReciterId === reciterId &&
        state.currentSurahName === String(surah.id);

      if (isSurahCurrent) {
        void togglePlayPause();
      } else {
        void playSurah(surah.id, reciterId, moshafId, reciterName, server, surahList);
      }
    },
    [playSurah, togglePlayPause, reciterId, moshafId, reciterName, server, surahList]
  );

  const handlePlayAll = useCallback(() => {
    const ids = surahList.split(',').map(Number);
    if (ids.length > 0) {
      void playSurah(ids[0], reciterId, moshafId, reciterName, server, surahList);
    }
  }, [playSurah, reciterId, moshafId, reciterName, server, surahList]);

  const names = useMemo(
    () => ({ reciterNameAr, reciterNameEn, moshafNameAr, moshafNameEn }),
    [reciterNameAr, reciterNameEn, moshafNameAr, moshafNameEn]
  );

  const handleDownloadAll = useCallback(() => {
    void startBulkDownload(reciterId, moshafId, surahList, server, names);
  }, [startBulkDownload, reciterId, moshafId, surahList, server, names]);

  const handleToggleFavorite = useCallback(() => {
    toggleReciterFav.mutate({
      isFavorited: isReciterFav ?? false,
      reciterId,
      moshafId,
      reciterName,
      moshafName,
      language: i18n.language,
      server,
      surahList,
      surahTotal: surahs.length,
    });
  }, [
    toggleReciterFav,
    isReciterFav,
    reciterId,
    moshafId,
    reciterName,
    moshafName,
    i18n.language,
    server,
    surahList,
    surahs.length,
  ]);

  const handleFavoritePress = useCallback(
    (surah: Surah) => {
      toggleSurahFav.mutate({
        isFavorited: isSurahFav(surah.id),
        reciterId,
        moshafId,
        surahId: surah.id,
        ...names,
        server,
        surahList,
      });
    },
    [toggleSurahFav, isSurahFav, reciterId, moshafId, names, server, surahList]
  );

  const handleDownloadPress = useCallback(
    (surah: Surah) => {
      if (!isSurahDl(surah.id)) {
        void startSurahDownload(reciterId, moshafId, surah.id, server, surahList, names);
      }
    },
    [startSurahDownload, isSurahDl, reciterId, moshafId, server, surahList, names]
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Expanded profile fades out as user scrolls
  const expandedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, SCROLL_THRESHOLD * 0.6], [1, 0], 'clamp'),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, SCROLL_THRESHOLD],
          [0, -SCROLL_THRESHOLD * 0.3],
          'clamp'
        ),
      },
    ],
  }));

  // Collapsed header slides in from top
  const collapsedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [SCROLL_THRESHOLD * 0.5, SCROLL_THRESHOLD * 0.8],
      [0, 1],
      'clamp'
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [SCROLL_THRESHOLD * 0.5, SCROLL_THRESHOLD * 0.8],
          [-20, 0],
          'clamp'
        ),
      },
    ],
    pointerEvents: scrollY.value > SCROLL_THRESHOLD * 0.5 ? 'auto' : 'none',
  }));

  const isBulkDownloading =
    bulkProgress?.isActive &&
    bulkProgress.reciterId === reciterId &&
    bulkProgress.moshafId === moshafId;

  const renderItem = useCallback(
    ({ item }: { item: Surah }) => {
      const downloadKey = `${String(reciterId)}:${String(moshafId)}:${String(item.id)}`;
      const isSurahDownloading = activeDownloads[downloadKey]?.status === 'downloading';

      return (
        <SurahListItem
          surah={item}
          reciterId={reciterId}
          onPlayPress={handlePlayPress}
          onFavoritePress={handleFavoritePress}
          onDownloadPress={handleDownloadPress}
          isFavorite={isSurahFav(item.id)}
          isDownloaded={isSurahDl(item.id)}
          isDownloading={isSurahDownloading}
        />
      );
    },
    [
      handlePlayPress,
      handleFavoritePress,
      handleDownloadPress,
      isSurahFav,
      isSurahDl,
      activeDownloads,
      reciterId,
      moshafId,
    ]
  );

  const keyExtractor = useCallback((item: Surah) => String(item.id), []);

  const isEmpty = filteredSurahs.length === 0;

  const listEmptyComponent = useMemo(
    () => (
      <View style={styles.centerContainer}>
        <Typography size="sm" color="secondary">
          {t('screens.library.reciterSurahs.noResults')}
        </Typography>
      </View>
    ),
    [t]
  );

  const playAllIcon = useMemo(
    () => <Icon familyName="MaterialIcons" iconName="play-arrow" variant="inverse" size={20} />,
    []
  );

  const favoriteIconName = isReciterFav ? 'favorite' : 'favorite-border';
  const favoriteIconVariant = isReciterFav ? 'accent' : 'muted';

  const listHeader = useMemo(
    () => (
      <Animated.View style={expandedStyle}>
        {/* Top bar: back + favorite */}
        <View style={styles.topBar}>
          <IconButton
            familyName="MaterialIcons"
            iconName={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
            variant="ghost"
            size="medium"
            onPress={() => router.back()}
          />
          <IconButton
            familyName="MaterialIcons"
            iconName={favoriteIconName}
            variant="ghost"
            size="medium"
            iconVariant={favoriteIconVariant}
            onPress={handleToggleFavorite}
          />
        </View>

        {/* Profile section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Icon familyName="MaterialIcons" iconName="person" variant="primary" size={48} />
          </View>
          <Typography size="xl" weight="bold" align="center" style={styles.reciterName}>
            {reciterName}
          </Typography>
          <Typography
            size="xs"
            color="secondary"
            align="center"
            uppercase
            style={styles.moshafInfo}
          >
            {moshafName} · {t('screens.library.reciterSurahs.surahCount', { count: surahs.length })}
          </Typography>

          {/* Bulk download progress */}
          {isBulkDownloading ? (
            <View style={styles.bulkProgressContainer}>
              <View style={styles.bulkProgressRow}>
                <View style={styles.bulkProgressBarTrack}>
                  <View
                    style={[
                      styles.bulkProgressBarFill,
                      {
                        width:
                          `${String(Math.round(((bulkProgress?.completed ?? 0) / (bulkProgress?.total ?? 1)) * 100))}%` as `${number}%`,
                      },
                    ]}
                  />
                </View>
                <IconButton
                  familyName="MaterialIcons"
                  iconName="close"
                  variant="ghost"
                  size="small"
                  iconVariant="muted"
                  onPress={cancelBulkDownload}
                />
              </View>
              <Typography
                size="xs"
                color="brandPrimary"
                align="center"
                style={styles.bulkProgressText}
              >
                {t('screens.library.reciterSurahs.downloadProgress', {
                  completed: bulkProgress?.completed,
                  total: bulkProgress?.total,
                  percent: Math.round(
                    ((bulkProgress?.completed ?? 0) / (bulkProgress?.total ?? 1)) * 100
                  ),
                })}
              </Typography>
            </View>
          ) : null}

          {/* Action row: Play All + Download */}
          <View style={styles.actionRow}>
            <Button
              icon={playAllIcon}
              variant="contained"
              color="primary"
              size="medium"
              fullWidth
              style={styles.playAllButton}
              onPress={handlePlayAll}
            >
              {t('screens.library.reciterSurahs.playAll')}
            </Button>
            <IconButton
              familyName="MaterialIcons"
              iconName="download"
              variant="outlined"
              size="large"
              onPress={handleDownloadAll}
            />
          </View>
        </View>

        {/* Search (scrollable in expanded view) */}
        <View style={styles.searchContainer}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('screens.library.reciterSurahs.searchPlaceholder')}
            onClear={handleClear}
          />
        </View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Typography size="md" weight="bold">
            {t('screens.library.reciterSurahs.suraList')}
          </Typography>
          <Typography size="xs" color="secondary">
            {t('screens.library.reciterSurahs.surahCount', { count: filteredSurahs.length })}
          </Typography>
        </View>
      </Animated.View>
    ),
    [
      expandedStyle,
      router,
      favoriteIconName,
      favoriteIconVariant,
      handleToggleFavorite,
      reciterName,
      moshafName,
      surahs.length,
      isBulkDownloading,
      bulkProgress,
      cancelBulkDownload,
      playAllIcon,
      handlePlayAll,
      handleDownloadAll,
      searchQuery,
      handleClear,
      filteredSurahs.length,
      t,
    ]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Collapsed sticky header (appears on scroll) */}
      <Animated.View style={[styles.collapsedHeader, { paddingTop: insets.top }, collapsedStyle]}>
        {/* Reciter info row */}
        <View style={styles.collapsedHeaderRow}>
          <IconButton
            familyName="MaterialIcons"
            iconName={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
            variant="ghost"
            size="small"
            onPress={() => router.back()}
          />
          <View style={styles.collapsedAvatar}>
            <Icon familyName="MaterialIcons" iconName="person" variant="primary" size={20} />
          </View>
          <View style={styles.collapsedInfo}>
            <Typography size="sm" weight="bold" numberOfLines={1}>
              {reciterName}
            </Typography>
            <Typography size="xxs" color="secondary" numberOfLines={1}>
              {moshafName}
            </Typography>
          </View>
          <View style={styles.collapsedActions}>
            <IconButton
              familyName="MaterialIcons"
              iconName="download"
              variant="ghost"
              size="small"
              iconVariant="muted"
              onPress={handleDownloadAll}
            />
            <IconButton
              familyName="MaterialIcons"
              iconName={favoriteIconName}
              variant="ghost"
              size="small"
              iconVariant={favoriteIconVariant}
              onPress={handleToggleFavorite}
            />
            <IconButton
              familyName="MaterialIcons"
              iconName="play-arrow"
              variant="tinted"
              size="small"
              onPress={handlePlayAll}
            />
          </View>
        </View>

        {/* Collapsed bulk progress bar */}
        {isBulkDownloading ? (
          <View style={styles.collapsedBulkProgress}>
            <View
              style={[
                styles.collapsedBulkProgressFill,
                {
                  width:
                    `${String(Math.round(((bulkProgress?.completed ?? 0) / (bulkProgress?.total ?? 1)) * 100))}%` as `${number}%`,
                },
              ]}
            />
          </View>
        ) : null}

        {/* Search bar (sticky) */}
        <View style={styles.collapsedSearchContainer}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('screens.library.reciterSurahs.searchPlaceholder')}
            onClear={handleClear}
          />
        </View>

        {/* Section header (sticky) */}
        <View style={styles.collapsedSectionHeader}>
          <Typography size="md" weight="bold">
            {t('screens.library.reciterSurahs.suraList')}
          </Typography>
          <Typography size="xs" color="secondary">
            {t('screens.library.reciterSurahs.surahCount', { count: filteredSurahs.length })}
          </Typography>
        </View>
      </Animated.View>

      <AnimatedFlatList
        data={filteredSurahs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPadding + spacingV.p32 },
          isEmpty && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        removeClippedSubviews
        maxToRenderPerBatch={15}
        initialNumToRender={12}
        windowSize={5}
      />
    </View>
  );
};

export default ReciterSurahsScreen;
