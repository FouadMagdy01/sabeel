import chroma from 'chroma-js';
import type { ThemeColors, ThemeConfig, Theme } from './types';

/**
 * Generates a complete theme from a base color.
 *
 * Design principles extracted from the hand-crafted Sabeel theme:
 *
 * LIGHT MODE:
 * - Text: Tailwind Slate scale (#0F172A → #94A3B8) for proven readability
 * - Backgrounds: Clean whites/near-whites with subtle brand tint in section
 * - Borders: Tailwind Slate borders (#E2E8F0, #F1F5F9, #CBD5E1)
 * - State: Universal colors (green/amber/red/blue) - same across all themes
 * - Brand: primary = base, secondary = very dark variant, tertiary = warm amber
 * - Overlays/shadows: base-tinted with appropriate alpha
 *
 * DARK MODE:
 * - Text: Tailwind Slate bright end (#F1F5F9 → #64748B)
 * - Backgrounds: Very dark base-tinted app bg + glass surfaces (rgba white)
 * - Borders: Glass edges (rgba white at varying opacity)
 * - State: Brighter variants of universal colors
 * - Brand: very bright primary, pastel secondary, gold tertiary
 * - Overlays: base-tinted dark overlays
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

/* ── Light theme ────────────────────────────────────────────────────── */

/**
 * Light theme generation.
 *
 * Uses proven Tailwind Slate scale for text/borders (hardcoded for contrast),
 * derives brand/overlay/gradient colors from base.
 *
 * Reference (hand-crafted Sabeel emerald #10B981):
 *   primary: #10B981, secondary: #064E3B, tertiary: #D97706
 *   primaryVariant: #059669, secondaryVariant: #065F46
 */
