/**
 * Sabeel Theme System - Type Definitions
 *
 * Comprehensive design system for an Islamic app with support for multiple themes,
 * color customization, and accessibility considerations.
 */

/**
 * Brand Colors - Core identity colors of the app
 */
export interface BrandColors {
  /**
   * Primary brand color
   * @usage Main CTAs, primary buttons, active states, key highlights
   * @examples "Pray Now" button, active tab indicator, selected prayer time
   */
  primary: string;

  /**
   * Secondary brand color
   * @usage Secondary actions, navigation icons, links, supporting elements
   * @examples Navigation bar icons, text links, secondary buttons
   */
  secondary: string;

  /**
   * Tertiary brand color
   * @usage Subtle accents, tertiary actions, less prominent UI elements
   * @examples Helper icons, subtle badges, tertiary buttons
   */
  tertiary: string;

  /**
   * Primary variant - lighter/darker shade of primary
   * @usage Hover states, pressed states, primary button variants
   * @examples Primary button hover state, selected card background
   */
  primaryVariant: string;

  /**
   * Secondary variant - lighter/darker shade of secondary
   * @usage Secondary element hover states, alternative secondary actions
   * @examples Secondary button hover, alternative navigation highlight
   */
  secondaryVariant: string;
}

/**
 * Background Colors - Surface and layout backgrounds
 */
export interface BackgroundColors {
  /**
   * Main app background
   * @usage Root background color for the entire app
   * @examples Screen background, main container background
   */
  app: string;

  /**
   * Primary surface background
   * @usage Cards, sheets, elevated components
   * @examples Prayer time cards, Quran reader card, bottom sheets
   */
  surface: string;

  /**
   * Alternative surface background
   * @usage Nested surfaces, alternative cards, dialogs
   * @examples Modal backgrounds, nested cards, elevated dialogs
   */
  surfaceAlt: string;

  /**
   * Section background
   * @usage Grouped content sections, list backgrounds
   * @examples Settings sections, grouped prayer times, list containers
   */
  section: string;

  /**
   * Elevated surface background
   * @usage Floating action buttons, tooltips, elevated menus
   * @examples FAB background, dropdown menus, popovers
   */
  elevated: string;

  /**
   * Input field background
   * @usage Text inputs, search bars, editable fields
   * @examples Search input, form fields, text areas
   */
  input: string;

  /**
   * Disabled background
   * @usage Disabled buttons, inactive elements
   * @examples Disabled button background, inactive toggle background
   */
  disabled: string;

  /**
   * Modal background
   * @usage Modal dialogs, bottom sheets, popovers
   * @examples Date picker modal, select bottom sheet, dialog backgrounds
   */
  modal: string;
}

/**
 * Text Colors - All typography colors
 */
export interface TextColors {
  /**
   * Primary text color
   * @usage Main readable content, body text, primary labels
   * @examples Quran text, article content, main headings
   */
  primary: string;

  /**
   * Secondary text color
   * @usage Subheadings, secondary labels, supporting text
   * @examples Card subtitles, section descriptions, helper labels
   */
  secondary: string;

  /**
   * Tertiary text color
   * @usage Tertiary information, timestamps, metadata
   * @examples Post timestamps, verse numbers, metadata labels
   */
  tertiary: string;

  /**
   * Muted text color
   * @usage Placeholder text, disabled text, very low priority information
   * @examples Input placeholders, disabled labels, footnotes
   */
  muted: string;

  /**
   * Inverse text color
   * @usage Text on dark/colored backgrounds
   * @examples Text on primary buttons, text on dark cards, overlay text
   */
  inverse: string;

  /**
   * Accent text color
   * @usage Highlighted text, emphasized content, special keywords
   * @examples Allah (SWT), Prophet names, sacred terms, badges
   */
  accent: string;

  /**
   * Link text color
   * @usage Clickable links, interactive text
   * @examples Hyperlinks, "Read more" links, navigation links
   */
  link: string;

