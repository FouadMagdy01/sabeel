import { Card } from '@/common/components/Card';
import { CircularProgress } from '@/common/components/CircularProgress';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import type { AzkarData } from '../../types';
import { styles } from './AzkarProgress.styles';

interface AzkarProgressProps {
  azkar: AzkarData[];
  onAzkarPress: (azkar: AzkarData) => void;
}

export function AzkarProgress({ azkar, onAzkarPress }: AzkarProgressProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const completedCount = azkar.filter((a) => a.status === 'completed').length;
  const progress = completedCount / azkar.length;
  const percentage = Math.round(progress * 100);

  const isIOS = Platform.OS === 'ios';

  const renderAzkarItem = (item: AzkarData): React.JSX.Element => {
    const isCompleted = item.status === 'completed';

    return (
      <Pressable
        key={item.type}
        style={({ pressed }) => [
          styles.itemContainer,
          isCompleted ? styles.itemCompleted : styles.itemPending,
          isIOS && pressed ? styles.pressed : undefined,
        ]}
        onPress={() => onAzkarPress(item)}
        android_ripple={{
          color: theme.colors.overlay.pressed,
          foreground: true,
          borderless: false,
        }}
      >
        <View style={styles.itemContent}>
          <Icon
            familyName="MaterialIcons"
            iconName={item.type === 'Morning' ? 'wb-sunny' : 'nights-stay'}
            size={22}
            variant={isCompleted ? 'success' : 'brandTertiary'}
          />
          <View style={styles.textContainer}>
            <Typography size="sm" weight="semiBold" color={isCompleted ? 'primary' : 'secondary'}>
              {t(
                `screens.home.dailyTodos.${item.type === 'Morning' ? 'morning' : 'evening'}` as never
              )}
            </Typography>
          </View>
        </View>
        <Icon
          familyName="MaterialIcons"
          iconName={isCompleted ? 'check-circle' : 'radio-button-unchecked'}
          size={20}
          variant={isCompleted ? 'success' : 'muted'}
        />
      </Pressable>
    );
  };

  return (
    <Card variant="elevated" padding="lg" style={styles.cardLayout}>
      <View style={styles.header}>
        <Typography size="sm" weight="bold" color="brandSecondary" uppercase style={styles.title}>
          {t('screens.home.dailyTodos.azkar')}
        </Typography>
        <View style={styles.progressRow}>
          <Typography size="xs" weight="bold" color="brandPrimary">
            {percentage}%
          </Typography>
          <CircularProgress progress={progress} />
        </View>
      </View>

      <View style={styles.verticalList}>{azkar.map(renderAzkarItem)}</View>
    </Card>
  );
}
