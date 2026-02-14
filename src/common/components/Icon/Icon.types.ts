import { ComponentProps } from 'react';
import { ICON_FAMILIES } from './Icon.constants';

/**
 * Icon color variants that map to theme colors
 */
export type IconColorVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'muted'
  | 'inverse'
  | 'accent';

// Extract icon name types from each icon family
export type IconName<T extends keyof typeof ICON_FAMILIES> = ComponentProps<
  (typeof ICON_FAMILIES)[T]
>['name'];

// Create a type that extends all icon component props and replaces 'name' with 'iconName'
type IconProps<T extends keyof typeof ICON_FAMILIES = keyof typeof ICON_FAMILIES> = Omit<
  ComponentProps<(typeof ICON_FAMILIES)[T]>,
  'name' | 'color'
> & {
  familyName: T;
  iconName: IconName<T>;
  /**
   * Color variant that maps to theme icon colors
   * Takes precedence over direct color prop
   */
  variant?: IconColorVariant;
  /**
   * Direct color override (hex, rgb, etc.)
   * Only used if variant is not specified
   */
  color?: string;
};

export type { IconProps };