  /**
   * Link hover color
   * @usage Link hover and active states
   * @examples Link hover effect, pressed link state
   */
  linkHover: string;
}

/**
 * Border Colors - Outlines, dividers, and separators
 */
export interface BorderColors {
  /**
   * Default border color
   * @usage Standard borders for inputs, cards, containers
   * @examples Input borders, card outlines, container borders
   */
  default: string;

  /**
   * Subtle border color
   * @usage Light dividers, subtle separators
   * @examples List dividers, section separators, subtle card borders
   */
  subtle: string;

  /**
   * Strong border color
   * @usage Emphasized borders, important separators
   * @examples Selected card border, important section dividers
   */
  strong: string;

  /**
   * Focus border color
   * @usage Focused input states, keyboard navigation indicators
   * @examples Focused input ring, selected button outline, active navigation
   */
  focus: string;

  /**
   * Disabled border color
   * @usage Borders for disabled elements
   * @examples Disabled input border, inactive button border
   */
  disabled: string;
}

/**
 * Icon Colors - All icon tints and fills
 */
export interface IconColors {
  /**
   * Primary icon color
   * @usage Main interactive icons, primary navigation
   * @examples Tab bar icons, primary action icons, main navigation icons
   */
  primary: string;

  /**
   * Secondary icon color
   * @usage Supporting icons, secondary actions
   * @examples Utility icons, secondary action icons, helper icons
   */
  secondary: string;

  /**
   * Tertiary icon color
   * @usage Subtle icons, decorative elements
   * @examples Decorative icons, subtle indicators, low-priority icons
   */
  tertiary: string;

  /**
   * Muted icon color
   * @usage Disabled icons, inactive states
   * @examples Disabled action icons, inactive navigation icons
   */
  muted: string;

  /**
   * Inverse icon color
   * @usage Icons on dark/colored backgrounds
   * @examples Icons on primary buttons, icons on dark surfaces
   */
  inverse: string;

  /**
   * Accent icon color
   * @usage Special attention icons, featured elements
   * @examples Featured prayer icon, special badge icons, highlighted actions
   */
  accent: string;
}

/**
 * State Colors - Feedback and status indicators
 */
export interface StateColors {
  /**
   * Success state color
   * @usage Success messages, completed actions, positive feedback
   * @examples "Prayer completed" badge, successful form submission, checkmarks
   */
  success: string;

  /**
   * Success background
   * @usage Background for success messages and indicators
   * @examples Success notification background, completed task background
   */
  successBg: string;

  /**
   * Warning state color
   * @usage Warning messages, caution indicators, alerts
   * @examples Low battery warning, approaching prayer time, confirmations
   */
  warning: string;

  /**
   * Warning background
   * @usage Background for warning messages
   * @examples Warning notification background, caution banner
   */
  warningBg: string;

  /**
   * Error state color
   * @usage Error messages, validation errors, critical alerts
   * @examples Form validation errors, failed actions, error notifications
   */
  error: string;

  /**
   * Error background
   * @usage Background for error messages
   * @examples Error notification background, validation error background
   */
  errorBg: string;

  /**
   * Info state color
   * @usage Informational messages, neutral notifications, hints
   * @examples Tooltips, info banners, helpful hints, educational content
   */
  info: string;

  /**
   * Info background
   * @usage Background for info messages
   * @examples Info notification background, hint box background
   */
  infoBg: string;

  /**
   * Disabled state color
   * @usage Disabled elements, inactive states
   * @examples Disabled button text, inactive toggles, unavailable options
   */
  disabled: string;
}

/**
 * Overlay Colors - Modal overlays, shadows, and layers
 */
export interface OverlayColors {
  /**
   * Modal backdrop overlay
   * @usage Semi-transparent overlay behind modals and dialogs
   * @examples Modal backdrop, drawer overlay, dialog dimming
   */
  modal: string;

  /**
   * Press feedback overlay
   * @usage Touch/press ripple effects, interactive feedback
   * @examples Button press effect, list item press, touchable feedback
   */
  pressed: string;

