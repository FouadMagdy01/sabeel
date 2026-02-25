import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useUnistyles } from 'react-native-unistyles';

import { getSizeStyles, styles } from './SegmentedControl.styles';
import type { SegmentOption, SegmentedControlProps } from './SegmentedControl.types';

/**
 * Segmented control for switching between multiple views or options.
 * Displays a horizontal row of segments with one active selection.
 *
 * **NEW API (Recommended):**
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { label: 'Tab 1', value: 'tab1' },
 *     { label: 'Tab 2', value: 'tab2', icon: <Icon.../> }
 *   ]}
 *   value="tab1"
 *   onChange={(value) => setValue(value)}
 *   size="medium"
 *   fullWidth
 * />
 * ```
 *
 * **Legacy API (Still Supported):**
 * ```tsx
 * <SegmentedControl
 *   segments={['Daily', 'Weekly', 'Monthly']}
 *   selectedIndex={0}
 *   onSegmentChange={(index) => setView(index)}
 * />
 * ```
 *
 * @example
 * // With icons and per-segment disabled state
 * <SegmentedControl
 *   options={[
 *     { label: 'Daily', value: 'daily', icon: <Icon name="calendar" /> },
 *     { label: 'Weekly', value: 'weekly', icon: <Icon name="calendar-week" /> },
 *     { label: 'Monthly', value: 'monthly', disabled: true }
 *   ]}
 *   value="daily"
 *   onChange={setValue}
 *   size="large"
 * />
 */
const SegmentedControl: React.FC<SegmentedControlProps> = ({
  // New API props
  options,
  value,
  defaultValue,
  onChange,
  size = 'medium',
  disabled = false,
  fullWidth = false,

  // Legacy API props
  segments,
  selectedIndex,
  onSegmentChange,
}) => {
  const { theme } = useUnistyles();

  // Development warning for legacy API usage
  if (__DEV__) {
    if (segments || selectedIndex !== undefined || onSegmentChange) {
      console.warn(
        'SegmentedControl: You are using the deprecated API (segments, selectedIndex, onSegmentChange). ' +
          'Please migrate to the new API (options, value, onChange) for better features and type safety. ' +
          'See component documentation for migration guide.'
      );
    }
  }

  const sizeStyles = useMemo(() => getSizeStyles(size), [size]);

  // Convert legacy segments to options if needed
  const normalizedOptions = useMemo<SegmentOption[]>(() => {
    if (options) {
      return options;
    }

    if (segments) {
      return segments.map((label, index) => ({
        label,
        value: String(index),
      }));
    }

    return [];
  }, [options, segments]);

  // Internal state for uncontrolled usage
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue ??
      (selectedIndex !== undefined ? String(selectedIndex) : normalizedOptions[0]?.value)
  );

  // Determine current selected value
  const currentValue = value ?? internalValue;

  // Handle segment change for both APIs
  const handleChange = (newValue: string) => {
    // Update internal state for uncontrolled usage
    if (value === undefined) {
      setInternalValue(newValue);
    }

    // Call new API callback
    onChange?.(newValue);

    // Call legacy API callback
    if (onSegmentChange) {
      const index = normalizedOptions.findIndex((opt) => opt.value === newValue);
      if (index !== -1) {
        onSegmentChange(index);
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        fullWidth && styles.containerFullWidth,
        disabled && styles.containerDisabled,
      ]}
    >
      {normalizedOptions.map((option) => {
        const isActive = option.value === currentValue;
        const isSegmentDisabled = disabled || option.disabled;

        return (
          <Pressable
            key={option.value}
            style={[
              styles.segment,
              sizeStyles.segment,
              fullWidth && styles.segmentFullWidth,
              isActive && styles.segmentActive,
              isSegmentDisabled && styles.segmentDisabled,
            ]}
            onPress={() => !isSegmentDisabled && handleChange(option.value)}
            disabled={isSegmentDisabled}
            accessibilityRole="tab"
            accessibilityState={{
              selected: isActive,
              disabled: isSegmentDisabled,
            }}
            accessibilityLabel={option.label}
          >
            {option.icon && (
              <View
                style={[styles.iconContainer, sizeStyles.iconContainer]}
                accessibilityElementsHidden
              >
                {option.icon}
              </View>
            )}
            <Text
              style={[
                styles.segmentText,
                { fontSize: theme.fonts.size[sizeStyles.fontSize] },
                isActive && styles.segmentTextActive,
                isSegmentDisabled && styles.segmentTextDisabled,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default SegmentedControl;
