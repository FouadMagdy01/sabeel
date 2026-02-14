import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * Button appearance variants
 * - contained: Filled background with inverse text and shadow on press
 * - outlined: Border with transparent background
 * - elevated: Neutral surface color with elevation/shadow
 * - text: No background, just text
 * - transparent: No background, no padding, just text
 */
export type ButtonVariant = 'contained' | 'outlined' | 'elevated' | 'text' | 'transparent';

/**
 * Button color schemes
 * - primary: Uses brand primary color
 * - secondary: Uses brand secondary color
 * - success: Uses state success color
 * - error: Uses state error color
 * - warning: Uses state warning color
 * - info: Uses state info color
 */
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

/**
 * Button size options
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button component props extending React Native PressableProps
 */
export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Button text content */
  children: string;

  /** Icon to render (left side by default) */
  icon?: ReactNode;

  /** Position of the icon relative to text @default 'left' */
  iconPosition?: 'left' | 'right';

  /** Visual appearance variant @default 'contained' */
  variant?: ButtonVariant;

  /** Color scheme @default 'primary' */
  color?: ButtonColor;

  /** Button size @default 'medium' */
  size?: ButtonSize;

  /** Whether the button is disabled @default false */
  disabled?: boolean;

  /** Whether the button is in loading state @default false */
  loading?: boolean;

  /** Whether the button should take full width of container @default false */
  fullWidth?: boolean;

  /** Custom container style */
  style?: StyleProp<ViewStyle>;

  /** Custom text style */
  textStyle?: StyleProp<TextStyle>;
}
