import type { ThemeColors } from './types';

/**
 * Sabeel Default Light Theme
 *
 * A comprehensive, warm Islamic-inspired light theme using traditional
 * desert sand and emerald tones. Optimized for daytime reading with
 * excellent contrast ratios and accessibility.
 *
 * Color Philosophy:
 * - Primary: Desert gold/sand (#B08A54) - warmth and tradition
 * - Secondary: Islamic teal (#0FA18F) - spirituality and peace
 * - Tertiary: Deep forest (#084F49) - depth and contemplation
 */
/**
 * Sabeel Light Theme Colors (Active)
 *
 * Emerald and deep green palette with warm accents.
 * Optimized for daytime reading with excellent contrast.
 *
 * Color Philosophy:
 * - Primary: Emerald (#10B981) - growth and vitality
 * - Secondary: Deep emerald (#064E3B) - strong readable headings
 * - Tertiary: Amber (#D97706) - warm achievement accents
 */
export const lightColors: ThemeColors = {
  mode: 'light',

  brand: {
    /**
     * Primary brand color - Emerald green
     * @usage Main CTAs, primary buttons, active tabs, key highlights
     * @examples "Pray Now" button, active tab indicator, selected prayer time
     */
    primary: '#10B981',

    /**
     * Secondary brand color - Deep emerald
     * @usage Headings, strong readable text on light backgrounds
     * @examples Section headings, card titles, greeting text
     */
    secondary: '#064E3B',

    /**
     * Tertiary brand color - Amber accent
     * @usage Achievement icons, streaks, gold accents, special highlights
     * @examples Streak fire icon, points star, best streak medal
     */
    tertiary: '#D97706',

    /**
     * Primary variant - Darker emerald
     * @usage Hover states, pressed states, primary button variants
     * @examples Primary button hover state, selected card background
     */
    primaryVariant: '#059669',

    /**
     * Secondary variant - Lighter deep emerald
     * @usage Secondary element hover states, alternative secondary actions
     * @examples Secondary button hover, alternative navigation highlight
     */
    secondaryVariant: '#065F46',
  },

  background: {
    /**
     * Main app background - Soft warm gray
     * @usage Root background color for the entire app
     * @examples Screen background, main container background
     */
    app: '#F8FAF9',

    /**
     * Primary surface background - White
     * @usage Cards, sheets, elevated components
     * @examples Stats card, prayer cards, daily todo cards, bottom sheets
     */
    surface: '#FFFFFF',

    /**
     * Alternative surface background - Very light gray
     * @usage Nested surfaces, alternative cards, bento card backgrounds
     * @examples Bento grid cards, inactive toggles, subtle backgrounds
     */
    surfaceAlt: '#F1F5F4',

    /**
     * Section background - Light warm gray
     * @usage Grouped content sections
     * @examples Prayer card background, sacred section backgrounds
     */
    section: '#F0FDF4',

    /**
     * Elevated surface background - White
     * @usage Floating action buttons, tooltips, elevated menus
     * @examples FAB background, dropdown menus, popovers
     */
    elevated: '#FFFFFF',

    /**
     * Input field background - Very light gray
     * @usage Text inputs, search bars, editable fields
     * @examples Search input, form fields, text areas
     */
    input: '#F1F5F9',

    /**
     * Disabled background - Light gray
     * @usage Disabled buttons, inactive elements
     * @examples Disabled button background, inactive toggle background
     */
    disabled: '#E2E8F0',

    /**
     * Modal background - Solid white
     * @usage Modal dialogs, bottom sheets, popovers
     * @examples Date picker modal, select bottom sheet, dialog backgrounds
     */
    modal: '#FFFFFF',
  },

  text: {
    /**
     * Primary text color - Near black
     * @usage Main readable content, body text, primary labels
     * @examples Prayer names, card values, main headings
     */
    primary: '#0F172A',

    /**
     * Secondary text color - Dark gray
     * @usage Subheadings, secondary labels, supporting text
     * @examples Card subtitles, section descriptions, card titles
     */
    secondary: '#334155',

    /**
     * Tertiary text color - Medium gray
     * @usage Tertiary information, timestamps, metadata
     * @examples Hijri date, stat labels, section headers
     */
    tertiary: '#64748B',

    /**
     * Muted text color - Light gray
     * @usage Placeholder text, disabled text, very low priority information
     * @examples Input placeholders, disabled labels
     */
    muted: '#94A3B8',

    /**
     * Inverse text color - White
     * @usage Text on dark/colored backgrounds
     * @examples Text on primary buttons, text on gradient cards
     */
    inverse: '#FFFFFF',

    /**
     * Accent text color - Amber
     * @usage Highlighted text, emphasized content, special labels
     * @examples Streak values, gold accents
     */
    accent: '#D97706',

    /**
     * Link text color - Emerald
     * @usage Clickable links, interactive text
     * @examples Hyperlinks, "Read more" links, navigation links
     */
    link: '#10B981',

    /**
     * Link hover color - Darker emerald
     * @usage Link hover and active states
     * @examples Link hover effect, pressed link state
     */
    linkHover: '#059669',
  },

  border: {
    /**
     * Default border color - Light gray
     * @usage Standard borders for cards, containers
     * @examples Card borders, container outlines
     */
    default: '#E2E8F0',

    /**
     * Subtle border color - Very light gray
     * @usage Light dividers, subtle separators
     * @examples Stat dividers, section separators
     */
    subtle: '#F1F5F9',

    /**
     * Strong border color - Medium gray
     * @usage Emphasized borders, important separators
     * @examples Selected card border, important section dividers
     */
    strong: '#CBD5E1',

    /**
     * Focus border color - Emerald
     * @usage Focused input states, keyboard navigation indicators
     * @examples Focused input ring, selected button outline
     */
    focus: '#10B981',

    /**
     * Disabled border color - Very light gray
     * @usage Borders for disabled elements
     * @examples Disabled input border, inactive button border
     */
    disabled: '#E2E8F0',
  },

  icon: {
    /**
     * Primary icon color - Dark gray
     * @usage Main interactive icons, primary navigation
     * @examples Tab bar icons, primary action icons
     */
    primary: '#334155',

    /**
     * Secondary icon color - Medium gray
     * @usage Supporting icons, secondary actions
     * @examples Utility icons, secondary action icons
     */
    secondary: '#64748B',

    /**
     * Tertiary icon color - Light gray
     * @usage Subtle icons, decorative elements
     * @examples Decorative icons, subtle indicators
     */
    tertiary: '#94A3B8',

    /**
     * Muted icon color - Very light gray
     * @usage Disabled icons, inactive states
     * @examples Disabled action icons, inactive navigation icons
     */
    muted: '#CBD5E1',

    /**
     * Inverse icon color - White
     * @usage Icons on dark/colored backgrounds
     * @examples Icons on primary buttons, icons on gradient cards
     */
    inverse: '#FFFFFF',

    /**
     * Accent icon color - Amber
     * @usage Achievement icons, streak indicators
     * @examples Fire icon, stars icon
     */
    accent: '#D97706',
  },

  state: {
    /**
     * Success state color - Green
     * @usage Success messages, completed actions, positive feedback
     * @examples Completed prayer check, completed random act badge
     */
    success: '#10B981',

    /**
     * Success background - Light green tint
     * @usage Background for success/completed states
     * @examples Completed bento card background
     */
    successBg: '#E8F5E9',

    /**
     * Warning state color - Amber
     * @usage Warning messages, caution indicators
     * @examples Approaching prayer time
     */
    warning: '#F59E0B',

    /**
     * Warning background - Light amber tint
     * @usage Background for warning messages
     * @examples Warning notification background
     */
    warningBg: 'rgba(245, 158, 11, 0.12)',

    /**
     * Error state color - Red
     * @usage Error messages, validation errors
     * @examples Form validation errors
     */
    error: '#EF4444',

    /**
     * Error background - Light red tint
     * @usage Background for error messages
     * @examples Error notification background
     */
    errorBg: 'rgba(239, 68, 68, 0.12)',

    /**
     * Info state color - Blue
     * @usage Informational messages, azkar progress indicator
     * @examples Azkar progress ring color, info banners
     */
    info: '#3B82F6',

    /**
     * Info background - Light blue tint
     * @usage Background for info messages
     * @examples Info notification background
     */
    infoBg: 'rgba(59, 130, 246, 0.12)',

    /**
     * Disabled state color - Light gray
     * @usage Disabled elements, inactive states
     * @examples Disabled button text, inactive toggles
     */
    disabled: '#CBD5E1',
  },

  overlay: {
    /**
     * Modal backdrop overlay - Semi-transparent black
     * @usage Semi-transparent overlay behind modals and dialogs
     * @examples Modal backdrop, drawer overlay
     */
    modal: 'rgba(0, 0, 0, 0.5)',

    /**
     * Press feedback overlay - Emerald tint
     * @usage Touch/press ripple effects, interactive feedback
     * @examples Button press effect, card press feedback
     */
    pressed: 'rgba(16, 185, 129, 0.12)',

    /**
     * Hover feedback overlay - Subtle emerald tint
     * @usage Hover state overlay
     * @examples Card hover effect, button hover
     */
    hover: 'rgba(16, 185, 129, 0.08)',

    /**
     * Focus overlay - Emerald tint
     * @usage Keyboard focus indicator overlay
     * @examples Focus ring, keyboard navigation highlight
     */
    focus: 'rgba(16, 185, 129, 0.15)',

    /**
     * Ripple effect overlay - Semi-transparent white
     * @usage Android ripple on colored/contained button backgrounds
     * @examples Ripple on primary button, ripple on success button
     */
    ripple: 'rgba(255, 255, 255, 0.25)',

    /**
     * Shadow color - Semi-transparent black
     * @usage Drop shadows, elevation shadows
     * @examples Card shadow, button shadow
     */
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  gradient: {
    /**
     * Primary gradient - Emerald range
     * @usage Main brand gradients, current prayer card background
     * @examples Current prayer card gradient
     */
    primary: ['#064E3B', '#10B981'],

    /**
     * Secondary gradient - Green range
     * @usage Supporting gradients, alternative styling
     * @examples Secondary cards, alternative headers
     */
    secondary: ['#10B981', '#34D399'],

    /**
     * Sacred/Spiritual gradient - Deep emerald
     * @usage Current prayer card, spiritual content backgrounds
     * @examples Prayer card gradient
     */
    sacred: ['#D1FAE5', '#A7F3D0'],

    /**
     * Success gradient - Green range
     * @usage Success states, achievements, completions
     * @examples Completion badges, success notifications
     */
    success: ['#059669', '#34D399'],

    /**
     * Premium/Featured gradient - Amber range
     * @usage Premium features, gold-themed content
     * @examples Premium badges, featured content cards
     */
    premium: ['#B45309', '#F59E0B'],
  },

  shadow: {
    color: 'rgba(0, 0, 0, 0.1)',
    elevation: 4,
    elevationSmall: 2,
    elevationMedium: 4,
    elevationLarge: 8,
  },
};

export default lightColors;
