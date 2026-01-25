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
export const darkColors: ThemeColors = {
  mode: 'dark',

  brand: {
    /**
     * Primary brand color - Luminous gold
     * @usage Main CTAs, primary buttons, active tabs, key highlights
     * @examples "Pray Now" button, active tab indicator, selected prayer time
     */
    primary: '#C9A66B',

    /**
     * Secondary brand color - Bright teal
     * @usage Secondary actions, navigation icons, links, supporting elements
     * @examples Navigation bar icons, text links, secondary buttons
     */
    secondary: '#3FB6A5',

    /**
     * Tertiary brand color - Deep ocean teal
     * @usage Subtle accents, tertiary actions, less prominent UI elements
     * @examples Helper icons, subtle badges, tertiary buttons
     */
    tertiary: '#0B6B61',

    /**
     * Primary variant - Brighter gold
     * @usage Hover states, pressed states, primary button variants
     * @examples Primary button hover state, selected card background
     */
    primaryVariant: '#D9B67B',

    /**
     * Secondary variant - Brighter teal
     * @usage Secondary element hover states, alternative secondary actions
     * @examples Secondary button hover, alternative navigation highlight
     */
    secondaryVariant: '#4FC6B5',
  },

  background: {
    /**
     * Main app background - Deep dark teal
     * @usage Root background color for the entire app
     * @examples Screen background, main container background
     */
    app: '#0C1B19',

    /**
     * Primary surface background - Dark teal surface
     * @usage Cards, sheets, elevated components
     * @examples Prayer time cards, Quran reader card, bottom sheets
     */
    surface: '#132826',

    /**
     * Alternative surface background - Elevated dark teal
     * @usage Nested surfaces, alternative cards, dialogs
     * @examples Modal backgrounds, nested cards, elevated dialogs
     */
    surfaceAlt: '#1A3532',

    /**
     * Section background - Deep grouped surface
     * @usage Grouped content sections, list backgrounds
     * @examples Settings sections, grouped prayer times, list containers
     */
    section: '#102322',

    /**
     * Elevated surface background - Lighter elevated surface
     * @usage Floating action buttons, tooltips, elevated menus
     * @examples FAB background, dropdown menus, popovers
     */
    elevated: '#1E403D',

    /**
     * Input field background - Dark input surface
     * @usage Text inputs, search bars, editable fields
     * @examples Search input, form fields, text areas
     */
    input: '#1B2F2C',

    /**
     * Disabled background - Muted dark with opacity
     * @usage Disabled buttons, inactive elements
     * @examples Disabled button background, inactive toggle background
     */
    disabled: 'rgba(58, 58, 58, 0.5)',
  },

  text: {
    /**
     * Primary text color - Warm off-white
     * @usage Main readable content, body text, primary labels
     * @examples Quran text, article content, main headings
     */
    primary: '#F3EEE6',

    /**
     * Secondary text color - Light warm gray
     * @usage Subheadings, secondary labels, supporting text
     * @examples Card subtitles, section descriptions, helper labels
     */
    secondary: '#D1C4AF',

    /**
     * Tertiary text color - Medium warm gray
     * @usage Tertiary information, timestamps, metadata
     * @examples Post timestamps, verse numbers, metadata labels
     */
    tertiary: '#B3A48C',

    /**
     * Muted text color - Muted brown-gray
     * @usage Placeholder text, disabled text, very low priority information
     * @examples Input placeholders, disabled labels, footnotes
     */
    muted: '#8C806A',

    /**
     * Inverse text color - Very dark teal
     * @usage Text on light/colored backgrounds
     * @examples Text on light buttons, text on light cards
     */
    inverse: '#0C1B19',

    /**
     * Accent text color - Bright warm gold
     * @usage Highlighted text, emphasized content, special keywords
     * @examples Allah (SWT), Prophet names, sacred terms, badges
     */
    accent: '#F0B15C',

    /**
     * Link text color - Bright teal
     * @usage Clickable links, interactive text
     * @examples Hyperlinks, "Read more" links, navigation links
     */
    link: '#4FC6B5',

    /**
     * Link hover color - Very bright teal
     * @usage Link hover and active states
     * @examples Link hover effect, pressed link state
     */
    linkHover: '#5FD6C5',
  },

  border: {
    /**
     * Default border color - Medium brown-tan
     * @usage Standard borders for inputs, cards, containers
     * @examples Input borders, card outlines, container borders
     */
    default: '#5A4A36',

    /**
     * Subtle border color - Very dark teal
     * @usage Light dividers, subtle separators
     * @examples List dividers, section separators, subtle card borders
     */
    subtle: '#243F3C',

    /**
     * Strong border color - Brighter border
     * @usage Emphasized borders, important separators
     * @examples Selected card border, important section dividers
     */
    strong: '#7A6A56',

    /**
     * Focus border color - Bright teal
     * @usage Focused input states, keyboard navigation indicators
     * @examples Focused input ring, selected button outline, active navigation
     */
    focus: '#3FB6A5',

    /**
     * Disabled border color - Dark gray with opacity
     * @usage Borders for disabled elements
     * @examples Disabled input border, inactive button border
     */
    disabled: 'rgba(58, 58, 58, 0.3)',
  },

  icon: {
    /**
     * Primary icon color - Bright teal
     * @usage Main interactive icons, primary navigation
     * @examples Tab bar icons, primary action icons, main navigation icons
     */
    primary: '#3FB6A5',

    /**
     * Secondary icon color - Light warm gray
     * @usage Supporting icons, secondary actions
     * @examples Utility icons, secondary action icons, helper icons
     */
    secondary: '#D1C4AF',

    /**
     * Tertiary icon color - Lighter teal
     * @usage Subtle icons, decorative elements
     * @examples Decorative icons, subtle indicators, low-priority icons
     */
    tertiary: '#5A8A82',

    /**
     * Muted icon color - Muted brown-gray
     * @usage Disabled icons, inactive states
     * @examples Disabled action icons, inactive navigation icons
     */
    muted: '#8C806A',

    /**
     * Inverse icon color - Very dark teal
     * @usage Icons on light/colored backgrounds
     * @examples Icons on light buttons, icons on light surfaces
     */
    inverse: '#0C1B19',

    /**
     * Accent icon color - Luminous gold
     * @usage Special attention icons, featured elements
     * @examples Featured prayer icon, special badge icons, highlighted actions
     */
    accent: '#C9A66B',
  },

  state: {
    /**
     * Success state color - Bright green
     * @usage Success messages, completed actions, positive feedback
     * @examples "Prayer completed" badge, successful form submission, checkmarks
     */
    success: '#34D399',

    /**
     * Success background - Dark green with opacity
     * @usage Background for success messages and indicators
     * @examples Success notification background, completed task background
     */
    successBg: 'rgba(52, 211, 153, 0.2)',

    /**
     * Warning state color - Bright amber
     * @usage Warning messages, caution indicators, alerts
     * @examples Low battery warning, approaching prayer time, confirmations
     */
    warning: '#FBBF24',

    /**
     * Warning background - Dark amber with opacity
     * @usage Background for warning messages
     * @examples Warning notification background, caution banner
     */
    warningBg: 'rgba(251, 191, 36, 0.2)',

    /**
     * Error state color - Bright red
     * @usage Error messages, validation errors, critical alerts
     * @examples Form validation errors, failed actions, error notifications
     */
    error: '#F87171',

    /**
     * Error background - Dark red with opacity
     * @usage Background for error messages
     * @examples Error notification background, validation error background
     */
    errorBg: 'rgba(248, 113, 113, 0.2)',

    /**
     * Info state color - Bright teal
     * @usage Informational messages, neutral notifications, hints
     * @examples Tooltips, info banners, helpful hints, educational content
     */
    info: '#3FB6A5',

    /**
     * Info background - Dark teal with opacity
     * @usage Background for info messages
     * @examples Info notification background, hint box background
     */
    infoBg: 'rgba(63, 182, 165, 0.2)',

    /**
     * Disabled state color - Dark gray
     * @usage Disabled elements, inactive states
     * @examples Disabled button text, inactive toggles, unavailable options
     */
    disabled: '#3F3F46',
  },

  overlay: {
    /**
     * Modal backdrop overlay - Deep semi-transparent black
     * @usage Semi-transparent overlay behind modals and dialogs
     * @examples Modal backdrop, drawer overlay, dialog dimming
     */
    modal: 'rgba(0, 0, 0, 0.7)',

    /**
     * Press feedback overlay - Teal with medium opacity
     * @usage Touch/press ripple effects, interactive feedback
     * @examples Button press effect, list item press, touchable feedback
     */
    pressed: 'rgba(63, 182, 165, 0.2)',

    /**
     * Hover feedback overlay - Teal with low opacity
     * @usage Hover state overlay (for web/desktop)
     * @examples Card hover effect, button hover, interactive element hover
     */
    hover: 'rgba(63, 182, 165, 0.12)',

    /**
     * Focus overlay - Teal with medium opacity
     * @usage Keyboard focus indicator overlay
     * @examples Focus ring, keyboard navigation highlight
     */
    focus: 'rgba(63, 182, 165, 0.2)',

    /**
     * Shadow color - Deep semi-transparent black
     * @usage Drop shadows, elevation shadows
     * @examples Card shadow, button shadow, elevated surface shadow
     */
    shadow: 'rgba(0, 0, 0, 0.6)',
  },

  component: {
    switchTrackOff: '#3F3F46',
    switchTrackOn: '#C9A66B',
    switchThumb: '#FFFFFF',
    checkboxBorder: '#737373',
    checkboxChecked: '#C9A66B',
    radioBorder: '#737373',
    radioChecked: '#C9A66B',
    sliderTrackInactive: '#3F3F46',
    sliderTrackActive: '#C9A66B',
    sliderThumb: '#FFFFFF',
    progressTrack: '#1E2E2C',
    progressFill: '#C9A66B',
    tabBarBackground: '#132826',
    tabBarBorder: '#243F3C',
    badgeBackground: '#EF4444',
    badgeText: '#FFFFFF',
    chipBackground: '#1E3532',
    chipText: '#C9A66B',
    divider: '#243F3C',
  },

  islamic: {
    /**
     * Active prayer time indicator - Bright teal
     * @usage Current/active prayer time highlight
     * @examples Current prayer highlight, active prayer badge
     */
    prayerActive: '#3FB6A5',

    /**
     * Upcoming prayer time indicator - Luminous gold
     * @usage Next prayer time highlight
     * @examples Next prayer countdown, upcoming prayer card
     */
    prayerUpcoming: '#C9A66B',

    /**
     * Passed prayer time indicator - Muted gray
     * @usage Completed prayer times
     * @examples Passed prayer times in list, completed prayer indicator
     */
    prayerPassed: '#8C806A',

    /**
     * Quran text color - Warm off-white
     * @usage Arabic Quran text, special typography
     * @examples Quran verses, Arabic content
     */
    quranText: '#F5F5F5',

    /**
     * Quran background - Deep reading surface
     * @usage Background for Quran reading view
     * @examples Quran reader background, verse card background
     */
    quranBackground: '#0F2220',

    /**
     * Verse highlight color - Teal with opacity
     * @usage Selected or highlighted Quran verses
     * @examples Selected verse background, bookmarked verse highlight
     */
    verseHighlight: 'rgba(63, 182, 165, 0.22)',

    /**
     * Verse number badge - Luminous gold
     * @usage Verse number indicators
     * @examples Verse number badges, ayah markers
     */
    verseNumber: '#C9A66B',

    /**
     * Tasbih counter background - Dark elevated surface
     * @usage Digital tasbih/dhikr counter background
     * @examples Counter display background, tasbeeh card
     */
    tasbihBackground: '#1A3532',

    /**
     * Tasbih counter text - Luminous gold
     * @usage Counter numbers and text
     * @examples Count display, progress text
     */
    tasbihText: '#C9A66B',

    /**
     * Hadith background - Dark warm surface
     * @usage Background for Hadith cards/sections
     * @examples Hadith card background, narration section
     */
    hadithBackground: '#1A2420',

    /**
     * Sacred text accent - Bright saturated gold
     * @usage Emphasis on sacred names and terms (Allah, Muhammad ﷺ)
     * @examples Sacred name highlighting, honorific markers
     */
    sacredTextAccent: '#F4C174',

    /**
     * Qibla direction indicator - Bright saturated teal
     * @usage Qibla compass indicator
     * @examples Qibla arrow, direction marker
     */
    qiblaIndicator: '#4FD6C5',

    /**
     * Islamic calendar date - Luminous gold
     * @usage Hijri date display
     * @examples Islamic date badge, calendar display
     */
    hijriDate: '#C9A66B',
  },

  gradient: {
    /**
     * Primary gradient - Deep to bright teal
     * @usage Main brand gradients, hero sections
     * @examples Primary button gradient, header gradient, featured cards
     */
    primary: ['#0B6B61', '#3FB6A5'],

    /**
     * Secondary gradient - Teal gradient
     * @usage Supporting gradients, alternative styling
     * @examples Secondary cards, alternative headers
     */
    secondary: ['#2A8A7D', '#4FC6B5'],

    /**
     * Sacred/Spiritual gradient - Deep brown gradient
     * @usage Quran headers, prayer time cards, spiritual content
     * @examples Quran header, prayer card gradient, sacred section background
     */
    sacred: ['#2A1510', '#120A08'],

    /**
     * Success gradient - Green gradient
     * @usage Success states, achievements, completions
     * @examples Completion badges, success notifications
     */
    success: ['#059669', '#34D399'],

    /**
     * Premium/Featured gradient - Purple gradient
     * @usage Premium features, special content
     * @examples Premium badges, featured content cards
     */
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

export default darkColors;
