import React from 'react';
import { Pressable, View } from 'react-native';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { THEME_METADATA, THEME_PRESET_NAMES, type ThemePresetName } from '@/theme/config';
import { styles } from './ThemeSwatchPicker.styles';
import type { ThemeSwatchPickerProps } from './ThemeSwatchPicker.types';

export function ThemeSwatchPicker({ selected, onSelect }: ThemeSwatchPickerProps) {
  return (
    <View style={styles.container}>
      {THEME_PRESET_NAMES.map((preset: ThemePresetName) => {
        const meta = THEME_METADATA[preset];
        const isSelected = preset === selected;

        return (
          <Pressable key={preset} onPress={() => onSelect(preset)}>
            <View style={styles.swatchWrapper}>
              <View style={[styles.swatchOuter, isSelected && styles.swatchOuterSelected]}>
                <View style={[styles.swatch, { backgroundColor: meta.baseColor }]}>
                  {isSelected && (
                    <Icon familyName="Ionicons" iconName="checkmark" size={18} variant="inverse" />
                  )}
                </View>
              </View>
              <Typography
                type="caption"
                size="xxs"
                color={isSelected ? 'primary' : 'muted'}
                style={styles.label}
              >
                {meta.name}
              </Typography>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
