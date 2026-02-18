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

  // Inline color styles to avoid flicker during theme switching
  const timelineLineColor = { backgroundColor: theme.colors.border.default };
  const dotCompletedColors = {
    backgroundColor: theme.colors.state.successBg,
    borderColor: theme.colors.state.success,
  };
  const dotCurrentColors = {
    backgroundColor: theme.colors.brand.primary,
    shadowColor: theme.colors.brand.primary,
  };
  const dotCurrentInnerColor = { backgroundColor: '#FFFFFF' };
  const dotUpcomingColors = {
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.default,
  };
  const dotUpcomingInnerColor = { backgroundColor: theme.colors.icon.muted };
  const labelCompletedColor = { color: theme.colors.brand.secondary };
  const labelCurrentColor = { color: theme.colors.brand.primary };
  const labelUpcomingColor = { color: theme.colors.brand.secondary, opacity: 0.5 };

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
            size={16}
            color={theme.colors.brand.primary}
          />
          <Typography
            size="sm"
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
        <View style={[styles.timelineLine, timelineLineColor]} />
        {prayers.map((prayer) => (
          <View key={prayer.name} style={styles.timelineItem}>
            {prayer.status === 'completed' && (
              <View style={[styles.dotCompleted, dotCompletedColors]}>
                <Icon
                  familyName="MaterialIcons"
                  iconName="check"
                  size={12}
                  color={theme.colors.brand.secondary}
                />
              </View>
            )}
            {prayer.status === 'current' && (
              <View style={[styles.dotCurrent, dotCurrentColors]}>
                <View style={[styles.dotCurrentInner, dotCurrentInnerColor]} />
              </View>
            )}
            {prayer.status === 'upcoming' && (
              <View style={[styles.dotUpcoming, dotUpcomingColors]}>
                <View style={[styles.dotUpcomingInner, dotUpcomingInnerColor]} />
              </View>
            )}
            <Typography
              size="xxs"
              weight="bold"
              uppercase
              style={[
                styles.prayerLabel,
                prayer.status === 'completed' && styles.labelCompleted,
                prayer.status === 'completed' && labelCompletedColor,
                prayer.status === 'current' && labelCurrentColor,
                prayer.status === 'upcoming' && labelUpcomingColor,
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
