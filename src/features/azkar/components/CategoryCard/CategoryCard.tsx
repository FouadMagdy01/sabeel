import React from 'react';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';

import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';

import { styles } from './CategoryCard.styles';
import type { CategoryCardProps } from './CategoryCard.types';

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  return (
    <Card variant="elevated" onPress={onPress} padding="sm">
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.background.surface }]}>
          <Icon
            familyName={category.iconFamily}
            iconName={category.iconName}
            size={24}
            variant="primary"
          />
        </View>
        <Typography size="sm" weight="medium" align="center" numberOfLines={2}>
          {t(category.labelKey as never)}
        </Typography>
      </View>
    </Card>
  );
}
