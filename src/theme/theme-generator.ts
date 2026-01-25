import chroma from 'chroma-js';
import type { ThemeColors, ThemeConfig, Theme } from './types';

/**
 * Generates a complete theme from a base color
 *
 * This function creates a comprehensive, accessible color system for both
 * light and dark modes, ensuring proper contrast ratios and visual harmony.
 *
 * @param config - Theme configuration with base color and mode
 * @returns Complete theme color palette
 */
export function generateTheme(config: ThemeConfig): Theme {
  const { baseColor, mode, name, description } = config;
  const base = chroma(baseColor);

  const colors: ThemeColors = mode === 'light' ? generateLightTheme(base) : generateDarkTheme(base);

  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    description,
    baseColor: base.hex(),
    mode,
    colors,
  };
}

/**
 * Generates light theme colors from base color
 */
function generateLightTheme(base: chroma.Color): ThemeColors {
  // Derive color families from base
  const primary = base.saturate(0.4).darken(0.3);
  const secondary = base.set('hsl.h', `+120`).saturate(0.3);
  const tertiary = base.darken(1.4);

  return {
    mode: 'light',

    brand: {
      primary: primary.hex(),
      secondary: secondary.hex(),
      tertiary: tertiary.hex(),
      primaryVariant: primary.darken(0.3).hex(),
      secondaryVariant: secondary.darken(0.3).hex(),
    },

    background: {
      app: base.brighten(4.2).desaturate(2.5).hex(),
      surface: '#FFFFFF',
      surfaceAlt: base.brighten(4).desaturate(2.8).hex(),
      section: base.brighten(3.8).desaturate(2.2).hex(),
      elevated: '#FFFFFF',
      input: base.brighten(4.4).desaturate(3).hex(),
      disabled: base.brighten(3.2).desaturate(2.8).alpha(0.6).hex(),
    },

    text: {
      primary: '#1A1A1A',
      secondary: '#4A4A4A',
      tertiary: '#6B6B6B',
      muted: '#9E9E9E',
      inverse: '#FFFFFF',
      accent: primary.darken(0.5).hex(),
      link: secondary.darken(0.4).hex(),
      linkHover: secondary.darken(0.8).hex(),
    },

    border: {
      default: base.desaturate(1.2).darken(0.4).alpha(0.5).hex(),
      subtle: base.brighten(2).desaturate(2).alpha(0.3).hex(),
      strong: base.darken(0.6).hex(),
      focus: secondary.hex(),
      disabled: base.brighten(2.5).desaturate(2.5).alpha(0.4).hex(),
    },

    icon: {
      primary: tertiary.hex(),
      secondary: base.darken(0.6).hex(),
      tertiary: base.darken(0.2).hex(),
      muted: '#9E9E9E',
      inverse: '#FFFFFF',
      accent: primary.hex(),
    },

    state: {
      success: '#10B981',
      successBg: chroma('#10B981').brighten(3).alpha(0.15).hex(),
      warning: '#F59E0B',
      warningBg: chroma('#F59E0B').brighten(3).alpha(0.15).hex(),
      error: '#EF4444',
      errorBg: chroma('#EF4444').brighten(3).alpha(0.15).hex(),
      info: secondary.hex(),
      infoBg: secondary.brighten(3).alpha(0.15).hex(),
      disabled: '#D1D5DB',
    },

    overlay: {
      modal: 'rgba(0, 0, 0, 0.5)',
      pressed: base.alpha(0.12).hex(),
      hover: base.alpha(0.08).hex(),
      focus: secondary.alpha(0.15).hex(),
      shadow: 'rgba(0, 0, 0, 0.15)',
    },

    component: {
      switchTrackOff: '#D1D5DB',
      switchTrackOn: primary.hex(),
      switchThumb: '#FFFFFF',
      checkboxBorder: '#9E9E9E',
      checkboxChecked: primary.hex(),
      radioBorder: '#9E9E9E',
      radioChecked: primary.hex(),
      sliderTrackInactive: '#E5E7EB',
      sliderTrackActive: primary.hex(),
      sliderThumb: '#FFFFFF',
      progressTrack: base.brighten(3).desaturate(2).hex(),
      progressFill: primary.hex(),
      tabBarBackground: '#FFFFFF',
      tabBarBorder: '#E5E7EB',
      badgeBackground: '#EF4444',
      badgeText: '#FFFFFF',
      chipBackground: base.brighten(3.5).desaturate(2).hex(),
      chipText: tertiary.hex(),
      divider: base.brighten(2.5).desaturate(2.2).hex(),
    },

    islamic: {
      prayerActive: secondary.hex(),
      prayerUpcoming: primary.hex(),
      prayerPassed: '#9E9E9E',
      quranText: '#1A1A1A',
      quranBackground: base.brighten(4.5).desaturate(3).hex(),
      verseHighlight: base.brighten(3).desaturate(1.8).alpha(0.25).hex(),
      verseNumber: primary.hex(),
      tasbihBackground: base.brighten(3.8).desaturate(2).hex(),
      tasbihText: tertiary.hex(),
      hadithBackground: base.set('hsl.h', '+30').brighten(4).desaturate(2.5).hex(),
      sacredTextAccent: primary.saturate(0.5).hex(),
      qiblaIndicator: secondary.saturate(0.6).hex(),
      hijriDate: primary.darken(0.3).hex(),
    },

    gradient: {
      primary: [primary.hex(), primary.brighten(0.8).hex()],
      secondary: [secondary.hex(), secondary.brighten(0.8).hex()],
      sacred: [tertiary.hex(), base.darken(0.8).hex()],
      success: ['#10B981', '#34D399'],
      premium: ['#8B5CF6', '#A78BFA'],
    },

    shadow: {
      color: 'rgba(0, 0, 0, 0.15)',
      elevation: 8,
      elevationSmall: 2,
      elevationMedium: 8,
      elevationLarge: 16,
    },
  };
}

