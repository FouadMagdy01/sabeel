import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/common/components/Icon';
import type { IconProps } from '@/common/components/Icon';

export type ToolbarAction = {
  key: string;
  icon: Pick<IconProps, 'familyName' | 'iconName'>;
  label?: string;
  onPress: () => void;
  disabled?: boolean;
};

type ToolbarProps = {
  actions: ToolbarAction[];
  showLabels?: boolean;
  style?: React.ComponentProps<typeof View>['style'];
};

export function Toolbar({ actions, showLabels = false, style }: ToolbarProps) {
  const { theme } = useUnistyles();

  // Inline color styles to avoid flicker during theme switching
  const containerColors = {
    backgroundColor: theme.colors.brand.secondary,
    shadowColor: theme.colors.shadow.color,
  };
  const labelColor = { color: theme.colors.text.inverse };

  return (
    <View style={[styles.container, containerColors, style]}>
      {actions.map((action) => {
        const androidRipple =
          Platform.OS === 'android' && !action.disabled
            ? { color: theme.colors.overlay.ripple, borderless: true }
            : undefined;

        return (
          <Pressable
            key={action.key}
            onPress={action.onPress}
            disabled={action.disabled}
            android_ripple={androidRipple}
            style={({ pressed }) => [
              styles.action,
              pressed && !action.disabled && Platform.OS !== 'android' && styles.actionPressed,
              action.disabled && styles.actionDisabled,
            ]}
          >
            <Icon {...action.icon} size={20} variant={action.disabled ? 'muted' : 'inverse'} />
            {showLabels && action.label != null && (
              <Text style={[styles.label, labelColor]} numberOfLines={1}>
                {action.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: theme.metrics.spacingV.p4,
    paddingHorizontal: theme.metrics.spacing.p4,
    gap: theme.metrics.spacing.p4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: theme.colors.shadow.elevationSmall,
  },
  action: {
    alignItems: 'center',
    padding: theme.metrics.spacing.p8,
    borderRadius: 8,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionDisabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: theme.fonts.size.xxs,
    fontFamily: theme.fonts.medium,
    marginTop: 2,
  },
}));
