import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { styles } from './button.styles';
import { ButtonProps } from '@/common/components/Button/button.types';

// Animated shadow values for contained button press effect
const SHADOW_CONFIG = {
  default: {
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffsetY: 0,
    elevation: 0,
  },
  pressed: {
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffsetY: 4,
    elevation: 4,
  },
};

// Spinner sizes based on button size
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
 * // Contained primary (default)
 * <Button onPress={handlePress}>Submit</Button>
 *
 * // With icon
 * <Button icon={<Icon name="check" />} onPress={handlePress}>
 *   Submit
 * </Button>
 *
 * // Loading state
 * <Button loading onPress={handlePress}>Submitting</Button>
 *
 * // Outlined secondary
 * <Button variant="outlined" color="secondary" onPress={handlePress}>
 *   Cancel
 * </Button>
 *
 * // Elevated (neutral background with colored text)
 * <Button variant="elevated" onPress={handlePress}>Save</Button>
 *
 * // Text button
 * <Button variant="text" color="secondary" onPress={handlePress}>
 *   Learn More
 * </Button>
 *
 * // Disabled button
 * <Button disabled onPress={handlePress}>Disabled</Button>
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
  style,
  textStyle,
  onPressIn,
  onPressOut,
  ...pressableProps
}: ButtonProps) {
  const { theme } = useUnistyles();

  // Button is effectively disabled when loading
  const isDisabled = disabled || loading;

  // Animated values for contained button shadow
  const shadowOpacity = useRef(new Animated.Value(SHADOW_CONFIG.default.shadowOpacity)).current;
  const shadowRadius = useRef(new Animated.Value(SHADOW_CONFIG.default.shadowRadius)).current;
  const shadowOffsetY = useRef(new Animated.Value(SHADOW_CONFIG.default.shadowOffsetY)).current;

  // Configure variants for unistyles
  styles.useVariants({
    variant,
    color,
    size,
    disabled: isDisabled as true | false,
  });

  // Get ripple color for Android based on variant and color
  const androidRipple = useMemo(() => {
    if (Platform.OS !== 'android' || isDisabled) return undefined;

    let rippleColor: string;
    const brandColor =
      color === 'primary' ? theme.colors.brand.primary : theme.colors.brand.secondary;

    switch (variant) {
      case 'contained':
        // White/light ripple on colored background for better visibility
        rippleColor = 'rgba(255, 255, 255, 0.25)';
        break;
      case 'outlined':
      case 'text':
      case 'elevated':
        // Use brand color with transparency for ripple
        rippleColor = `${brandColor}25`;
        break;
      default:
        rippleColor = `${brandColor}25`;
    }

    return {
      color: rippleColor,
      borderless: false,
      foreground: true,
    };
  }, [variant, color, theme, isDisabled]);

  // Get spinner color based on variant
  const getSpinnerColor = useCallback(() => {
    if (variant === 'contained') {
      return theme.colors.text.inverse;
    }
    return color === 'primary' ? theme.colors.brand.primary : theme.colors.brand.secondary;
  }, [variant, color, theme]);

  // Animate shadow in
  const animateShadowIn = useCallback(() => {
    if (variant !== 'contained' || isDisabled) return;

    Animated.parallel([
      Animated.timing(shadowOpacity, {
        toValue: SHADOW_CONFIG.pressed.shadowOpacity,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(shadowRadius, {
        toValue: SHADOW_CONFIG.pressed.shadowRadius,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(shadowOffsetY, {
        toValue: SHADOW_CONFIG.pressed.shadowOffsetY,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  }, [variant, isDisabled, shadowOpacity, shadowRadius, shadowOffsetY]);

  // Animate shadow out
  const animateShadowOut = useCallback(() => {
    if (variant !== 'contained' || isDisabled) return;

    Animated.parallel([
      Animated.timing(shadowOpacity, {
        toValue: SHADOW_CONFIG.default.shadowOpacity,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(shadowRadius, {
        toValue: SHADOW_CONFIG.default.shadowRadius,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(shadowOffsetY, {
        toValue: SHADOW_CONFIG.default.shadowOffsetY,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  }, [variant, isDisabled, shadowOpacity, shadowRadius, shadowOffsetY]);

  // Reset shadow when variant changes
  useEffect(() => {
    if (variant !== 'contained') {
      shadowOpacity.setValue(SHADOW_CONFIG.default.shadowOpacity);
      shadowRadius.setValue(SHADOW_CONFIG.default.shadowRadius);
      shadowOffsetY.setValue(SHADOW_CONFIG.default.shadowOffsetY);
    }
  }, [variant, shadowOpacity, shadowRadius, shadowOffsetY]);

  // Handle press in with animation
  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      animateShadowIn();
      onPressIn?.(e);
    },
    [animateShadowIn, onPressIn]
  );

  // Handle press out with animation
  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      animateShadowOut();
      onPressOut?.(e);
    },
    [animateShadowOut, onPressOut]
  );

  // Get pressed background color based on variant and color
  const getPressedBgColor = useCallback(() => {
    const brandColor =
      color === 'primary' ? theme.colors.brand.primary : theme.colors.brand.secondary;
    return `${brandColor}15`;
  }, [color, theme]);

  // Style function for Pressable that handles pressed state (iOS only, Android uses ripple)
  const getContainerStyle = useCallback(
    ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
      styles.container,
      // Ensure overflow hidden for ripple to work on Android
      { overflow: 'hidden' },
      // iOS pressed states (Android uses ripple)
      Platform.OS === 'ios' &&
        pressed &&
        !isDisabled &&
        variant === 'outlined' && {
          backgroundColor: getPressedBgColor(),
        },
      Platform.OS === 'ios' &&
        pressed &&
        !isDisabled &&
        variant === 'text' && {
          backgroundColor: getPressedBgColor(),
        },
      Platform.OS === 'ios' &&
        pressed &&
        !isDisabled &&
        variant === 'elevated' && {
          backgroundColor: getPressedBgColor(),
        },
      style,
    ],
    [isDisabled, style, variant, getPressedBgColor]
  );

  // Animated styles for contained variant (iOS shadow animation)
  const animatedShadowStyle: Animated.WithAnimatedObject<ViewStyle> =
    variant === 'contained' && !isDisabled && Platform.OS === 'ios'
      ? {
          shadowColor: theme.colors.shadow.color,
          shadowOpacity,
          shadowRadius,
          shadowOffset: {
            width: 0,
            height: shadowOffsetY,
          },
        }
      : {};

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
      style={getContainerStyle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      android_ripple={androidRipple}
      {...pressableProps}
    >
      {renderContent()}
    </Pressable>
  );

  // Use Animated.View wrapper for contained variant to animate shadow on iOS
  if (variant === 'contained' && !isDisabled && Platform.OS === 'ios') {
    return <Animated.View style={animatedShadowStyle}>{renderPressable()}</Animated.View>;
  }

  // For Android, wrap in View to clip ripple to border radius
  if (Platform.OS === 'android') {
    return <View style={styles.androidWrapper}>{renderPressable()}</View>;
  }

  return renderPressable();
}
