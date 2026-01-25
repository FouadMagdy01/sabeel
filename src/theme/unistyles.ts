import { StyleSheet } from 'react-native-unistyles';
import { getItem, STORAGE_KEYS } from '../utils/storage';
import { appThemes } from './config';
import { breakpoints } from './metrics';
// Unistyles settings for theme configuration
const settings = {
  initialTheme: () => {
    // Get preferred theme from MMKV storage
    const result = getItem<'light' | 'dark'>(STORAGE_KEYS.preferences.theme);

    // Return stored theme or default to "light"
    return result.success && result.data ? result.data : 'light';
  },
};

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings,
  breakpoints,
  themes: appThemes,
});
