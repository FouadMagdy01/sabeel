import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from './SegmentedControl.styles';
import type { SegmentedControlProps } from './SegmentedControl.types';

/**
 * Segmented control for switching between multiple views or options.
 * Displays a horizontal row of segments with one active selection.
 *
 * @example
 * <SegmentedControl
 *   segments={['Daily', 'Weekly', 'Monthly']}
 *   selectedIndex={0}
 *   onSegmentChange={(index) => setView(index)}
 * />
 */
const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  selectedIndex,
  onSegmentChange,
}) => {
  return (
    <View style={styles.container}>
      {segments.map((segment, index) => {
        const isActive = index === selectedIndex;
        return (
          <Pressable
            key={segment}
            style={[styles.segment, isActive && styles.segmentActive]}
            onPress={() => onSegmentChange(index)}
          >
            <Text style={isActive ? styles.segmentTextActive : styles.segmentText}>{segment}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default SegmentedControl;
