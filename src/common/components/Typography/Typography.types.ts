import type { StyleProp, TextProps as RNTextProps, TextStyle } from 'react-native';

export type TypographyType = 'heading' | 'body' | 'caption' | 'label' | 'overline';

export type TypographySize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export type TypographyWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'muted'
  | 'inverse'
  | 'accent'
  | 'error'
  | 'success'
  | 'disabled'
  | 'brandPrimary'
  | 'brandSecondary'
  | 'brandTertiary';

export type TypographyAlign = 'left' | 'center' | 'right';

/**
 * Props for the Typography component.
 *
 * @param type - Semantic type that sets default size, weight, and color
 * @default 'body'
 * @param size - Font size (overrides type default)
 * @param weight - Font weight (overrides type default)
 * @param color - Text color from theme (overrides type default)
 * @default 'primary'
 * @param align - Text alignment (left, center, right)
 * @param uppercase - Whether to uppercase the text
 * @default false
 * @param italic - Whether to italicize the text
 * @default false
 * @param strikethrough - Whether to add strikethrough decoration
 * @default false
 * @param underline - Whether to add underline decoration
 * @default false
 * @param style - Style overrides (e.g. lineHeight, writingDirection, letterSpacing)
 */
export interface TypographyProps extends Omit<RNTextProps, 'style'> {
  type?: TypographyType;
  size?: TypographySize;
  weight?: TypographyWeight;
  color?: TypographyColor;
  align?: TypographyAlign;
  uppercase?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  style?: StyleProp<TextStyle>;
}
