import { Card } from '@/common/components/Card';
import { Divider } from '@/common/components/Divider';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { FavoriteReciter } from '../../types';
import { styles } from './FavoriteReciterCard.styles';

interface FavoriteReciterCardProps {
  reciter: FavoriteReciter;
}

const FavoriteReciterCard: React.FC<FavoriteReciterCardProps> = ({ reciter }) => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  // Inline color styles to avoid flicker during theme switching
  const avatarColors = {
    backgroundColor: `${theme.colors.brand.primary}15`,
    borderColor: `${theme.colors.brand.primary}30`,
  };

  return (
    <Card variant="outlined" style={styles.cardLayout}>
      <View style={[styles.avatar, avatarColors]}>
        <Icon
          familyName="MaterialIcons"
          iconName="person"
          size={24}
          color={theme.colors.brand.primary}
        />
      </View>
      <View style={styles.content}>
        <Typography size="sm" weight="bold">
          {reciter.name}
        </Typography>
        <View style={styles.metaRow}>
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {reciter.nationality}
          </Typography>
          <Divider variant="dot" />
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {t('screens.library.reciter.suras', {
              count: reciter.surasCount,
            })}
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

export default FavoriteReciterCard;
