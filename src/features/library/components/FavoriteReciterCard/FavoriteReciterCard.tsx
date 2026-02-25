import { Card } from '@/common/components/Card';
import { Divider } from '@/common/components/Divider';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { FavoriteReciter } from '../../types';
import { styles } from './FavoriteReciterCard.styles';

interface FavoriteReciterCardProps {
  reciter: FavoriteReciter;
  onPress?: (reciter: FavoriteReciter) => void;
  onPlay?: (reciter: FavoriteReciter) => void;
  onUnfavorite?: (reciter: FavoriteReciter) => void;
  isPlaying?: boolean;
}

const FavoriteReciterCard: React.FC<FavoriteReciterCardProps> = ({
  reciter,
  onPress,
  onPlay,
  onUnfavorite,
  isPlaying = false,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const reciterDisplayName = isArabic
    ? reciter.reciterNameAr || reciter.reciterNameEn
    : reciter.reciterNameEn || reciter.reciterNameAr;
  const moshafDisplayName = isArabic
    ? reciter.moshafNameAr || reciter.moshafNameEn
    : reciter.moshafNameEn || reciter.moshafNameAr;

  return (
    <Card
      variant="outlined"
      style={styles.cardLayout}
      onPress={onPress ? () => onPress(reciter) : undefined}
    >
      <View style={styles.avatar}>
        <Icon familyName="MaterialIcons" iconName="person" size={24} variant="brandPrimary" />
      </View>
      <View style={styles.content}>
        <Typography size="sm" weight="bold">
          {reciterDisplayName}
        </Typography>
        <View style={styles.metaRow}>
          <Typography
            size="xs"
            weight="medium"
            color="muted"
            style={styles.metaText}
            numberOfLines={1}
          >
            {moshafDisplayName}
          </Typography>
          <Divider variant="dot" />
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {t('screens.library.reciter.suras', {
              count: reciter.surahTotal,
            })}
          </Typography>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <IconButton
          familyName="MaterialIcons"
          iconName={isPlaying ? 'pause' : 'play-arrow'}
          variant="tinted"
          size="medium"
          onPress={onPlay ? () => onPlay(reciter) : undefined}
        />
        <IconButton
          familyName="MaterialIcons"
          iconName="favorite"
          variant="ghost"
          size="medium"
          iconVariant="accent"
          onPress={onUnfavorite ? () => onUnfavorite(reciter) : undefined}
        />
      </View>
    </Card>
  );
};

export default FavoriteReciterCard;
