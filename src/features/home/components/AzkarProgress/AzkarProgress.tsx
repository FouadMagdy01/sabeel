import { Card } from '@/common/components/Card';
import { CircularProgress } from '@/common/components/CircularProgress';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React, { useMemo } from 'react';
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

  const androidRipple = useMemo(
    () =>
      Platform.OS === 'android'
        ? { color: theme.colors.overlay.pressed, foreground: true, borderless: false }
        : undefined,
    [theme.colors.overlay.pressed]
  );

  const renderAzkarChip = (item: AzkarData): React.JSX.Element => {
    const isCompleted = item.status === 'completed';

    const chipBg = isCompleted
      ? { backgroundColor: theme.colors.state.successBg }
      : { backgroundColor: theme.colors.background.surfaceAlt };

    return (
      <Pressable
        key={item.type}
        style={({ pressed }) => [
          styles.chip,
          chipBg,
          isIOS && pressed ? styles.pressed : undefined,
        ]}
        onPress={() => onAzkarPress(item)}
        android_ripple={androidRipple}
      >
        <Icon
          familyName="MaterialIcons"
          iconName={isCompleted ? 'check-circle' : 'radio-button-unchecked'}
          size={16}
          color={isCompleted ? theme.colors.state.success : theme.colors.icon.muted}
        />
        <Typography size="xs" weight="semiBold" color={isCompleted ? 'primary' : 'secondary'}>
          {item.type}
        </Typography>
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
          <CircularProgress progress={progress} color={theme.colors.brand.primary} />
        </View>
      </View>

      <View style={styles.chipsRow}>{azkar.map(renderAzkarChip)}</View>
    </Card>
  );
}
