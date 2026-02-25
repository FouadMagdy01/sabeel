import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { getSurahById } from '@/features/library/data/surahData';
import {
  getTafseerForVerse,
  getVerse,
  type Verse,
} from '@/features/quran/services/quranTextDatabase';
import { shareAyahWithTafseer } from '@/features/quran/services/shareService';
import {
  fetchTafseerForAyah,
  fetchTafseerList,
  type TafseerEdition,
} from '@/features/quran/services/tafseerApi';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { TabBar, TabView } from 'react-native-tab-view';

import { styles } from './TafseerSheet.styles';

type AyahRef = { sura: number; ayah: number };

export type TafseerSheetRef = {
  present: (ayahs: AyahRef[]) => void;
  dismiss: () => void;
};

const LOCAL_TAFSEER_KEY = 'local';

type LocalTafseerContentProps = {
  db: SQLiteDatabase;
  ayahs: AyahRef[];
  verses: (Verse | null)[];
  surahName: string;
};

type RemoteTafseerContentProps = {
  tafseerId: string;
  ayahs: AyahRef[];
  verses: (Verse | null)[];
  surahName: string;
  isActive: boolean;
};

function PressableButton({
  onPress,
  children,
}: {
  onPress: () => void;
  children: React.ReactNode;
}) {
  const { theme } = useUnistyles();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.shareButton,
        Platform.OS === 'ios' && pressed ? { opacity: 0.85 } : undefined,
      ]}
      onPress={onPress}
      android_ripple={{
        color: theme.colors.overlay.pressed,
        borderless: false,
        foreground: true,
      }}
    >
      {children}
    </Pressable>
  );
}

