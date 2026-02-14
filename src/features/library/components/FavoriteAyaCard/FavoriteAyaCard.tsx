import { Card } from '@/common/components/Card';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { FavoriteAya } from '../../types';
import { styles } from './FavoriteAyaCard.styles';

interface FavoriteAyaCardProps {
  aya: FavoriteAya;
}

const FavoriteAyaCard: React.FC<FavoriteAyaCardProps> = ({ aya }) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" style={styles.cardLayout}>
      <View style={styles.headerRow}>
        <View style={styles.suraInfo}>
          <View style={styles.numberBadge}>
            <Typography size="xs" weight="bold" color="brandPrimary">
              {aya.suraNumber}
            </Typography>
          </View>
          <View>
            <Typography size="xs" weight="bold">
              {aya.suraName}
            </Typography>
            <Typography size="xs" weight="medium" color="muted" style={styles.verseLabel}>
              {t('screens.library.aya.verse', { number: aya.ayaNumber })}
            </Typography>
          </View>
        </View>
        <IconButton
          familyName="MaterialIcons"
          iconName="favorite"
          variant="ghost"
          size="medium"
          iconVariant="accent"
        />
      </View>
      <Typography size="lg" align="right" style={styles.arabicText}>
        {aya.arabicText}
      </Typography>
      <Typography size="xs" color="tertiary" style={styles.translationText}>
        {aya.translation}
      </Typography>
    </Card>
  );
};

export default FavoriteAyaCard;
