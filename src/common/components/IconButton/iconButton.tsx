import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import Icon from '@/common/components/Icon';
import type { ICON_FAMILIES } from '@/common/components/Icon/icon.constants';
import { ICON_SIZES, styles } from './iconButton.styles';
import type { IconButtonProps } from './iconButton.types';

/**
 * IconButton component - A pressable button containing only an icon
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
 * // Outlined button
 * <IconButton
 *   familyName="Feather"
 *   iconName="x"
 *   variant="outlined"
 *   size="large"
 *   onPress={handlePress}
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
  disabled = false,
  style,
  ...pressableProps
}: IconButtonProps<T>) {
  const { theme } = useUnistyles();

  styles.useVariants({
    variant,
    size,
    disabled: disabled as true | false,
  });

  // Determine icon color based on variant
  const getDefaultIconVariant = () => {
    if (iconVariant) return iconVariant;
    if (variant === 'filled') return 'inverse';
    return 'primary';
  };

  const iconSize = ICON_SIZES[size];

  const iconProps = {
    familyName,
    iconName,
    variant: iconColor ? undefined : getDefaultIconVariant(),
    color: iconColor,
    size: iconSize,
  } as const;

  const button = (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.7 }, style]}
      disabled={disabled}
      {...pressableProps}
    >
      {/* @ts-expect-error - Generic icon props are complex */}
      <Icon {...iconProps} />
    </Pressable>
  );

  // Android ripple effect wrapper
  if (Platform.OS === 'android') {
    return (
      <View style={styles.androidWrapper}>
        <Pressable
          style={[styles.container, style]}
          disabled={disabled}
          android_ripple={{
            color: theme.colors.overlay.pressed,
            borderless: true,
          }}
          {...pressableProps}
        >
          {/* @ts-expect-error - Generic icon props are complex */}
          <Icon {...iconProps} />
        </Pressable>
      </View>
    );
  }

  return button;
}
