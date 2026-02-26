import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { getAllSurahsForPage, getSurahById } from '@/features/library/data/surahData';
import { QuranDownloadPrompt } from '@/features/quran/components/QuranDownloadPrompt';
import { QuranPagesView } from '@/features/quran/components/QuranPagesView';
import type { QuranPagesViewRef } from '@/features/quran/components/QuranPagesView';
import type { SelectedAyah } from '@/features/quran/components/QuranPagesView/QuranPagesView.types';
import { QuranSettingsSheet } from '@/features/quran/components/QuranSettingsSheet';
import { TafseerSheet, type TafseerSheetRef } from '@/features/quran/components/TafseerSheet';
import { arePagesReady } from '@/features/quran/services/quranDownloadService';
import { getVerse } from '@/features/quran/services/quranTextDatabase';
import { shareAyah } from '@/features/quran/services/shareService';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { LastReadInfo } from '@/features/quran/components/ContinueReadingCard';
import { setItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
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
    surahId?: string;
    page?: string;
    ayah?: string;
  }>();

  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const clampPage = (val: unknown) => {
    const n = Number(val);
    return Number.isNaN(n) || n < 1 ? 1 : Math.min(604, n);
  };
  const clampSurah = (val: unknown) => {
    const n = Number(val);
    return Number.isNaN(n) || n < 1 ? 1 : Math.min(114, n);
  };

  // Stable initial page — only changes when route params change, NOT on swipe.
  // This prevents QuranPagesView from remounting on every page swipe.
  const initialPageRef = useRef(clampPage(params.page));
  const pagesViewRef = useRef<QuranPagesViewRef>(null);

  console.warn(
    '[QuranReader] render params.page=%s params.surahId=%s initialPageRef=%d',
    params.page,
    params.surahId,
    initialPageRef.current
  );

  const [currentPage, setCurrentPage] = useState(clampPage(params.page));
  const [currentSurahId, setCurrentSurahId] = useState(clampSurah(params.surahId));
  const [_chromeVisible, setChromeVisible] = useState(true);

  // Save last read position to MMKV
  const savedPageRef = useRef<number>(clampPage(params.page));

  // Sync state when params change (e.g. navigating to a different surah)
  useEffect(() => {
    const paramPage = clampPage(params.page);
    const paramSurahId = clampSurah(params.surahId);
    console.warn(
      '[QuranReader] params sync effect: paramPage=%d paramSurahId=%d oldInitialPage=%d pagesViewRef=%s',
      paramPage,
      paramSurahId,
      initialPageRef.current,
      pagesViewRef.current ? 'mounted' : 'null'
    );
    initialPageRef.current = paramPage;
    setCurrentPage(paramPage);
    setCurrentSurahId(paramSurahId);
    savedPageRef.current = paramPage;
    // Scroll to the new page if QuranPagesView is already mounted
    pagesViewRef.current?.scrollToPage(paramPage);
  }, [params.page, params.surahId]);

  const [pagesDownloaded, setPagesDownloaded] = useState(false);
  const [checkingPages, setCheckingPages] = useState(true);

  const setMiniPlayerHidden = usePlayerStore((s) => s.setMiniPlayerHidden);

  useEffect(() => {
    console.warn('[QuranReader] checking pages download status...');
    void arePagesReady().then((ready) => {
      console.warn(
        '[QuranReader] arePagesReady=%s, initialPageRef=%d',
        ready,
        initialPageRef.current
      );
      setPagesDownloaded(ready);
      setCheckingPages(false);
    });
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
  const tafseerSheetRef = useRef<TafseerSheetRef>(null);
  const db = useSQLiteContext();

  const handleTafseer = useCallback((ayahs: SelectedAyah[]) => {
    if (ayahs.length === 0) return;
    tafseerSheetRef.current?.present(ayahs);
  }, []);

  const handleShare = useCallback(
    async (ayahs: SelectedAyah[]) => {
      if (ayahs.length === 0) return;
      const first = ayahs[0];
      const verse = await getVerse(db, first.sura, first.ayah);
      if (!verse) return;
      const info = getSurahById(first.sura);
      const name = i18n.language === 'ar' ? info?.nameArabic : info?.nameSimple;
      shareAyah(verse, name ?? '');
    },
    [db, i18n.language]
  );

  // Fix A: Pure derivation — no side effects in useMemo
  const surah = useMemo(() => {
    const allSurahs = getAllSurahsForPage(currentPage);
    if (allSurahs.length === 0) return undefined;
    return allSurahs.find((s) => s.id === currentSurahId) ?? allSurahs[0];
  }, [currentPage, currentSurahId]);

  // Sync surahId in effect (safe, runs after render)
  useEffect(() => {
    if (surah && surah.id !== currentSurahId) {
      setCurrentSurahId(surah.id);
    }
  }, [surah, currentSurahId]);

  // Fix B: Debounce MMKV save (500ms)
  useEffect(() => {
    if (currentPage === savedPageRef.current) return;
    const timer = setTimeout(() => {
      savedPageRef.current = currentPage;
      const lastRead: LastReadInfo = {
        page: currentPage,
        surahId: surah?.id ?? currentSurahId,
        timestamp: Date.now(),
      };
      setItem(STORAGE_KEYS.quran.lastPage, lastRead);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, currentSurahId, surah]);

  const isArabic = i18n.language === 'ar';
  const surahName = isArabic ? surah?.nameArabic : surah?.nameSimple;
  const revelationPlace =
    surah?.revelationPlace === 'makkah'
      ? t('screens.quran.verses.makkah')
      : t('screens.quran.verses.madinah');

  const highlightAyah = params.ayah
    ? { sura: clampSurah(params.surahId), ayah: Number(params.ayah) || 1 }
    : undefined;

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
      {!pagesDownloaded ? (
        <QuranDownloadPrompt onReady={handlePagesReady} />
      ) : (
        <SQLiteProvider
          databaseName="quran_ayah_bounds.db"
          assetSource={{ assetId: AYAH_BOUNDS_DB }}
          onError={(err) => console.error('[SQLiteProvider ayah_bounds] Error:', err)}
        >
          {
            console.warn(
              '[QuranReader] rendering QuranPagesView with initialPage=%d',
              initialPageRef.current
            ) as undefined
          }
          <QuranPagesView
            ref={pagesViewRef}
            initialPage={initialPageRef.current}
            onPageChange={handlePageChange}
            highlightAyah={highlightAyah}
            onTap={handleTap}
            onTafseer={handleTafseer}
            onShare={(ayahs) => void handleShare(ayahs)}
          />
        </SQLiteProvider>
      )}
      <QuranSettingsSheet ref={settingsSheetRef} />
      <TafseerSheet ref={tafseerSheetRef} />
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