  /**
   * Hover feedback overlay
   * @usage Hover state overlay (for web/desktop)
   * @examples Card hover effect, button hover, interactive element hover
   */
  hover: string;

  /**
   * Focus overlay
   * @usage Keyboard focus indicator overlay
   * @examples Focus ring, keyboard navigation highlight
   */
  focus: string;

  /**
   * Ripple effect overlay for contained buttons
   * @usage Android ripple effect on colored/contained button backgrounds
   * @examples Ripple on primary button, ripple on success button
   */
  ripple: string;

  /**
   * Shadow color
   * @usage Drop shadows, elevation shadows
   * @examples Card shadow, button shadow, elevated surface shadow
   */
  shadow: string;
}

/**
 * Gradient Colors - Multi-color gradients for special UI elements
 */
export interface GradientColors {
  /**
   * Primary gradient
   * @usage Main brand gradients, hero sections
   * @examples Primary button gradient, header gradient, featured cards
   */
  primary: [string, string];

  /**
   * Secondary gradient
   * @usage Supporting gradients, alternative styling
   * @examples Secondary cards, alternative headers
   */
  secondary: [string, string];

  /**
   * Sacred/Spiritual gradient
   * @usage Quran headers, prayer time cards, spiritual content
   * @examples Quran header, prayer card gradient, sacred section background
   */
  sacred: [string, string];

  /**
   * Success gradient
   * @usage Success states, achievements, completions
   * @examples Completion badges, success notifications
   */
  success: [string, string];

  /**
   * Premium/Featured gradient
   * @usage Premium features, special content
   * @examples Premium badges, featured content cards
   */
  premium: [string, string];
}

/**
 * Shadow Configuration
 */
export interface ShadowConfig {
  /**
   * Shadow color (typically semi-transparent black)
   */
  color: string;

  /**
   * Default elevation level (0-24)
   * @usage Standard shadow depth for elevated surfaces
   */
  elevation: number;

  /**
   * Small shadow elevation
   * @usage Subtle elevation for slight raise
   */
  elevationSmall: number;

  /**
   * Medium shadow elevation
   * @usage Medium elevation for cards and surfaces
   */
  elevationMedium: number;

  /**
   * Large shadow elevation
   * @usage High elevation for modals and important elements
   */
  elevationLarge: number;
}

/**
 * Complete Theme Color Palette
 */
export interface ThemeColors {
  mode: 'light' | 'dark';
  brand: BrandColors;
  background: BackgroundColors;
  text: TextColors;
  border: BorderColors;
  icon: IconColors;
  state: StateColors;
  overlay: OverlayColors;
  gradient: GradientColors;
  shadow: ShadowConfig;
}

/**
 * Theme Configuration for the Generator
 */
export interface ThemeConfig {
  /**
   * Base color to generate theme from (hex color)
   */
  baseColor: string;

  /**
   * Theme mode (light or dark)
   */
  mode: 'light' | 'dark';

  /**
   * Theme name/identifier
   */
  name: string;

  /**
   * Theme description
   */
  description?: string;
}

/**
 * Complete Theme with metadata
 */
export interface Theme {
  id: string;
  name: string;
  description?: string;
  baseColor: string;
  mode: 'light' | 'dark';
  colors: ThemeColors;
}

/**
 * Predefined Theme Presets
 */
export type ThemePreset =
  | 'ocean' // Deep blue-teal inspired by Iznik tiles
  | 'desert' // Warm terracotta and earth tones
  | 'sapphire' // Vivid blue inspired by lapis lazuli
  | 'rose' // Warm rose inspired by Persian gardens
  | 'royal'; // Rich purple and gold

/**
 * User Theme Preferences
 */
export interface ThemePreferences {
  /**
   * Selected theme ID or preset name
   */
  theme: string;

  /**
   * Automatically switch between light/dark based on time or system
   */
  autoSwitch: boolean;

  /**
   * Use system color scheme preference
   */
  useSystemTheme: boolean;

  /**
   * Custom user-created themes
   */
  customThemes: Theme[];
}
