import {
  CurrentPrayerCard,
  DailyTodos,
  HomeHeader,
  PrayerTimesError,
  QuickAccess,
  VerseOfTheDay,
} from '@/features/home';
import { QUICK_ACCESS_ITEMS } from '@/features/home/constants';
import type { QuickAccessItem } from '@/features/home/components/QuickAccess/QuickAccess.types';
import { DUMMY_PRAYERS } from '@/features/home/data';
import type { AzkarData, PrayerData, PrayerName, RandomActData } from '@/features/home/types';
import { useVerseOfTheDay } from '@/features/home/hooks/useVerseOfTheDay';
import { useDailyTodosStore } from '@/features/home/stores/dailyTodosStore';
import { usePrayerTimes } from '@/features/prayers';
import { useBottomPadding } from '@/hooks/useBottomPadding';
import { getItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';
import type { LastReadInfo } from '@/features/quran/components/ContinueReadingCard';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Share, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomPadding = useBottomPadding();
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const router = useRouter();
  const {
    todayPrayers,
    currentPrayer,
    nextPrayer,
    countdown,
    hijriDate,
    isLoading,
    isStale,
    error,
    refresh,
  } = usePrayerTimes();

  const { verse } = useVerseOfTheDay();

  // Daily todos store
  const {
    completedPrayers,
    completedAzkar,
    completedRandomActs,
    dailyRandomActs,
    togglePrayer,
    toggleRandomAct,
    loadFromStorage: loadTodosFromStorage,
  } = useDailyTodosStore();

  // Load daily todos state on mount
  useEffect(() => {
    loadTodosFromStorage();
  }, [loadTodosFromStorage]);

  const livePrayerData: PrayerData[] = useMemo(() => {
    if (todayPrayers.length === 0) return DUMMY_PRAYERS;
    return todayPrayers.map((p) => ({
      name: p.name as PrayerName,
      time: p.time,
      status: p.status,
    }));
  }, [todayPrayers]);

  // Build azkar data from store state
  const azkarData: AzkarData[] = useMemo(
    () => [
      {
        type: 'Morning' as const,
        categoryId: 'morning_azkar' as const,
        status: completedAzkar.includes('morning_azkar')
          ? ('completed' as const)
          : ('uncompleted' as const),
      },
      {
        type: 'Evening' as const,
        categoryId: 'evening_azkar' as const,
        status: completedAzkar.includes('evening_azkar')
          ? ('completed' as const)
          : ('uncompleted' as const),
      },
    ],
    [completedAzkar]
  );

  // Build random acts data from store state
  const randomActsData: RandomActData[] = useMemo(
    () =>
      dailyRandomActs.map((act) => ({
        id: act.id,
        title: t(act.titleKey as never),
        iconFamily: act.iconFamily,
        iconName: act.iconName,
        status: completedRandomActs.includes(act.id)
          ? ('completed' as const)
          : ('unlocked' as const),
      })),
    [dailyRandomActs, completedRandomActs, t]
  );

  const handleQuickAccessPress = useCallback(
    (item: QuickAccessItem) => {
      switch (item.id) {
        case 'mushaf': {
          const result = getItem<LastReadInfo>(STORAGE_KEYS.quran.lastPage);
          const lastRead = result.data;
          const page = Math.max(1, Math.min(604, lastRead?.page ?? 1));
          const surahId = Math.max(1, Math.min(114, lastRead?.surahId ?? 1));
          router.push({
            pathname: '/(main)/quran-reader',
            params: {
              page: String(page),
              surahId: String(surahId),
            },
          });
          break;
        }
        case 'qibla':
          router.push('/(main)/qibla');
          break;
        case 'tasbeeh':
          router.push('/(main)/tasbeeh');
          break;
        case 'azkar-dua':
          router.push('/(main)/azkar-hub');
          break;
        case 'sunnah-books':
          router.push('/(main)/sunnah-collections');
          break;
        default:
          break;
      }
    },
    [router]
  );

  const handlePrayerPress = useCallback(
    (prayer: PrayerData) => {
      // Only allow toggling past and current prayers, not upcoming
      if (prayer.status === 'upcoming' && !completedPrayers.includes(prayer.name)) return;
      togglePrayer(prayer.name);
    },
    [togglePrayer, completedPrayers]
  );

  const handleAzkarPress = useCallback(
    (azkar: AzkarData) => {
      router.push({
        pathname: '/(main)/azkar-session',
        params: { categoryId: azkar.categoryId },
      });
    },
    [router]
  );

  const handleRandomActPress = useCallback(
    (act: RandomActData) => {
      // Find the definition to check for navigation
      const definition = dailyRandomActs.find((a) => a.id === act.id);

      if (definition?.navigateTo) {
        if (definition.navigateTo === '/(main)/quran-reader') {
          const result = getItem<LastReadInfo>(STORAGE_KEYS.quran.lastPage);
          const lastRead = result.data;
          const page = Math.max(1, Math.min(604, lastRead?.page ?? 1));
          const surahId = Math.max(1, Math.min(114, lastRead?.surahId ?? 1));
          router.push({
            pathname: '/(main)/quran-reader',
            params: { page: String(page), surahId: String(surahId) },
          });
        } else {
          router.push(definition.navigateTo as never);
        }
      }

      toggleRandomAct(act.id);
    },
    [dailyRandomActs, router, toggleRandomAct]
  );

  const handleShareVerse = useCallback(() => {
    const parts = [verse.arabic, verse.translation, verse.reference].filter(Boolean);
    void Share.share({ message: parts.join('\n\n') });
  }, [verse]);

  const renderPrayerCard = () => {
    if (isLoading && todayPrayers.length === 0) {
      return (
        <View style={homeStyles.loadingContainer}>
          <ActivityIndicator color={theme.colors.brand.primary} />
        </View>
      );
    }

    if (error && todayPrayers.length === 0) {
      return <PrayerTimesError error={error} onRetry={refresh} />;
    }

    return (
      <CurrentPrayerCard
        prayers={livePrayerData}
        currentPrayer={currentPrayer as PrayerName | null}
        nextPrayer={nextPrayer as PrayerName | null}
        countdown={countdown}
        isStale={isStale}
        onRefresh={refresh}
      />
    );
  };

  return (
    <View style={homeStyles.screen}>
      <ScrollView
        contentContainerStyle={[
          homeStyles.content,
          {
            paddingTop: insets.top + 16,
            paddingBottom: bottomPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader hijriDate={hijriDate} />

        {renderPrayerCard()}
        <QuickAccess items={QUICK_ACCESS_ITEMS} onItemPress={handleQuickAccessPress} />

        <VerseOfTheDay verse={verse} onShare={handleShareVerse} />

        <DailyTodos
          prayers={livePrayerData.length > 0 ? livePrayerData : DUMMY_PRAYERS}
          completedPrayers={completedPrayers}
          azkar={azkarData}
          randomActs={randomActsData}
          onPrayerPress={handlePrayerPress}
          onAzkarPress={handleAzkarPress}
          onActPress={handleRandomActPress}
        />
      </ScrollView>
    </View>
  );
}

const homeStyles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  content: {
    paddingHorizontal: theme.metrics.spacing.p24,
    gap: theme.metrics.spacingV.p24,
  },
  loadingContainer: {
    paddingVertical: theme.metrics.spacingV.p32,
    alignItems: 'center',
  },
}));
