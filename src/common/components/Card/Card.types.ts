import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'gradient';
export type CardRadius = 'sm' | 'md' | 'lg' | 'xl';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Props for the Card component.
 *
 * @param variant - Card visual variant (elevated, outlined, filled, gradient)
 * @default 'elevated'
 * @param radius - Border radius size (sm, md, lg, xl)
 * @default 'md'
 * @param padding - Internal padding (none, sm, md, lg)
 * @default 'md'
 * @param gradientColors - Gradient colors (only used with variant="gradient")
 * @param gradientStart - Gradient start point (only used with variant="gradient")
 * @default { x: 0, y: 0 }
 * @param gradientEnd - Gradient end point (only used with variant="gradient")
 * @default { x: 1, y: 1 }
 * @param onPress - Callback when card is pressed (makes card pressable)
 * @param loading - Whether the card is in loading state
 * @default false
 * @param style - Style overrides for layout (e.g. flexDirection, gap)
 * @param children - Card content
 */
export interface CardProps {
  variant?: CardVariant;
  radius?: CardRadius;
  padding?: CardPadding;
  gradientColors?: [string, string];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  onPress?: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}
