import type { ReactNode } from 'react';
import type { ICON_FAMILIES } from '@/common/components/Icon/Icon.constants';

type IconFamilyName = keyof typeof ICON_FAMILIES;

export interface SettingsRowProps {
  icon?: string;
  iconFamily?: IconFamilyName;
  label: string;
  value?: string;
  rightElement?: ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  isLast?: boolean;
}
