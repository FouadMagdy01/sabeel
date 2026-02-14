import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'line' | 'dot';
export type DividerTextAlign = 'left' | 'center' | 'right';

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
 * @param children - Label text/content to show in divider
 * @param dashed - Use dashed border style
 * @default false
 * @param textAlign - Label position (left, center, right)
 * @default 'center'
 * @param style - Style overrides
 */
export interface DividerProps {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  color?: string;
  thickness?: number;
  length?: number;
  children?: ReactNode;
  dashed?: boolean;
  textAlign?: DividerTextAlign;
  style?: StyleProp<ViewStyle>;
}
