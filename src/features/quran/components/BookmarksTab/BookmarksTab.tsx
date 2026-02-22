import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { getSurahById } from '@/features/library/data/surahData';
import {
  getBookmarks,
  removeBookmark,
  type Bookmark,
} from '@/features/quran/services/bookmarksService';
import { getVerse, type Verse } from '@/features/quran/services/quranTextDatabase';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './BookmarksTab.styles';
import type { BookmarksTabProps } from './BookmarksTab.types';

type BookmarkWithVerse = Bookmark & {
  verse: Verse | null;
};

type BookmarkItemProps = {
  item: BookmarkWithVerse;
  onPress: (surahId: number, page: number, ayah: number) => void;
  onRemove: (verseKey: string) => void;
};

const BookmarkItem = React.memo(({ item, onPress, onRemove }: BookmarkItemProps) => {
  const { i18n } = useTranslation();
  const { theme } = useUnistyles();

  const [surahIdStr, ayahStr] = item.verseKey.split(':');
  const surahId = Number(surahIdStr);
  const ayahNumber = Number(ayahStr);
  const surah = getSurahById(surahId);

  const isArabic = i18n.language === 'ar';
  const surahName = isArabic ? surah?.nameArabic : surah?.nameSimple;
  const page = item.verse?.page_number ?? surah?.pages[0] ?? 1;

  const handlePress = useCallback(() => {
    onPress(surahId, page, ayahNumber);
  }, [onPress, surahId, page, ayahNumber]);

  const handleRemove = useCallback(() => {
    onRemove(item.verseKey);
  }, [onRemove, item.verseKey]);

  return (
    <Pressable
      style={[styles.item, { backgroundColor: theme.colors.background.surface }]}
      onPress={handlePress}
      android_ripple={{ color: theme.colors.overlay.pressed }}
    >
      <View style={[styles.badge, { backgroundColor: `${theme.colors.brand.primary}1A` }]}>
        <Typography size="xs" weight="bold" style={{ color: theme.colors.brand.primary }}>
          {String(surahId)}
        </Typography>
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Typography size="sm" weight="semiBold">
            {`${surahName ?? ''} : ${String(ayahNumber)}`}
          </Typography>
        </View>
        {item.verse && (
          <Typography size="sm" color="secondary" style={styles.verseText} numberOfLines={2}>
            {item.verse.text_uthmani}
          </Typography>
        )}
      </View>
      <Pressable onPress={handleRemove} hitSlop={8}>
        <Icon familyName="Ionicons" iconName="bookmark" size={20} variant="brandPrimary" />
      </Pressable>
    </Pressable>
  );
});
BookmarkItem.displayName = 'BookmarkItem';

const BookmarksTab: React.FC<BookmarksTabProps> = React.memo(
  ({ onVersePress, refreshKey, bottomPadding = 0 }) => {
    const { t } = useTranslation();
    const { theme } = useUnistyles();
    const db = useSQLiteContext();
    const [bookmarks, setBookmarks] = useState<BookmarkWithVerse[]>([]);

    const loadBookmarks = useCallback(async () => {
      const rawBookmarks = getBookmarks();
      const enriched = await Promise.all(
        rawBookmarks.map(async (b) => {
          const [surahIdStr, ayahStr] = b.verseKey.split(':');
          const verse = await getVerse(db, Number(surahIdStr), Number(ayahStr));
          return { ...b, verse };
        })
      );
      setBookmarks(enriched);
    }, [db]);

    // Reload bookmarks on mount and whenever refreshKey changes (screen focus or tab switch)
    useEffect(() => {
      void loadBookmarks();
    }, [loadBookmarks, refreshKey]);

    const handleRemove = useCallback(
      (verseKey: string) => {
        removeBookmark(verseKey);
        void loadBookmarks();
      },
      [loadBookmarks]
    );

    const renderItem = useCallback(
      ({ item }: { item: BookmarkWithVerse }) => (
        <BookmarkItem item={item} onPress={onVersePress} onRemove={handleRemove} />
      ),
      [onVersePress, handleRemove]
    );

    const keyExtractor = useCallback((item: BookmarkWithVerse) => item.verseKey, []);

    if (bookmarks.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon familyName="Ionicons" iconName="bookmark-outline" size={48} variant="muted" />
          <Typography size="md" color="muted" align="center">
            {t('screens.quran.bookmarks.empty')}
          </Typography>
          <Typography size="sm" color="muted" align="center">
            {t('screens.quran.bookmarks.emptyHint')}
          </Typography>
        </View>
      );
    }

    return (
      <FlatList
        data={bookmarks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        extraData={theme.colors.mode}
      />
    );
  }
);

BookmarksTab.displayName = 'BookmarksTab';

export default BookmarksTab;
