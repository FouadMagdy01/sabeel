import darkColors from '@/theme/dark-theme';
import { FONTS } from './fonts';
import { lightColors } from './light-theme';
import metrics, { fontSize } from './metrics';
import type { Theme } from './types';
import { THEME_PRESETS, generateCustomTheme, getPreset, getAllPresets } from './theme-generator';

/**
 * Default Light Theme
 */
const lightTheme = {
  colors: {
    ...lightColors,
  },
  metrics: {
    ...metrics,
  },
  fonts: {
    ...FONTS,
    size: {
      ...fontSize,
    },
  },
};

/**
 * Default Dark Theme
 */
const darkTheme = {
  colors: {
    ...darkColors,
  },
  metrics: {
    ...metrics,
  },
  fonts: {
    ...FONTS,
    size: {
      ...fontSize,
    },
  },
};

/**
 * Default app themes (current implementation)
 */
export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

/**
 * All available predefined theme presets
 *
 * Five carefully crafted Islamic-inspired color schemes:
 * - Emerald: Traditional teal and emerald (default)
 * - Desert: Warm earth tones and golden sands
 * - Sapphire: Deep blues inspired by mosque domes
 * - Moonlight: Cool silver and white tones for night prayers
 * - Royal: Rich purple and gold from Islamic manuscripts
 *
 * Each preset includes both light and dark variants.
 *
 * @example
 * ```ts
 * // Use Emerald theme
 * const theme = PRESETS.emerald.light;
 *
 * // Use Desert dark theme
 * const darkDesert = PRESETS.desert.dark;
 * ```
 */
export const PRESETS = THEME_PRESETS;

/**
 * Helper function to get a specific preset theme
 *
 * @param preset - The preset name ('emerald', 'desert', 'sapphire', 'moonlight', 'royal')
 * @param mode - Theme mode ('light' or 'dark')
 * @returns Complete theme object
 *
 * @example
 * ```ts
 * const myTheme = getThemePreset('sapphire', 'dark');
 * ```
 */
export function getThemePreset(preset: keyof typeof THEME_PRESETS, mode: 'light' | 'dark'): Theme {
  return getPreset(preset, mode);
}

/**
 * Get all available theme presets as a flat array
 *
 * Useful for theme selection UI where you want to display all
 * available themes in a list or grid.
 *
 * @returns Array of all theme presets (10 themes total)
 *
 * @example
 * ```tsx
 * const ThemePicker = () => {
 *   const themes = getAllThemePresets();
 *
 *   return themes.map(theme => (
 *     <ThemeCard
 *       key={theme.id}
 *       name={theme.name}
 *       colors={theme.colors}
 *     />
 *   ));
 * };
 * ```
 */
export function getAllThemePresets() {
  return getAllPresets();
}

/**
 * Generate a custom theme from a user's favorite color
 *
 * This allows users to personalize the app with their own color preferences
 * while maintaining accessibility and design consistency.
 *
 * @param baseColor - Hex color code (e.g., '#FF5733')
 * @param mode - Theme mode ('light' or 'dark')
 * @param name - Optional theme name (defaults to 'Custom Theme')
 * @param description - Optional theme description
 * @returns Complete custom theme object
 *
 * @example
 * ```ts
 * // Create a custom pink theme
 * const pinkTheme = createCustomTheme('#E91E63', 'light', 'Pink Blossom');
 *
 * // Create a custom dark theme from user input
 * const userColor = colorPicker.getValue();
 * const customDark = createCustomTheme(userColor, 'dark', 'My Theme');
 * ```
 */
export function createCustomTheme(
  baseColor: string,
  mode: 'light' | 'dark',
  name?: string,
  description?: string
): Theme {
  return generateCustomTheme(baseColor, mode, name, description);
}

/**
 * Theme preset names for type safety
 */
export type ThemePresetName = keyof typeof THEME_PRESETS;

/**
 * All available theme preset names
 */
export const THEME_PRESET_NAMES: ThemePresetName[] = [
  'emerald',
  'desert',
  'sapphire',
  'moonlight',
  'royal',
];

/**
 * Theme metadata for UI display
 */
export const THEME_METADATA = {
  emerald: {
    name: 'Emerald',
    description: 'Traditional Islamic teal inspired by mosque architecture',
    icon: '🕌',
    baseColor: '#0FA18F',
  },
  desert: {
    name: 'Desert',
    description: 'Warm desert sands and golden tones',
    icon: '🏜️',
    baseColor: '#C9A66B',
  },
  sapphire: {
    name: 'Sapphire',
    description: 'Deep blue inspired by mosque domes',
    icon: '🔷',
    baseColor: '#2563EB',
  },
  moonlight: {
    name: 'Moonlight',
    description: 'Cool silver tones inspired by moonlight',
    icon: '🌙',
    baseColor: '#64748B',
  },
  royal: {
    name: 'Royal',
    description: 'Rich purple and gold from Islamic manuscripts',
    icon: '👑',
    baseColor: '#7C3AED',
  },
} as const;

/**
 * Export individual theme colors for backward compatibility
 */
export { lightColors } from './light-theme';
export { default as darkColors } from './dark-theme';

/**
 * Export theme types
 */
export type { Theme, ThemeColors, ThemeConfig, ThemePreferences } from './types';
