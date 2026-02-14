import React from 'react';
import { View } from 'react-native';

import { styles } from './Divider.styles';
import type { DividerProps } from './Divider.types';

/**
 * Visual separator for content sections.
 * Supports horizontal/vertical orientation and line/dot variants.
 *
 * @example
 * <Divider orientation="horizontal" variant="line" />
 */
export function Divider({
  orientation = 'horizontal',
  variant = 'line',
  color,
  thickness,
  length,
  style,
}: DividerProps) {
  if (variant === 'dot') {
    const dotSize = thickness ?? 3;
    return (
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
          },
          color !== undefined && { backgroundColor: color },
          color !== undefined && styles.dotWithColor,
          style,
        ]}
      />
    );
  }

  const lineThickness = thickness ?? 1;
  const isVertical = orientation === 'vertical';

  return (
    <View
      style={[
        styles.base,
        isVertical
          ? { width: lineThickness, height: length }
          : { height: lineThickness, width: length },
        color !== undefined && { backgroundColor: color },
        style,
      ]}
    />
  );
}
