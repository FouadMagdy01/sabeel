import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { getSurahById } from '@/features/library/data/surahData';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './ContinueReadingCard.styles';
import type { ContinueReadingCardProps } from './ContinueReadingCard.types';

const ContinueReadingCard: React.FC<ContinueReadingCardProps> = React.memo(
  ({ lastRead, onPress }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useUnistyles();

    const surah = getSurahById(lastRead.surahId);
    const isArabic = i18n.language === 'ar';
    const surahName = isArabic ? surah?.nameArabic : surah?.nameSimple;

    if (!surah) return null;

    return (
      <Pressable
        style={[styles.container, { backgroundColor: theme.colors.background.surface }]}
        onPress={onPress}
        android_ripple={{ color: theme.colors.overlay.pressed }}
      >
        <View style={[styles.badge, { backgroundColor: `${theme.colors.brand.primary}1A` }]}>
          <Typography size="sm" weight="bold" style={{ color: theme.colors.brand.primary }}>
            {String(surah.id)}
          </Typography>
        </View>
        <View style={styles.content}>
          <Typography size="sm" weight="semiBold">
            {t('screens.quran.continueReading.title')}
          </Typography>
          <View style={styles.metaRow}>
            <Typography size="xs" color="secondary">
              {surahName ?? ''}
            </Typography>
            <Typography size="xs" color="muted">
              {'·'}
            </Typography>
            <Typography size="xs" color="secondary">
              {t('screens.quran.continueReading.page', { page: lastRead.page })}
            </Typography>
          </View>
        </View>
        <Icon familyName="Ionicons" iconName="play-circle" size={28} variant="brandPrimary" />
      </Pressable>
    );
  }
);

ContinueReadingCard.displayName = 'ContinueReadingCard';

export default ContinueReadingCard;
