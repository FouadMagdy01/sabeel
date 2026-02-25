import { QuranPage } from '@/features/quran/components/QuranPage';
import { getPageUri } from '@/features/quran/services/quranDownloadService';
import {
  addBookmark,
  isBookmarked,
  removeBookmark,
} from '@/features/quran/services/bookmarksService';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, I18nManager, useWindowDimensions, View } from 'react-native';

import { styles } from './QuranPagesView.styles';
import type { QuranPagesViewProps } from './QuranPagesView.types';

const TOTAL_PAGES = 604;
const PAGE_DATA = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

type SelectedAyah = { sura: number; ayah: number };

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

const QuranPagesView: React.FC<QuranPagesViewProps> = React.memo(
  ({ initialPage = 1, onPageChange, highlightAyah, onTap }) => {
    const { width } = useWindowDimensions();
    const listRef = useRef<FlatList<number>>(null);
    const [activeSelectionPage, setActiveSelectionPage] = useState<number | null>(null);
    const [currentVisiblePage, setCurrentVisiblePage] = useState(initialPage);

    const playerSource = usePlayerStore((s) => s.playerSource);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const playPageAyahs = usePlayerStore((s) => s.playPageAyahs);
    const playSelectedAyahs = usePlayerStore((s) => s.playSelectedAyahs);
    const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);

    const initialHighlightKeys = useMemo(
      () => (highlightAyah ? new Set([`${highlightAyah.sura}:${highlightAyah.ayah}`]) : undefined),
      [highlightAyah]
    );

    const handleAyahSelect = useCallback((_ayahs: SelectedAyah[]) => {
      // TODO: handle ayah selection
    }, []);

    const handleSelectionStart = useCallback((page: number) => {
      setActiveSelectionPage(page);
    }, []);

    const handleTafseer = useCallback((_ayahs: SelectedAyah[]) => {
      // TODO: open tafseer
    }, []);

    const handleShare = useCallback((_ayahs: SelectedAyah[]) => {
      // TODO: share selected ayahs
    }, []);

    const handlePlay = useCallback(
      (ayahs: SelectedAyah[]) => {
        if (playerSource === 'quran' && isPlaying) {
          void togglePlayPause();
        } else if (ayahs.length > 0) {
          void playSelectedAyahs(ayahs);
        } else {
          void playPageAyahs(currentVisiblePage);
        }
      },
      [
        playerSource,
        isPlaying,
        togglePlayPause,
        playSelectedAyahs,
        playPageAyahs,
        currentVisiblePage,
      ]
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

    const lastReportedPage = useRef(initialPage);

    const handleMomentumEnd = useCallback(
      (e: { nativeEvent: { contentOffset: { x: number } } }) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const pageIndex = Math.round(offsetX / width);
        // RTL native layout: index 0 is at the right end, offsetX grows leftward
        // so pageIndex from offsetX is distance from left = (TOTAL_PAGES - 1 - actualIndex)
        // page number = actualIndex + 1 = TOTAL_PAGES - pageIndex
        const page = TOTAL_PAGES - pageIndex;

        if (page !== lastReportedPage.current && page >= 1 && page <= TOTAL_PAGES) {
          lastReportedPage.current = page;
          setCurrentVisiblePage(page);
          onPageChange?.(page);
        }
      },
      [width, onPageChange]
    );

    const renderItem = useCallback(
      ({ item }: { item: number }) => (
        <PageItem
          pageNum={item}
          width={width}
          onAyahSelect={handleAyahSelect}
          activeSelectionPage={activeSelectionPage}
          onSelectionStart={handleSelectionStart}
          onTafseer={handleTafseer}
          onShare={handleShare}
          onPlay={handlePlay}
          onBookmark={handleBookmark}
          onTap={onTap}
          isPagePlaying={playerSource === 'quran' && isPlaying}
          initialHighlightKeys={item === initialPage ? initialHighlightKeys : undefined}
        />
      ),
      [
        width,
        handleAyahSelect,
        activeSelectionPage,
        handleSelectionStart,
        handleTafseer,
        handleShare,
        handlePlay,
        handleBookmark,
        onTap,
        isPlaying,
        initialPage,
        initialHighlightKeys,
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

    // Convert page number to index (RTL aware)
    const initialIndex = I18nManager.isRTL ? initialPage - 1 : TOTAL_PAGES - initialPage;

    return (
      <FlatList
        ref={listRef}
        data={PAGE_DATA}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        horizontal
        pagingEnabled
        inverted={!I18nManager.isRTL}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
        style={styles.container}
        initialScrollIndex={Math.max(0, Math.min(initialIndex, TOTAL_PAGES - 1))}
        onMomentumScrollEnd={handleMomentumEnd}
      />
    );
  }
);

QuranPagesView.displayName = 'QuranPagesView';

export default QuranPagesView;
