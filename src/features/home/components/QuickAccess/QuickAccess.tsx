import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { UniPressable } from '@/common/components/themed';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import { styles } from './QuickAccess.styles';
import type { QuickAccessItem, QuickAccessProps } from './QuickAccess.types';

export function QuickAccess({ items, onItemPress }: QuickAccessProps) {
  const { t } = useTranslation();

  const getPressedStyle = useCallback((pressed: boolean) => {
    if (!pressed || Platform.OS === 'android') return {};
    return { opacity: 0.7 };
  }, []);

  const renderItem = (item: QuickAccessItem) => (
    <Card key={item.id} variant="elevated" padding="none" style={styles.itemCard}>
      <UniPressable
        onPress={() => onItemPress(item)}
        style={({ pressed }) => [styles.itemPressable, getPressedStyle(pressed)]}
      >
        <Icon familyName={item.iconFamily} iconName={item.iconName} variant="primary" size={24} />
        <Typography size="xxs" weight="bold" color="secondary" style={styles.itemLabel}>
          {t(item.labelKey)}
        </Typography>
      </UniPressable>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Typography size="xxs" weight="bold" color="tertiary" uppercase style={styles.header}>
        {t('screens.home.quickAccess.sectionTitle')}
      </Typography>
      <View style={styles.grid}>{items.map(renderItem)}</View>
    </View>
  );
}
