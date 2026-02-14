import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import type { PrayerData, PrayerName } from '../../types';
import { styles } from './CurrentPrayerCard.styles';

interface CurrentPrayerCardProps {
  prayers: PrayerData[];
  currentPrayer: PrayerName;
  countdown: string;
}

export function CurrentPrayerCard({ prayers, currentPrayer, countdown }: CurrentPrayerCardProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  return (
    <Card
      variant="gradient"
      gradientColors={[theme.colors.gradient.sacred[0], theme.colors.gradient.sacred[1]]}
      radius="xl"
      padding="lg"
    >
      <View style={styles.topSection}>
        <Typography
          size="xxs"
          weight="bold"
          color="brandSecondary"
          uppercase
          style={styles.currentLabel}
        >
          {t('screens.home.currentPrayer.label')}
        </Typography>
        <Typography size="4xl" weight="bold" color="brandSecondary" style={styles.prayerName}>
          {currentPrayer}
        </Typography>
        <View style={styles.timerRow}>
          <Icon
            familyName="MaterialIcons"
            iconName="schedule"
            size={14}
            color={theme.colors.brand.primary}
          />
          <Typography
            size="xs"
            weight="bold"
            color="brandPrimary"
            uppercase
            style={styles.timerText}
          >
            {t('screens.home.currentPrayer.endsIn', { countdown })}
          </Typography>
        </View>
      </View>

      <View style={styles.timelineContainer}>
        <View style={styles.timelineLine} />
        {prayers.map((prayer) => (
          <View key={prayer.name} style={styles.timelineItem}>
            {prayer.status === 'completed' && (
              <View style={styles.dotCompleted}>
                <Icon
                  familyName="MaterialIcons"
                  iconName="check"
                  size={12}
                  color={theme.colors.brand.secondary}
                />
              </View>
            )}
            {prayer.status === 'current' && (
              <View style={styles.dotCurrent}>
                <View style={styles.dotCurrentInner} />
              </View>
            )}
            {prayer.status === 'upcoming' && (
              <View style={styles.dotUpcoming}>
                <View style={styles.dotUpcomingInner} />
              </View>
            )}
            <Typography
              size="xxs"
              weight="bold"
              uppercase
              style={[
                styles.prayerLabel,
                prayer.status === 'completed' && styles.labelCompleted,
                prayer.status === 'current' && styles.labelCurrent,
                prayer.status === 'upcoming' && styles.labelUpcoming,
              ]}
            >
              {prayer.name}
            </Typography>
          </View>
        ))}
      </View>
    </Card>
  );
}
