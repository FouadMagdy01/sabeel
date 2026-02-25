import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { getSurahById } from '@/features/library/data/surahData';
import {
  addBookmark,
  isBookmarked,
  removeBookmark,
} from '@/features/quran/services/bookmarksService';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import { getVersesByPage, type Verse } from '@/features/quran/services/quranTextDatabase';
import { useReaderBottomPadding } from '@/hooks/useBottomPadding';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, I18nManager, ScrollView, Share, View, useWindowDimensions } from 'react-native';

import { useSQLiteContext } from 'expo-sqlite';

import { styles } from './QuranVersesView.styles';
import type { QuranVersesViewProps } from './QuranVersesView.types';

const TOTAL_PAGES = 604;
const PAGE_DATA = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

type VerseItemProps = {
  verse: Verse;
  onBookmarkToggle: (verseKey: string) => void;
  onShare: (verse: Verse) => void;
  onPlay: (sura: number, ayah: number) => void;
  bookmarked: boolean;
  isHighlighted: boolean;
  isVersePlaying: boolean;
  saveLabel: string;
  shareLabel: string;
  tafseerLabel: string;
  playLabel: string;
  pauseLabel: string;
};

/**
 * VerseItem — glass card with centered text, inline verse badge, circular action buttons.
 * All colors come from the stylesheet (JSI-atomic), no useUnistyles() call.
 */
const VerseItem = React.memo(
  ({
    verse,
    onBookmarkToggle,
    onShare,
    onPlay,
    bookmarked,
    isHighlighted,
    isVersePlaying,
    saveLabel,
    shareLabel,
    tafseerLabel,
    playLabel,
    pauseLabel,
  }: VerseItemProps) => {
    const handleBookmark = useCallback(() => {
      onBookmarkToggle(verse.verse_key);
    }, [onBookmarkToggle, verse.verse_key]);

    const handleShare = useCallback(() => {
      onShare(verse);
    }, [onShare, verse]);

    const handlePlay = useCallback(() => {
      onPlay(verse.surah_id, verse.ayah_number);
    }, [onPlay, verse.surah_id, verse.ayah_number]);

    return (
      <View style={[styles.verseCard, isHighlighted && styles.verseCardHighlighted]}>
        <View style={styles.verseTextContainer}>
          <Typography size="3xl" weight="medium" style={styles.verseText}>
            {verse.text_uthmani}
          </Typography>
          <View style={styles.verseNumberBadge}>
            <Typography size="xs" weight="bold" style={styles.verseNumberText}>
              {String(verse.ayah_number)}
            </Typography>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.verseActions}>
          <View style={styles.actionButton}>
            <IconButton
              familyName="Ionicons"
              iconName={bookmarked ? 'bookmark' : 'bookmark-outline'}
              onPress={handleBookmark}
              variant="outlined"
              size="medium"
              iconVariant={bookmarked ? 'brandPrimary' : 'secondary'}
            />
            <Typography
              size="xxs"
              weight="medium"
              color="secondary"
              style={styles.actionButtonLabel}
            >
              {saveLabel}
            </Typography>
          </View>
          <View style={styles.actionButton}>
            <IconButton
              familyName="Ionicons"
              iconName="share-outline"
              onPress={handleShare}
              variant="outlined"
              size="medium"
              iconVariant="secondary"
            />
            <Typography
              size="xxs"
              weight="medium"
              color="secondary"
              style={styles.actionButtonLabel}
            >
              {shareLabel}
            </Typography>
          </View>
          <View style={styles.actionButton}>
            <IconButton
              familyName="MaterialCommunityIcons"
              iconName="book-open-variant"
              variant="outlined"
              size="medium"
              iconVariant="secondary"
            />
            <Typography
              size="xxs"
              weight="medium"
              color="secondary"
              style={styles.actionButtonLabel}
            >
              {tafseerLabel}
            </Typography>
          </View>
          <View style={styles.actionButton}>
            <IconButton
              familyName="Ionicons"
              iconName={isVersePlaying ? 'pause' : 'play'}
              onPress={handlePlay}
              variant="outlined"
              size="medium"
              iconVariant={isVersePlaying ? 'brandPrimary' : 'secondary'}
            />
            <Typography
              size="xxs"
              weight="medium"
              color="secondary"
              style={styles.actionButtonLabel}
            >
              {isVersePlaying ? pauseLabel : playLabel}
            </Typography>
          </View>
        </View>
      </View>
    );
  }
);
VerseItem.displayName = 'VerseItem';

type VersePageProps = {
  pageNum: number;
  width: number;
  highlightAyah?: { sura: number; ayah: number };
};