function LocalTafseerContent({ db, ayahs, verses, surahName }: LocalTafseerContentProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();

  const tafseerQueries = useQueries({
    queries: ayahs.map((a) => ({
      queryKey: ['localTafseer', a.sura, a.ayah],
      queryFn: async () => {
        const v = await getVerse(db, a.sura, a.ayah);
        if (!v) return null;
        const tafseers = await getTafseerForVerse(db, v.id);
        return tafseers[0]?.text ?? null;
      },
      staleTime: Infinity,
    })),
  });

  const isLoading = tafseerQueries.some((q) => q.isLoading);
  const allTexts = tafseerQueries.map((q) => q.data ?? null);
  const combinedText = allTexts.filter(Boolean).join('\n\n');

  const handleShare = useCallback(() => {
    const firstVerse = verses[0];
    if (firstVerse && combinedText) {
      shareAyahWithTafseer(
        firstVerse,
        surahName,
        t('screens.quran.tafseer.localTafseer'),
        combinedText
      );
    }
  }, [verses, combinedText, surahName, t]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.brand.primary} />
        <Typography size="sm" color="secondary">
          {t('screens.quran.tafseer.loading')}
        </Typography>
      </View>
    );
  }

  return (
    <BottomSheetScrollView
      contentContainerStyle={[styles.tabContent, { paddingBottom: insets.bottom + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {ayahs.map((a, i) => {
        const text = allTexts[i];
        if (!text) return null;
        return (
          <View
            key={`${String(a.sura)}-${String(a.ayah)}`}
            style={i > 0 ? styles.ayahSection : undefined}
          >
            {ayahs.length > 1 ? (
              <Typography size="xs" color="muted" style={styles.ayahLabel}>
                {`${t('screens.quran.tafseer.ayah')} ${String(a.ayah)}`}
              </Typography>
            ) : null}
            <Typography size="md" style={styles.tafseerText}>
              {text}
            </Typography>
          </View>
        );
      })}
      {combinedText ? (
        <PressableButton onPress={handleShare}>
          <Icon familyName="Ionicons" iconName="share-outline" size={18} variant="secondary" />
          <Typography size="sm" color="secondary">
            {t('screens.quran.tafseer.shareWithTafseer')}
          </Typography>
        </PressableButton>
      ) : null}
    </BottomSheetScrollView>
  );
}

function RemoteTafseerContent({
  tafseerId,
  ayahs,
  verses,
  surahName,
  isActive,
}: RemoteTafseerContentProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();

  const tafseerQueries = useQueries({
    queries: ayahs.map((a) => ({
      queryKey: ['remoteTafseer', tafseerId, a.sura, a.ayah],
      queryFn: () => fetchTafseerForAyah(Number(tafseerId), a.sura, a.ayah),
      enabled: isActive,
      staleTime: 1000 * 60 * 60, // 1 hour
    })),
  });

  const isLoading = tafseerQueries.some((q) => q.isLoading);
  const isError = tafseerQueries.some((q) => q.isError);
  const allData = tafseerQueries.map((q) => q.data ?? null);
  const combinedText = allData
    .filter(Boolean)
    .map((d) => d!.text)
    .join('\n\n');

  const handleShare = useCallback(() => {
    const firstVerse = verses[0];
    const firstName = allData.find(Boolean)?.tafseer_name ?? '';
    if (firstVerse && combinedText) {
      shareAyahWithTafseer(firstVerse, surahName, firstName, combinedText);
    }
  }, [verses, allData, combinedText, surahName]);

  const handleRetry = useCallback(() => {
    tafseerQueries.forEach((q) => void q.refetch());
  }, [tafseerQueries]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.brand.primary} />
        <Typography size="sm" color="secondary">
          {t('screens.quran.tafseer.loading')}
        </Typography>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Typography size="sm" color="secondary">
          {t('screens.quran.tafseer.error')}
        </Typography>
        <PressableButton onPress={handleRetry}>
          <Typography size="sm" color="secondary">
            {t('screens.quran.tafseer.retry')}
          </Typography>
        </PressableButton>
      </View>
    );
  }

  return (
    <BottomSheetScrollView
      contentContainerStyle={[styles.tabContent, { paddingBottom: insets.bottom + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {ayahs.map((a, i) => {
        const data = allData[i];
        if (!data) return null;
        return (
          <View
            key={`${String(a.sura)}-${String(a.ayah)}`}
            style={i > 0 ? styles.ayahSection : undefined}
          >
            {ayahs.length > 1 ? (
              <Typography size="xs" color="muted" style={styles.ayahLabel}>
                {`${t('screens.quran.tafseer.ayah')} ${String(a.ayah)}`}
              </Typography>
            ) : null}
            <Typography size="md" style={styles.tafseerText}>
              {data.text}
            </Typography>
          </View>
        );
      })}
      {combinedText ? (
        <PressableButton onPress={handleShare}>
          <Icon familyName="Ionicons" iconName="share-outline" size={18} variant="secondary" />
          <Typography size="sm" color="secondary">
            {t('screens.quran.tafseer.shareWithTafseer')}
          </Typography>
        </PressableButton>
      ) : null}
    </BottomSheetScrollView>
  );
}

const TafseerSheet = forwardRef<TafseerSheetRef>((_props, ref) => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const db = useSQLiteContext();
  const sheetRef = useRef<BottomSheetModal>(null);

  const [ayahs, setAyahs] = useState<AyahRef[]>([{ sura: 1, ayah: 1 }]);
  const [tabIndex, setTabIndex] = useState(0);

  const snapPoints = useMemo(() => ['75%', '95%'], []);

  const surahId = ayahs[0]?.sura ?? 1;

  useImperativeHandle(ref, () => ({
    present: (newAyahs: AyahRef[]) => {
      if (newAyahs.length === 0) return;
      setAyahs(newAyahs);
      setTabIndex(0);
      sheetRef.current?.present();
    },
    dismiss: () => {
      sheetRef.current?.dismiss();
    },
  }));

  const verseQueries = useQueries({
    queries: ayahs.map((a) => ({
      queryKey: ['verse', a.sura, a.ayah],
      queryFn: () => getVerse(db, a.sura, a.ayah),
      staleTime: Infinity,
    })),
  });

  const verses = verseQueries.map((q) => q.data ?? null);

  const { data: editions } = useQuery({
    queryKey: ['tafseerEditions'],
    queryFn: fetchTafseerList,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const surahName = useMemo(() => {
    const info = getSurahById(surahId);
    return info?.nameArabic ?? '';
  }, [surahId]);

  const headerReference = useMemo(() => {
    if (ayahs.length === 1) {
      return `${surahName} (${String(surahId)}:${String(ayahs[0].ayah)})`;
    }
    const first = ayahs[0].ayah;
    const last = ayahs[ayahs.length - 1].ayah;
    return `${surahName} (${String(surahId)}:${String(first)}-${String(last)})`;
  }, [ayahs, surahId, surahName]);

  const ayahDisplayText = useMemo(() => {
    return verses
      .filter((v): v is Verse => v !== null)
      .map((v) => v.text_uthmani)
      .join(' ');
  }, [verses]);

  const routes = useMemo(() => {
    const localRoute = {
      key: LOCAL_TAFSEER_KEY,
      title: t('screens.quran.tafseer.localTafseer'),
    };
    const remoteRoutes = (editions ?? []).map((edition: TafseerEdition) => ({
      key: String(edition.id),
      title: edition.name,
    }));
    return [localRoute, ...remoteRoutes];
  }, [editions, t]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={1}
        style={[props.style, { backgroundColor: theme.colors.overlay.modal }]}
      />
    ),
    [theme.colors.overlay.modal]
  );

  const handleDismiss = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const renderScene = useCallback(
    ({ route }: { route: { key: string } }) => {
      const isActive = routes[tabIndex]?.key === route.key;

      if (route.key === LOCAL_TAFSEER_KEY) {
        return <LocalTafseerContent db={db} ayahs={ayahs} verses={verses} surahName={surahName} />;
      }

      return (
        <RemoteTafseerContent
          tafseerId={route.key}
          ayahs={ayahs}
          verses={verses}
          surahName={surahName}
          isActive={isActive}
        />
      );
    },
    [db, ayahs, verses, surahName, routes, tabIndex]
  );

  const tabOptions = useMemo(() => {
    const opts: Record<string, { labelStyle: typeof styles.tabLabel }> = {};
    for (const route of routes) {
      opts[route.key] = { labelStyle: styles.tabLabel };
    }
    return opts;
  }, [routes]);

  const renderTabBar = useCallback(
    (props: React.ComponentProps<typeof TabBar>) => (
      <TabBar
        {...props}
        scrollEnabled
        bounces
        style={[
          styles.tabBar,
          { backgroundColor: theme.colors.background.modal, width: layout.width },
        ]}
        indicatorStyle={styles.tabIndicator}
        activeColor={theme.colors.brand.primary}
        inactiveColor={theme.colors.text.secondary}
        pressColor={theme.colors.overlay.pressed}
        tabStyle={styles.tabStyle}
        options={tabOptions}
        gap={4}
      />
    ),
    [theme, layout.width, tabOptions]
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      containerStyle={styles.sheetContainer}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
      topInset={insets.top}
    >
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Typography size="md" weight="bold">
            {t('screens.quran.tafseer.title')}
          </Typography>
          <Typography size="xs" color="secondary">
            {headerReference}
          </Typography>
        </View>
        <IconButton
          familyName="Feather"
          iconName="x"
          onPress={handleDismiss}
          variant="ghost"
          size="medium"
        />
      </View>
      {ayahDisplayText ? (
        <View style={styles.ayahTextContainer}>
          <Text
            style={[
              styles.ayahText,
              {
                color: theme.colors.text.primary,
                fontFamily: theme.fonts.quran,
              },
            ]}
          >
            {ayahDisplayText}
          </Text>
        </View>
      ) : null}
      <TabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setTabIndex}
        initialLayout={{ width: layout.width }}
        lazy
        style={styles.tabView}
      />
    </BottomSheetModal>
  );
});

TafseerSheet.displayName = 'TafseerSheet';

export default TafseerSheet;
