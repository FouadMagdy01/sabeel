import { UnistylesRuntime } from 'react-native-unistyles';
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage';
import {
  compositeThemeName,
  parseCompositeThemeName,
  THEME_PRESET_NAMES,
  type ThemePresetName,
} from './config';

/**
 * Apply a theme preset at runtime.
 *
 * All themes are pre-registered in StyleSheet.configure(), so switching
 * is a single setTheme() call - no updateTheme(), no flicker.
 */
export function applyThemePreset(preset: ThemePresetName) {
  const mode = getCurrentMode();
  const target = compositeThemeName(preset, mode);
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[themeManager] setTheme:', target, '| current:', UnistylesRuntime.themeName);
  }
  UnistylesRuntime.setTheme(target);
  setItem(STORAGE_KEYS.preferences.themePreset, preset);
}

/**
 * Toggle dark mode on/off and persist the choice.
 */
export function toggleDarkMode(isDark: boolean) {
  const mode = isDark ? 'dark' : 'light';
  const preset = getCurrentPreset();
  const target = compositeThemeName(preset, mode);
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[themeManager] toggleDarkMode:', target, '| current:', UnistylesRuntime.themeName);
  }
  UnistylesRuntime.setTheme(target);
  setItem(STORAGE_KEYS.preferences.theme, mode);
}

/**
 * Get the current theme mode from storage.
 */
export function getCurrentMode(): 'light' | 'dark' {
  // Try to read from the current runtime theme name first
  const currentName = UnistylesRuntime.themeName;
  if (currentName && typeof currentName === 'string') {
    const { mode } = parseCompositeThemeName(currentName);
    return mode;
  }
  const result = getItem<string>(STORAGE_KEYS.preferences.theme);
  return result.success && result.data === 'dark' ? 'dark' : 'light';
}

/**
 * Get the current preset from storage, defaulting to 'default'.
 */
export function getCurrentPreset(): ThemePresetName {
  const result = getItem<string>(STORAGE_KEYS.preferences.themePreset);
  if (
    result.success &&
    result.data &&
    THEME_PRESET_NAMES.includes(result.data as ThemePresetName)
  ) {
    return result.data as ThemePresetName;
  }
  return 'default';
}

/**
 * Initialize theme from persisted preferences.
 * Since all themes are pre-registered and initialTheme is set in
 * StyleSheet.configure(), this is now a no-op kept for API compatibility.
 */
export function initializeTheme() {
  // Theme is initialized via StyleSheet.configure({ settings: { initialTheme } })
  // No runtime action needed.
}
