import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';

import { RADIUS_MAP, styles } from './Card.styles';
import type { CardProps } from './Card.types';

/**
 * Versatile card container with multiple visual variants and gradient support.
 * Provides elevation, outline, filled, and gradient styles with customizable padding and radius.
 *
 * @example
 * <Card variant="elevated" radius="lg" padding="md">
 *   <Typography>Card content</Typography>
 * </Card>
 */
export function Card({
  variant = 'elevated',
  radius = 'md',
  padding = 'md',
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  style,
  children,
}: CardProps) {
  styles.useVariants({ variant, radius, padding });

  if (variant === 'gradient' && gradientColors) {
    return (
      <LinearGradient
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={[styles.container, { borderRadius: RADIUS_MAP[radius] }, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return <View style={[styles.container, style]}>{children}</View>;
}
