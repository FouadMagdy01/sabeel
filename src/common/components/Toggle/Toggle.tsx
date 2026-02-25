import React from 'react';
import { Switch } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { ToggleProps } from './Toggle.types';

export function Toggle({ value, onValueChange, disabled = false }: ToggleProps) {
  const { theme } = useUnistyles();

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: theme.colors.border.default,
        true: theme.colors.brand.primary,
      }}
      ios_backgroundColor={theme.colors.border.default}
    />
  );
}
