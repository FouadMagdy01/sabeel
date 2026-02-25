import React from 'react';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';

import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';

import { styles } from './RecommendedCard.styles';
import type { RecommendedCardProps } from './RecommendedCard.types';

export function RecommendedCard({ category, onPress }: RecommendedCardProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  return (
    <Card variant="elevated" onPress={onPress}>
      <View style={styles.cardContent}>
        <View
          style={[styles.iconContainer, { backgroundColor: theme.colors.brand.primaryVariant }]}
        >
          <Icon
            familyName={category.iconFamily}
            iconName={category.iconName}
            size={28}
            variant="accent"
          />
        </View>
        <View style={styles.textContainer}>
          <Typography type="heading" size="lg" weight="bold">
            {t(category.labelKey as never)}
          </Typography>
          <Typography size="sm" color="secondary">
            {t(category.descriptionKey as never)}
          </Typography>
        </View>
        <Icon familyName="Feather" iconName="chevron-right" size={20} variant="muted" />
      </View>
    </Card>
  );
}
