# 🎨 Sabeel Design System - Complete Guide

**A comprehensive Islamic-inspired design system for building beautiful, accessible React Native apps.**

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Getting Started Guides](#getting-started-guides)
3. [Theme Presets](#theme-presets)
4. [Color System](#color-system)
5. [Component Patterns](#component-patterns)
6. [Islamic Components](#islamic-components)
7. [Advanced Usage](#advanced-usage)
8. [Best Practices](#best-practices)
9. [Migration Guide](#migration-guide)

---

## Quick Start

### Installation

The theme system is already installed in your project. Just import and use:

```tsx
import { PRESETS, createCustomTheme } from '@/theme';

// Use a preset
const theme = PRESETS.emerald.light;

// Or create custom theme
const customTheme = createCustomTheme('#E91E63', 'light', 'My Theme');
```

### First Component

```tsx
import { Pressable, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

function MyButton() {
  const { colors } = useTheme();

  return (
    <Pressable style={{ backgroundColor: colors.brand.primary, padding: 16 }}>
      <Text style={{ color: colors.text.inverse }}>Click Me</Text>
    </Pressable>
  );
}
```

---

## Getting Started Guides

**Choose your path based on your experience:**

### 🚀 Complete Beginner (New to Design)

**30 seconds:** Read [CHEAT_SHEET.md](./CHEAT_SHEET.md)

- The 5 most common patterns
- Golden rules
- Quick examples

**2 minutes:** Read [QUICK_START.md](./QUICK_START.md)

- Button patterns
- Input patterns
- Card patterns
- Decision tree for "what color should I use?"

**As needed:** Browse [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)

- Complete reference for every component
- All color tokens explained
- All states and variants

**When coding:** Copy from [EXAMPLES.tsx](./EXAMPLES.tsx)

- Ready-to-use components
- Real implementation examples
- Copy, paste, modify

### 🎯 Experienced Developer

**Start here:** [README.md](./README.md)

- Theme configuration
- API reference
- Advanced features

**Reference:** [types.ts](./types.ts)

- TypeScript definitions
- Inline documentation
- Usage annotations

---

## Theme Presets

### Available Presets

We provide 5 carefully crafted Islamic-inspired color schemes, each with light and dark variants:

#### 1. **Emerald** 🕌 (Default)

Traditional Islamic teal inspired by mosque architecture.

```tsx
import { PRESETS } from '@/theme';

const theme = PRESETS.emerald.light;
const darkTheme = PRESETS.emerald.dark;
```

**When to use:**

- Default theme for most apps
- Clean, professional look
- Traditional Islamic aesthetic

**Colors:**

- Primary: Teal/Emerald (#0FA18F)
- Accent: Gold undertones
- Feel: Traditional, Spiritual, Professional

---

#### 2. **Desert** 🏜️

Warm earth tones and golden desert sands.

```tsx
const theme = PRESETS.desert.light;
```

**When to use:**

- Warm, inviting aesthetic
- Reading-focused apps
- Traditional manuscript feel

**Colors:**

- Primary: Desert Gold (#C9A66B)
- Accent: Warm browns
- Feel: Warm, Traditional, Welcoming

---

#### 3. **Sapphire** 🔷

Deep blue inspired by mosque domes.

```tsx
const theme = PRESETS.sapphire.light;
```

**When to use:**

- Modern, clean aesthetic
- Professional applications
- Scholarly content

**Colors:**

- Primary: Deep Blue (#2563EB)
- Accent: Royal blue tones
- Feel: Modern, Professional, Contemplative

---

#### 4. **Moonlight** 🌙

Cool silver tones for night prayers and contemplation.

```tsx
const theme = PRESETS.moonlight.light;
```

**When to use:**

- Minimalist design
- Night-focused features
- Modern, neutral aesthetic

**Colors:**

- Primary: Cool Silver (#64748B)
- Accent: Slate tones
- Feel: Calm, Neutral, Modern

---

#### 5. **Royal** 👑

Rich purple and gold from Islamic manuscripts.

```tsx
const theme = PRESETS.royal.light;
```

**When to use:**

- Premium features
- Elegant, sophisticated look
- Special occasions

**Colors:**

- Primary: Royal Purple (#7C3AED)
- Accent: Gold highlights
- Feel: Elegant, Premium, Sophisticated

---

### Creating Custom Themes

Allow users to personalize with their favorite color:

```tsx
import { createCustomTheme } from '@/theme';

// Basic custom theme
const pinkTheme = createCustomTheme('#E91E63', 'light', 'Pink Blossom');

// With description
const customTheme = createCustomTheme(
  '#FF5733',
  'dark',
  'My Custom Theme',
  'A vibrant custom theme for my app'
);

// From user input
function ThemeCustomizer() {
  const [color, setColor] = useState('#0FA18F');
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const userTheme = createCustomTheme(color, mode, 'My Theme');

  return <ThemeProvider theme={userTheme}>...</ThemeProvider>;
}
```

---

## Color System

### Understanding Color Tokens

Our theme system uses **semantic color tokens** instead of raw hex values. This ensures:

- ✅ Consistent design across the app
- ✅ Easy theme switching
- ✅ Accessibility compliance
- ✅ Maintainable codebase

**Example:**

```tsx
// ❌ Bad - Hard-coded colors
<View style={{ backgroundColor: '#0FA18F' }}>
  <Text style={{ color: '#FFFFFF' }}>Hello</Text>
</View>

// ✅ Good - Semantic tokens
<View style={{ backgroundColor: colors.brand.primary }}>
  <Text style={{ color: colors.text.inverse }}>Hello</Text>
</View>
```

### Color Token Categories

#### 1. Brand Colors

Your app's identity colors.

```tsx
colors.brand.primary; // Main brand color
colors.brand.secondary; // Secondary brand color
colors.brand.tertiary; // Subtle brand accent
colors.brand.primaryVariant; // Hover/pressed state
colors.brand.secondaryVariant;
```

**Usage:**

- Buttons, CTAs
- Active states
- Brand highlights

---

#### 2. Background Colors

Surface and layout backgrounds.

```tsx
colors.background.app; // Main app background
colors.background.surface; // Cards, panels
colors.background.surfaceAlt; // Nested surfaces
colors.background.section; // Grouped sections
colors.background.elevated; // Modals, FABs
colors.background.input; // Input fields
colors.background.disabled; // Disabled elements
```

**Hierarchy:**

```
App (background.app)
└── Card (background.surface)
    └── Nested Card (background.surfaceAlt)
```

---

#### 3. Text Colors

Typography color hierarchy.

```tsx
colors.text.primary; // Main content (highest contrast)
colors.text.secondary; // Supporting text
colors.text.tertiary; // Metadata, timestamps
colors.text.muted; // Placeholders, disabled
colors.text.inverse; // Text on dark backgrounds
colors.text.accent; // Highlighted text
colors.text.link; // Hyperlinks
colors.text.linkHover; // Link hover state
```

**Hierarchy Example:**

```tsx
<View>
  <Text style={{ color: colors.text.primary }}>Main Heading</Text>
  <Text style={{ color: colors.text.secondary }}>Subheading</Text>
  <Text style={{ color: colors.text.tertiary }}>Posted 2 hours ago</Text>
</View>
```

---

#### 4. Icon Colors

```tsx
colors.icon.primary; // Main interactive icons
colors.icon.secondary; // Supporting icons
colors.icon.tertiary; // Subtle icons
colors.icon.muted; // Disabled icons
colors.icon.inverse; // Icons on dark backgrounds
colors.icon.accent; // Special attention icons
```

---

#### 5. State Colors

Feedback and status indicators.

```tsx
// Success (green)
colors.state.success;
colors.state.successBg;

// Warning (amber)
colors.state.warning;
colors.state.warningBg;

// Error (red)
colors.state.error;
colors.state.errorBg;

// Info (teal/blue)
colors.state.info;
colors.state.infoBg;

// Disabled
colors.state.disabled;
```

---

#### 6. Component Colors

Specific UI components.

```tsx
// Switches
colors.component.switchTrackOff;
colors.component.switchTrackOn;
colors.component.switchThumb;

// Checkboxes
colors.component.checkboxBorder;
colors.component.checkboxChecked;

// Sliders
colors.component.sliderTrackInactive;
colors.component.sliderTrackActive;
colors.component.sliderThumb;

// Progress
colors.component.progressTrack;
colors.component.progressFill;

// Badges
colors.component.badgeBackground;
colors.component.badgeText;

// Chips
colors.component.chipBackground;
colors.component.chipText;

// Dividers
colors.component.divider;
```

---

#### 7. Islamic-Specific Colors

Special tokens for Islamic features.

```tsx
// Prayer Times
colors.islamic.prayerActive; // Current prayer
colors.islamic.prayerUpcoming; // Next prayer
colors.islamic.prayerPassed; // Completed prayers

// Quran
colors.islamic.quranText; // Arabic text
colors.islamic.quranBackground; // Reader background
colors.islamic.verseHighlight; // Selected verses
colors.islamic.verseNumber; // Verse numbers

// Other
colors.islamic.tasbihBackground; // Counter background
colors.islamic.tasbihText; // Counter text
colors.islamic.hadithBackground; // Hadith cards
colors.islamic.sacredTextAccent; // Allah, Prophet names
colors.islamic.qiblaIndicator; // Qibla compass
colors.islamic.hijriDate; // Islamic calendar
```

---

## Component Patterns

### Buttons

#### Primary Button

Main actions (Submit, Save, Pray Now).

```tsx
<Pressable
  style={{
    backgroundColor: colors.brand.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  }}
  onPress={handlePress}
>
  <Text style={{ color: colors.text.inverse, fontSize: 16, fontWeight: '600' }}>Submit</Text>
</Pressable>
```

**States:**

- Default: `brand.primary` + `text.inverse`
- Pressed: `brand.primaryVariant` + `text.inverse`
- Disabled: `background.disabled` + `state.disabled`

---

#### Secondary Button

Less important actions (Cancel, Skip).

```tsx
<Pressable
  style={{
    backgroundColor: colors.brand.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  }}
>
  <Text style={{ color: colors.text.inverse }}>Cancel</Text>
</Pressable>
```

---

#### Outline Button

Alternative actions.

```tsx
<Pressable
  style={{
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.default,
  }}
>
  <Text style={{ color: colors.text.primary }}>Learn More</Text>
</Pressable>
```

---

### Inputs

#### Standard Input

```tsx
<View>
  {/* Label */}
  <Text style={{ color: colors.text.secondary, marginBottom: 8 }}>Email Address</Text>

  {/* Input */}
  <TextInput
    style={{
      backgroundColor: colors.background.input,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: 8,
      padding: 12,
      color: colors.text.primary,
    }}
    placeholderTextColor={colors.text.muted}
    placeholder="Enter your email"
  />

  {/* Helper text */}
  <Text style={{ color: colors.text.tertiary, marginTop: 4, fontSize: 12 }}>
    We'll never share your email
  </Text>
</View>
```

**Color Breakdown:**

- Container: `background.input`
- Border (default): `border.default`
- Border (focused): `border.focus`
- Border (error): `border.error`
- Input text: `text.primary`
- Placeholder: `text.muted`
- Label: `text.secondary`
- Helper text: `text.tertiary`
- Error message: `state.error`

---

### Cards

#### Standard Card

```tsx
<View
  style={{
    backgroundColor: colors.background.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  }}
>
  <Text style={{ color: colors.text.primary, fontSize: 18, fontWeight: '600' }}>Card Title</Text>
  <Text style={{ color: colors.text.secondary, marginTop: 4 }}>Card description goes here</Text>
  <Text style={{ color: colors.text.tertiary, marginTop: 8, fontSize: 12 }}>
    Posted 2 hours ago
  </Text>
</View>
```

---

## Islamic Components

### Prayer Time Cards

#### Active Prayer (Happening Now)

```tsx
<View
  style={{
    backgroundColor: colors.islamic.prayerActive,
    borderRadius: 12,
    padding: 16,
  }}
>
  <Text style={{ color: colors.text.inverse, fontSize: 20, fontWeight: '600' }}>Dhuhr</Text>
  <Text style={{ color: colors.text.inverse, fontSize: 16, marginTop: 4 }}>12:30 PM</Text>
  <Text style={{ color: colors.text.inverse, fontSize: 12, opacity: 0.8 }}>Current Prayer</Text>
</View>
```

#### Upcoming Prayer

```tsx
<View
  style={{
    backgroundColor: colors.background.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.islamic.prayerUpcoming,
  }}
>
  <Text style={{ color: colors.text.primary, fontSize: 18, fontWeight: '600' }}>Asr</Text>
  <Text style={{ color: colors.islamic.prayerUpcoming, fontSize: 16 }}>3:45 PM</Text>
  <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>Next Prayer</Text>
</View>
```

---

### Quran Reader

```tsx
<View
  style={{
    backgroundColor: colors.islamic.quranBackground,
    padding: 20,
    borderRadius: 12,
  }}
>
  {/* Arabic Text */}
  <Text
    style={{
      color: colors.islamic.quranText,
      fontSize: 24,
      lineHeight: 40,
      textAlign: 'right',
    }}
  >
    بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
  </Text>

  {/* Verse Number */}
  <View
    style={{
      backgroundColor: colors.islamic.verseNumber,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-end',
      marginTop: 12,
    }}
  >
    <Text style={{ color: colors.text.inverse, fontSize: 12 }}>1</Text>
  </View>
</View>
```

**Verse Highlighting:**

```tsx
// Add highlighted background
<View style={{
  backgroundColor: colors.islamic.verseHighlight,
  // ... other styles
}}>
```

---

### Tasbih Counter

```tsx
<View
  style={{
    backgroundColor: colors.islamic.tasbihBackground,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  }}
>
  {/* Count */}
  <Text
    style={{
      color: colors.islamic.tasbihText,
      fontSize: 64,
      fontWeight: 'bold',
    }}
  >
    33
  </Text>

  {/* Label */}
  <Text style={{ color: colors.text.secondary, fontSize: 16, marginTop: 8 }}>of 100</Text>
</View>
```

---

## Advanced Usage

### Dynamic Theme Switching

```tsx
import { useState } from 'react';
import { PRESETS } from '@/theme';

function App() {
  const [currentPreset, setCurrentPreset] = useState('emerald');
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = PRESETS[currentPreset][mode];

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const changePreset = (preset: string) => {
    setCurrentPreset(preset);
  };

  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}
```

---

### Custom Theme with User Input

```tsx
import { createCustomTheme } from '@/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ThemeCustomizer() {
  const [color, setColor] = useState('#0FA18F');
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const customTheme = createCustomTheme(color, mode, 'My Custom Theme');

  const saveTheme = async () => {
    await AsyncStorage.setItem('userTheme', JSON.stringify({ color, mode }));
  };

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem('userTheme');
    if (saved) {
      const { color, mode } = JSON.parse(saved);
      setColor(color);
      setMode(mode);
    }
  };

  return (
    <View>
      <ColorPicker value={color} onChange={setColor} />
      <Switch value={mode === 'dark'} onChange={(val) => setMode(val ? 'dark' : 'light')} />
      <Button title="Save" onPress={saveTheme} />
    </View>
  );
}
```

---

## Best Practices

### 1. Always Use Semantic Tokens

```tsx
// ✅ Good
<View style={{ backgroundColor: colors.background.surface }}>
  <Text style={{ color: colors.text.primary }}>Hello</Text>
</View>

// ❌ Bad
<View style={{ backgroundColor: '#FFFFFF' }}>
  <Text style={{ color: '#000000' }}>Hello</Text>
</View>
```

### 2. Follow Color Hierarchy

```tsx
// Text hierarchy
colors.text.primary; // Most important
colors.text.secondary; // Important
colors.text.tertiary; // Less important
colors.text.muted; // Least important

// Background hierarchy
colors.background.app; // Root
colors.background.surface; // Cards
colors.background.surfaceAlt; // Nested cards
```

### 3. Use Component-Specific Tokens

```tsx
// ✅ Good - Using component color
switchTrackOn: colors.component.switchTrackOn;

// ❌ Avoid - Using generic brand color
switchTrackOn: colors.brand.primary;
```

### 4. Test Both Light and Dark Modes

```tsx
// Always test your UI in both modes
const lightTheme = PRESETS.emerald.light;
const darkTheme = PRESETS.emerald.dark;
```

### 5. Use `text.inverse` on Colored Backgrounds

```tsx
// ✅ Good
<View style={{ backgroundColor: colors.brand.primary }}>
  <Text style={{ color: colors.text.inverse }}>Text</Text>
</View>

// ❌ Bad - Poor contrast
<View style={{ backgroundColor: colors.brand.primary }}>
  <Text style={{ color: colors.text.primary }}>Text</Text>
</View>
```

---

## Migration Guide

### From Old Theme System

```tsx
// Old
const oldColor = colors.primary; // Direct access

// New
const newColor = colors.brand.primary; // Semantic category
```

### Mapping Old to New

| Old                    | New                                   |
| ---------------------- | ------------------------------------- |
| `colors.primary`       | `colors.brand.primary`                |
| `colors.background`    | `colors.background.app` or `.surface` |
| `colors.text`          | `colors.text.primary`                 |
| `colors.textSecondary` | `colors.text.secondary`               |
| `colors.border`        | `colors.border.default`               |
| `colors.icon`          | `colors.icon.primary`                 |

---

## File Structure

```
src/theme/
├── DESIGN_GUIDE.md          ← You are here (Complete guide)
├── CHEAT_SHEET.md          ← Quick 5-pattern reference
├── QUICK_START.md          ← Beginner-friendly patterns
├── COMPONENT_GUIDE.md      ← All components reference
├── EXAMPLES.tsx            ← Copy-paste components
├── README.md               ← API documentation
├── index.ts                ← Main exports
├── types.ts                ← TypeScript definitions
├── config.ts               ← Theme configuration
├── theme-generator.ts      ← Theme generator + presets
├── light-theme.ts          ← Default light theme
├── dark-theme.ts           ← Default dark theme
├── fonts.ts                ← Font configuration
└── metrics.ts              ← Spacing/sizing
```

---

## Support & Resources

- **Quick Reference:** [CHEAT_SHEET.md](./CHEAT_SHEET.md)
- **Beginner Guide:** [QUICK_START.md](./QUICK_START.md)
- **Component Reference:** [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)
- **Code Examples:** [EXAMPLES.tsx](./EXAMPLES.tsx)
- **API Docs:** [README.md](./README.md)
- **Type Definitions:** [types.ts](./types.ts)

---

## Contributing

When adding new color tokens:

1. Add the property to the interface in `types.ts`
2. Add comprehensive documentation with `@usage` and `@examples`
3. Update both `light-theme.ts` and `dark-theme.ts`
4. Update the theme generator in `theme-generator.ts`
5. Add examples to this guide
6. Update `COMPONENT_GUIDE.md` if it's a new component pattern

---

**Made with ❤️ for the Sabeel Islamic App**
