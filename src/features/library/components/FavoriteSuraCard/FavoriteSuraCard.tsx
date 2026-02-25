import { Card } from '@/common/components/Card';
import { Divider } from '@/common/components/Divider';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { getSurahById } from '../../data/surahData';
import type { FavoriteSura } from '../../types';
import { styles } from './FavoriteSuraCard.styles';

interface FavoriteSuraCardProps {
  sura: FavoriteSura;
  onPress?: (sura: FavoriteSura) => void;
  onPlay?: (sura: FavoriteSura) => void;
  onUnfavorite?: (sura: FavoriteSura) => void;
  isPlaying?: boolean;
}

const FavoriteSuraCard: React.FC<FavoriteSuraCardProps> = ({
  sura,
  onPress,
  onPlay,
  onUnfavorite,
  isPlaying = false,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const surahInfo = getSurahById(sura.surahId);
  const surahName = isArabic ? surahInfo?.nameArabic : surahInfo?.nameSimple;
  const reciterDisplayName = isArabic
    ? sura.reciterNameAr || sura.reciterNameEn
    : sura.reciterNameEn || sura.reciterNameAr;

  return (
    <Card
      variant="outlined"
      style={styles.cardLayout}
      onPress={onPress ? () => onPress(sura) : undefined}
    >
      <View style={styles.numberBadge}>
        <Typography size="md" weight="bold" color="brandPrimary">
          {sura.surahId}
        </Typography>
      </View>
      <View style={styles.content}>
        <Typography size="sm" weight="bold">
          {surahName ?? String(sura.surahId)}
        </Typography>
        <View style={styles.metaRow}>
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {reciterDisplayName}
          </Typography>
          {surahInfo ? (
            <>
              <Divider variant="dot" />
              <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
                {t('screens.library.sura.verses', { count: surahInfo.versesCount })}
              </Typography>
            </>
          ) : null}
        </View>
      </View>
      <View style={styles.actionsRow}>
        <IconButton
          familyName="MaterialIcons"
          iconName={isPlaying ? 'pause' : 'play-arrow'}
          variant="tinted"
          size="medium"
          onPress={onPlay ? () => onPlay(sura) : undefined}
        />
        <IconButton
          familyName="MaterialIcons"
          iconName="favorite"
          variant="ghost"
          size="medium"
          iconVariant="accent"
          onPress={onUnfavorite ? () => onUnfavorite(sura) : undefined}
        />
      </View>
    </Card>
  );
};

export default FavoriteSuraCard;
