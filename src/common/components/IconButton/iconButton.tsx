import React from 'react';
import { ActivityIndicator, Platform, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { IconColorVariant } from '@/common/components/Icon';
import { Icon } from '@/common/components/Icon';
import type { ICON_FAMILIES } from '@/common/components/Icon/Icon.constants';
import { ICON_SIZES, styles } from './iconButton.styles';
import type { IconButtonColor, IconButtonProps } from './iconButton.types';

const TINTED_ICON_COLORS: Record<
  IconButtonColor,
  (theme: ReturnType<typeof useUnistyles>['theme']) => string
> = {
  primary: (theme) => theme.colors.brand.primary,
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
  color = 'success',
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
    if (variant === 'filled') return { variant: 'inverse' };
    if (variant === 'tinted') return { color: TINTED_ICON_COLORS[color](theme) };
    return { variant: 'primary' };
  };

  const iconSize = ICON_SIZES[size];
  const resolvedIconColor = getIconColor();

  // Determine spinner color
  const spinnerColor = resolvedIconColor.color ?? theme.colors.icon.primary;

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

  const button = (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && !loading && { opacity: 0.7 }, style]}
      disabled={isDisabled}
      {...pressableProps}
    >
      {renderContent()}
    </Pressable>
  );

  // Android ripple effect wrapper
  if (Platform.OS === 'android') {
    return (
      <View style={styles.androidWrapper}>
        <Pressable
          style={[styles.container, style]}
          disabled={isDisabled}
          android_ripple={{
            color: theme.colors.overlay.pressed,
            borderless: true,
          }}
          {...pressableProps}
        >
          {renderContent()}
        </Pressable>
      </View>
    );
  }

  return button;
}