function generateLightTheme(base: chroma.Color): ThemeColors {
  // Brand: primary is the base (clamped for readability on white)
  const primary = base.luminance() > 0.3 ? base.luminance(0.2) : base;
  // Secondary: very dark version for headings (ref: #064E3B from #10B981)
  const secondary = base.darken(3).desaturate(0.2);
  // Primary variant: darker for hover/pressed (ref: #059669)
  const primaryVariant = base.darken(0.8).saturate(0.2);
  // Secondary variant: between primary and secondary (ref: #065F46)
  const secondaryVariant = base.darken(2.2).desaturate(0.1);
  // Tertiary: warm amber accent - universally harmonious (ref: #D97706)
  const tertiary = chroma('#D97706');

  // Section bg: very subtle tint of base (ref: #F0FDF4 for emerald)
  const sectionBg = chroma('#F0FDF4').mix(base.luminance(0.93), 0.4);

  return {
    mode: 'light',

    brand: {
      primary: primary.hex(),
      secondary: secondary.hex(),
      tertiary: tertiary.hex(),
      primaryVariant: primaryVariant.hex(),
      secondaryVariant: secondaryVariant.hex(),
    },

    // Clean whites - subtle brand tint only in section
    background: {
      app: '#F8FAF9',
      surface: '#FFFFFF',
      surfaceAlt: '#F1F5F4',
      section: sectionBg.hex(),
      elevated: '#FFFFFF',
      input: '#F1F5F9',
      disabled: '#E2E8F0',
      modal: '#FFFFFF',
    },

    // Tailwind Slate scale - proven contrast ratios
    text: {
      primary: '#0F172A', // ~15.4:1 on white
      secondary: '#334155', // ~9.7:1 on white
      tertiary: '#64748B', // ~5.0:1 on white
      muted: '#94A3B8', // ~2.8:1 on white (decorative)
      inverse: '#FFFFFF',
      accent: tertiary.hex(), // derived from base
      link: primary.hex(),
      linkHover: primaryVariant.hex(),
    },

    // Tailwind Slate borders - clean and neutral
    border: {
      default: '#E2E8F0',
      subtle: '#F1F5F9',
      strong: '#CBD5E1',
      focus: primary.hex(), // derived from base
      disabled: '#E2E8F0',
    },

    icon: {
      primary: primary.hex(),
      secondary: secondary.hex(),
      tertiary: '#94A3B8',
      muted: '#CBD5E1',
      inverse: '#FFFFFF',
      accent: tertiary.hex(),
    },

    // Universal state colors - consistent across all themes
    state: {
      success: '#10B981',
      successBg: '#E8F5E9',
      warning: '#F59E0B',
      warningBg: 'rgba(245, 158, 11, 0.12)',
      error: '#EF4444',
      errorBg: 'rgba(239, 68, 68, 0.12)',
      info: '#3B82F6',
      infoBg: 'rgba(59, 130, 246, 0.12)',
      disabled: '#CBD5E1',
    },

    // Overlays derived from primary brand color
    overlay: {
      modal: 'rgba(0, 0, 0, 0.5)',
      pressed: primary.alpha(0.12).css(),
      hover: primary.alpha(0.08).css(),
      focus: primary.alpha(0.15).css(),
      ripple: 'rgba(255, 255, 255, 0.25)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },

    // Gradients derived from brand colors
    gradient: {
      primary: [secondary.hex(), primary.hex()],
      secondary: [primary.hex(), primary.brighten(0.5).hex()],
      sacred: [
        base.luminance(0.88).desaturate(1.5).hex(),
        base.luminance(0.82).desaturate(1).hex(),
      ],
      success: ['#059669', '#34D399'],
      premium: [tertiary.darken(0.5).hex(), tertiary.brighten(0.3).hex()],
    },

    shadow: {
      color: 'rgba(0, 0, 0, 0.1)',
      elevation: 4,
      elevationSmall: 2,
      elevationMedium: 4,
      elevationLarge: 8,
    },
  };
}

/* ── Dark theme ─────────────────────────────────────────────────────── */

/**
 * Dark theme generation.
 *
 * Uses Tailwind Slate bright end for text (hardcoded for contrast),
 * glass surfaces (rgba white), derives brand/backgrounds from base.
 *
 * Reference (hand-crafted Sabeel emerald #10B981):
 *   primary: #19E65E, secondary: #A7F3D0, tertiary: #FBBF24
 *   appBg: #061612, section: #062A1A
 *   surfaces: rgba(255, 255, 255, 0.08/0.12/0.15)
 */
function generateDarkTheme(base: chroma.Color): ThemeColors {
  // Brand: very bright and saturated for dark backgrounds (ref: #19E65E)
  const primary = base.luminance(0.35).saturate(1.5);
  // Primary variant: softer (ref: #34D399)
  const primaryVariant = base.luminance(0.25).saturate(0.8);
  // Secondary: pastel for soft headings (ref: #A7F3D0)
  const secondary = base.luminance(0.75).desaturate(0.5);
  // Secondary variant: between primary and secondary (ref: #6EE7B7)
  const secondaryVariant = base.luminance(0.55).desaturate(0.3);
  // Tertiary: warm gold accent (ref: #FBBF24)
  const tertiary = chroma('#FBBF24');

  // Deep dark backgrounds tinted with base hue (ref: #061612, #062A1A, #0A2318)
  const appBg = base.luminance(0.01).desaturate(1.5);
  const sectionBg = base.luminance(0.02).desaturate(1);
  const modalBg = base.luminance(0.015).desaturate(1.2);

  return {
    mode: 'dark',

    brand: {
      primary: primary.hex(),
      secondary: secondary.hex(),
      tertiary: tertiary.hex(),
      primaryVariant: primaryVariant.hex(),
      secondaryVariant: secondaryVariant.hex(),
    },

    // Glass surfaces on deep dark base-tinted background
    background: {
      app: appBg.hex(),
      surface: 'rgba(255, 255, 255, 0.08)',
      surfaceAlt: 'rgba(255, 255, 255, 0.12)',
      section: sectionBg.hex(),
      elevated: 'rgba(255, 255, 255, 0.15)',
      input: 'rgba(255, 255, 255, 0.08)',
      disabled: 'rgba(255, 255, 255, 0.05)',
      modal: modalBg.hex(),
    },

    // Tailwind Slate bright end - proven readability on dark
    text: {
      primary: '#F1F5F9', // ~15.4:1 on near-black
      secondary: '#CBD5E1', // ~11.0:1
      tertiary: '#94A3B8', // ~6.8:1
      muted: '#64748B', // ~3.8:1 (decorative)
      inverse: appBg.hex(), // derived - for text on bright surfaces
      accent: tertiary.hex(),
      link: primary.hex(),
      linkHover: primaryVariant.hex(),
    },

    // Glass-effect borders
    border: {
      default: 'rgba(255, 255, 255, 0.12)',
      subtle: 'rgba(255, 255, 255, 0.06)',
      strong: 'rgba(255, 255, 255, 0.2)',
      focus: primary.hex(),
      disabled: 'rgba(255, 255, 255, 0.05)',
    },

    icon: {
      primary: primary.hex(),
      secondary: secondary.hex(),
      tertiary: '#64748B',
      muted: '#475569',
      inverse: appBg.hex(),
      accent: tertiary.hex(),
    },

    // Universal state colors - brighter for dark mode
    state: {
      success: 'rgba(25, 230, 94, 0.3)',
      successBg: 'rgba(23, 207, 54, 0.1)',
      warning: '#FBBF24',
      warningBg: 'rgba(251, 191, 36, 0.2)',
      error: '#F87171',
      errorBg: 'rgba(248, 113, 113, 0.2)',
      info: '#60A5FA',
      infoBg: 'rgba(96, 165, 250, 0.2)',
      disabled: '#475569',
    },

    // Overlays derived from primary brand color
    overlay: {
      modal: 'rgba(0, 0, 0, 0.7)',
      pressed: primary.alpha(0.15).css(),
      hover: primary.alpha(0.08).css(),
      focus: primary.alpha(0.2).css(),
      ripple: 'rgba(255, 255, 255, 0.2)',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },

    // Gradients derived from brand colors
    gradient: {
      primary: [sectionBg.hex(), primary.hex()],
      secondary: [primary.hex(), primaryVariant.hex()],
      sacred: [sectionBg.hex(), sectionBg.brighten(0.5).hex()],
      success: ['#059669', '#34D399'],
      premium: [tertiary.darken(0.8).hex(), tertiary.hex()],
    },

    shadow: {
      color: 'rgba(0, 0, 0, 0.5)',
      elevation: 6,
      elevationSmall: 2,
      elevationMedium: 6,
      elevationLarge: 12,
    },
  };
}

/**
 * Predefined Islamic Theme Presets
 */
export const THEME_PRESETS = {
  /**
   * Ocean - Deep Islamic blue-teal
   * Inspired by the blues of Ottoman Iznik tiles and mosque interiors
   */
  ocean: {
    light: generateTheme({
      baseColor: '#0891B2',
      mode: 'light',
      name: 'Ocean Light',
      description: 'Deep blue-teal inspired by Iznik tiles',
    }),
    dark: generateTheme({
      baseColor: '#0891B2',
      mode: 'dark',
      name: 'Ocean Dark',
      description: 'Deep ocean tones for night reading',
    }),
  },

  /**
   * Desert - Rich warm terracotta
   * Inspired by Arabian desert clay and Andalusian architecture
   */
  desert: {
    light: generateTheme({
      baseColor: '#C2703E',
      mode: 'light',
      name: 'Desert Light',
      description: 'Warm terracotta inspired by desert architecture',
    }),
    dark: generateTheme({
      baseColor: '#C2703E',
      mode: 'dark',
      name: 'Desert Dark',
      description: 'Desert night with warm earth tones',
    }),
  },

  /**
   * Sapphire - Vivid royal blue
   * Inspired by the night sky and lapis lazuli in Islamic art
   */
  sapphire: {
    light: generateTheme({
      baseColor: '#2563EB',
      mode: 'light',
      name: 'Sapphire Light',
      description: 'Vivid blue inspired by lapis lazuli',
    }),
    dark: generateTheme({
      baseColor: '#2563EB',
      mode: 'dark',
      name: 'Sapphire Dark',
      description: 'Night sky blue for peaceful reading',
    }),
  },

  /**
   * Rose - Warm rose-pink
   * Inspired by Persian rose gardens and Mughal miniature art
   */
  rose: {
    light: generateTheme({
      baseColor: '#E11D48',
      mode: 'light',
      name: 'Rose Light',
      description: 'Warm rose inspired by Persian gardens',
    }),
    dark: generateTheme({
      baseColor: '#E11D48',
      mode: 'dark',
      name: 'Rose Dark',
      description: 'Soft rose glow for night contemplation',
    }),
  },

  /**
   * Royal - Rich purple-indigo
   * Inspired by royal Islamic manuscripts and Topkapi Palace
   */
  royal: {
    light: generateTheme({
      baseColor: '#7C3AED',
      mode: 'light',
      name: 'Royal Light',
      description: 'Rich purple from Islamic manuscripts',
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
