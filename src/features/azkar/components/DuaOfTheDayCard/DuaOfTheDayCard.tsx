import React from 'react';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';

import { Card } from '@/common/components/Card';
import { Typography } from '@/common/components/Typography';

import { styles } from './DuaOfTheDayCard.styles';
import type { DuaOfTheDayCardProps } from './DuaOfTheDayCard.types';

export function DuaOfTheDayCard({ item }: DuaOfTheDayCardProps) {
  const { theme } = useUnistyles();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <Card variant="elevated">
      <View style={styles.container}>
        <View style={[styles.topBorder, { backgroundColor: theme.colors.brand.secondary }]} />
        <View style={[styles.badge, { backgroundColor: theme.colors.brand.secondaryVariant }]}>
          <Typography size="xs" weight="semiBold" color="brandSecondary">
            {t('screens.azkar.hub.duaOfTheDay')}
          </Typography>
        </View>
        <Typography type="heading" size="xl" weight="bold" align="center" style={styles.arabicText}>
          {item.arabic}
        </Typography>
        {!isArabic && (
          <Typography size="sm" color="secondary" italic align="center">
            {t(item.translationKey as never)}
          </Typography>
        )}
        {item.source.startsWith('Quran ') && (
          <View style={[styles.ayahBadge, { backgroundColor: theme.colors.brand.secondaryVariant }]}>
            <Typography size="xs" weight="semiBold" color="brandSecondary">
              {t('screens.azkar.session.ayah', {
                ref: item.source.replace('Quran ', ''),
              })}
            </Typography>
          </View>
        )}
        <Typography size="xs" color="muted" style={styles.source}>
          {item.source}
        </Typography>
      </View>
    </Card>
  );
}
