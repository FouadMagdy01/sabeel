import { Card } from '@/common/components/Card';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './SurahListItem.styles';
import type { SurahListItemProps } from './SurahListItem.types';

const SurahListItem: React.FC<SurahListItemProps> = React.memo(
  ({
    surah,
    reciterId,
    onPress,
    onPlayPress,
    onFavoritePress,
    onDownloadPress,
    isFavorite,
    isDownloaded,
    isDownloading,
  }) => {
    const isPlaying = usePlayerStore(
      (s) =>
        s.playerSource === 'library' &&
        s.currentLibraryReciterId === reciterId &&
        s.isPlaying &&
        s.currentSurahName === String(surah.id)
    );
    const { t, i18n } = useTranslation();
    const { theme } = useUnistyles();

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
            iconVariant={isFavorite ? 'accent' : 'muted'}
            onPress={handleFavoritePress}
          />
          {isDownloading ? (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="small" color={theme.colors.brand.primary} />
            </View>
          ) : (
            <IconButton
              familyName="MaterialIcons"
              iconName={isDownloaded ? 'check-circle' : 'download'}
              variant="ghost"
              size="medium"
              iconVariant={isDownloaded ? 'accent' : 'muted'}
              onPress={handleDownloadPress}
            />
          )}
          <IconButton
            familyName="MaterialIcons"
            iconName={isPlaying ? 'pause' : 'play-arrow'}
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
