import type { ThemeColors } from './types';

/**
 * Sabeel Default Dark Theme
 *
 * A comprehensive dark theme optimized for night reading, prayers, and
 * reduced eye strain. Uses deep teal and warm gold accents inspired by
 * traditional Islamic art and night contemplation.
 *
 * Color Philosophy:
 * - Primary: Bright gold (#C9A66B) - warmth in darkness
 * - Secondary: Luminous teal (#3FB6A5) - spiritual light
 * - Tertiary: Deep ocean (#0B6B61) - depth and peace
 */
/**
 * Sabeel Dark Theme Colors (Active)
 *
 * Deep dark emerald palette with bright green and gold accents.
 * Optimized for night reading, prayers, and reduced eye strain.
 *
 * Color Philosophy:
 * - Primary: Bright green (#19E65E) - vibrant in darkness
 * - Secondary: Light emerald (#A7F3D0) - soft readable accents
 * - Tertiary: Gold accent (#FBBF24) - warm achievement glow
 */
export const darkColors: ThemeColors = {
  mode: 'dark',

  brand: {
    /**
     * Primary brand color - Bright green
     * @usage Main CTAs, primary buttons, active tabs, key highlights
     * @examples "Pray Now" button, active tab indicator, selected prayer time
     */
    primary: '#19E65E',

    /**
     * Secondary brand color - Light emerald
     * @usage Secondary actions, readable headings on dark backgrounds
     * @examples Section headings, greeting text, prayer card text
     */
    secondary: '#A7F3D0',

    /**
     * Tertiary brand color - Gold accent
     * @usage Achievement icons, streaks, gold accents, special highlights
     * @examples Streak fire icon, points star, best streak medal
     */
    tertiary: '#FBBF24',

    /**
     * Primary variant - Softer green
     * @usage Hover states, pressed states, primary button variants
     * @examples Primary button hover state, selected card background
     */
    primaryVariant: '#34D399',

    /**
     * Secondary variant - Brighter emerald
     * @usage Secondary element hover states, alternative secondary actions
     * @examples Secondary button hover, alternative navigation highlight
     */
    secondaryVariant: '#6EE7B7',
  },

  background: {
    /**
     * Main app background - Very dark emerald
     * @usage Root background color for the entire app
     * @examples Screen background, main container background
     */
    app: '#061612',

    /**
     * Primary surface background - Glass effect
     * @usage Cards, sheets, elevated components
     * @examples Stats card, prayer cards, daily todo cards, bottom sheets
     */
    surface: 'rgba(255, 255, 255, 0.08)',

    /**
     * Alternative surface background - Slightly brighter glass
     * @usage Nested surfaces, alternative cards, bento card backgrounds
     * @examples Bento grid cards, inactive toggles, subtle backgrounds
     */
    surfaceAlt: 'rgba(255, 255, 255, 0.12)',

    /**
     * Section background - Dark emerald card
     * @usage Grouped content sections, emerald-tinted backgrounds
     * @examples Prayer card background, sacred section backgrounds
     */
    section: '#062A1A',

    /**
     * Elevated surface background - Brighter glass
     * @usage Floating action buttons, tooltips, elevated menus
     * @examples FAB background, dropdown menus, popovers
     */
    elevated: 'rgba(255, 255, 255, 0.15)',

    /**
     * Input field background - Glass effect
     * @usage Text inputs, search bars, editable fields
     * @examples Search input, form fields, text areas
     */
    input: 'rgba(255, 255, 255, 0.08)',

    /**
     * Disabled background - Very dim glass
     * @usage Disabled buttons, inactive elements
     * @examples Disabled button background, inactive toggle background
     */
    disabled: 'rgba(255, 255, 255, 0.05)',

    /**
     * Modal background - Solid dark emerald
     * @usage Modal dialogs, bottom sheets, popovers
     * @examples Date picker modal, select bottom sheet, dialog backgrounds
     */
    modal: '#0A2318',
  },

  text: {
    /**
     * Primary text color - Off-white
     * @usage Main readable content, body text, primary labels
     * @examples Prayer names, card values, main headings
     */
    primary: '#F1F5F9',

    /**
     * Secondary text color - Light slate
     * @usage Subheadings, secondary labels, supporting text
     * @examples Card subtitles, section descriptions, card titles
     */
    secondary: '#CBD5E1',

    /**
     * Tertiary text color - Medium slate
     * @usage Tertiary information, timestamps, metadata
     * @examples Hijri date, stat labels, section headers
     */
    tertiary: '#94A3B8',

    /**
     * Muted text color - Dim slate
     * @usage Placeholder text, disabled text, very low priority information
     * @examples Input placeholders, disabled labels, upcoming prayer labels
     */
    muted: '#64748B',

    /**
     * Inverse text color - Very dark
     * @usage Text on light/colored backgrounds
     * @examples Text on gold buttons, text on light cards
     */
    inverse: '#061612',

    /**
     * Accent text color - Gold
     * @usage Highlighted text, emphasized content, special labels
     * @examples "Verse of the Day" label, streak values, gold accents
     */
    accent: '#FBBF24',

    /**
     * Link text color - Bright green
     * @usage Clickable links, interactive text
     * @examples Hyperlinks, "Read more" links, navigation links
     */
    link: '#19E65E',

    /**
     * Link hover color - Softer green
     * @usage Link hover and active states
     * @examples Link hover effect, pressed link state
     */
    linkHover: '#34D399',
  },

  border: {
    /**
     * Default border color - Subtle glass edge
     * @usage Standard borders for cards, containers
     * @examples Card borders, glass card outline
     */
    default: 'rgba(255, 255, 255, 0.12)',

    /**
     * Subtle border color - Very faint glass edge
     * @usage Light dividers, subtle separators
     * @examples Stat dividers, section separators
     */
    subtle: 'rgba(255, 255, 255, 0.06)',

    /**
     * Strong border color - Visible glass edge
     * @usage Emphasized borders, important separators
     * @examples Selected card border, important section dividers
     */
    strong: 'rgba(255, 255, 255, 0.2)',

    /**
     * Focus border color - Bright green
     * @usage Focused input states, keyboard navigation indicators
     * @examples Focused input ring, selected button outline
     */
    focus: '#19E65E',

    /**
     * Disabled border color - Very faint
     * @usage Borders for disabled elements
     * @examples Disabled input border, inactive button border
     */
    disabled: 'rgba(255, 255, 255, 0.05)',
  },

  icon: {
    /**
     * Primary icon color - Bright green (brand)
     * @usage Main interactive icons, primary navigation, quick access
     * @examples Tab bar active icons, primary action icons, feature icons
     */
    primary: '#19E65E',

    /**
     * Secondary icon color - Light emerald (brand secondary)
     * @usage Supporting icons, secondary actions, section icons
     * @examples Utility icons, secondary action icons, card header icons
     */
    secondary: '#A7F3D0',

    /**
     * Tertiary icon color - Medium slate
     * @usage Subtle icons, decorative elements
     * @examples Decorative icons, subtle indicators
     */
    tertiary: '#64748B',

    /**
     * Muted icon color - Dark slate
     * @usage Disabled icons, inactive states
     * @examples Disabled action icons, inactive navigation icons
     */
    muted: '#475569',

    /**
     * Inverse icon color - Very dark
     * @usage Icons on light/colored backgrounds
     * @examples Icons on gold buttons, icons on light surfaces
     */
    inverse: '#061612',

    /**
     * Accent icon color - Gold
     * @usage Achievement icons, streak indicators, gold highlights
     * @examples Fire icon, stars icon, military tech icon
     */
    accent: '#FBBF24',
  },

  state: {
    /**
     * Success state color - Bright green
     * @usage Success messages, completed actions, positive feedback
     * @examples Completed prayer check, completed random act badge
     */
    success: 'rgba(25, 230, 94, 0.3)',

    /**
     * Success background - Dark green tint
     * @usage Background for success/completed states
     * @examples Completed bento card background
     */
    successBg: 'rgba(23, 207, 54, 0.1)',

    /**
     * Warning state color - Bright amber
     * @usage Warning messages, caution indicators
     * @examples Approaching prayer time
     */
    warning: '#FBBF24',

    /**
     * Warning background - Dark amber tint
     * @usage Background for warning messages
     * @examples Warning notification background
     */
    warningBg: 'rgba(251, 191, 36, 0.2)',

    /**
     * Error state color - Bright red
     * @usage Error messages, validation errors
     * @examples Form validation errors
     */
    error: '#F87171',

    /**
     * Error background - Dark red tint
     * @usage Background for error messages
     * @examples Error notification background
     */
    errorBg: 'rgba(248, 113, 113, 0.2)',

    /**
     * Info state color - Bright blue
     * @usage Informational messages, azkar progress indicator
     * @examples Azkar progress ring color, info banners
     */
    info: '#60A5FA',

    /**
     * Info background - Dark blue tint
     * @usage Background for info messages
     * @examples Info notification background
     */
    infoBg: 'rgba(96, 165, 250, 0.2)',

    /**
     * Disabled state color - Dark slate
     * @usage Disabled elements, inactive states
     * @examples Disabled button text, inactive toggles
     */
    disabled: '#475569',
  },

  overlay: {
    /**
     * Modal backdrop overlay - Deep semi-transparent black
     * @usage Semi-transparent overlay behind modals and dialogs
     * @examples Modal backdrop, drawer overlay
     */
    modal: 'rgba(0, 0, 0, 0.7)',

    /**
     * Press feedback overlay - Green tint
     * @usage Touch/press ripple effects, interactive feedback
     * @examples Button press effect, card press feedback
     */
    pressed: 'rgba(25, 230, 94, 0.15)',

    /**
     * Hover feedback overlay - Subtle green tint
     * @usage Hover state overlay
     * @examples Card hover effect, button hover
     */
    hover: 'rgba(25, 230, 94, 0.08)',

    /**
     * Focus overlay - Green tint
     * @usage Keyboard focus indicator overlay
     * @examples Focus ring, keyboard navigation highlight
     */
    focus: 'rgba(25, 230, 94, 0.2)',

    /**
     * Ripple effect overlay - Semi-transparent white
     * @usage Android ripple on colored/contained button backgrounds
     * @examples Ripple on primary button, ripple on success button
     */
    ripple: 'rgba(255, 255, 255, 0.2)',

    /**
     * Shadow color - Deep semi-transparent black
     * @usage Drop shadows, elevation shadows
     * @examples Card shadow, button shadow
     */
    shadow: 'rgba(0, 0, 0, 0.5)',
  },

  gradient: {
    /**
     * Primary gradient - Dark emerald to bright green
     * @usage Main brand gradients, current prayer card background
     * @examples Current prayer card gradient
     */
    primary: ['#062A1A', '#19E65E'],

    /**
     * Secondary gradient - Green range
     * @usage Supporting gradients, alternative styling
     * @examples Secondary cards, alternative headers
     */
    secondary: ['#19E65E', '#34D399'],

    /**
     * Sacred/Spiritual gradient - Deep emerald tints
     * @usage Current prayer card, spiritual content backgrounds
     * @examples Prayer card dark gradient
     */
    sacred: ['#062A1A', '#0A3D28'],

    /**
     * Success gradient - Green range
     * @usage Success states, achievements, completions
     * @examples Completion badges, success notifications
     */
    success: ['#059669', '#34D399'],

    /**
     * Premium/Featured gradient - Gold range
     * @usage Premium features, gold-themed content
     * @examples Premium badges, featured content cards
     */
    premium: ['#B45309', '#FBBF24'],
  },

  shadow: {
    color: 'rgba(0, 0, 0, 0.5)',
    elevation: 6,
    elevationSmall: 2,
    elevationMedium: 6,
    elevationLarge: 12,
  },
};

export default darkColors;
