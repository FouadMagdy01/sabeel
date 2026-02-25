import type { ThemePresetName } from '@/theme/config';

export interface ThemeSwatchPickerProps {
  selected: ThemePresetName;
  onSelect: (preset: ThemePresetName) => void;
}
