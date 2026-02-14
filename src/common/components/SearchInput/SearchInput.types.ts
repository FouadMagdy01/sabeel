import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

import type { ComponentSize } from '@/common/components/shared.types';

/**
 * SearchInput component props
 */
export interface SearchInputProps extends Omit<TextInputProps, 'style'> {
  /** Custom container style */
  containerStyle?: StyleProp<ViewStyle>;

  /** Custom text input style */
  style?: StyleProp<TextStyle>;

  /** Callback when clear button is pressed */
  onClear?: () => void;

  /** Whether to show the clear button @default true when value is non-empty */
  showClearButton?: boolean;

  /** Callback when Enter key is pressed @default undefined */
  onSearch?: (query: string) => void;

  /** Show loading spinner instead of search icon @default false */
  loading?: boolean;

  /** Size variant @default 'medium' */
  size?: ComponentSize;

  /** Whether the input is disabled @default false */
  disabled?: boolean;
}
