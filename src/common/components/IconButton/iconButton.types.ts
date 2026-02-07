import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import type { ICON_FAMILIES } from '@/common/components/Icon/icon.constants';
import type { IconColorVariant, IconName } from '@/common/components/Icon/icon.types';

export type IconButtonSize = 'small' | 'medium' | 'large';
export type IconButtonVariant = 'filled' | 'outlined' | 'ghost';

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
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;
}
