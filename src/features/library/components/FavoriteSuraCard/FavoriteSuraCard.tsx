import { Card } from '@/common/components/Card';
import { Divider } from '@/common/components/Divider';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { FavoriteSura } from '../../types';
import { styles } from './FavoriteSuraCard.styles';

interface FavoriteSuraCardProps {
  sura: FavoriteSura;
}

const FavoriteSuraCard: React.FC<FavoriteSuraCardProps> = ({ sura }) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" style={styles.cardLayout}>
      <View style={styles.numberBadge}>
        <Typography size="md" weight="bold" color="brandPrimary">
          {sura.id}
        </Typography>
      </View>
      <View style={styles.content}>
        <Typography size="sm" weight="bold">
          {sura.name}
        </Typography>
        <View style={styles.metaRow}>
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {sura.translation}
          </Typography>
          <Divider variant="dot" />
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {t('screens.library.sura.verses', { count: sura.versesCount })}
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
    </Card>
  );
};

export default FavoriteSuraCard;
