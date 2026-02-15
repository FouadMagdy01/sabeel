import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './button.styles';
import type { ButtonProps } from './button.types';

const SPINNER_SIZE = {
  small: 12,
  medium: 14,
  large: 18,
} as const;

/**
 * Button component with multiple variants and color schemes
 *
 * @example
 * ```tsx
 * <Button onPress={handlePress}>Submit</Button>
 *
 * <Button icon={<Icon name="check" />} onPress={handlePress}>
 *   Submit
 * </Button>
 *
 * <Button variant="outlined" color="secondary" onPress={handlePress}>
 *   Cancel
 * </Button>
 *
 * <Button variant="text" onPress={handlePress}>Learn More</Button>
 * ```
 */
export function Button({
  children,
  icon,
  iconPosition = 'left',
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  ...pressableProps
}: ButtonProps) {
  const { theme } = useUnistyles();

  const isDisabled = disabled || loading;

  styles.useVariants({
    variant,
    color,
    size,
    disabled: isDisabled as true | false,
    fullWidth: fullWidth as true | false,
  });

  const androidRipple = useMemo(() => {
    if (Platform.OS !== 'android' || isDisabled) return undefined;

    const rippleColor =
      variant === 'contained' ? theme.colors.overlay.ripple : theme.colors.overlay.hover;

    return {
      color: rippleColor,
      borderless: false,
      foreground: true,
    };
  }, [variant, theme, isDisabled]);

  const spinnerColor = useMemo(() => {
    // For contained variant, use appropriate text color based on state
    if (variant === 'contained') {
      // When disabled (including loading + disabled), button becomes gray background
      // Use primary text color for visibility on gray disabled background
      if (disabled) return theme.colors.text.primary;
      // When only loading (not disabled), button keeps its color - use inverse
      return theme.colors.text.inverse;
    }

    // For other variants, use the button's color scheme
    if (color === 'primary') return theme.colors.brand.primary;
    if (color === 'secondary') return theme.colors.brand.secondary;
    if (color === 'success') return theme.colors.state.success;
    if (color === 'error') return theme.colors.state.error;
    if (color === 'warning') return theme.colors.state.warning;
    if (color === 'info') return theme.colors.state.info;
    return theme.colors.brand.primary;
  }, [variant, color, theme, disabled]);

  const getPressedStyle = useCallback(
    (pressed: boolean): StyleProp<ViewStyle> => {
      if (!pressed || isDisabled || Platform.OS === 'android') return {};
      if (variant === 'contained') return { opacity: 0.85 };
      if (variant === 'transparent') return { opacity: 0.7 };

      return { backgroundColor: theme.colors.overlay.pressed };
    },
    [variant, theme, isDisabled]
  );

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator size={SPINNER_SIZE[size]} color={spinnerColor} />
      ) : (
        icon && iconPosition === 'left' && icon
      )}
      <Text style={[styles.text, textStyle]}>{children}</Text>
      {!loading && icon && iconPosition === 'right' && icon}
    </>
  );

  const renderPressable = () => (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.container,
        { overflow: 'hidden' as const },
        getPressedStyle(pressed),
        style,
      ]}
      android_ripple={androidRipple}
      {...pressableProps}
    >
      {renderContent()}
    </Pressable>
  );

  if (Platform.OS === 'android') {
    return <View style={styles.androidWrapper}>{renderPressable()}</View>;
  }

  return renderPressable();
}
