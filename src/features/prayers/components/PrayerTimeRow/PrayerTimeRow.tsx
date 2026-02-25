import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';

import type { PrayerKey } from '../../types';
import { styles } from './PrayerTimeRow.styles';
import type { PrayerTimeRowProps } from './PrayerTimeRow.types';

const PRAYER_ICON_MAP: Record<
  PrayerKey,
  | {
      family: 'MaterialCommunityIcons';
      icon: 'weather-sunset-up' | 'weather-sunny' | 'weather-partly-cloudy' | 'weather-sunset-down';
    }
  | { family: 'Ionicons'; icon: 'sunny-outline' | 'moon-outline' }
> = {
  Fajr: { family: 'MaterialCommunityIcons', icon: 'weather-sunset-up' },
  Sunrise: { family: 'MaterialCommunityIcons', icon: 'weather-sunny' },
  Dhuhr: { family: 'Ionicons', icon: 'sunny-outline' },
  Asr: { family: 'MaterialCommunityIcons', icon: 'weather-partly-cloudy' },
  Maghrib: { family: 'MaterialCommunityIcons', icon: 'weather-sunset-down' },
  Isha: { family: 'Ionicons', icon: 'moon-outline' },
};

export function PrayerTimeRow({ name, displayName, time, status, countdown }: PrayerTimeRowProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  const isSunrise = name === 'Sunrise';
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';

  const rowBg = isCompleted ? theme.colors.background.surfaceAlt : theme.colors.background.surface;

  const borderColor = isCurrent
    ? theme.colors.brand.primary
    : isCompleted
      ? 'transparent'
      : theme.colors.border.default;

  const iconBg = isCurrent
    ? theme.colors.brand.primary
    : isSunrise
      ? `${theme.colors.state.warning}20`
      : isCompleted
        ? theme.colors.background.app
        : `${theme.colors.brand.primary}15`;

  const iconColor = isCurrent
    ? theme.colors.text.inverse
    : isSunrise
      ? theme.colors.state.warning
      : isCompleted
        ? theme.colors.text.muted
        : theme.colors.brand.primary;

  const textColor = isCompleted ? theme.colors.text.muted : theme.colors.text.primary;
  const timeColor = isCompleted ? theme.colors.text.muted : theme.colors.text.primary;

  const prayerIcon = PRAYER_ICON_MAP[name];
  const rowOpacity = isCompleted ? 0.7 : 1;

  const renderIcon = () => {
    if (isCompleted) {
      return <Icon familyName="Ionicons" iconName="checkmark" size={18} color={iconColor} />;
    }

    if (prayerIcon.family === 'Ionicons') {
      return (
        <Icon
          familyName="Ionicons"
          iconName={prayerIcon.icon as 'sunny-outline' | 'moon-outline'}
          size={20}
          color={iconColor}
        />
      );
    }

    return (
      <Icon
        familyName="MaterialCommunityIcons"
        iconName={
          prayerIcon.icon as
            | 'weather-sunset-up'
            | 'weather-sunny'
            | 'weather-partly-cloudy'
            | 'weather-sunset-down'
        }
        size={20}
        color={iconColor}
      />
    );
  };

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: rowBg,
          borderColor,
          opacity: rowOpacity,
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>{renderIcon()}</View>

      <View style={styles.textContainer}>
        <Typography type="body" style={[styles.prayerName, { color: textColor }]}>
          {displayName}
        </Typography>
        {isCurrent && countdown && (
          <Typography
            type="caption"
            style={[styles.statusText, { color: theme.colors.brand.primary }]}
          >
            {t('screens.prayers.upcomingIn', { time: countdown })}
          </Typography>
        )}
      </View>

      <Typography type="body" style={[styles.timeText, { color: timeColor }]}>
        {time}
      </Typography>
    </View>
  );
}