/**
 * Generates dark theme colors from base color
 */
function generateDarkTheme(base: chroma.Color): ThemeColors {
  // Derive color families - brighter variants for dark mode
  const primary = base.brighten(1).saturate(0.4);
  const secondary = base.set('hsl.h', `+120`).brighten(0.8).saturate(0.3);
  const tertiary = base.darken(0.6);

  return {
    mode: 'dark',

    brand: {
      primary: primary.hex(),
      secondary: secondary.hex(),
      tertiary: tertiary.hex(),
      primaryVariant: primary.brighten(0.4).hex(),
      secondaryVariant: secondary.brighten(0.4).hex(),
    },

    background: {
      app: base.darken(4.2).desaturate(1.5).hex(),
      surface: base.darken(3.5).desaturate(1.6).hex(),
      surfaceAlt: base.darken(3).desaturate(1.4).hex(),
      section: base.darken(3.8).desaturate(1.7).hex(),
      elevated: base.darken(2.8).desaturate(1.3).hex(),
      input: base.darken(3.2).desaturate(1.5).hex(),
      disabled: base.darken(3).desaturate(2).alpha(0.5).hex(),
    },

    text: {
      primary: '#F5F5F5',
      secondary: '#D4D4D4',
      tertiary: '#A3A3A3',
      muted: '#737373',
      inverse: '#1A1A1A',
      accent: primary.brighten(0.5).hex(),
      link: secondary.brighten(0.3).hex(),
      linkHover: secondary.brighten(0.6).hex(),
    },

    border: {
      default: base.desaturate(1).brighten(0.2).alpha(0.4).hex(),
      subtle: base.darken(2).desaturate(1.5).alpha(0.3).hex(),
      strong: base.brighten(0.4).hex(),
      focus: secondary.hex(),
      disabled: base.darken(2.5).desaturate(2).alpha(0.3).hex(),
    },

    icon: {
      primary: primary.hex(),
      secondary: secondary.desaturate(0.3).hex(),
      tertiary: base.brighten(0.5).hex(),
      muted: '#737373',
      inverse: '#1A1A1A',
      accent: primary.saturate(0.4).hex(),
    },

    state: {
      success: '#34D399',
      successBg: chroma('#34D399').darken(3).alpha(0.2).hex(),
      warning: '#FBBF24',
      warningBg: chroma('#FBBF24').darken(3).alpha(0.2).hex(),
      error: '#F87171',
      errorBg: chroma('#F87171').darken(3).alpha(0.2).hex(),
      info: secondary.hex(),
      infoBg: secondary.darken(3).alpha(0.2).hex(),
      disabled: '#3F3F46',
    },

    overlay: {
      modal: 'rgba(0, 0, 0, 0.7)',
      pressed: base.alpha(0.2).hex(),
      hover: base.alpha(0.12).hex(),
      focus: secondary.alpha(0.2).hex(),
      shadow: 'rgba(0, 0, 0, 0.6)',
    },

    component: {
      switchTrackOff: '#3F3F46',
      switchTrackOn: primary.hex(),
      switchThumb: '#FFFFFF',
      checkboxBorder: '#737373',
      checkboxChecked: primary.hex(),
      radioBorder: '#737373',
      radioChecked: primary.hex(),
      sliderTrackInactive: '#3F3F46',
      sliderTrackActive: primary.hex(),
      sliderThumb: '#FFFFFF',
      progressTrack: base.darken(3).desaturate(1.8).hex(),
      progressFill: primary.hex(),
      tabBarBackground: base.darken(3.5).desaturate(1.6).hex(),
      tabBarBorder: base.darken(2.5).desaturate(1.5).hex(),
      badgeBackground: '#EF4444',
      badgeText: '#FFFFFF',
      chipBackground: base.darken(2.5).desaturate(1.5).hex(),
      chipText: primary.hex(),
      divider: base.darken(2.8).desaturate(1.6).hex(),
    },

    islamic: {
      prayerActive: secondary.hex(),
      prayerUpcoming: primary.hex(),
      prayerPassed: '#737373',
      quranText: '#F5F5F5',
      quranBackground: base.darken(3.8).desaturate(1.8).hex(),
      verseHighlight: base.darken(2.5).desaturate(1.2).alpha(0.3).hex(),
      verseNumber: primary.hex(),
      tasbihBackground: base.darken(3.2).desaturate(1.6).hex(),
      tasbihText: primary.hex(),
      hadithBackground: base.set('hsl.h', '+30').darken(3.5).desaturate(1.5).hex(),
      sacredTextAccent: primary.saturate(0.6).brighten(0.3).hex(),
      qiblaIndicator: secondary.saturate(0.6).hex(),
      hijriDate: primary.hex(),
    },

    gradient: {
      primary: [primary.darken(0.4).hex(), primary.brighten(0.6).hex()],
      secondary: [secondary.darken(0.4).hex(), secondary.brighten(0.6).hex()],
      sacred: [tertiary.hex(), base.darken(2).hex()],
      success: ['#059669', '#34D399'],
      premium: ['#7C3AED', '#A78BFA'],
    },

    shadow: {
      color: 'rgba(0, 0, 0, 0.6)',
      elevation: 10,
      elevationSmall: 3,
      elevationMedium: 10,
      elevationLarge: 20,
    },
  };
}

