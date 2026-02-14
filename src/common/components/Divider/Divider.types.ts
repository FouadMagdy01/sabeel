import type { StyleProp, ViewStyle } from 'react-native';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'line' | 'dot';

/**
 * Props for the Divider component.
 *
 * @param orientation - Divider orientation (horizontal or vertical)
 * @default 'horizontal'
 * @param variant - Visual variant (line or dot)
 * @default 'line'
 * @param color - Override the theme default color
 * @param thickness - Line thickness or dot diameter
 * @default 1 for line, 3 for dot
 * @param length - Length for vertical dividers (height) or horizontal dividers (width)
 * @param style - Style overrides
 */
export interface DividerProps {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  color?: string;
  thickness?: number;
  length?: number;
  style?: StyleProp<ViewStyle>;
}
