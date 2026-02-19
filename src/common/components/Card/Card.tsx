import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';

import { UniActivityIndicator, UniPressable } from '@/common/components/themed';
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
 *
 * <Card variant="outlined" onPress={handlePress}>
 *   <Typography>Pressable card</Typography>
 * </Card>
 *
 * <Card variant="filled" loading>
 *   <Typography>Loading card</Typography>
 * </Card>
 */
export function Card({
  variant = 'elevated',
  radius = 'md',
  padding = 'md',
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  onPress,
  loading = false,
  style,
  children,
}: CardProps) {
  styles.useVariants({ variant, radius, padding });

  const isDisabled = loading;

  const getPressedStyle = useCallback(
    (pressed: boolean): StyleProp<ViewStyle> => {
      if (!pressed || isDisabled || Platform.OS === 'android') return undefined;
      return { opacity: 0.85 };
    },
    [isDisabled]
  );

  const renderLoadingOverlay = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingOverlay}>
        <UniActivityIndicator size="large" />
      </View>
    );
  };

  const renderContent = () => (
    <>
      {children}
      {renderLoadingOverlay()}
    </>
  );

  // Gradient variant with optional press interaction
  if (variant === 'gradient' && gradientColors) {
    const gradientStyle = [styles.container, { borderRadius: RADIUS_MAP[radius] }, style];

    if (onPress) {
      return (
        <UniPressable
          onPress={onPress}
          disabled={isDisabled}
          style={({ pressed }) => [styles.container, getPressedStyle(pressed)]}
        >
          <LinearGradient
            colors={gradientColors}
            start={gradientStart}
            end={gradientEnd}
            style={gradientStyle}
          >
            {renderContent()}
          </LinearGradient>
        </UniPressable>
      );
    }

    return (
      <LinearGradient
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={gradientStyle}
      >
        {renderContent()}
      </LinearGradient>
    );
  }

  // Regular variants with optional press interaction
  if (onPress) {
    return (
      <UniPressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [styles.container, getPressedStyle(pressed), style]}
      >
        {renderContent()}
      </UniPressable>
    );
  }

  return <View style={[styles.container, style]}>{renderContent()}</View>;
}
