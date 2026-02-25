import React from 'react';
import { ActivityIndicator, Platform, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { IconColorVariant } from '@/common/components/Icon';
import { Icon } from '@/common/components/Icon';
import type { ICON_FAMILIES } from '@/common/components/Icon/Icon.constants';
import { ICON_SIZES, styles } from './iconButton.styles';
import type { IconButtonColor, IconButtonProps } from './iconButton.types';

/**
 * Map IconButtonColor to IconColorVariant for direct use without theme access
 */
const BUTTON_COLOR_TO_ICON_VARIANT: Record<IconButtonColor, IconColorVariant> = {
  primary: 'brandPrimary',
  secondary: 'brandSecondary',
  tertiary: 'brandTertiary',
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
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

  // Determine icon color variant
  const getIconProps = (): { variant?: IconColorVariant; color?: string } => {
    if (iconColor) return { color: iconColor };
    if (iconVariant) return { variant: iconVariant };
    if (variant === 'filled' && disabled) return { variant: 'primary' };
    if (variant === 'filled') return { variant: 'inverse' };
    return { variant: BUTTON_COLOR_TO_ICON_VARIANT[color] };
  };

  const iconSize = ICON_SIZES[size];
  const resolvedIconProps = getIconProps();

  const isDisabled = disabled || loading;

  const getSpinnerColor = () => {
    if (resolvedIconProps.color) return resolvedIconProps.color;
    const v = resolvedIconProps.variant;
    if (v === 'inverse') return theme.colors.icon.inverse;
    if (v === 'brandPrimary') return theme.colors.brand.primary;
    if (v === 'brandSecondary') return theme.colors.brand.secondary;
    if (v === 'brandTertiary') return theme.colors.brand.tertiary;
    if (v === 'success') return theme.colors.state.success;
    if (v === 'error') return theme.colors.state.error;
    if (v === 'warning') return theme.colors.state.warning;
    if (v === 'info') return theme.colors.state.info;
    if (v === 'primary') return theme.colors.icon.primary;
    if (v === 'secondary') return theme.colors.icon.secondary;
    if (v === 'tertiary') return theme.colors.icon.tertiary;
    if (v === 'muted') return theme.colors.icon.muted;
    if (v === 'accent') return theme.colors.icon.accent;
    return theme.colors.icon.primary;
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={getSpinnerColor()} />;
    }
    // Generic icon props require type assertion due to TypeScript generic inference limitations
    const iconProps = { familyName, iconName, size: iconSize, ...resolvedIconProps };
    return <Icon {...(iconProps as React.ComponentProps<typeof Icon>)} />;
  };

  const getPressedStyle = (pressed: boolean) => {
    if (!pressed || isDisabled || Platform.OS === 'android') return {};
    return { opacity: 0.85 };
  };

  const renderPressable = () => (
    <Pressable
      style={({ pressed }) => [styles.container, getPressedStyle(pressed), style]}
      disabled={isDisabled}
      android_ripple={
        isDisabled
          ? undefined
          : {
              color:
                variant === 'filled' ? theme.colors.overlay.ripple : theme.colors.overlay.hover,
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
