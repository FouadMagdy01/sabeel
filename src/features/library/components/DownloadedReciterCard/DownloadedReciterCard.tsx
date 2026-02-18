import { Card } from '@/common/components/Card';
import { Divider } from '@/common/components/Divider';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { DownloadedReciter } from '../../types';
import { styles } from './DownloadedReciterCard.styles';

interface DownloadedReciterCardProps {
  reciter: DownloadedReciter;
}

const DownloadedReciterCard: React.FC<DownloadedReciterCardProps> = ({ reciter }) => {
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
          <Divider variant="dot" />
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {reciter.totalSize}
          </Typography>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <IconButton
          familyName="MaterialIcons"
          iconName="play-arrow"
          variant="tinted"
          size="medium"
          onPress={() => console.warn('Play reciter:', reciter.name)}
        />
        <IconButton
          familyName="MaterialIcons"
          iconName="delete-outline"
          variant="ghost"
          size="medium"
          color="error"
          onPress={() => console.warn('Delete reciter:', reciter.name)}
        />
      </View>
    </Card>
  );
};

export default DownloadedReciterCard;
