import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type DatePickerSize = 'small' | 'medium' | 'large';
export type DatePickerVariant = 'outlined' | 'filled';
export type DatePickerMode = 'date' | 'time' | 'datetime';
export type TimeFormat = '12h' | '24h';
export type DatePickerViewMode = 'calendar' | 'year' | 'month';

export interface TimeValue {
  hours: number; // 0-23
  minutes: number; // 0-55 (multiples of minuteStep)
}

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

  /**
   * Picker mode determining which controls are shown.
   * - 'date': Calendar only (default, backward compatible)
   * - 'time': Time wheels only (no calendar)
   * - 'datetime': Calendar + time wheels
   * @default 'date'
   */
  mode?: DatePickerMode;

  /**
   * Time display format. When not specified, auto-detects from locale.
   * - '12h': 1-12 with AM/PM
   * - '24h': 0-23
   * @default locale-based
   */
  timeFormat?: TimeFormat;

  /**
   * Minute wheel step increment.
   * @default 5
   */
  minuteStep?: number;

  /**
   * Minimum selectable time (applied when selected date matches minDate).
   * Only relevant when mode is 'time' or 'datetime'.
   */
  minTime?: TimeValue;

  /**
   * Maximum selectable time (applied when selected date matches maxDate).
   * Only relevant when mode is 'time' or 'datetime'.
   */
  maxTime?: TimeValue;
}

export interface YearSelectorProps {
  /**
   * Currently selected year
   */
  selectedYear: number;

  /**
   * Callback when year is selected
   */
  onSelectYear: (year: number) => void;

  /**
   * Minimum selectable year
   * @default 1900
   */
  minYear?: number;

  /**
   * Maximum selectable year
   * @default 2100
   */
  maxYear?: number;
}

export interface MonthGridProps {
  /**
   * Currently selected month (0-11)
   */
  selectedMonth: number;

  /**
   * Current year being viewed
   */
  year: number;

  /**
   * Callback when month is selected
   */
  onSelectMonth: (month: number) => void;

  /**
   * Minimum selectable date (for disabling months)
   */
  minDate?: Date;

  /**
   * Maximum selectable date (for disabling months)
   */
  maxDate?: Date;
}

export interface TimeWheelPickerProps {
  /**
   * Currently selected hours (0-23)
   */
  hours: number;

  /**
   * Currently selected minutes (0-55, multiples of minuteStep)
   */
  minutes: number;

  /**
   * Callback when time changes
   */
  onTimeChange: (hours: number, minutes: number) => void;

  /**
   * Time display format
   * @default '24h'
   */
  timeFormat?: TimeFormat;

  /**
   * Minute wheel step increment
   * @default 5
   */
  minuteStep?: number;

  /**
   * Minimum selectable time
   */
  minTime?: TimeValue;

  /**
   * Maximum selectable time
   */
  maxTime?: TimeValue;
}
