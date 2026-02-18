import React from 'react';
import { ActivityIndicator, Platform, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { IconColorVariant } from '@/common/components/Icon';
import { Icon } from '@/common/components/Icon';
import type { ICON_FAMILIES } from '@/common/components/Icon/Icon.constants';
import { ICON_SIZES, styles } from './iconButton.styles';
import type { IconButtonColor, IconButtonProps } from './iconButton.types';

const ICON_COLORS: Record<
  IconButtonColor,
  (theme: ReturnType<typeof useUnistyles>['theme']) => string
> = {
  primary: (theme) => theme.colors.brand.primary,
  secondary: (theme) => theme.colors.brand.secondary,
  tertiary: (theme) => theme.colors.brand.tertiary,
  success: (theme) => theme.colors.brand.primary,
  error: (theme) => theme.colors.state.error,
  warning: (theme) => theme.colors.state.warning,
  info: (theme) => theme.colors.state.info,
};

/**
 * IconButton component - A pressable button containing only an icon.
 * Supports loading state with spinner.
 *
 * @example
 * ```tsx
 * // Ghost button (default)
 * <IconButton
 *   familyName="Feather"
 *   iconName="eye"
 *   onPress={handlePress}
 * />
 *
 * // Filled button
 * <IconButton
 *   familyName="Feather"
 *   iconName="check"
 *   variant="filled"
 *   iconVariant="inverse"
 *   onPress={handlePress}
 * />
 *
 * // Tinted error button
 * <IconButton
 *   familyName="MaterialIcons"
 *   iconName="delete"
 *   variant="tinted"
 *   color="error"
 *   onPress={handleDelete}
 * />
 *
 * // Loading state
 * <IconButton
 *   familyName="Feather"
 *   iconName="save"
 *   loading
 *   onPress={handleSave}
 * />
 * ```
 */
export function IconButton<T extends keyof typeof ICON_FAMILIES>({
  familyName,
  iconName,
  iconVariant,
  iconColor,
  size = 'medium',
  variant = 'ghost',
  color = 'primary',
  disabled = false,
  loading = false,
  style,
  ...pressableProps
}: IconButtonProps<T>) {
  const { theme } = useUnistyles();

  styles.useVariants({
    variant,
    size,
    color,
    disabled: disabled as true | false,
  });

  // Determine icon/spinner color based on button variant
  const getIconColor = (): { variant?: IconColorVariant; color?: string } => {
    if (iconColor) return { color: iconColor };
    if (iconVariant) return { variant: iconVariant };

    // When filled variant and disabled, use primary text for visibility on gray background
    if (variant === 'filled' && disabled) return { variant: 'primary' };
    if (variant === 'filled') return { variant: 'inverse' };

    // Ghost, tinted, and outlined variants all respect the color prop
    return { color: ICON_COLORS[color](theme) };
  };

  const iconSize = ICON_SIZES[size];
  const resolvedIconColor = getIconColor();

  // Determine spinner color - ensure it's always visible
  const spinnerColor = (() => {
    if (resolvedIconColor.color) return resolvedIconColor.color;
    if (resolvedIconColor.variant === 'inverse') return theme.colors.icon.inverse;
    if (resolvedIconColor.variant === 'primary') return theme.colors.icon.primary;
    if (resolvedIconColor.variant === 'secondary') return theme.colors.icon.secondary;
    if (resolvedIconColor.variant === 'tertiary') return theme.colors.icon.tertiary;
    if (resolvedIconColor.variant === 'muted') return theme.colors.icon.muted;
    if (resolvedIconColor.variant === 'accent') return theme.colors.icon.accent;
    return theme.colors.icon.primary;
  })();

  const iconProps = {
    familyName,
    iconName,
    size: iconSize,
    ...(resolvedIconColor.variant ? { variant: resolvedIconColor.variant } : {}),
    ...(resolvedIconColor.color ? { color: resolvedIconColor.color } : {}),
  } as const;

  // Render icon or loading spinner
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={spinnerColor} />;
    }
    // @ts-expect-error - Generic icon props are complex
    return <Icon {...iconProps} />;
  };

  const isDisabled = disabled || loading;

  const androidRipple =
    Platform.OS === 'android' && !isDisabled
      ? {
          color: variant === 'filled' ? theme.colors.overlay.ripple : theme.colors.overlay.hover,
          borderless: false,
          foreground: true,
        }
      : undefined;

  const getPressedStyle = (pressed: boolean) => {
    if (!pressed || isDisabled || Platform.OS === 'android') return {};
    return { opacity: 0.85 };
  };

  const renderPressable = () => (
    <Pressable
      style={({ pressed }) => [styles.container, getPressedStyle(pressed), style]}
      disabled={isDisabled}
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
