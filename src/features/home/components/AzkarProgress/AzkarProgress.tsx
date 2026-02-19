import { Card } from '@/common/components/Card';
import { CircularProgress } from '@/common/components/CircularProgress';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { UniPressable } from '@/common/components/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import type { AzkarData } from '../../types';
import { styles } from './AzkarProgress.styles';

interface AzkarProgressProps {
  azkar: AzkarData[];
  onAzkarPress: (azkar: AzkarData) => void;
}

export function AzkarProgress({ azkar, onAzkarPress }: AzkarProgressProps) {
  const { t } = useTranslation();

  const completedCount = azkar.filter((a) => a.status === 'completed').length;
  const progress = completedCount / azkar.length;
  const percentage = Math.round(progress * 100);

  const isIOS = Platform.OS === 'ios';

  const renderAzkarChip = (item: AzkarData): React.JSX.Element => {
    const isCompleted = item.status === 'completed';

    return (
      <UniPressable
        key={item.type}
        style={({ pressed }) => [
          styles.chip,
          isCompleted ? styles.chipCompleted : styles.chipPending,
          isIOS && pressed ? styles.pressed : undefined,
        ]}
        onPress={() => onAzkarPress(item)}
      >
        <Icon
          familyName="MaterialIcons"
          iconName={isCompleted ? 'check-circle' : 'radio-button-unchecked'}
          size={16}
          variant={isCompleted ? 'success' : 'muted'}
        />
        <Typography size="xs" weight="semiBold" color={isCompleted ? 'primary' : 'secondary'}>
          {item.type}
        </Typography>
      </UniPressable>
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

      <View style={styles.chipsRow}>{azkar.map(renderAzkarChip)}</View>
    </Card>
  );
}
