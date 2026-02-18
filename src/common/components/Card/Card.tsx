import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useMemo } from 'react';
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

  // Inline color styles to avoid flicker during theme switching
  const variantColors =
    variant === 'gradient'
      ? {}
      : variant === 'elevated'
        ? {
            backgroundColor: theme.colors.background.surface,
            borderColor: theme.colors.border.default,
            shadowColor: theme.colors.shadow.color,
          }
        : variant === 'outlined'
          ? {
              backgroundColor: theme.colors.background.surface,
              borderColor: theme.colors.border.default,
            }
          : { backgroundColor: theme.colors.background.surface };

  const getPressedStyle = useCallback(
    (pressed: boolean): StyleProp<ViewStyle> => {
      if (!pressed || isDisabled || Platform.OS === 'android') return undefined;
      return { opacity: 0.85 };
    },
    [isDisabled]
  );

  const androidRipple = useMemo(() => {
    if (Platform.OS !== 'android' || isDisabled) return undefined;
    return {
      color: theme.colors.overlay.pressed,
      borderless: false,
      foreground: true,
    };
  }, [theme.colors.overlay.pressed, isDisabled]);

  const loadingOverlayColor = { backgroundColor: theme.colors.background.disabled };

  const renderLoadingOverlay = () => {
    if (!loading) return null;
    return (
      <View style={[styles.loadingOverlay, loadingOverlayColor]}>
        <ActivityIndicator size="large" />
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
          style={({ pressed }) => [styles.container, getPressedStyle(pressed)]}
          android_ripple={androidRipple}
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
        style={({ pressed }) => [styles.container, variantColors, getPressedStyle(pressed), style]}
        android_ripple={androidRipple}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return <View style={[styles.container, variantColors, style]}>{renderContent()}</View>;
}
