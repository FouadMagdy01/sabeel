import { Card } from '@/common/components/Card';
import { CircularProgress } from '@/common/components/CircularProgress';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React, { useMemo } from 'react';
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
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const completedCount = acts.filter((a) => a.status === 'completed').length;
  const progress = completedCount / acts.length;
  const percentage = Math.round(progress * 100);

  // Order acts: completed first, then unlocked, then locked
  const completedActs = acts.filter((a) => a.status === 'completed');
  const unlockedActs = acts.filter((a) => a.status === 'unlocked');
  const lockedActs = acts.filter((a) => a.status === 'locked');
  const orderedActs = [...completedActs, ...unlockedActs, ...lockedActs];

  const isIOS = Platform.OS === 'ios';

  const androidRipple = useMemo(
    () =>
      Platform.OS === 'android'
        ? { color: theme.colors.overlay.pressed, foreground: true, borderless: false }
        : undefined,
    [theme.colors.overlay.pressed]
  );

  const renderActCard = (act: RandomActData): React.JSX.Element => {
    const isCompleted = act.status === 'completed';
    const isLocked = act.status === 'locked';

    const cardBg = isCompleted
      ? { backgroundColor: theme.colors.state.successBg }
      : { backgroundColor: theme.colors.background.surfaceAlt };

    return (
      <Pressable
        key={act.id}
        style={({ pressed }) =>
          [
            styles.cardContainer,
            cardBg,
            isIOS && pressed ? styles.pressed : undefined,
          ] as ViewStyle[]
        }
        onPress={() => onActPress(act)}
        android_ripple={androidRipple}
      >
        <View style={styles.actCard}>
          <View style={styles.cardContent}>
            <Icon
              familyName={act.iconFamily}
              iconName={act.iconName}
              size={22}
              color={
                isCompleted
                  ? theme.colors.state.success
                  : isLocked
                    ? theme.colors.icon.muted
                    : theme.colors.brand.tertiary
              }
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
              color={
                isCompleted
                  ? theme.colors.state.success
                  : isLocked
                    ? theme.colors.icon.muted
                    : theme.colors.icon.muted
              }
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

      <View style={styles.verticalList}>{orderedActs.map(renderActCard)}</View>
    </Card>
  );
}
