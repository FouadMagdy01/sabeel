import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

import { Typography } from '@/common/components/Typography';
import { styles } from './CircularProgress.styles';
import type { CircularProgressProps, CircularProgressStatus } from './CircularProgress.types';

/**
 * Map status to theme colors
 */
const STATUS_COLORS: Record<
  CircularProgressStatus,
  (theme: ReturnType<typeof useUnistyles>['theme']) => string
> = {
  normal: (theme) => theme.colors.brand.primary,
  success: (theme) => theme.colors.state.success,
  error: (theme) => theme.colors.state.error,
  warning: (theme) => theme.colors.state.warning,
};

/**
 * Circular progress indicator using SVG.
 * Displays progress as an arc around a circle with customizable size, stroke, and colors.
 * Supports indeterminate spinning animation, status-based colors, and custom center content.
 *
 * @example
 * // Standard progress
 * <CircularProgress progress={0.75} size={48} strokeWidth={4} />
 *
 * // With percentage label
 * <CircularProgress progress={0.75} showLabel />
 *
 * // Indeterminate spinning
 * <CircularProgress progress={0} indeterminate />
 *
 * // Status-based color
 * <CircularProgress progress={0.85} status="success" showLabel />
 *
 * // Custom center content
 * <CircularProgress progress={0.5}>
 *   <Typography type="caption" size="xs">50%</Typography>
 * </CircularProgress>
 */
const CircularProgress = ({
  progress,
  size = 24,
  strokeWidth = 3,
  color,
  trackColor,
  indeterminate = false,
  showLabel = false,
  status = 'normal',
  children,
}: CircularProgressProps) => {
  const { theme } = useUnistyles();
  const rotation = useSharedValue(0);

  // Setup spinning animation for indeterminate mode
  useEffect(() => {
    if (indeterminate) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      rotation.value = 0;
    }
  }, [indeterminate, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const strokeDashoffset = indeterminate
    ? circumference * 0.75 // Show 25% arc when spinning
    : circumference * (1 - clampedProgress);

  // Determine progress color: custom color > status color > default
  const progressColor = color ?? STATUS_COLORS[status](theme);
  const bgTrackColor = trackColor ?? theme.colors.border.default;

  // Calculate percentage text
  const percentageText = `${Math.round(clampedProgress * 100)}%`;

  const containerStyle = useMemo(
    () => ({
      width: size,
      height: size,
      position: 'relative' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    }),
    [size]
  );

  return (
    <View style={containerStyle}>
      <Animated.View style={indeterminate ? animatedStyle : undefined}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="transparent">
          {/* Track circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={bgTrackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress arc */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
      </Animated.View>

      {/* Center content */}
      {(children ?? showLabel) && (
        <View style={styles.labelContainer}>
          {children ?? (
            <Typography type="caption" size="xs" weight="medium" style={styles.label}>
              {percentageText}
            </Typography>
          )}
        </View>
      )}
    </View>
  );
};

export default CircularProgress;
