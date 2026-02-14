/**
 * Sabeel Theme System
 *
 * Main export file for the theme system.
 * Import everything you need from here.
 *
 * 🚀 NEW TO DESIGN?
 * Start with these guides in order:
 * 1. src/theme/CHEAT_SHEET.md     - The 5 most common patterns (30 sec)
 * 2. src/theme/QUICK_START.md     - Simple button/input patterns (2 min)
 * 3. src/theme/COMPONENT_GUIDE.md - Complete component reference
 * 4. src/theme/EXAMPLES.tsx       - Copy-paste ready components
 *
 * QUICK EXAMPLE:
 * ```tsx
 * import { useTheme } from '@/hooks/useTheme';
 *
 * function MyButton() {
 *   const { colors } = useTheme();
 *   return (
 *     <Pressable style={{ backgroundColor: colors.brand.primary }}>
 *       <Text style={{ color: colors.text.inverse }}>Click Me</Text>
 *     </Pressable>
 *   );
 * }
 * ```
 */

// Main theme configuration and presets
export {
  appThemes,
  PRESETS,
  THEME_PRESET_NAMES,
  THEME_METADATA,
  getThemePreset,
  getAllThemePresets,
  createCustomTheme,
  lightColors,
  darkColors,
} from './config';

// Theme generator utilities
export {
  THEME_PRESETS,
  generateTheme,
  generateCustomTheme,
  getPreset,
  getAllPresets,
} from './theme-generator';

// TypeScript types
export type {
  Theme,
  ThemeColors,
  ThemeConfig,
  ThemePreferences,
  ThemePreset,
  BrandColors,
  BackgroundColors,
  TextColors,
  BorderColors,
  IconColors,
  StateColors,
  OverlayColors,
  GradientColors,
  ShadowConfig,
} from './types';

export type { ThemePresetName } from './config';

// Metrics and fonts (for backward compatibility)
export { default as metrics, fontSize } from './metrics';
export { FONTS } from './fonts';
