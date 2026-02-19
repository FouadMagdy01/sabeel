import React from 'react';
import { Platform, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Icon } from '@/common/components/Icon';
import type { IconProps } from '@/common/components/Icon';
import { UniPressable } from '@/common/components/themed';

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
  return (
    <View style={[styles.container, style]}>
      {actions.map((action) => (
        <UniPressable
          key={action.key}
          onPress={action.onPress}
          disabled={action.disabled}
          uniProps={
            action.disabled
              ? undefined
              : (theme) => ({
                  android_ripple: { color: theme.colors.overlay.ripple, borderless: true },
                })
          }
          style={({ pressed }) => [
            styles.action,
            pressed && !action.disabled && Platform.OS !== 'android' && styles.actionPressed,
            action.disabled && styles.actionDisabled,
          ]}
        >
          <Icon {...action.icon} size={20} variant={action.disabled ? 'muted' : 'inverse'} />
          {showLabels && action.label != null && (
            <Text style={styles.label} numberOfLines={1}>
              {action.label}
            </Text>
          )}
        </UniPressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: theme.colors.brand.secondary,
    shadowColor: theme.colors.shadow.color,
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
    color: theme.colors.text.inverse,
    marginTop: 2,
  },
}));
