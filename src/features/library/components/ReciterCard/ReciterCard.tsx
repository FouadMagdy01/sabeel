import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type GestureResponderEvent, View } from 'react-native';

import { styles } from './ReciterCard.styles';
import type { ReciterCardProps } from './ReciterCard.types';

const ReciterCard: React.FC<ReciterCardProps> = React.memo(
  ({ reciter, onPress, onFavoriteToggle, isFavorited = false, onPlay, isPlaying = false }) => {
    const { t } = useTranslation();

    const surahTotal = reciter.moshaf[0]?.surah_total ?? 0;
    const moshafCount = reciter.moshaf.length;

    const handlePress = useCallback(() => {
      onPress?.(reciter);
    }, [onPress, reciter]);

    const handleFavoriteToggle = useCallback(
      (e: GestureResponderEvent) => {
        e.stopPropagation();
        onFavoriteToggle?.(reciter);
      },
      [onFavoriteToggle, reciter]
    );

    const handlePlay = useCallback(
      (e: GestureResponderEvent) => {
        e.stopPropagation();
        onPlay?.(reciter);
      },
      [onPlay, reciter]
    );

    return (
      <Card
        variant="outlined"
        padding="sm"
        style={styles.cardLayout}
        onPress={onPress ? handlePress : undefined}
      >
        <View style={styles.imageContainer}>
          <Icon familyName="MaterialIcons" iconName="person" size={28} variant="brandPrimary" />
        </View>
        <View style={styles.content}>
          <Typography size="sm" weight="bold">
            {reciter.name}
          </Typography>
          <View style={styles.metaRow}>
            <Typography
              size="xs"
              weight="bold"
              color="brandTertiary"
              uppercase
              style={styles.surahText}
            >
              {t('screens.library.explore.surahCount', { count: surahTotal })}
            </Typography>
            <Typography size="xs" color="muted" style={styles.separator}>
              {'·'}
            </Typography>
            <Typography
              size="xs"
              weight="bold"
              color="secondary"
              uppercase
              style={styles.surahText}
            >
              {t('screens.library.explore.moshafCount', { count: moshafCount })}
            </Typography>
          </View>
        </View>
        <View style={styles.actionsRow}>
          <IconButton
            familyName="MaterialIcons"
            iconName={isFavorited ? 'favorite' : 'favorite-border'}
            variant="ghost"
            size="medium"
            iconVariant={isFavorited ? 'accent' : 'muted'}
            onPress={handleFavoriteToggle}
          />
          {onPlay && (
            <IconButton
              familyName="MaterialIcons"
              iconName={isPlaying ? 'pause' : 'play-arrow'}
              variant="tinted"
              size="medium"
              onPress={handlePlay}
            />
          )}
        </View>
      </Card>
    );
  }
);

ReciterCard.displayName = 'ReciterCard';

export default ReciterCard;
