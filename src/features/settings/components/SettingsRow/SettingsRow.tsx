import React, { useCallback } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { UniPressable } from '@/common/components/themed';
import { styles, ICON_BG_SIZE } from './SettingsRow.styles';
import type { SettingsRowProps } from './SettingsRow.types';

export function SettingsRow({
  icon,
  iconFamily = 'Ionicons',
  label,
  value,
  rightElement,
  onPress,
  showChevron = true,
  isLast = false,
}: SettingsRowProps) {
  const getPressedStyle = useCallback((pressed: boolean): StyleProp<ViewStyle> => {
    if (!pressed || Platform.OS === 'android') return undefined;
    return { opacity: 0.85 };
  }, []);

  const content = (
    <View style={[styles.container, !isLast && styles.separator]}>
      {icon && (
        <View style={styles.iconContainer}>
          <Icon
            familyName={iconFamily}
            iconName={icon}
            size={ICON_BG_SIZE * 0.5}
            variant="accent"
          />
        </View>
      )}
      <View style={styles.content}>
        <Typography type="body" size="sm">
          {label}
        </Typography>
        {value && (
          <Typography type="caption" color="muted" style={styles.valueText}>
            {value}
          </Typography>
        )}
      </View>
      <View style={styles.rightContainer}>
        {rightElement ??
          (onPress && showChevron && (
            <Icon familyName="Ionicons" iconName="chevron-forward" size={20} variant="muted" />
          ))}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <UniPressable onPress={onPress} style={({ pressed }) => getPressedStyle(pressed)}>
        {content}
      </UniPressable>
    );
  }

  return content;
}
