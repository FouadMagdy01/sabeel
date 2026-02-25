import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { getSurahById } from '@/features/library/data/surahData';
import { searchVerses, type Verse } from '@/features/quran/services/quranTextDatabase';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { useSQLiteContext } from 'expo-sqlite';

import { styles } from './QuranSearchResults.styles';
import type { QuranSearchResultsProps } from './QuranSearchResults.types';

type ResultItemProps = {
  verse: Verse;
  onPress: (surahId: number, page: number, ayahNumber: number) => void;
};

const ResultItem = React.memo(({ verse, onPress }: ResultItemProps) => {
  const { i18n } = useTranslation();
  const { theme } = useUnistyles();

  const isArabic = i18n.language === 'ar';
  const surah = getSurahById(verse.surah_id);
  const surahName = isArabic ? surah?.nameArabic : surah?.nameSimple;

  const handlePress = useCallback(() => {
    onPress(verse.surah_id, verse.page_number, verse.ayah_number);
  }, [onPress, verse.surah_id, verse.page_number, verse.ayah_number]);

  return (
    <Pressable
      style={[styles.item, { backgroundColor: theme.colors.background.surface }]}
      onPress={handlePress}
      android_ripple={{ color: theme.colors.overlay.pressed }}
    >
      <Typography size="xs" color="brandPrimary" weight="semiBold">
        {`${surahName ?? ''} : ${String(verse.ayah_number)}`}
      </Typography>
      <Typography size="md" style={styles.verseText} numberOfLines={2}>
        {verse.text_uthmani}
      </Typography>
    </Pressable>
  );
});
ResultItem.displayName = 'ResultItem';

const QuranSearchResults: React.FC<QuranSearchResultsProps> = React.memo(
  ({ query, onResultPress, pagesReady }) => {
    const { t } = useTranslation();
    const { theme } = useUnistyles();
    const db = useSQLiteContext();
    const [results, setResults] = useState<Verse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      let cancelled = false;
      setLoading(true);

      void searchVerses(db, query.trim())
        .then((data) => {
          if (!cancelled) {
            setResults(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setResults([]);
            setLoading(false);
          }
        });

      return () => {
        cancelled = true;
      };
    }, [db, query]);

    const handleResultPress = useCallback(
      (surahId: number, page: number, ayahNumber: number) => {
        onResultPress(surahId, page, pagesReady ? 'pages' : 'verses', ayahNumber);
      },
      [onResultPress, pagesReady]
    );

    const renderItem = useCallback(
      ({ item }: { item: Verse }) => <ResultItem verse={item} onPress={handleResultPress} />,
      [handleResultPress]
    );

    const keyExtractor = useCallback((item: Verse) => String(item.id), []);

    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand.primary} />
        </View>
      );
    }

    if (query.trim().length >= 2 && results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon familyName="Ionicons" iconName="search-outline" size={48} variant="muted" />
          <Typography size="md" color="muted" align="center">
            {t('screens.quran.search.noResults')}
          </Typography>
        </View>
      );
    }

    return (
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        style={styles.container}
        showsVerticalScrollIndicator={false}
      />
    );
  }
);

QuranSearchResults.displayName = 'QuranSearchResults';

export default QuranSearchResults;
