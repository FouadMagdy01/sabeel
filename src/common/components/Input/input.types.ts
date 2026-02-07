import type { ReactNode } from 'react';
import type { TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';

/**
 * Input appearance variants
 * - outlined: Border with transparent background (default)
 * - filled: Solid background color
 * - underlined: Only bottom border
 */
export type InputVariant = 'outlined' | 'filled' | 'underlined';

/**
 * Input size options
 */
export type InputSize = 'small' | 'medium' | 'large';

/**
 * Input state for styling
 */
export type InputState = 'default' | 'focused' | 'error' | 'success';

/**
 * Input component props extending React Native TextInputProps
 */
export interface InputProps extends Omit<TextInputProps, 'style'> {
  /**
   * Visual appearance variant
   * @default 'outlined'
   */
  variant?: InputVariant;

  /**
   * Input size
   * @default 'medium'
   */
  size?: InputSize;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the input has an error
   * @default false
   */
  error?: boolean;

  /**
   * Whether the input is in success state
   * @default false
   */
  success?: boolean;

  /**
   * Label text displayed above the input
   */
  label?: string;

  /**
   * Helper text displayed below the input
   */
  helperText?: string;

  /**
   * Error message displayed below the input (overrides helperText when error is true)
   */
  errorText?: string;

  /**
   * Element to render on the left side of the input
   */
  leftElement?: ReactNode;

  /**
   * Element to render on the right side of the input
   */
  rightElement?: ReactNode;

  /**
   * Custom container style (wraps everything including label and helper text)
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Custom input container style (wraps input and left/right elements)
   */
  inputContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Custom text input style
   */
  style?: StyleProp<TextStyle>;

  /**
   * Custom label style
   */
  labelStyle?: StyleProp<TextStyle>;

  /**
   * Custom helper text style
   */
  helperTextStyle?: StyleProp<TextStyle>;
}
