import {
  CurrentPrayerCard,
  DailyTodos,
  QuickAccess,
  StatsCard,
  VerseOfTheDay,
} from '@/features/home';
import { QUICK_ACCESS_ITEMS } from '@/features/home/constants';
import {
  CURRENT_PRAYER_COUNTDOWN,
  DUMMY_AZKAR,
  DUMMY_PRAYERS,
  DUMMY_RANDOM_ACTS,
  DUMMY_STATS,
  DUMMY_VERSE,
} from '@/features/home/data';
import { useBottomPadding } from '@/hooks/useBottomPadding';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomPadding = useBottomPadding();

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
        <StatsCard stats={DUMMY_STATS} />

        <CurrentPrayerCard
          prayers={DUMMY_PRAYERS}
          currentPrayer="Asr"
          countdown={CURRENT_PRAYER_COUNTDOWN}
        />

        <QuickAccess
          items={QUICK_ACCESS_ITEMS}
          onItemPress={(item) => console.warn('Quick access pressed:', item.id)}
        />

        <VerseOfTheDay verse={DUMMY_VERSE} onShare={() => console.warn('Share verse')} />

        <DailyTodos
          prayers={DUMMY_PRAYERS}
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
}));
