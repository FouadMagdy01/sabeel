import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/common/components/Typography';
import { styles } from './SettingsSection.styles';
import type { SettingsSectionProps } from './SettingsSection.types';

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View style={styles.container}>
      <Typography
        type="overline"
        size="xs"
        weight="semiBold"
        color="muted"
        uppercase
        style={styles.title}
      >
        {title}
      </Typography>
      <View style={styles.card}>{children}</View>
    </View>
  );
}
