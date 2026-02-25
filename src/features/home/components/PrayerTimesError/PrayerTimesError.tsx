import { Button } from '@/common/components/Button';
import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './PrayerTimesError.styles';

interface PrayerTimesErrorProps {
  error: string;
  onRetry: () => void;
}

export function PrayerTimesError({ error, onRetry }: PrayerTimesErrorProps) {
  const { t } = useTranslation();

  const message =
    error === 'location_denied'
      ? t('screens.home.prayerTimes.locationRequired')
      : t('screens.home.prayerTimes.error');

  const icon = error === 'location_denied' ? 'location-off' : 'error-outline';

  return (
    <Card variant="elevated" radius="xl" padding="lg">
      <View style={styles.container}>
        <Icon familyName="MaterialIcons" iconName={icon} size={32} variant="muted" />
        <Typography size="sm" color="secondary" align="center" style={styles.message}>
          {message}
        </Typography>
        <Button variant="outlined" size="small" onPress={onRetry}>
          {t('screens.home.prayerTimes.retry')}
        </Button>
      </View>
    </Card>
  );
}
