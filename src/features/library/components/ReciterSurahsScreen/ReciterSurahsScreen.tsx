import { Button } from '@/common/components/Button';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { SearchInput } from '@/common/components/SearchInput';
import { Typography } from '@/common/components/Typography';
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
import { SurahListItem } from '../SurahListItem';
import { PROFILE_HEIGHT, styles } from './ReciterSurahsScreen.styles';
import type { ReciterSurahsScreenProps } from './ReciterSurahsScreen.types';

const AnimatedFlatList = Animated.FlatList;

const SCROLL_THRESHOLD = PROFILE_HEIGHT;

const ReciterSurahsScreen: React.FC<ReciterSurahsScreenProps> = ({
  reciterName,
  moshafName,
  surahList,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useSharedValue(0);

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
        surah.name_arabic.includes(query) ||
        surah.name_simple.toLowerCase().includes(query) ||
        surah.translated_name.name.toLowerCase().includes(query)
    );
  }, [surahs, searchQuery]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleSurahPress = useCallback((surah: Surah) => {
    console.warn('Selected surah:', surah.name_simple);
  }, []);

  const handlePlayPress = useCallback((surah: Surah) => {
    console.warn('Play surah:', surah.name_simple);
  }, []);

  const handlePlayAll = useCallback(() => {
    console.warn('Play all surahs');
  }, []);

  const handleDownloadAll = useCallback(() => {
    console.warn('Download all surahs');
  }, []);

  const handleToggleFavorite = useCallback(() => {
    console.warn('Toggle favorite reciter');
  }, []);

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

  const renderItem = useCallback(
    ({ item }: { item: Surah }) => (
      <SurahListItem surah={item} onPress={handleSurahPress} onPlayPress={handlePlayPress} />
    ),
    [handleSurahPress, handlePlayPress]
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
            iconName="favorite-border"
            variant="ghost"
            size="medium"
            iconVariant="muted"
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
      handleToggleFavorite,
      reciterName,
      moshafName,
      surahs.length,
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
              iconName="favorite-border"
              variant="ghost"
              size="small"
              iconVariant="muted"
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
        contentContainerStyle={[styles.listContent, isEmpty && styles.listContentEmpty]}
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