const VersePage = React.memo(({ pageNum, width, highlightAyah }: VersePageProps) => {
  const { t, i18n } = useTranslation();
  const db = useSQLiteContext();
  const bottomPadding = useReaderBottomPadding();

  const [verses, setVerses] = useState<Verse[]>([]);
  const [bookmarkedKeys, setBookmarkedKeys] = useState<Set<string>>(new Set());
  const bookmarkedKeysRef = useRef<Set<string>>(bookmarkedKeys);
  bookmarkedKeysRef.current = bookmarkedKeys;

  const isArabic = i18n.language === 'ar';

  const playerSource = usePlayerStore((s) => s.playerSource);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentSurahName = usePlayerStore((s) => s.currentSurahName);
  const currentAyahNumber = usePlayerStore((s) => s.currentAyahNumber);
  const playSingleAyah = usePlayerStore((s) => s.playSingleAyah);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);

  useEffect(() => {
    let cancelled = false;
    void getVersesByPage(db, pageNum).then((data) => {
      if (!cancelled) {
        setVerses(data);
        const keys = new Set<string>();
        for (const v of data) {
          if (isBookmarked(v.verse_key)) {
            keys.add(v.verse_key);
          }
        }
        setBookmarkedKeys(keys);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [db, pageNum]);

  const handleBookmarkToggle = useCallback((verseKey: string) => {
    if (isBookmarked(verseKey)) {
      removeBookmark(verseKey);
      setBookmarkedKeys((prev) => {
        const next = new Set(prev);
        next.delete(verseKey);
        return next;
      });
    } else {
      addBookmark(verseKey);
      setBookmarkedKeys((prev) => new Set(prev).add(verseKey));
    }
  }, []);

  const handleShareVerse = useCallback(
    (verse: Verse) => {
      const surahInfo = getSurahById(verse.surah_id);
      const name = isArabic ? surahInfo?.nameArabic : surahInfo?.nameSimple;
      void Share.share({
        message: `${verse.text_uthmani}\n\n— ${name ?? ''} (${String(verse.surah_id)}:${String(verse.ayah_number)})`,
      });
    },
    [isArabic]
  );

  const handlePlayVerse = useCallback(
    (sura: number, ayah: number) => {
      const isThisVersePlaying =
        playerSource === 'quran' &&
        isPlaying &&
        currentSurahName === String(sura) &&
        currentAyahNumber === ayah;
      if (isThisVersePlaying) {
        void togglePlayPause();
      } else {
        void playSingleAyah(sura, ayah);
      }
    },
    [playerSource, isPlaying, currentSurahName, currentAyahNumber, togglePlayPause, playSingleAyah]
  );

  const saveLabel = t('screens.quran.verses.save');
  const shareLabel = t('screens.quran.verses.share');
  const tafseerLabel = t('screens.quran.verses.tafseer');
  const playLabel = t('screens.quran.verses.play');
  const pauseLabel = t('screens.quran.verses.pause');

  // Determine if we should show bismillah: first verse on page is ayah 1 and surah has bismillahPre
  const showBismillah =
    verses.length > 0 &&
    verses[0].ayah_number === 1 &&
    getSurahById(verses[0].surah_id)?.bismillahPre === true;

  return (
    <View style={[styles.page, { width }]}>
      <ScrollView
        contentContainerStyle={[styles.pageScrollContent, { paddingBottom: bottomPadding + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {showBismillah && (
          <View style={styles.bismillah}>
            <Typography size="4xl" weight="medium" style={styles.bismillahText}>
              {t('screens.quran.verses.bismillah')}
            </Typography>
          </View>
        )}
        {verses.map((verse) => (
          <VerseItem
            key={verse.verse_key}
            verse={verse}
            onBookmarkToggle={handleBookmarkToggle}
            onShare={handleShareVerse}
            onPlay={handlePlayVerse}
            bookmarked={bookmarkedKeysRef.current.has(verse.verse_key)}
            isHighlighted={
              highlightAyah?.sura === verse.surah_id && highlightAyah?.ayah === verse.ayah_number
            }
            isVersePlaying={
              playerSource === 'quran' &&
              isPlaying &&
              currentSurahName === String(verse.surah_id) &&
              currentAyahNumber === verse.ayah_number
            }
            saveLabel={saveLabel}
            shareLabel={shareLabel}
            tafseerLabel={tafseerLabel}
            playLabel={playLabel}
            pauseLabel={pauseLabel}
          />
        ))}
      </ScrollView>
    </View>
  );
});
VersePage.displayName = 'VersePage';

const QuranVersesView: React.FC<QuranVersesViewProps> = React.memo(
  ({ initialPage = 1, onPageChange, highlightAyah }) => {
    const { width } = useWindowDimensions();
    const listRef = useRef<FlatList<number>>(null);

    const lastReportedPage = useRef(initialPage);

    const handleMomentumEnd = useCallback(
      (e: { nativeEvent: { contentOffset: { x: number } } }) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const pageIndex = Math.round(offsetX / width);
        const page = TOTAL_PAGES - pageIndex;

        if (page !== lastReportedPage.current && page >= 1 && page <= TOTAL_PAGES) {
          lastReportedPage.current = page;
          onPageChange?.(page);
        }
      },
      [width, onPageChange]
    );

    const renderItem = useCallback(
      ({ item }: { item: number }) => (
        <VersePage
          pageNum={item}
          width={width}
          highlightAyah={item === initialPage ? highlightAyah : undefined}
        />
      ),
      [width, initialPage, highlightAyah]
    );

    const getItemLayout = useCallback(
      (_: unknown, index: number) => ({
        length: width,
        offset: width * index,
        index,
      }),
      [width]
    );

    const keyExtractor = useCallback((item: number) => `verse-page-${String(item)}`, []);

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

QuranVersesView.displayName = 'QuranVersesView';

export default QuranVersesView;
