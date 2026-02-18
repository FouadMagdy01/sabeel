import React, { useCallback, useMemo } from 'react';
import { Platform, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
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
  const { theme } = useUnistyles();

  const androidRipple = useMemo(() => {
    if (Platform.OS !== 'android') return undefined;
    return { color: theme.colors.overlay.pressed, borderless: false, foreground: true };
  }, [theme]);

  const getPressedStyle = useCallback((pressed: boolean): StyleProp<ViewStyle> => {
    if (!pressed || Platform.OS === 'android') return undefined;
    return { opacity: 0.85 };
  }, []);

  // Inline color styles to avoid flicker during theme switching
  const separatorColor = { borderBottomColor: theme.colors.border.subtle };
  const iconBgColor = { backgroundColor: `${theme.colors.brand.primary}15` };

  const content = (
    <View style={[styles.container, !isLast && styles.separator, !isLast && separatorColor]}>
      {icon && (
        <View style={[styles.iconContainer, iconBgColor]}>
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
      <Pressable
        onPress={onPress}
        android_ripple={androidRipple}
        style={({ pressed }) => getPressedStyle(pressed)}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
