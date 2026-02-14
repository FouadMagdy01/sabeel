import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';
import type { CircularProgressProps } from './CircularProgress.types';
import { styles } from './CircularProgress.styles';

/**
 * Circular progress indicator using SVG.
 * Displays progress as an arc around a circle with customizable size, stroke, and colors.
 *
 * @example
 * <CircularProgress progress={0.75} size={48} strokeWidth={4} />
 */
const CircularProgress = ({
  progress,
  size = 24,
  strokeWidth = 3,
  color,
  trackColor,
}: CircularProgressProps) => {
  const { theme } = useUnistyles();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const strokeDashoffset = circumference * (1 - clampedProgress);

  const progressColor = color ?? theme.colors.brand.primary;
  const bgTrackColor = trackColor ?? theme.colors.border.default;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const containerStyle = styles.container(size);
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <View style={containerStyle}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgTrackColor}
          strokeWidth={strokeWidth}
          style={styles.trackCircle}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
          style={styles.progressCircle}
        />
      </Svg>
    </View>
  );
};

export default CircularProgress;
