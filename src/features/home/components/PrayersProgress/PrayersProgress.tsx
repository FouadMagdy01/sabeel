import { Card } from '@/common/components/Card';
import { CircularProgress } from '@/common/components/CircularProgress';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';
import type { PrayerData, PrayerName } from '../../types';
import { styles } from './PrayersProgress.styles';

interface PrayersProgressProps {
  prayers: PrayerData[];
  completedPrayers: PrayerName[];
  onPrayerPress: (prayer: PrayerData) => void;
}

function PulsingDot() {
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(0.3, { duration: 1000 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.currentDot, animatedStyle]} />;
}

export function PrayersProgress({
  prayers,
  completedPrayers,
  onPrayerPress,
}: PrayersProgressProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const completedCount = completedPrayers.length;
  const progress = completedCount / prayers.length;
  const percentage = Math.round(progress * 100);
  const allCompleted = completedCount === prayers.length;

  const renderPrayerCircle = (prayer: PrayerData): React.JSX.Element => {
    const isManuallyCompleted = completedPrayers.includes(prayer.name);
    const isUpcoming = prayer.status === 'upcoming';
    const isDisabled = isUpcoming && !isManuallyCompleted;

    return (
      <Pressable
        key={prayer.name}
        style={styles.prayerCircle}
        onPress={() => onPrayerPress(prayer)}
        disabled={isDisabled}
        android_ripple={
          isDisabled
            ? undefined
            : { color: theme.colors.overlay.pressed, borderless: true, foreground: true }
        }
      >
        {isManuallyCompleted && (
          <View style={styles.circleCompleted}>
            <Icon familyName="MaterialIcons" iconName="check" size={20} variant="inverse" />
          </View>
        )}
        {!isManuallyCompleted && prayer.status === 'current' && (
          <View style={styles.circleCurrent}>
            <PulsingDot />
          </View>
        )}
        {!isManuallyCompleted &&
          (prayer.status === 'upcoming' || prayer.status === 'completed') && (
            <View style={[styles.circleUpcoming, isUpcoming ? styles.disabledCircle : undefined]}>
              <Icon
                familyName="MaterialCommunityIcons"
                iconName="circle-outline"
                size={18}
                variant="muted"
              />
            </View>
          )}
      </Pressable>
    );
  };

  return (
    <Card variant="elevated" padding="lg" style={styles.cardLayout}>
      <View style={styles.header}>
        <Typography size="sm" weight="bold" color="brandSecondary" uppercase style={styles.title}>
          {t('screens.home.dailyTodos.prayers')}
        </Typography>
        <View style={styles.progressRow}>
          <Typography size="xs" weight="bold" color="brandPrimary">
            {percentage}%
          </Typography>
          <CircularProgress progress={progress} />
        </View>
      </View>

      <View style={styles.prayerRow}>{prayers.map(renderPrayerCircle)}</View>

      {allCompleted && (
        <Typography
          size="xs"
          color="success"
          align="center"
          weight="semiBold"
          style={styles.allCompletedText}
        >
          {t('screens.home.dailyTodos.allPrayersCompleted')}
        </Typography>
      )}
    </Card>
  );
}
