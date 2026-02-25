import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

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
  const { theme } = useUnistyles();
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
        <ActivityIndicator size="large" color={theme.colors.brand.primary} />
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
        <Pressable
          onPress={onPress}
          disabled={isDisabled}
          android_ripple={
            isDisabled
              ? undefined
              : { color: theme.colors.overlay.pressed, borderless: false, foreground: true }
          }
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
        </Pressable>
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
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        android_ripple={
          isDisabled
            ? undefined
            : { color: theme.colors.overlay.pressed, borderless: false, foreground: true }
        }
        style={({ pressed }) => [styles.container, getPressedStyle(pressed), style]}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return <View style={[styles.container, style]}>{renderContent()}</View>;
}
