import { ICON_FAMILIES } from '@/common/components/Icon/Icon.constants';
import { IconColorVariant, IconProps } from '@/common/components/Icon/Icon.types';
import React from 'react';
import { useUnistyles } from 'react-native-unistyles';

/**
 * Icon component with theme color variant support
 *
 * @example
 * ```tsx
 * // Using color variant (recommended)
 * <Icon familyName="Feather" iconName="check" variant="primary" size={24} />
 *
 * // Using direct color
 * <Icon familyName="Ionicons" iconName="heart" color="#FF0000" size={20} />
 *
 * // Default (primary variant)
 * <Icon familyName="MaterialIcons" iconName="home" size={24} />
 * ```
 */
const Icon = <T extends keyof typeof ICON_FAMILIES>({
  familyName,
  iconName,
  variant,
  color,
  ...rest
}: IconProps<T>) => {
  const { theme } = useUnistyles();
  // Map variant to theme icon color
  const getColorFromVariant = (v: IconColorVariant): string => {
    const colorMap: Record<IconColorVariant, string> = {
      primary: theme.colors.icon.primary,
      secondary: theme.colors.icon.secondary,
      tertiary: theme.colors.icon.tertiary,
      muted: theme.colors.icon.muted,
      inverse: theme.colors.icon.inverse,
      accent: theme.colors.icon.accent,
    };
    return colorMap[v];
  };

  // Determine final color: variant takes precedence, then direct color, then default
  const finalColor = variant ? getColorFromVariant(variant) : (color ?? theme.colors.icon.primary);

  const IconComponent = ICON_FAMILIES[familyName];
  return <IconComponent name={iconName} color={finalColor} {...rest} />;
};

export { Icon };
