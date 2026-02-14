import type { ReactNode } from 'react';
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

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
 * Input component props extending React Native TextInputProps
 */
export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Visual appearance variant @default 'outlined' */
  variant?: InputVariant;

  /** Input size @default 'medium' */
  size?: InputSize;

  /** Whether the input is disabled @default false */
  disabled?: boolean;

  /** Whether the input has an error @default false */
  error?: boolean;

  /** Whether the input is in success state @default false */
  success?: boolean;

  /** Label text displayed above the input */
  label?: string;

  /** Helper text displayed below the input */
  helperText?: string;

  /** Error message displayed below the input (overrides helperText when error is true) */
  errorText?: string;

  /** Element to render on the left side of the input */
  leftElement?: ReactNode;

  /** Element to render on the right side of the input */
  rightElement?: ReactNode;

  /** Custom container style (wraps everything including label and helper text) */
  containerStyle?: StyleProp<ViewStyle>;

  /** Custom input container style (wraps input and left/right elements) */
  inputContainerStyle?: StyleProp<ViewStyle>;

  /** Custom text input style */
  style?: StyleProp<TextStyle>;

  /** Custom label style */
  labelStyle?: StyleProp<TextStyle>;

  /** Custom helper text style */
  helperTextStyle?: StyleProp<TextStyle>;

  /** Show clear button (X icon) when input has value @default false */
  clearable?: boolean;

  /** Show required indicator (*) next to label @default false */
  required?: boolean;

  /** Show character count (e.g., "15/100") @default false */
  showCount?: boolean;

  /** Maximum character length for character count display */
  maxLength?: number;
}
