import type { ICON_FAMILIES } from '@/common/components/Icon/Icon.constants';
import type { IconColorVariant, IconName } from '@/common/components/Icon/Icon.types';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

export type IconButtonSize = 'small' | 'medium' | 'large';
export type IconButtonVariant = 'filled' | 'outlined' | 'ghost' | 'tinted';
export type IconButtonColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface IconButtonProps<T extends keyof typeof ICON_FAMILIES> extends Omit<
  PressableProps,
  'style'
> {
  /**
   * Icon family name
   */
  familyName: T;

  /**
   * Icon name from the selected family
   */
  iconName: IconName<T>;

  /**
   * Icon color variant from theme
   */
  iconVariant?: IconColorVariant;

  /**
   * Direct icon color (overrides variant)
   */
  iconColor?: string;

  /**
   * Button size
   * @default 'medium'
   */
  size?: IconButtonSize;

  /**
   * Button visual variant
   * @default 'ghost'
   */
  variant?: IconButtonVariant;

  /**
   * Button color (applies to filled and tinted variants)
   * @default 'primary'
   */
  color?: IconButtonColor;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Show loading spinner instead of icon
   * @default false
   */
  loading?: boolean;

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;
}
