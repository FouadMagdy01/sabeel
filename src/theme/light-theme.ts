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
export const lightColors: ThemeColors = {
  mode: 'light',

  brand: {
    /**
     * Primary brand color - Desert gold
     * @usage Main CTAs, primary buttons, active tabs, key highlights
     * @examples "Pray Now" button, active tab indicator, selected prayer time
     */
    primary: '#B08A54',

    /**
     * Secondary brand color - Islamic teal
     * @usage Secondary actions, navigation icons, links, supporting elements
     * @examples Navigation bar icons, text links, secondary buttons
     */
    secondary: '#0FA18F',

    /**
     * Tertiary brand color - Deep forest
     * @usage Subtle accents, tertiary actions, less prominent UI elements
     * @examples Helper icons, subtle badges, tertiary buttons
     */
    tertiary: '#084F49',

    /**
     * Primary variant - Darker desert gold
     * @usage Hover states, pressed states, primary button variants
     * @examples Primary button hover state, selected card background
     */
    primaryVariant: '#8B6B3E',

    /**
     * Secondary variant - Darker teal
     * @usage Secondary element hover states, alternative secondary actions
     * @examples Secondary button hover, alternative navigation highlight
     */
    secondaryVariant: '#0A7A6C',
  },

  background: {
    /**
     * Main app background - Soft cream paper
     * @usage Root background color for the entire app
     * @examples Screen background, main container background
     */
    app: '#FFF7EC',

    /**
     * Primary surface background - Pure white
     * @usage Cards, sheets, elevated components
     * @examples Prayer time cards, Quran reader card, bottom sheets
     */
    surface: '#FFFFFF',

    /**
     * Alternative surface background - Warm white
     * @usage Nested surfaces, alternative cards, dialogs
     * @examples Modal backgrounds, nested cards, elevated dialogs
     */
    surfaceAlt: '#FFFDF8',

    /**
     * Section background - Soft mint
     * @usage Grouped content sections, list backgrounds
     * @examples Settings sections, grouped prayer times, list containers
     */
    section: '#F3FAF9',

    /**
     * Elevated surface background - Pure white
     * @usage Floating action buttons, tooltips, elevated menus
     * @examples FAB background, dropdown menus, popovers
     */
    elevated: '#FFFFFF',

    /**
     * Input field background - Light beige
     * @usage Text inputs, search bars, editable fields
     * @examples Search input, form fields, text areas
     */
    input: '#FAF4EC',

    /**
     * Disabled background - Light gray with opacity
     * @usage Disabled buttons, inactive elements
     * @examples Disabled button background, inactive toggle background
     */
    disabled: 'rgba(214, 206, 193, 0.6)',
  },

  text: {
    /**
     * Primary text color - Rich dark brown
     * @usage Main readable content, body text, primary labels
     * @examples Quran text, article content, main headings
     */
    primary: '#3E2D14',

    /**
     * Secondary text color - Medium brown
     * @usage Subheadings, secondary labels, supporting text
     * @examples Card subtitles, section descriptions, helper labels
     */
    secondary: '#5F4A2C',

    /**
     * Tertiary text color - Light brown
     * @usage Tertiary information, timestamps, metadata
     * @examples Post timestamps, verse numbers, metadata labels
     */
    tertiary: '#7A643F',

    /**
     * Muted text color - Soft gray-brown
     * @usage Placeholder text, disabled text, very low priority information
     * @examples Input placeholders, disabled labels, footnotes
     */
    muted: '#B2A489',

    /**
     * Inverse text color - Pure white
     * @usage Text on dark/colored backgrounds
     * @examples Text on primary buttons, text on dark cards, overlay text
     */
    inverse: '#FFFFFF',

    /**
     * Accent text color - Orange-brown
     * @usage Highlighted text, emphasized content, special keywords
     * @examples Allah (SWT), Prophet names, sacred terms, badges
     */
    accent: '#9C5F17',

    /**
     * Link text color - Darker teal
     * @usage Clickable links, interactive text
     * @examples Hyperlinks, "Read more" links, navigation links
     */
    link: '#0A7A6C',

    /**
     * Link hover color - Very dark teal
     * @usage Link hover and active states
     * @examples Link hover effect, pressed link state
     */
    linkHover: '#064F46',
  },

  border: {
    /**
     * Default border color - Light tan
     * @usage Standard borders for inputs, cards, containers
     * @examples Input borders, card outlines, container borders
     */
    default: '#BFA06A',

    /**
     * Subtle border color - Very light beige
     * @usage Light dividers, subtle separators
     * @examples List dividers, section separators, subtle card borders
     */
    subtle: '#E6D8C5',

    /**
     * Strong border color - Medium brown
     * @usage Emphasized borders, important separators
     * @examples Selected card border, important section dividers
     */
    strong: '#8B7355',

    /**
     * Focus border color - Bright teal
     * @usage Focused input states, keyboard navigation indicators
     * @examples Focused input ring, selected button outline, active navigation
     */
    focus: '#0FA18F',

    /**
     * Disabled border color - Light gray
     * @usage Borders for disabled elements
     * @examples Disabled input border, inactive button border
     */
    disabled: 'rgba(214, 206, 193, 0.4)',
  },

  icon: {
    /**
     * Primary icon color - Deep forest
     * @usage Main interactive icons, primary navigation
     * @examples Tab bar icons, primary action icons, main navigation icons
     */
    primary: '#084F49',

    /**
     * Secondary icon color - Medium brown
     * @usage Supporting icons, secondary actions
     * @examples Utility icons, secondary action icons, helper icons
     */
    secondary: '#5F4A2C',

    /**
     * Tertiary icon color - Light brown
     * @usage Subtle icons, decorative elements
     * @examples Decorative icons, subtle indicators, low-priority icons
     */
    tertiary: '#8B7355',

    /**
     * Muted icon color - Soft gray-brown
     * @usage Disabled icons, inactive states
     * @examples Disabled action icons, inactive navigation icons
     */
    muted: '#B2A489',

    /**
     * Inverse icon color - Pure white
     * @usage Icons on dark/colored backgrounds
     * @examples Icons on primary buttons, icons on dark surfaces
     */
    inverse: '#FFFFFF',

    /**
     * Accent icon color - Desert gold
     * @usage Special attention icons, featured elements
     * @examples Featured prayer icon, special badge icons, highlighted actions
     */
    accent: '#B08A54',
  },

  state: {
    /**
     * Success state color - Green
     * @usage Success messages, completed actions, positive feedback
     * @examples "Prayer completed" badge, successful form submission, checkmarks
     */
    success: '#10B981',

    /**
     * Success background - Light green with opacity
     * @usage Background for success messages and indicators
     * @examples Success notification background, completed task background
     */
    successBg: 'rgba(16, 185, 129, 0.15)',

    /**
     * Warning state color - Amber
     * @usage Warning messages, caution indicators, alerts
     * @examples Low battery warning, approaching prayer time, confirmations
     */
    warning: '#F59E0B',

    /**
     * Warning background - Light amber with opacity
     * @usage Background for warning messages
     * @examples Warning notification background, caution banner
     */
    warningBg: 'rgba(245, 158, 11, 0.15)',

    /**
     * Error state color - Red
     * @usage Error messages, validation errors, critical alerts
     * @examples Form validation errors, failed actions, error notifications
     */
    error: '#EF4444',

    /**
     * Error background - Light red with opacity
     * @usage Background for error messages
     * @examples Error notification background, validation error background
     */
    errorBg: 'rgba(239, 68, 68, 0.15)',

    /**
     * Info state color - Teal
     * @usage Informational messages, neutral notifications, hints
     * @examples Tooltips, info banners, helpful hints, educational content
     */
    info: '#0FA18F',

    /**
     * Info background - Light teal with opacity
     * @usage Background for info messages
     * @examples Info notification background, hint box background
     */
    infoBg: 'rgba(15, 161, 143, 0.15)',

    /**
     * Disabled state color - Light gray
     * @usage Disabled elements, inactive states
     * @examples Disabled button text, inactive toggles, unavailable options
     */
    disabled: '#D1D5DB',
  },

  overlay: {
    /**
     * Modal backdrop overlay - Semi-transparent black
     * @usage Semi-transparent overlay behind modals and dialogs
     * @examples Modal backdrop, drawer overlay, dialog dimming
     */
    modal: 'rgba(0, 0, 0, 0.5)',

    /**
     * Press feedback overlay - Light teal with low opacity
     * @usage Touch/press ripple effects, interactive feedback
     * @examples Button press effect, list item press, touchable feedback
     */
    pressed: 'rgba(15, 161, 143, 0.12)',

    /**
     * Hover feedback overlay - Very light teal
     * @usage Hover state overlay (for web/desktop)
     * @examples Card hover effect, button hover, interactive element hover
     */
    hover: 'rgba(15, 161, 143, 0.08)',

    /**
     * Focus overlay - Light teal
     * @usage Keyboard focus indicator overlay
     * @examples Focus ring, keyboard navigation highlight
     */
    focus: 'rgba(15, 161, 143, 0.15)',

    /**
     * Shadow color - Semi-transparent black
     * @usage Drop shadows, elevation shadows
     * @examples Card shadow, button shadow, elevated surface shadow
     */
    shadow: 'rgba(0, 0, 0, 0.15)',
  },

  component: {
    switchTrackOff: '#D1D5DB',
    switchTrackOn: '#B08A54',
    switchThumb: '#FFFFFF',
    checkboxBorder: '#9E9E9E',
    checkboxChecked: '#B08A54',
    radioBorder: '#9E9E9E',
    radioChecked: '#B08A54',
    sliderTrackInactive: '#E5E7EB',
    sliderTrackActive: '#B08A54',
    sliderThumb: '#FFFFFF',
    progressTrack: '#F0E8DC',
    progressFill: '#B08A54',
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E5E7EB',
    badgeBackground: '#EF4444',
    badgeText: '#FFFFFF',
    chipBackground: '#F5EFE6',
    chipText: '#084F49',
    divider: '#E6D8C5',
  },

  islamic: {
    /**
     * Active prayer time indicator - Bright teal
     * @usage Current/active prayer time highlight
     * @examples Current prayer highlight, active prayer badge
     */
    prayerActive: '#0FA18F',

    /**
     * Upcoming prayer time indicator - Desert gold
     * @usage Next prayer time highlight
     * @examples Next prayer countdown, upcoming prayer card
     */
    prayerUpcoming: '#B08A54',

    /**
     * Passed prayer time indicator - Muted gray
     * @usage Completed prayer times
     * @examples Passed prayer times in list, completed prayer indicator
     */
    prayerPassed: '#B2A489',

    /**
     * Quran text color - Rich dark brown
     * @usage Arabic Quran text, special typography
     * @examples Quran verses, Arabic content
     */
    quranText: '#1A1A1A',

    /**
     * Quran background - Very light cream
     * @usage Background for Quran reading view
     * @examples Quran reader background, verse card background
     */
    quranBackground: '#FFFCF5',

    /**
     * Verse highlight color - Light teal with opacity
     * @usage Selected or highlighted Quran verses
     * @examples Selected verse background, bookmarked verse highlight
     */
    verseHighlight: 'rgba(15, 161, 143, 0.15)',

    /**
     * Verse number badge - Desert gold
     * @usage Verse number indicators
     * @examples Verse number badges, ayah markers
     */
    verseNumber: '#B08A54',

    /**
     * Tasbih counter background - Light warm beige
     * @usage Digital tasbih/dhikr counter background
     * @examples Counter display background, tasbeeh card
     */
    tasbihBackground: '#F5EFE6',

    /**
     * Tasbih counter text - Deep forest
     * @usage Counter numbers and text
     * @examples Count display, progress text
     */
    tasbihText: '#084F49',

    /**
     * Hadith background - Light peachy beige
     * @usage Background for Hadith cards/sections
     * @examples Hadith card background, narration section
     */
    hadithBackground: '#FFF5EB',

    /**
     * Sacred text accent - Saturated gold
     * @usage Emphasis on sacred names and terms (Allah, Muhammad ﷺ)
     * @examples Sacred name highlighting, honorific markers
     */
    sacredTextAccent: '#D4A056',

    /**
     * Qibla direction indicator - Bright saturated teal
     * @usage Qibla compass indicator
     * @examples Qibla arrow, direction marker
     */
    qiblaIndicator: '#0CC9B3',

    /**
     * Islamic calendar date - Darker gold
     * @usage Hijri date display
     * @examples Islamic date badge, calendar display
     */
    hijriDate: '#8B6B3E',
  },

  gradient: {
    /**
     * Primary gradient - Forest to teal
     * @usage Main brand gradients, hero sections
     * @examples Primary button gradient, header gradient, featured cards
     */
    primary: ['#084F49', '#12B09E'],

    /**
     * Secondary gradient - Light teal gradient
     * @usage Supporting gradients, alternative styling
     * @examples Secondary cards, alternative headers
     */
    secondary: ['#0FA18F', '#3DBFB0'],

    /**
     * Sacred/Spiritual gradient - Dark brown gradient
     * @usage Quran headers, prayer time cards, spiritual content
     * @examples Quran header, prayer card gradient, sacred section background
     */
    sacred: ['#4B2418', '#7A4A2C'],

    /**
     * Success gradient - Green gradient
     * @usage Success states, achievements, completions
     * @examples Completion badges, success notifications
     */
    success: ['#10B981', '#34D399'],

    /**
     * Premium/Featured gradient - Purple gradient
     * @usage Premium features, special content
     * @examples Premium badges, featured content cards
     */
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

export default lightColors;
