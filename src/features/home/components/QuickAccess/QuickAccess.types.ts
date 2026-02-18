import type { ParseKeys } from 'i18next';
import type { IconFamilyName } from '../../types';

export interface QuickAccessItem {
  id: string;
  labelKey: ParseKeys;
  iconFamily: IconFamilyName;
  iconName: string;
}

export interface QuickAccessProps {
  items: QuickAccessItem[];
  onItemPress: (item: QuickAccessItem) => void;
}
