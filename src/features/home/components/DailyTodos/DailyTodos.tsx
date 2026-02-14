import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import type { AzkarData, PrayerData, RandomActData } from '../../types';
import { AzkarProgress } from '../AzkarProgress';
import { PrayersProgress } from '../PrayersProgress';
import { RandomActsGrid } from '../RandomActsGrid';
import { styles } from './DailyTodos.styles';

interface DailyTodosProps {
  prayers: PrayerData[];
  azkar: AzkarData[];
  randomActs: RandomActData[];
  onPrayerPress: (prayer: PrayerData) => void;
  onAzkarPress: (azkar: AzkarData) => void;
  onActPress: (act: RandomActData) => void;
}

export function DailyTodos({
  prayers,
  azkar,
  randomActs,
  onPrayerPress,
  onAzkarPress,
  onActPress,
}: DailyTodosProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Typography type="overline" style={styles.sectionHeader}>
        {t('screens.home.dailyTodos.sectionTitle')}
      </Typography>
      <PrayersProgress prayers={prayers} onPrayerPress={onPrayerPress} />
      <AzkarProgress azkar={azkar} onAzkarPress={onAzkarPress} />
      <RandomActsGrid acts={randomActs} onActPress={onActPress} />
    </View>
  );
}
