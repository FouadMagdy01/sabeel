import { Card } from '@/common/components/Card';
import { CircularProgress } from '@/common/components/CircularProgress';
import Icon from '@/common/components/Icon';
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
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const completedCount = acts.filter((a) => a.status === 'completed').length;
  const progress = completedCount / acts.length;
  const percentage = Math.round(progress * 100);

  // Order acts: completed first, then unlocked, then locked (research decision #6)
  const completedActs = acts.filter((a) => a.status === 'completed');
  const unlockedActs = acts.filter((a) => a.status === 'unlocked');
  const lockedActs = acts.filter((a) => a.status === 'locked');
  const orderedActs = [...completedActs, ...unlockedActs, ...lockedActs];

  const isIOS = Platform.OS === 'ios';

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

      <View style={styles.verticalList}>
        {orderedActs.map((act) => {
          const isCompleted = act.status === 'completed';
          const isLocked = act.status === 'locked';

          return (
            <Pressable
              key={act.id}
              style={({ pressed }) =>
                [styles.cardContainer, isIOS && pressed ? styles.pressed : undefined] as ViewStyle[]
              }
              onPress={() => onActPress(act)}
              android_ripple={{ color: theme.colors.overlay.pressed, foreground: true }}
            >
              <View
                style={[
                  styles.actCard,
                  isCompleted && styles.cardCompleted,
                  !isCompleted && !isLocked && styles.cardUnlocked,
                  isLocked && styles.cardLocked,
                ]}
              >
                {/* Status badge */}
                <View style={styles.statusBadge}>
                  <Icon
                    familyName="MaterialIcons"
                    iconName={isCompleted ? 'check-circle' : isLocked ? 'lock' : 'add'}
                    size={14}
                    color={
                      isCompleted
                        ? theme.colors.state.success
                        : isLocked
                          ? theme.colors.icon.muted
                          : theme.colors.brand.tertiary
                    }
                  />
                </View>

                {/* Card content */}
                <View style={styles.cardContent}>
                  <Icon
                    familyName={act.iconFamily}
                    iconName={act.iconName}
                    size={24}
                    color={
                      isCompleted
                        ? theme.colors.state.success
                        : isLocked
                          ? theme.colors.icon.muted
                          : theme.colors.brand.tertiary
                    }
                  />
                  <View style={styles.textContainer}>
                    <Typography size="xxs" weight="bold" color="brandSecondary" uppercase>
                      {act.title}
                    </Typography>
                    <Typography
                      size="xxs"
                      weight="bold"
                      color={isCompleted ? 'brandPrimary' : 'tertiary'}
                      uppercase
                      style={styles.statusText}
                    >
                      {isCompleted
                        ? t('screens.home.dailyTodos.completed')
                        : t('screens.home.dailyTodos.tapToComplete')}
                    </Typography>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}
