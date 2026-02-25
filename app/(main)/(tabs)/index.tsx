import {
  CurrentPrayerCard,
  DailyTodos,
  HomeHeader,
  PrayerTimesError,
  QuickAccess,
  StatsCard,
  VerseOfTheDay,
} from '@/features/home';
import { QUICK_ACCESS_ITEMS } from '@/features/home/constants';
import type { QuickAccessItem } from '@/features/home/components/QuickAccess/QuickAccess.types';
import {
  DUMMY_AZKAR,
  DUMMY_PRAYERS,
  DUMMY_RANDOM_ACTS,
  DUMMY_STATS,
  DUMMY_VERSE,
} from '@/features/home/data';
import type { PrayerData, PrayerName } from '@/features/home/types';
import { usePrayerTimes } from '@/features/prayers';
import { useBottomPadding } from '@/hooks/useBottomPadding';
import { getItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';
import type { LastReadInfo } from '@/features/quran/components/ContinueReadingCard';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, View } from 'react-native';
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

  const livePrayerData: PrayerData[] = useMemo(() => {
    if (todayPrayers.length === 0) return DUMMY_PRAYERS;
    return todayPrayers.map((p) => ({
      name: p.name as PrayerName,
      time: p.time,
      status: p.status,
    }));
  }, [todayPrayers]);

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
          console.warn(t('screens.home.quickAccess.sectionTitle'), item.id);
      }
    },
    [router, t]
  );

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

        <StatsCard stats={DUMMY_STATS} />
        {renderPrayerCard()}
        <QuickAccess items={QUICK_ACCESS_ITEMS} onItemPress={handleQuickAccessPress} />

        <VerseOfTheDay verse={DUMMY_VERSE} onShare={() => console.warn('Share verse')} />

        <DailyTodos
          prayers={livePrayerData.length > 0 ? livePrayerData : DUMMY_PRAYERS}
          azkar={DUMMY_AZKAR}
          randomActs={DUMMY_RANDOM_ACTS}
          onPrayerPress={(p) => console.warn('Prayer pressed:', p.name)}
          onAzkarPress={(a) => console.warn('Azkar pressed:', a.type)}
          onActPress={(a) => console.warn('Act pressed:', a.title)}
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
