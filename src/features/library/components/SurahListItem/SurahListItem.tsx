import { Card } from '@/common/components/Card';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './SurahListItem.styles';
import type { SurahListItemProps } from './SurahListItem.types';

const SurahListItem: React.FC<SurahListItemProps> = React.memo(
  ({ surah, onPress, onPlayPress, onFavoritePress, onDownloadPress, isFavorite, isDownloaded }) => {
    const { t, i18n } = useTranslation();

    const isArabic = i18n.language === 'ar';
    const surahName = isArabic ? surah.nameArabic : surah.nameSimple;

    const revelationPlace =
      surah.revelationPlace === 'makkah'
        ? t('screens.library.reciterSurahs.makkah')
        : t('screens.library.reciterSurahs.madinah');

    const handlePress = useCallback(() => {
      onPress?.(surah);
    }, [onPress, surah]);

    const handlePlayPress = useCallback(() => {
      onPlayPress?.(surah);
    }, [onPlayPress, surah]);

    const handleFavoritePress = useCallback(() => {
      onFavoritePress?.(surah);
    }, [onFavoritePress, surah]);

    const handleDownloadPress = useCallback(() => {
      onDownloadPress?.(surah);
    }, [onDownloadPress, surah]);

    return (
      <Card
        variant="outlined"
        padding="sm"
        style={styles.cardLayout}
        onPress={onPress ? handlePress : undefined}
      >
        <View style={styles.numberCircle}>
          <Typography size="xs" weight="bold" color="brandPrimary">
            {String(surah.id)}
          </Typography>
        </View>
        <View style={styles.content}>
          <Typography size="sm" weight="bold">
            {surahName}
          </Typography>
          <View style={styles.metaRow}>
            <Typography size="xs" color="secondary" style={styles.metaText}>
              {t('screens.library.reciterSurahs.verses', { count: surah.versesCount })}
            </Typography>
            <Typography size="xs" color="muted" style={styles.separator}>
              {'·'}
            </Typography>
            <Typography size="xs" color="secondary" style={styles.metaText}>
              {revelationPlace}
            </Typography>
          </View>
        </View>
        <View style={styles.actions}>
          <IconButton
            familyName="MaterialIcons"
            iconName={isFavorite ? 'favorite' : 'favorite-border'}
            variant="ghost"
            size="medium"
            iconVariant="muted"
            onPress={handleFavoritePress}
          />
          <IconButton
            familyName="MaterialIcons"
            iconName={isDownloaded ? 'check-circle' : 'download'}
            variant="ghost"
            size="medium"
            iconVariant="muted"
            onPress={handleDownloadPress}
          />
          <IconButton
            familyName="MaterialIcons"
            iconName="play-arrow"
            variant="tinted"
            size="medium"
            onPress={handlePlayPress}
          />
        </View>
      </Card>
    );
  }
);

SurahListItem.displayName = 'SurahListItem';

export default SurahListItem;
