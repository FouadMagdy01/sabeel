import { SearchInput } from '@/common/components/SearchInput';
import { SurahListTab } from '@/features/quran/components/SurahListTab';
import { JuzListTab } from '@/features/quran/components/JuzListTab';
import { BookmarksTab } from '@/features/quran/components/BookmarksTab';
import { ContinueReadingCard } from '@/features/quran/components/ContinueReadingCard';
import type { LastReadInfo } from '@/features/quran/components/ContinueReadingCard';
import { QuranSearchResults } from '@/features/quran/components/QuranSearchResults';
import type { ViewType } from '@/features/quran/components/FABViewToggle';
import { arePagesReady } from '@/features/quran/services/quranDownloadService';
import { getPageForVerse } from '@/features/quran/services/quranTextDatabase';
import { juzData } from '@/features/quran/data/juzData';
import { SURAHS } from '@/features/library/data/surahData';
import { useBottomPadding } from '@/hooks/useBottomPadding';
import { getItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';
import { useFocusEffect, useRouter } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { TabBar, TabView } from 'react-native-tab-view';

const QURAN_DATA_DB = require('../../../../assets/quran/quran_data.db') as number;

function QuranBrowsingContent() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const router = useRouter();
  const db = useSQLiteContext();
  const layout = useWindowDimensions();

  const insets = useSafeAreaInsets();
  const bottomPadding = useBottomPadding();
  const [searchQuery, setSearchQuery] = useState('');
  const [pagesReady, setPagesReady] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [lastRead, setLastRead] = useState<LastReadInfo | null>(null);
  const refreshKeyRef = useRef(0);
  const [bookmarksRefreshKey, setBookmarksRefreshKey] = useState(0);

  useEffect(() => {
    void arePagesReady().then(setPagesReady);
  }, []);

  // Refresh last read + bookmarks on screen focus (user may return from reader)
  useFocusEffect(
    useCallback(() => {
      const result = getItem<LastReadInfo>(STORAGE_KEYS.quran.lastPage);
      setLastRead(result.data ?? null);
      refreshKeyRef.current += 1;
      setBookmarksRefreshKey(refreshKeyRef.current);
    }, [])
  );

  const routes = useMemo(
    () => [
      { key: 'surah', title: t('screens.quran.tabs.surah') },
      { key: 'juz', title: t('screens.quran.tabs.juz') },
      { key: 'bookmarks', title: t('screens.quran.tabs.bookmarks') },
    ],
    [t]
  );

  const handleSurahPress = useCallback(
    (surahId: number) => {
      const surah = SURAHS.find((s) => s.id === surahId);
      const page = surah?.pages[0] ?? 1;
      router.push({
        pathname: '/(main)/quran-reader',
        params: {
          viewType: 'pages',
          surahId: String(surahId),
          page: String(page),
        },
      });
    },
    [router]
  );

  const handleJuzPress = useCallback(
    async (juzNumber: number) => {
      const juz = juzData.find((j) => j.juzNumber === juzNumber);
      if (!juz) return;

      const firstEntry = Object.entries(juz.verseMapping)[0] as [string, string];
      const firstSurahId = Number(firstEntry[0]);
      const firstAyah = Number(firstEntry[1].split('-')[0]);

      const page = await getPageForVerse(db, firstSurahId, firstAyah);
      const fallbackPage = SURAHS.find((s) => s.id === firstSurahId)?.pages[0] ?? 1;

      router.push({
        pathname: '/(main)/quran-reader',
        params: {
          viewType: 'pages',
          surahId: String(firstSurahId),
          page: String(page ?? fallbackPage),
          ayah: String(firstAyah),
        },
      });
    },
    [router, db]
  );

  const handleBookmarkPress = useCallback(
    (surahId: number, page: number, ayah: number) => {
      router.push({
        pathname: '/(main)/quran-reader',
        params: {
          viewType: pagesReady ? 'pages' : 'verses',
          surahId: String(surahId),
          page: String(page),
          ayah: String(ayah),
        },
      });
    },
    [router, pagesReady]
  );

  const handleContinueReading = useCallback(() => {
    if (!lastRead) return;
    router.push({
      pathname: '/(main)/quran-reader',
      params: {
        viewType: pagesReady ? 'pages' : 'verses',
        surahId: String(lastRead.surahId),
        page: String(lastRead.page),
      },
    });
  }, [router, pagesReady, lastRead]);

  const handleSearchResultPress = useCallback(
    (surahId: number, page: number, viewType: ViewType, ayahNumber: number) => {
      router.push({
        pathname: '/(main)/quran-reader',
        params: {
          viewType,
          surahId: String(surahId),
          page: String(page),
          ayah: String(ayahNumber),
        },
      });
    },
    [router]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const renderScene = useCallback(
    ({ route }: { route: { key: string } }) => {
      switch (route.key) {
        case 'surah':
          return <SurahListTab onSurahPress={handleSurahPress} bottomPadding={bottomPadding} />;
        case 'juz':
          return <JuzListTab onJuzPress={handleJuzPress} bottomPadding={bottomPadding} />;
        case 'bookmarks':
          return (
            <BookmarksTab
              onVersePress={handleBookmarkPress}
              refreshKey={bookmarksRefreshKey}
              bottomPadding={bottomPadding}
            />
          );
        default:
          return null;
      }
    },
    [handleSurahPress, handleJuzPress, handleBookmarkPress, bookmarksRefreshKey, bottomPadding]
  );

  const renderTabBar = useCallback(
    (props: React.ComponentProps<typeof TabBar>) => (
      <TabBar
        {...props}
        style={{ backgroundColor: theme.colors.background.surface }}
        indicatorStyle={{ backgroundColor: theme.colors.brand.primary }}
        activeColor={theme.colors.brand.primary}
        inactiveColor={theme.colors.text.secondary}
        pressColor={theme.colors.overlay.pressed}
      />
    ),
    [theme]
  );

  const isSearching = searchQuery.trim().length >= 2;

  return (
    <View style={[screenStyles.container, { paddingTop: insets.top }]}>
      <View style={screenStyles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('screens.quran.search.placeholder')}
          onClear={handleClearSearch}
        />
      </View>
      {isSearching ? (
        <QuranSearchResults
          query={searchQuery}
          onResultPress={handleSearchResultPress}
          pagesReady={pagesReady}
        />
      ) : (
        <>
          {lastRead && (
            <View style={screenStyles.continueReadingContainer}>
              <ContinueReadingCard lastRead={lastRead} onPress={handleContinueReading} />
            </View>
          )}
          <TabView
            navigationState={{ index: tabIndex, routes }}
            renderScene={renderScene}
            onIndexChange={setTabIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
          />
        </>
      )}
    </View>
  );
}

export default function QuranScreen() {
  return (
    <SQLiteProvider
      databaseName="quran_data.db"
      assetSource={{ assetId: QURAN_DATA_DB }}
      onError={(err) => console.error('[SQLiteProvider quran_data] Error:', err)}
    >
      <QuranBrowsingContent />
    </SQLiteProvider>
  );
}

const screenStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  searchContainer: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingBottom: theme.metrics.spacingV.p8,
  },
  continueReadingContainer: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingBottom: theme.metrics.spacingV.p8,
  },
}));
