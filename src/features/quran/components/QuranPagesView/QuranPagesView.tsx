import { QuranPage } from '@/features/quran/components/QuranPage';
import {
  addBookmark,
  isBookmarked,
  removeBookmark,
} from '@/features/quran/services/bookmarksService';
import { getPageUri } from '@/features/quran/services/quranDownloadService';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import React, { memo, useCallback, useImperativeHandle, useMemo, useRef, useState, forwardRef } from 'react';
import { FlatList, I18nManager, useWindowDimensions, View, type ViewToken } from 'react-native';

import { styles } from './QuranPagesView.styles';
import type { QuranPagesViewProps, QuranPagesViewRef, SelectedAyah } from './QuranPagesView.types';

const TOTAL_PAGES = 604;
const IS_RTL = I18nManager.isRTL;

// Both LTR and RTL use the same reversed data: [604, 603, ..., 1]
// Page 604 at index 0, page 1 at index 603.
// In LTR: index 0 is leftmost — Mushaf order correct (higher pages left, lower right).
// In RTL: Android flips horizontal scroll, but we use contentOffset to bypass initialScrollIndex.
const PAGE_DATA = Array.from({ length: TOTAL_PAGES }, (_, i) => TOTAL_PAGES - i);

/** Convert a page number (1-604) to a FlatList index in the reversed array */
function pageToIndex(page: number): number {
  const clamped = Math.max(1, Math.min(TOTAL_PAGES, page));
  return TOTAL_PAGES - clamped;
}

type PageItemProps = {
  pageNum: number;
  width: number;
  onAyahSelect: (ayahs: SelectedAyah[]) => void;
  activeSelectionPage: number | null;
  onSelectionStart: (page: number) => void;
  onTafseer: (ayahs: SelectedAyah[]) => void;
  onShare: (ayahs: SelectedAyah[]) => void;
  onPlay: (ayahs: SelectedAyah[]) => void;
  onBookmark: (ayahs: SelectedAyah[]) => void;
  onTap?: () => void;
  isPagePlaying: boolean;
  initialHighlightKeys?: Set<string>;
};

const PageItem = memo(
  ({
    pageNum,
    width,
    onAyahSelect,
    activeSelectionPage,
    onSelectionStart,
    onTafseer,
    onShare,
    onPlay,
    onBookmark,
    onTap,
    isPagePlaying,
    initialHighlightKeys,
  }: PageItemProps) => {
    return (
      <View style={[styles.page, { width }]}>
        <QuranPage
          page={pageNum}
          imageUri={getPageUri(pageNum)}
          onAyahSelect={onAyahSelect}
          activeSelectionPage={activeSelectionPage}
          onSelectionStart={onSelectionStart}
          onTafseer={onTafseer}
          onShare={onShare}
          onPlay={onPlay}
          onBookmark={onBookmark}
          onTap={onTap}
          isPagePlaying={isPagePlaying}
          showToolbarLabels
          initialHighlightKeys={initialHighlightKeys}
        />
      </View>
    );
  }
);
PageItem.displayName = 'PageItem';

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 50 };

