import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { styles } from './QuickAccess.styles';
import type { QuickAccessItem, QuickAccessProps } from './QuickAccess.types';

export function QuickAccess({ items, onItemPress }: QuickAccessProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const getPressedStyle = useCallback((pressed: boolean) => {
    if (!pressed || Platform.OS === 'android') return {};
    return { opacity: 0.7 };
  }, []);

  const renderItem = (item: QuickAccessItem) => (
    <Card key={item.id} variant="elevated" padding="none" style={styles.itemCard}>
      <Pressable
        onPress={() => onItemPress(item)}
        style={({ pressed }) => [styles.itemPressable, getPressedStyle(pressed)]}
        android_ripple={{
          color: theme.colors.overlay.pressed,
          borderless: false,
          foreground: true,
        }}
      >
        <Icon familyName={item.iconFamily} iconName={item.iconName} variant="primary" size={24} />
        <Typography size="xxs" weight="bold" color="secondary" style={styles.itemLabel}>
          {t(item.labelKey)}
        </Typography>
      </Pressable>
    </Card>
  );

  const topRow = items.slice(0, 3);
  const bottomRow = items.slice(3);

  return (
    <View style={styles.container}>
      <Typography size="xxs" weight="bold" color="tertiary" uppercase style={styles.header}>
        {t('screens.home.quickAccess.sectionTitle')}
      </Typography>
      <View style={styles.gridContainer}>
        <View style={styles.grid}>{topRow.map(renderItem)}</View>
        {bottomRow.length > 0 && (
          <View style={styles.gridBottomRow}>
            {bottomRow.map((item) => (
              <View key={item.id} style={styles.gridBottomRowItem}>
                {renderItem(item)}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
