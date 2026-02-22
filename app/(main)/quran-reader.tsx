import { IconButton } from '@/common/components/IconButton';
import { MINI_PLAYER_HEIGHT } from '@/common/components/MiniPlayer';
import { Typography } from '@/common/components/Typography';
import { getAllSurahsForPage } from '@/features/library/data/surahData';
import { QuranDownloadPrompt } from '@/features/quran/components/QuranDownloadPrompt';
import { QuranPagesView } from '@/features/quran/components/QuranPagesView';
import { QuranVersesView } from '@/features/quran/components/QuranVersesView';
import { FABViewToggle, type ViewType } from '@/features/quran/components/FABViewToggle';
import { QuranSettingsSheet } from '@/features/quran/components/QuranSettingsSheet';
import { arePagesReady } from '@/features/quran/services/quranDownloadService';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { LastReadInfo } from '@/features/quran/components/ContinueReadingCard';
import { setItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';
import { SQLiteProvider } from 'expo-sqlite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

const AYAH_BOUNDS_DB = require('../../assets/quran/quran_ayah_bounds.db') as number;
const QURAN_DATA_DB = require('../../assets/quran/quran_data.db') as number;

function ReaderContent() {
  const params = useLocalSearchParams<{
    viewType?: string;
    surahId?: string;
    page?: string;
    ayah?: string;
  }>();

  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [viewType, setViewType] = useState<ViewType>((params.viewType as ViewType) ?? 'pages');
  const [currentPage, setCurrentPage] = useState(Number(params.page) || 1);
  const [chromeVisible, setChromeVisible] = useState(true);

  const [pagesDownloaded, setPagesDownloaded] = useState(false);
  const [checkingPages, setCheckingPages] = useState(true);

  const isPlayerVisible = usePlayerStore((s) => s.isVisible);
  const setMiniPlayerHidden = usePlayerStore((s) => s.setMiniPlayerHidden);

  useEffect(() => {
    void arePagesReady().then((ready) => {
      setPagesDownloaded(ready);
      setCheckingPages(false);
    });
  }, []);

  const handleToggleView = useCallback(() => {
    setViewType((prev) => (prev === 'pages' ? 'verses' : 'pages'));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePagesReady = useCallback(() => {
    setPagesDownloaded(true);
  }, []);

  const handleTap = useCallback(() => {
    setChromeVisible((prev) => {
      const next = !prev;
      setMiniPlayerHidden(!next);
      return next;
    });
  }, [setMiniPlayerHidden]);

  const settingsSheetRef = useRef<BottomSheetModal>(null);

  const [currentSurahId, setCurrentSurahId] = useState(Number(params.surahId) || 1);

  // Save last read position to MMKV
  const savedPageRef = useRef<number>(0);
  useEffect(() => {
    if (currentPage !== savedPageRef.current) {
      savedPageRef.current = currentPage;
      const lastRead: LastReadInfo = {
        page: currentPage,
        surahId: currentSurahId,
        timestamp: Date.now(),
      };
      setItem(STORAGE_KEYS.quran.lastPage, lastRead);
    }
  }, [currentPage, currentSurahId]);

  // Derive surah from current page — keep current surah if still on page (boundary pages)
  const isArabic = i18n.language === 'ar';
  const surah = useMemo(() => {
    const allSurahs = getAllSurahsForPage(currentPage);
    if (allSurahs.length === 0) return undefined;
    const match = allSurahs.find((s) => s.id === currentSurahId);
    if (match) return match;
    // Scrolled past the current surah — update to first surah on page
    setCurrentSurahId(allSurahs[0].id);
    return allSurahs[0];
  }, [currentPage, currentSurahId]);
  const surahName = isArabic ? surah?.nameArabic : surah?.nameSimple;
  const revelationPlace =
    surah?.revelationPlace === 'makkah'
      ? t('screens.quran.verses.makkah')
      : t('screens.quran.verses.madinah');

  const highlightAyah = params.ayah
    ? { sura: Number(params.surahId) || 1, ayah: Number(params.ayah) }
    : undefined;

  // Compute FAB bottom offset to sit above MiniPlayer when visible
  // MiniPlayer sits at bottom: insets.bottom on non-tab screens
  const fabBottomOffset = isPlayerVisible && chromeVisible ? MINI_PLAYER_HEIGHT + insets.bottom : 0;

  if (checkingPages) {
    return <View style={readerStyles.container} />;
  }

  return (
    <View style={[readerStyles.container, { paddingTop: insets.top }]}>
      <View style={readerStyles.header}>
        <IconButton
          familyName="MaterialIcons"
          iconName={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
          variant="ghost"
          size="medium"
          onPress={() => router.back()}
        />
        <View style={readerStyles.headerCenter}>
          <Typography size="lg" weight="bold">
            {surahName ?? ''}
          </Typography>
          <View style={readerStyles.headerMetaRow}>
            <Typography size="xs" color="secondary">
              {revelationPlace}
            </Typography>
            <Typography size="xs" color="muted">
              {'·'}
            </Typography>
            <Typography size="xs" color="secondary">
              {t('screens.quran.verses.versesCount', { count: surah?.versesCount ?? 0 })}
            </Typography>
          </View>
        </View>
        <IconButton
          familyName="Ionicons"
          iconName="settings-outline"
          variant="ghost"
          size="medium"
          onPress={() => settingsSheetRef.current?.present()}
        />
      </View>
      {viewType === 'pages' && !pagesDownloaded ? (
        <QuranDownloadPrompt onReady={handlePagesReady} />
      ) : viewType === 'pages' ? (
        <SQLiteProvider
          databaseName="quran_ayah_bounds.db"
          assetSource={{ assetId: AYAH_BOUNDS_DB }}
          onError={(err) => console.error('[SQLiteProvider ayah_bounds] Error:', err)}
        >
          <QuranPagesView
            initialPage={currentPage}
            onPageChange={handlePageChange}
            highlightAyah={highlightAyah}
            onTap={handleTap}
          />
        </SQLiteProvider>
      ) : (
        <QuranVersesView
          initialPage={currentPage}
          onPageChange={handlePageChange}
          highlightAyah={highlightAyah}
        />
      )}
      <FABViewToggle
        viewType={viewType}
        onToggle={handleToggleView}
        visible={chromeVisible}
        bottomOffset={fabBottomOffset}
      />
      <QuranSettingsSheet ref={settingsSheetRef} />
    </View>
  );
}

export default function QuranReaderScreen() {
  return (
    <SQLiteProvider
      databaseName="quran_data.db"
      assetSource={{ assetId: QURAN_DATA_DB }}
      onError={(err) => console.error('[SQLiteProvider quran_data] Error:', err)}
    >
      <ReaderContent />
    </SQLiteProvider>
  );
}

const readerStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p8,
    gap: theme.metrics.spacing.p8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
}));