const QuranPagesView = forwardRef<QuranPagesViewRef, QuranPagesViewProps>(
  (
    {
      initialPage = 1,
      onPageChange,
      highlightAyah,
      onTap,
      onTafseer: onTafseerProp,
      onShare: onShareProp,
    },
    ref
  ) => {
    const { width } = useWindowDimensions();
    const listRef = useRef<FlatList<number>>(null);
    const [activeSelectionPage, setActiveSelectionPage] = useState<number | null>(null);
    const activeSelectionPageRef = useRef<number | null>(null);
    activeSelectionPageRef.current = activeSelectionPage;
    const currentVisiblePageRef = useRef(initialPage);

    console.log('[QuranPagesView] render initialPage=%d index=%d isRTL=%s', initialPage, pageToIndex(initialPage), IS_RTL);

    // Track the latest onPageChange callback in a ref to avoid re-creating onViewableItemsChanged
    const onPageChangeRef = useRef(onPageChange);
    onPageChangeRef.current = onPageChange;

    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const isPlayingRef = useRef(isPlaying);
    isPlayingRef.current = isPlaying;
    const playPageAyahs = usePlayerStore((s) => s.playPageAyahs);
    const playSelectedAyahs = usePlayerStore((s) => s.playSelectedAyahs);
    const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);

    const initialHighlightKeys = useMemo(
      () => (highlightAyah ? new Set([`${highlightAyah.sura}:${highlightAyah.ayah}`]) : undefined),
      [highlightAyah]
    );

    // Imperative handle for parent to scroll to a specific page
    useImperativeHandle(ref, () => ({
      scrollToPage: (page: number) => {
        const index = pageToIndex(page);
        console.log('[QuranPagesView] scrollToPage page=%d index=%d', page, index);
        listRef.current?.scrollToOffset({ offset: index * width, animated: false });
      },
    }), [width]);

    // Primary page detection — uses viewable items
    const onViewableItemsChanged = useRef(
      ({ viewableItems }: { viewableItems: ViewToken<number>[] }) => {
        if (viewableItems.length > 0) {
          const page = viewableItems[0].item;
          console.log('[QuranPagesView] onViewableItemsChanged page=%d', page);
          currentVisiblePageRef.current = page;
          onPageChangeRef.current?.(page);
        }
      }
    ).current;

    const handleAyahSelect = useCallback((_ayahs: SelectedAyah[]) => {
      // TODO: handle ayah selection
    }, []);

    const handleSelectionStart = useCallback((page: number) => {
      setActiveSelectionPage(page);
    }, []);

    const onTafseerRef = useRef(onTafseerProp);
    onTafseerRef.current = onTafseerProp;
    const handleTafseer = useCallback(
      (ayahs: SelectedAyah[]) => {
        onTafseerRef.current?.(ayahs);
      },
      []
    );

    const onShareRef = useRef(onShareProp);
    onShareRef.current = onShareProp;
    const handleShare = useCallback(
      (ayahs: SelectedAyah[]) => {
        onShareRef.current?.(ayahs);
      },
      []
    );

    const playPageAyahsRef = useRef(playPageAyahs);
    playPageAyahsRef.current = playPageAyahs;
    const playSelectedAyahsRef = useRef(playSelectedAyahs);
    playSelectedAyahsRef.current = playSelectedAyahs;
    const togglePlayPauseRef = useRef(togglePlayPause);
    togglePlayPauseRef.current = togglePlayPause;

    const handlePlay = useCallback(
      (ayahs: SelectedAyah[]) => {
        if (isPlayingRef.current) {
          void togglePlayPauseRef.current();
        } else if (ayahs.length > 0) {
          void playSelectedAyahsRef.current(ayahs);
        } else {
          void playPageAyahsRef.current(currentVisiblePageRef.current);
        }
      },
      []
    );

    const handleBookmark = useCallback((ayahs: SelectedAyah[]) => {
      for (const ayah of ayahs) {
        const verseKey = `${String(ayah.sura)}:${String(ayah.ayah)}`;
        if (isBookmarked(verseKey)) {
          removeBookmark(verseKey);
        } else {
          addBookmark(verseKey);
        }
      }
    }, []);

    const onTapRef = useRef(onTap);
    onTapRef.current = onTap;
    const stableOnTap = useCallback(() => {
      onTapRef.current?.();
    }, []);

    const initialHighlightKeysRef = useRef(initialHighlightKeys);
    initialHighlightKeysRef.current = initialHighlightKeys;
    const initialPageRef = useRef(initialPage);
    initialPageRef.current = initialPage;

    const renderItem = useCallback(
      ({ item }: { item: number }) => {
        return (
          <PageItem
            pageNum={item}
            width={width}
            onAyahSelect={handleAyahSelect}
            activeSelectionPage={activeSelectionPageRef.current}
            onSelectionStart={handleSelectionStart}
            onTafseer={handleTafseer}
            onShare={handleShare}
            onPlay={handlePlay}
            onBookmark={handleBookmark}
            onTap={stableOnTap}
            isPagePlaying={isPlayingRef.current}
            initialHighlightKeys={item === initialPageRef.current ? initialHighlightKeysRef.current : undefined}
          />
        );
      },
      [
        width,
        handleAyahSelect,
        handleSelectionStart,
        handleTafseer,
        handleShare,
        handlePlay,
        handleBookmark,
        stableOnTap,
      ]
    );

    const getItemLayout = useCallback(
      (_: unknown, index: number) => ({
        length: width,
        offset: width * index,
        index,
      }),
      [width]
    );

    const keyExtractor = useCallback((item: number) => String(item), []);

    const initialIndex = pageToIndex(initialPage);

    // In RTL, Android's horizontal FlatList initialScrollIndex is unreliable.
    // Use contentOffset to set the native scroll position before first paint instead.
    // In LTR, initialScrollIndex works reliably.
    const scrollProps = IS_RTL
      ? { contentOffset: { x: initialIndex * width, y: 0 } }
      : { initialScrollIndex: initialIndex };

    return (
      <FlatList
        ref={listRef}
        data={PAGE_DATA}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        {...scrollProps}
        viewabilityConfig={VIEWABILITY_CONFIG}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={IS_RTL ? 3 : 1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
    );
  }
);

QuranPagesView.displayName = 'QuranPagesView';

export default QuranPagesView;