/**
 * Predefined Islamic Theme Presets
 *
 * Five carefully crafted color schemes inspired by Islamic art, architecture,
 * and natural elements mentioned in Islamic tradition.
 */
export const THEME_PRESETS = {
  /**
   * Emerald - Traditional Islamic teal and emerald
   * Inspired by traditional Islamic architecture and mosque domes
   */
  emerald: {
    light: generateTheme({
      baseColor: '#0FA18F',
      mode: 'light',
      name: 'Emerald Light',
      description: 'Traditional Islamic teal inspired by mosque architecture',
    }),
    dark: generateTheme({
      baseColor: '#0FA18F',
      mode: 'dark',
      name: 'Emerald Dark',
      description: 'Traditional Islamic teal for night reading',
    }),
  },

  /**
   * Desert - Warm earth tones and desert sand
   * Inspired by the deserts of Arabia and traditional Islamic calligraphy
   */
  desert: {
    light: generateTheme({
      baseColor: '#C9A66B',
      mode: 'light',
      name: 'Desert Light',
      description: 'Warm desert sands and golden tones',
    }),
    dark: generateTheme({
      baseColor: '#C9A66B',
      mode: 'dark',
      name: 'Desert Dark',
      description: 'Desert night with warm earth tones',
    }),
  },

  /**
   * Sapphire - Deep blue inspired by mosque domes and night sky
   * Reflects the depth of Islamic scholarship and contemplation
   */
  sapphire: {
    light: generateTheme({
      baseColor: '#2563EB',
      mode: 'light',
      name: 'Sapphire Light',
      description: 'Deep blue inspired by mosque domes',
    }),
    dark: generateTheme({
      baseColor: '#2563EB',
      mode: 'dark',
      name: 'Sapphire Dark',
      description: 'Night sky blue for peaceful reading',
    }),
  },

  /**
   * Moonlight - Cool silver and white tones
   * Inspired by the Islamic lunar calendar and night prayers
   */
  moonlight: {
    light: generateTheme({
      baseColor: '#64748B',
      mode: 'light',
      name: 'Moonlight Light',
      description: 'Cool silver tones inspired by moonlight',
    }),
    dark: generateTheme({
      baseColor: '#64748B',
      mode: 'dark',
      name: 'Moonlight Dark',
      description: 'Gentle moonlight for night contemplation',
    }),
  },

  /**
   * Royal - Rich purple and gold
   * Inspired by royal Islamic manuscripts and traditional Islamic art
   */
  royal: {
    light: generateTheme({
      baseColor: '#7C3AED',
      mode: 'light',
      name: 'Royal Light',
      description: 'Rich purple and gold from Islamic manuscripts',
    }),
    dark: generateTheme({
      baseColor: '#7C3AED',
      mode: 'dark',
      name: 'Royal Dark',
      description: 'Royal elegance for night reading',
    }),
  },
} as const;

/**
 * Get all available theme presets
 */
export function getAllPresets() {
  return Object.entries(THEME_PRESETS).flatMap(([key, themes]) => [
    { ...themes.light, preset: key },
    { ...themes.dark, preset: key },
  ]);
}

/**
 * Get a specific preset theme
 */
export function getPreset(preset: keyof typeof THEME_PRESETS, mode: 'light' | 'dark') {
  return THEME_PRESETS[preset][mode];
}

/**
 * Generate a custom theme from user's favorite color
 *
 * @example
 * ```ts
 * const myTheme = generateCustomTheme('#FF5733', 'light', 'My Custom Theme');
 * ```
 */
export function generateCustomTheme(
  baseColor: string,
  mode: 'light' | 'dark',
  name: string = 'Custom Theme',
  description?: string
): Theme {
  return generateTheme({
    baseColor,
    mode,
    name,
    description: description ?? `Custom ${mode} theme based on ${baseColor}`,
  });
}
