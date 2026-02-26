import { Card } from '@/common/components/Card';
import { CircularProgress } from '@/common/components/CircularProgress';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ViewStyle } from 'react-native';
import { Platform, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import type { RandomActData } from '../../types';
import { styles } from './RandomActsGrid.styles';

interface RandomActsGridProps {
  acts: RandomActData[];
  onActPress: (act: RandomActData) => void;
}

export function RandomActsGrid({ acts, onActPress }: RandomActsGridProps) {
  // useUnistyles only for CircularProgress color prop (non-style prop)
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const completedCount = acts.filter((a) => a.status === 'completed').length;
  const progress = completedCount / acts.length;
  const percentage = Math.round(progress * 100);

  const isIOS = Platform.OS === 'ios';

  const renderActCard = (act: RandomActData): React.JSX.Element => {
    const isCompleted = act.status === 'completed';
    const isLocked = act.status === 'locked';

    return (
      <Pressable
        key={act.id}
        style={({ pressed }) =>
          [
            styles.cardContainer,
            isCompleted ? styles.cardCompleted : styles.cardPending,
            isIOS && pressed ? styles.pressed : undefined,
          ] as ViewStyle[]
        }
        onPress={() => onActPress(act)}
        android_ripple={{
          color: theme.colors.overlay.pressed,
          borderless: false,
          foreground: true,
        }}
      >
        <View style={styles.actCard}>
          <View style={styles.cardContent}>
            <Icon
              familyName={act.iconFamily}
              iconName={act.iconName}
              size={22}
              variant={isCompleted ? 'success' : isLocked ? 'muted' : 'brandTertiary'}
            />
            <View style={styles.textContainer}>
              <Typography size="sm" weight="semiBold" color={isLocked ? 'muted' : 'primary'}>
                {act.title}
              </Typography>
            </View>
          </View>
          <View style={styles.statusIcon}>
            <Icon
              familyName="MaterialIcons"
              iconName={isCompleted ? 'check-circle' : isLocked ? 'lock' : 'radio-button-unchecked'}
              size={20}
              variant={isCompleted ? 'success' : 'muted'}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <Card variant="elevated" padding="lg" style={styles.cardLayout}>
      <View style={styles.header}>
        <Typography size="sm" weight="bold" color="brandSecondary" uppercase style={styles.title}>
          {t('screens.home.dailyTodos.randomActs')}
        </Typography>
        <View style={styles.progressRow}>
          <Typography size="xs" weight="bold" color="brandTertiary">
            {percentage}%
          </Typography>
          <CircularProgress progress={progress} color={theme.colors.brand.tertiary} />
        </View>
      </View>

      <View style={styles.verticalList}>{acts.map(renderActCard)}</View>
    </Card>
  );
}
