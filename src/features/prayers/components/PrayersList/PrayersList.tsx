import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Typography } from '@/common/components/Typography';

import { PrayerTimeRow } from '../PrayerTimeRow';
import { styles } from './PrayersList.styles';
import type { PrayersListProps } from './PrayersList.types';

export function PrayersList({ prayers, prayerNames, countdown }: PrayersListProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Typography type="heading" size="lg" weight="bold" style={styles.sectionHeader}>
        {t('screens.prayers.dailySchedule')}
      </Typography>

      {prayers.map((prayer) => (
        <PrayerTimeRow
          key={prayer.name}
          name={prayer.name}
          displayName={prayerNames[prayer.name] ?? prayer.name}
          time={prayer.time}
          status={prayer.status}
          countdown={prayer.status === 'current' ? countdown : undefined}
        />
      ))}
    </View>
  );
}
