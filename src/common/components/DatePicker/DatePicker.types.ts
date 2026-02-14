import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type DatePickerSize = 'small' | 'medium' | 'large';
export type DatePickerVariant = 'outlined' | 'filled';

export interface DatePickerProps {
  /**
   * Currently selected date
   */
  value?: Date | null;

  /**
   * Callback when date changes
   */
  onValueChange: (date: Date | null) => void;

  /**
   * Placeholder text when no date is selected
   */
  placeholder?: string;

  /**
   * Label text displayed above the picker
   */
  label?: string;

  /**
   * Visual variant
   * @default 'outlined'
   */
  variant?: DatePickerVariant;

  /**
   * Size of the picker
   * @default 'medium'
   */
  size?: DatePickerSize;

  /**
   * Whether the picker is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the picker has an error
   * @default false
   */
  error?: boolean;

  /**
   * Error message to display
   */
  errorText?: string;

  /**
   * Helper text displayed below the picker
   */
  helperText?: string;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Date format for display
   * @default 'MMM dd, yyyy'
   */
  dateFormat?: string;

  /**
   * Show clear button when value selected
   * @default false
   */
  clearable?: boolean;

  /**
   * Custom container style
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Custom picker button style
   */
  pickerStyle?: StyleProp<ViewStyle>;

  /**
   * Custom label style
   */
  labelStyle?: StyleProp<TextStyle>;
}
