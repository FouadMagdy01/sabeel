import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './RecommendedReciterCard.styles';
import type { RecommendedReciterCardProps } from './RecommendedReciterCard.types';

const RecommendedReciterCard: React.FC<RecommendedReciterCardProps> = ({ reciter }) => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  // Inline color styles to avoid flicker during theme switching
  const imageBgColor = { backgroundColor: `${theme.colors.brand.primary}15` };

  return (
    <Card variant="outlined" padding="sm" style={styles.cardLayout}>
      <View style={[styles.imageContainer, imageBgColor]}>
        <Icon
          familyName="MaterialIcons"
          iconName="person"
          size={28}
          color={theme.colors.brand.primary}
        />
      </View>
      <View style={styles.content}>
        <Typography size="sm" weight="bold">
          {reciter.name}
        </Typography>
        <Typography
          size="xs"
          weight="bold"
          color="brandTertiary"
          uppercase
          style={styles.surasText}
        >
          {t('screens.library.explore.surasAvailable', {
            count: reciter.surasAvailable,
          })}
        </Typography>
      </View>
      <View style={styles.actionsRow}>
        <IconButton
          familyName="MaterialIcons"
          iconName={reciter.isStarred ? 'favorite' : 'favorite-border'}
          variant="ghost"
          size="medium"
          iconVariant={reciter.isStarred ? 'accent' : 'muted'}
          onPress={() => console.warn('Toggle favorite:', reciter.name)}
        />
        <IconButton
          familyName="MaterialIcons"
          iconName="play-arrow"
          variant="tinted"
          size="medium"
          onPress={() => console.warn('Play reciter:', reciter.name)}
        />
      </View>
    </Card>
  );
};

export default RecommendedReciterCard;
