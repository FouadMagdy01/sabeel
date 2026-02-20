import { Typography } from '@/common/components/Typography';
import type { HijriDate } from '@/features/prayers';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './HomeHeader.styles';

interface HomeHeaderProps {
  hijriDate?: HijriDate | null;
}

function formatHijriFromApi(hijri: HijriDate, isArabic: boolean): string {
  const day = hijri.day;
  const month = isArabic ? hijri.month.ar : hijri.month.en;
  const year = hijri.year;
  return `${day} ${month} ${year}`;
}

function formatHijriFromIntl(locale: string): string {
  return new Intl.DateTimeFormat(`${locale}-u-ca-islamic`, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(Date.now());
}

export function HomeHeader({ hijriDate }: HomeHeaderProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const locale = isArabic ? 'ar-TN' : 'en-US';

  const gregorianDate = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(Date.now()),
    [locale]
  );

  const hijriStr = useMemo(
    () => (hijriDate ? formatHijriFromApi(hijriDate, isArabic) : formatHijriFromIntl(locale)),
    [hijriDate, isArabic, locale]
  );

  return (
    <View style={styles.container}>
      <Typography type="heading" size="xl" weight="bold" color="primary">
        {t('screens.home.greeting')}
      </Typography>
      <View style={styles.dateRow}>
        <Typography size="sm" color="secondary">
          {gregorianDate}
        </Typography>
        <Typography size="sm" color="muted" style={styles.dateSeparator}>
          {'·'}
        </Typography>
        <Typography size="sm" color="secondary">
          {hijriStr}
        </Typography>
      </View>
    </View>
  );
}
