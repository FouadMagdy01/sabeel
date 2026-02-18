import darkColors from '@/theme/dark-theme';
import { FONTS } from './fonts';
import { lightColors } from './light-theme';
import metrics, { fontSize } from './metrics';
import type { Theme, ThemeColors } from './types';
import { THEME_PRESETS, generateCustomTheme, getPreset, getAllPresets } from './theme-generator';

/**
 * Build an app theme object from colors
 */
function buildAppTheme(colors: ThemeColors) {
  return {
    colors,
    metrics: { ...metrics },
    fonts: { ...FONTS, size: { ...fontSize } },
  };
}

/**
 * Default app themes using the hand-crafted light/dark themes
 */
export const appThemes = {
  light: buildAppTheme(lightColors),
  dark: buildAppTheme(darkColors),
};

/**
 * All preset names including 'default' (the hand-crafted theme)
 */
export type ThemePresetName = 'default' | keyof typeof THEME_PRESETS;

/**
 * Composite theme name used internally by unistyles.
 * Format: `{preset}_{mode}` e.g. "default_light", "emerald_dark"
 */
export type CompositeThemeName = `${ThemePresetName}_${'light' | 'dark'}`;

/**
 * Build composite theme name from preset + mode
 */
export function compositeThemeName(
  preset: ThemePresetName,
  mode: 'light' | 'dark'
): CompositeThemeName {
  return `${preset}_${mode}`;
}

/**
 * Parse composite theme name back to preset + mode
 */
export function parseCompositeThemeName(name: string): {
  preset: ThemePresetName;
  mode: 'light' | 'dark';
} {
  const lastUnderscore = name.lastIndexOf('_');
  const mode = name.slice(lastUnderscore + 1) as 'light' | 'dark';
  const preset = name.slice(0, lastUnderscore) as ThemePresetName;
  return { preset, mode };
}

/**
 * Build ALL themes for registration with StyleSheet.configure().
 * Returns a flat map of composite names to theme objects.
 * This enables flicker-free switching via setTheme() instead of updateTheme().
 */
export function buildAllThemes() {
  const themes: Record<string, ReturnType<typeof buildAppTheme>> = {};

  for (const preset of THEME_PRESET_NAMES) {
    if (preset === 'default') {
      themes[compositeThemeName('default', 'light')] = appThemes.light;
      themes[compositeThemeName('default', 'dark')] = appThemes.dark;
    } else {
      const presetData = THEME_PRESETS[preset];
      themes[compositeThemeName(preset, 'light')] = buildAppTheme(presetData.light.colors);
      themes[compositeThemeName(preset, 'dark')] = buildAppTheme(presetData.dark.colors);
    }
  }

  return themes;
}

/**
 * All available predefined theme presets
 */
export const PRESETS = THEME_PRESETS;

/**
 * Helper function to get a specific preset theme
 */
export function getThemePreset(preset: keyof typeof THEME_PRESETS, mode: 'light' | 'dark'): Theme {
  return getPreset(preset, mode);
}

/**
 * Get all available theme presets as a flat array
 */
export function getAllThemePresets() {
  return getAllPresets();
}

/**
 * Generate a custom theme from a user's favorite color
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
 * All available theme preset names (default first)
 */
export const THEME_PRESET_NAMES: ThemePresetName[] = [
  'default',
  'ocean',
  'desert',
  'sapphire',
  'rose',
  'royal',
];

/**
 * Theme metadata for UI display (baseColor used for swatch preview)
 */
export const THEME_METADATA: Record<
  ThemePresetName,
  { name: string; description: string; baseColor: string }
> = {
  default: {
    name: 'Default',
    description: 'Hand-crafted Sabeel emerald theme',
    baseColor: '#10B981',
  },
  ocean: {
    name: 'Ocean',
    description: 'Deep blue-teal inspired by Iznik tiles',
    baseColor: '#0891B2',
  },
  desert: {
    name: 'Desert',
    description: 'Warm terracotta inspired by desert architecture',
    baseColor: '#C2703E',
  },
  sapphire: {
    name: 'Sapphire',
    description: 'Vivid blue inspired by lapis lazuli',
    baseColor: '#2563EB',
  },
  rose: {
    name: 'Rose',
    description: 'Warm rose inspired by Persian gardens',
    baseColor: '#E11D48',
  },
  royal: {
    name: 'Royal',
    description: 'Rich purple from Islamic manuscripts',
    baseColor: '#7C3AED',
  },
};

/**
 * Export individual theme colors for backward compatibility
 */
export { lightColors } from './light-theme';
export { default as darkColors } from './dark-theme';

/**
 * Export theme types
 */
export type { Theme, ThemeColors, ThemeConfig, ThemePreferences } from './types';
