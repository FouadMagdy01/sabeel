import React from 'react';
import { Text } from 'react-native';

import { styles } from './Typography.styles';
import type { TypographyProps } from './Typography.types';

/**
 * Semantic text component with built-in Cairo font family and RTL support.
 * Provides consistent typography with theme-aware colors and responsive sizing.
 *
 * @example
 * <Typography type="heading" size="xl" weight="bold">
 *   Heading Text
 * </Typography>
 */
export function Typography({
  type = 'body',
  size,
  weight,
  color,
  align,
  uppercase = false,
  italic = false,
  strikethrough = false,
  underline = false,
  style,
  children,
  ...textProps
}: TypographyProps) {
  styles.useVariants({
    type,
    ...(size !== undefined && { size }),
    ...(weight !== undefined && { weight }),
    ...(color !== undefined && { color }),
    ...(align !== undefined && { align }),
    uppercase: uppercase as true | false,
    italic: italic as true | false,
    strikethrough: strikethrough as true | false,
    underline: underline as true | false,
  });

  return (
    <Text style={[styles.base, style]} {...textProps}>
      {children}
    </Text>
  );
}
