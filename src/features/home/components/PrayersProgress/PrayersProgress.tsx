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
import type { PrayerData } from '../../types';
import { styles } from './PrayersProgress.styles';

interface PrayersProgressProps {
  prayers: PrayerData[];
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

export function PrayersProgress({ prayers, onPrayerPress }: PrayersProgressProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const completedCount = prayers.filter((p) => p.status === 'completed').length;
  const progress = completedCount / prayers.length;
  const percentage = Math.round(progress * 100);

  const renderPrayerCircle = (prayer: PrayerData): React.JSX.Element => (
    <Pressable
      key={prayer.name}
      style={styles.prayerCircle}
      onPress={() => onPrayerPress(prayer)}
      android_ripple={{ color: theme.colors.overlay.pressed, borderless: true, foreground: true }}
    >
      {prayer.status === 'completed' && (
        <View style={styles.circleCompleted}>
          <Icon familyName="MaterialIcons" iconName="check" size={20} variant="inverse" />
        </View>
      )}
      {prayer.status === 'current' && (
        <View style={styles.circleCurrent}>
          <PulsingDot />
        </View>
      )}
      {prayer.status === 'upcoming' && (
        <View style={styles.circleUpcoming}>
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
    </Card>
  );
}
