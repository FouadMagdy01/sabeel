import React from 'react';
import { I18nManager, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { styles, TOGGLE_CONSTANTS } from './Toggle.styles';
import type { ToggleProps } from './Toggle.types';

export function Toggle({ value, onValueChange, disabled = false, size = 'medium' }: ToggleProps) {
  const constants = TOGGLE_CONSTANTS[size];
  const direction = I18nManager.isRTL ? -1 : 1;

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(value ? constants.translateX * direction : 0, { duration: 200 }),
      },
    ],
  }));

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      style={[
        styles.track,
        {
          width: constants.trackWidth,
          height: constants.trackHeight,
        },
        value ? styles.trackActive : styles.trackInactive,
        disabled && styles.trackDisabled,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            width: constants.thumbSize,
            height: constants.thumbSize,
          },
          thumbAnimatedStyle,
        ]}
      />
    </Pressable>
  );
}
