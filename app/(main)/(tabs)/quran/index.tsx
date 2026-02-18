import { QuranDownloadPrompt } from '@/features/quran/components/QuranDownloadPrompt';
import { QuranPage } from '@/features/quran/components/QuranPage';
import { getPageUri } from '@/features/quran/services/quranDownloadService';
import { SQLiteProvider } from 'expo-sqlite';
import { memo, useCallback, useRef, useState } from 'react';
import { FlatList, I18nManager, useWindowDimensions, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const DB_ASSET = require('../../../../assets/quran/quran_ayah_bounds.db') as number;
const TOTAL_PAGES = 604;

// Pre-build page data array once so FlatList doesn't get a new reference each render
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
  onPlaybackSettings: (ayahs: SelectedAyah[]) => void;
  onBookmark: (ayahs: SelectedAyah[]) => void;
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
    onPlaybackSettings,
    onBookmark,
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
          onPlaybackSettings={onPlaybackSettings}
          onBookmark={onBookmark}
          showToolbarLabels
        />
      </View>
    );
  }
);
PageItem.displayName = 'PageItem';

export default function QuranScreen() {
  const [pagesReady, setPagesReady] = useState(false);
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<number>>(null);

  const [activeSelectionPage, setActiveSelectionPage] = useState<number | null>(null);

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

  const handlePlay = useCallback((_ayahs: SelectedAyah[]) => {
    // TODO: play audio for selected ayahs
  }, []);

  const handlePlaybackSettings = useCallback((_ayahs: SelectedAyah[]) => {
    // TODO: open playback settings
  }, []);

  const handleBookmark = useCallback((_ayahs: SelectedAyah[]) => {
    // TODO: bookmark selected ayahs
  }, []);

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
        onPlaybackSettings={handlePlaybackSettings}
        onBookmark={handleBookmark}
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
      handlePlaybackSettings,
      handleBookmark,
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

  if (!pagesReady) {
    return (
      <View style={styles.container}>
        <QuranDownloadPrompt onReady={() => setPagesReady(true)} />
      </View>
    );
  }

  return (
    <SQLiteProvider
      databaseName="quran_ayah_bounds.db"
      assetSource={{ assetId: DB_ASSET }}
      onError={(err) => console.error('[SQLiteProvider] Error:', err)}
    >
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
      />
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.app,
  },
}));
