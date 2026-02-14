import { Card } from '@/common/components/Card';
import { CircularProgress } from '@/common/components/CircularProgress';
import Icon from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
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

  return (
    <Card variant="elevated" padding="lg" style={styles.cardLayout}>
      <View style={styles.header}>
        <Typography size="sm" weight="bold" color="brandSecondary" uppercase style={styles.title}>
          {t('screens.home.dailyTodos.azkar')}
        </Typography>
        <View style={styles.progressRow}>
          <Typography size="xs" weight="bold" style={styles.progressText}>
            {percentage}%
          </Typography>
          <CircularProgress progress={progress} color={theme.colors.state.info} />
        </View>
      </View>

      <View style={styles.chipsRow}>
        {azkar.map((item) => {
          const isCompleted = item.status === 'completed';
          return (
            <Pressable
              key={item.type}
              style={isCompleted ? styles.chipCompleted : styles.chipUncompleted}
              onPress={() => onAzkarPress(item)}
              android_ripple={{ color: theme.colors.overlay.pressed, foreground: true }}
            >
              <Icon
                familyName="MaterialIcons"
                iconName={isCompleted ? 'check-circle' : 'radio-button-unchecked'}
                size={14}
                color={isCompleted ? theme.colors.state.success : theme.colors.icon.muted}
              />
              <Typography
                size="xxs"
                weight="bold"
                color={isCompleted ? 'brandSecondary' : 'secondary'}
                uppercase
                style={styles.chipText}
              >
                {item.type}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}
