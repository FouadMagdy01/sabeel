import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';

import { styles } from './PrayerLocationCard.styles';
import type { PrayerLocationCardProps } from './PrayerLocationCard.types';

export function PrayerLocationCard({
  locationName,
  date,
  hijriDate,
  nextPrayer,
  nextPrayerTime,
  countdown,
}: PrayerLocationCardProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useUnistyles();

  const bgColor = theme.colors.brand.primary;
  const textColor = theme.colors.text.inverse;
  const decorColor = theme.colors.text.inverse;

  const gregorianDate = date.toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const hijriStr = hijriDate
    ? `${hijriDate.day} ${i18n.language === 'ar' ? hijriDate.month.ar : hijriDate.month.en} ${hijriDate.year}`
    : '';

  const dateDisplay = hijriStr ? `${gregorianDate} / ${hijriStr}` : gregorianDate;

  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={[styles.decorCircle1, { backgroundColor: decorColor }]} />
      <View style={[styles.decorCircle2, { backgroundColor: decorColor }]} />

      <View style={styles.locationRow}>
        <Icon familyName="Ionicons" iconName="location-outline" size={14} color={textColor} />
        <Typography type="body" size="sm" style={{ color: textColor }}>
          {locationName}
        </Typography>
      </View>

      <Typography type="body" style={[styles.dateText, { color: textColor }]}>
        {dateDisplay}
      </Typography>

      {nextPrayer ? (
        <>
          <Typography type="body" style={[styles.nextPrayerLabel, { color: textColor }]}>
            {t('screens.prayers.nextPrayer')}
          </Typography>
          <View style={styles.nextPrayerRow}>
            <Typography type="heading" style={[styles.prayerName, { color: textColor }]}>
              {nextPrayer}
            </Typography>
            <View style={{ alignItems: 'flex-end' as const }}>
              <Typography type="body" style={[styles.countdown, { color: textColor }]}>
                {nextPrayerTime}
              </Typography>
              <Typography
                type="caption"
                size="xs"
                style={[styles.upcomingText, { color: textColor }]}
              >
                {t('screens.prayers.upcomingIn', { time: countdown })}
              </Typography>
            </View>
          </View>
        </>
      ) : (
        <Typography type="body" style={[styles.nextPrayerLabel, { color: textColor }]}>
          {t('screens.prayers.allCompleted')}
        </Typography>
      )}
    </View>
  );
}
