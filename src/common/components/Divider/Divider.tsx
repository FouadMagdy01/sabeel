import React from 'react';
import { View } from 'react-native';

import { Typography } from '@/common/components/Typography';
import { styles } from './Divider.styles';
import type { DividerProps } from './Divider.types';

/**
 * Visual separator for content sections.
 * Supports horizontal/vertical orientation, line/dot variants, labeled dividers, and dashed style.
 *
 * @example
 * // Basic divider
 * <Divider orientation="horizontal" variant="line" />
 *
 * // Labeled divider
 * <Divider>Section Title</Divider>
 *
 * // Labeled with alignment
 * <Divider textAlign="left">Left Text</Divider>
 *
 * // Dashed divider
 * <Divider dashed />
 */
export function Divider({
  orientation = 'horizontal',
  variant = 'line',
  color,
  thickness,
  length,
  children,
  dashed = false,
  textAlign = 'center',
  style,
}: DividerProps) {
  // Dot variant (no label support)
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

  // Labeled divider (only for horizontal orientation)
  if (children && !isVertical) {
    const lineStyle = [
      styles.labelLine,
      { height: lineThickness },
      color !== undefined && { backgroundColor: color },
      dashed && styles.dashed,
    ];

    const textStyle = [
      styles.labelText,
      textAlign === 'left' && styles.labelAlignLeft,
      textAlign === 'right' && styles.labelAlignRight,
    ];

    return (
      <View style={[styles.labelContainer, styles.labelContainerHorizontal, style]}>
        {textAlign !== 'left' && <View style={lineStyle} />}
        {typeof children === 'string' ? (
          <Typography type="caption" size="sm" style={textStyle}>
            {children}
          </Typography>
        ) : (
          <View style={textStyle}>{children}</View>
        )}
        {textAlign !== 'right' && <View style={lineStyle} />}
      </View>
    );
  }

  // Standard line divider
  return (
    <View
      style={[
        styles.base,
        isVertical
          ? { width: lineThickness, height: length }
          : { height: lineThickness, width: length },
        color !== undefined && { backgroundColor: color },
        dashed && styles.dashed,
        style,
      ]}
    />
  );
}
