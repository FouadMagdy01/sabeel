import { QuranPage } from '@/features/quran/components/QuranPage';
import {
  addBookmark,
  isBookmarked,
  removeBookmark,
} from '@/features/quran/services/bookmarksService';
import { getPageUri } from '@/features/quran/services/quranDownloadService';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import React, {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Platform,
  useWindowDimensions,
  View,
  type ViewToken,
} from 'react-native';

import { styles } from './QuranPagesView.styles';
import type { QuranPagesViewProps, QuranPagesViewRef, SelectedAyah } from './QuranPagesView.types';

const TOTAL_PAGES = 604;
const IS_RTL = I18nManager.isRTL;

// Data: [604, 603, ..., 1] — reversed so index 0 = page 604 (leftmost in LTR).
// LTR: No `inverted`. Index 0 on left, index 603 on right. Mushaf order correct.
// RTL: Use `inverted` to cancel Android's native RTL flip (RTL flip + inverted scaleX = LTR).
//      This makes initialScrollIndex work reliably in RTL.
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
    const needsNudge = Platform.OS === 'android' && IS_RTL;
    const [settled, setSettled] = useState(!needsNudge);
    const [activeSelectionPage, setActiveSelectionPage] = useState<number | null>(null);
    const activeSelectionPageRef = useRef<number | null>(null);
    activeSelectionPageRef.current = activeSelectionPage;
    const currentVisiblePageRef = useRef(initialPage);

    console.warn(
      '[QuranPagesView] render initialPage=%d index=%d isRTL=%s',
      initialPage,
      pageToIndex(initialPage),
      IS_RTL
    );

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
    useImperativeHandle(
      ref,
      () => ({
        scrollToPage: (page: number) => {
          const index = pageToIndex(page);
          console.warn('[QuranPagesView] scrollToPage page=%d index=%d', page, index);
          listRef.current?.scrollToOffset({ offset: index * width, animated: false });
        },
      }),
      [width]
    );

    // Android RTL workaround: after mount, do a tiny scroll nudge to force
    // a native layout pass. This simulates a touch, making the correctly-scrolled
    // content visible. Without this, the FlatList renders index 0 visually despite
    // being scrolled to the correct offset internally.
    // The FlatList is hidden (opacity: 0) until the nudge completes to avoid flashing wrong content.
    useEffect(() => {
      if (!needsNudge) return;
      const targetOffset = pageToIndex(initialPage) * width;
      const timer = requestAnimationFrame(() => {
        listRef.current?.scrollToOffset({ offset: targetOffset + 1, animated: false });
        requestAnimationFrame(() => {
          listRef.current?.scrollToOffset({ offset: targetOffset, animated: false });
          setSettled(true);
        });
      });
      return () => cancelAnimationFrame(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Primary page detection — uses viewable items
    const onViewableItemsChanged = useRef(
      ({ viewableItems }: { viewableItems: ViewToken<number>[] }) => {
        if (viewableItems.length > 0) {
          const page = viewableItems[0].item;
          console.warn('[QuranPagesView] onViewableItemsChanged page=%d', page);
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
    const handleTafseer = useCallback((ayahs: SelectedAyah[]) => {
      onTafseerRef.current?.(ayahs);
    }, []);

    const onShareRef = useRef(onShareProp);
    onShareRef.current = onShareProp;
    const handleShare = useCallback((ayahs: SelectedAyah[]) => {
      onShareRef.current?.(ayahs);
    }, []);

    const playPageAyahsRef = useRef(playPageAyahs);
    playPageAyahsRef.current = playPageAyahs;
    const playSelectedAyahsRef = useRef(playSelectedAyahs);
    playSelectedAyahsRef.current = playSelectedAyahs;
    const togglePlayPauseRef = useRef(togglePlayPause);
    togglePlayPauseRef.current = togglePlayPause;

    const handlePlay = useCallback((ayahs: SelectedAyah[]) => {
      if (isPlayingRef.current) {
        void togglePlayPauseRef.current();
      } else if (ayahs.length > 0) {
        void playSelectedAyahsRef.current(ayahs);
      } else {
        void playPageAyahsRef.current(currentVisiblePageRef.current);
      }
    }, []);

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
            initialHighlightKeys={
              item === initialPageRef.current ? initialHighlightKeysRef.current : undefined
            }
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

    const initialScrollIndex = pageToIndex(initialPage);

    return (
      <View style={styles.container}>
        {!settled && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        )}
        <FlatList
          ref={listRef}
          data={PAGE_DATA}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          horizontal
          pagingEnabled
          inverted={IS_RTL}
          showsHorizontalScrollIndicator={false}
          style={[styles.container, !settled && styles.hidden]}
          initialScrollIndex={initialScrollIndex}
          viewabilityConfig={VIEWABILITY_CONFIG}
          onViewableItemsChanged={onViewableItemsChanged}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={3}
        />
      </View>
    );
  }
);

QuranPagesView.displayName = 'QuranPagesView';

export default QuranPagesView;
