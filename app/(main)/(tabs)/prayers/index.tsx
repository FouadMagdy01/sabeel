import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Typography } from '@/common/components/Typography';
import { DateSwiper } from '@/features/prayers/components/DateSwiper';
import { PrayerLocationCard } from '@/features/prayers/components/PrayerLocationCard';
import { PrayersList } from '@/features/prayers/components/PrayersList';
import { useDayPrayers } from '@/features/prayers/hooks/useDayPrayers';
import { useLocationName } from '@/features/prayers/hooks/useLocationName';
import { usePrayerTimes } from '@/features/prayers/hooks/usePrayerTimes';
import type { PrayerKey } from '@/features/prayers/types';
import { useBottomPadding } from '@/hooks/useBottomPadding';

function formatDateKey(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function PrayersScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomPadding = useBottomPadding();
  const { theme } = useUnistyles();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = useMemo(() => new Date(), []);
  const isToday = isSameDay(selectedDate, today);
  const selectedDateKey = formatDateKey(selectedDate);

  // Live data for today
  const {
    todayPrayers,
    nextPrayer: liveNextPrayer,
    countdown: liveCountdown,
    hijriDate: liveHijriDate,
  } = usePrayerTimes();

  // Data for selected date (any date)
  const {
    prayers: selectedPrayers,
    nextPrayer: selectedNextPrayer,
    countdown: selectedCountdown,
    hijriDate: selectedHijriDate,
  } = useDayPrayers(selectedDateKey);

  const locationName = useLocationName();

  // Use live data when today is selected, otherwise use day-specific data
  const prayers = isToday ? todayPrayers : selectedPrayers;
  const nextPrayer = isToday ? liveNextPrayer : selectedNextPrayer;
  const countdown = isToday ? liveCountdown : selectedCountdown;
  const hijriDate = isToday ? liveHijriDate : selectedHijriDate;

  const prayerNames = useMemo<Record<PrayerKey, string>>(
    () => ({
      Fajr: t('prayers.names.Fajr'),
      Sunrise: t('prayers.names.Sunrise'),
      Dhuhr: t('prayers.names.Dhuhr'),
      Asr: t('prayers.names.Asr'),
      Maghrib: t('prayers.names.Maghrib'),
      Isha: t('prayers.names.Isha'),
    }),
    [t]
  );

  const nextPrayerTime = useMemo(() => {
    if (!nextPrayer) return '';
    const prayer = prayers.find((p) => p.name === nextPrayer);
    return prayer?.time ?? '';
  }, [nextPrayer, prayers]);

  const locationDisplay = locationName.country
    ? `${locationName.city}, ${locationName.country}`
    : locationName.city;

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  return (
    <ScrollView
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: theme.colors.background.app },
      ]}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
    >
      <Typography type="heading" size="2xl" weight="bold" style={styles.screenTitle}>
        {t('screens.prayers.title')}
      </Typography>

      <DateSwiper selectedDate={selectedDate} onDateChange={handleDateChange} />

      <View style={styles.cardSpacing}>
        <PrayerLocationCard
          locationName={locationDisplay}
          date={selectedDate}
          hijriDate={hijriDate}
          nextPrayer={nextPrayer ? prayerNames[nextPrayer] : null}
          nextPrayerTime={nextPrayerTime}
          countdown={countdown}
        />
      </View>

      <PrayersList prayers={prayers} prayerNames={prayerNames} countdown={countdown} />
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  screenTitle: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingTop: theme.metrics.spacingV.p16,
    paddingBottom: theme.metrics.spacingV.p8,
  },
  cardSpacing: {
    marginTop: theme.metrics.spacingV.p8,
    marginBottom: theme.metrics.spacingV.p8,
  },
}));
