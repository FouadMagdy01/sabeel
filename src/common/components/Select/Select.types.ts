import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface SelectOption {
  label: string;
  value: string;
  icon?: string; // Emoji or icon identifier
}

export type SelectSize = 'small' | 'medium' | 'large';
export type SelectVariant = 'outlined' | 'filled';

export interface SelectProps {
  /**
   * Array of options to display
   */
  options: SelectOption[];

  /**
   * Currently selected value
   */
  value?: string;

  /**
   * Callback when selection changes
   */
  onValueChange: (value: string) => void;

  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;

  /**
   * Label text displayed above the select
   */
  label?: string;

  /**
   * Visual variant
   * @default 'outlined'
   */
  variant?: SelectVariant;

  /**
   * Size of the select
   * @default 'medium'
   */
  size?: SelectSize;

  /**
   * Whether the select is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the select has an error
   * @default false
   */
  error?: boolean;

  /**
   * Error message to display
   */
  errorText?: string;

  /**
   * Helper text displayed below the select
   */
  helperText?: string;

  /**
   * Show search input in dropdown
   * @default false
   */
  searchable?: boolean;

  /**
   * Show clear button when value selected
   * @default false
   */
  allowClear?: boolean;

  /**
   * Show loading spinner in dropdown
   * @default false
   */
  loading?: boolean;

  /**
   * Custom container style
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Custom select button style
   */
  selectStyle?: StyleProp<ViewStyle>;

  /**
   * Custom label style
   */
  labelStyle?: StyleProp<TextStyle>;
}
