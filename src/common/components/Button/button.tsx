import React, { useCallback } from 'react';
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

  const getPressedStyle = useCallback(
    (pressed: boolean): StyleProp<ViewStyle> => {
      if (!pressed || isDisabled || Platform.OS === 'android') return {};
      if (variant === 'contained') return { opacity: 0.85 };
      if (variant === 'transparent') return { opacity: 0.7 };

      return styles.pressedOverlay;
    },
    [variant, isDisabled]
  );

  const getSpinnerColor = () => {
    if (variant === 'contained') {
      return disabled ? theme.colors.text.primary : theme.colors.text.inverse;
    }
    const colorMap = {
      primary: theme.colors.brand.primary,
      secondary: theme.colors.brand.secondary,
      success: theme.colors.state.success,
      error: theme.colors.state.error,
      warning: theme.colors.state.warning,
      info: theme.colors.state.info,
    } as const;
    return colorMap[color];
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator size={SPINNER_SIZE[size]} color={getSpinnerColor()} />
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
      android_ripple={
        isDisabled
          ? undefined
          : {
              color:
                variant === 'contained' ? theme.colors.overlay.ripple : theme.colors.overlay.hover,
              borderless: false,
              foreground: true,
            }
      }
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
