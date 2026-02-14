# Sabeel Theme System

A comprehensive, Islamic-inspired design system with extensive color customization, accessibility features, and multiple predefined themes.

## Features

- **5 Predefined Islamic Themes**: Emerald, Desert, Sapphire, Moonlight, and Royal
- **Light & Dark Modes**: Each theme has both light and dark variants
- **Custom Theme Generator**: Create personalized themes from any color
- **Comprehensive Color Tokens**: Semantic color tokens for every UI element
- **TypeScript Documentation**: Detailed usage documentation for each color token
- **Design System Ready**: Colors optimized for buttons, inputs, toggles, icons, and more

## 🚀 New to Design? Start Here!

1. **📄 [CHEAT_SHEET.md](./CHEAT_SHEET.md)** - The 5 most common patterns (30 sec read) ⭐ **START HERE**
2. **📋 [QUICK_START.md](./QUICK_START.md)** - Simple patterns for buttons, inputs, cards (2 min read)
3. **📖 [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)** - Complete reference for all components
4. **💻 [EXAMPLES.tsx](./EXAMPLES.tsx)** - Copy-paste ready React Native components

## Quick Start

### Using Predefined Themes

```tsx
import { PRESETS } from '@/theme/config';

// Use Emerald theme (default)
const theme = PRESETS.emerald.light;

// Use Desert dark theme
const darkDesert = PRESETS.desert.dark;

// Access colors
const primaryColor = theme.colors.brand.primary;
const backgroundColor = theme.colors.background.app;
```

### Available Presets

1. **Emerald** 🕌 - Traditional Islamic teal inspired by mosque architecture
2. **Desert** 🏜️ - Warm desert sands and golden tones
3. **Sapphire** 🔷 - Deep blue inspired by mosque domes
4. **Moonlight** 🌙 - Cool silver tones for night prayers
5. **Royal** 👑 - Rich purple and gold from Islamic manuscripts

### Creating Custom Themes

```tsx
import { createCustomTheme } from '@/theme/config';

// Create a custom pink theme
const pinkTheme = createCustomTheme('#E91E63', 'light', 'Pink Blossom', 'A beautiful pink theme');

// Use the custom theme
const primaryColor = pinkTheme.colors.brand.primary;
```

### Getting All Themes

```tsx
import { getAllThemePresets } from '@/theme/config';

// Get all 10 themes (5 presets × 2 modes)
const allThemes = getAllThemePresets();

// Display in UI
allThemes.map((theme) => (
  <ThemeCard
    key={theme.id}
    name={theme.name}
    description={theme.description}
    colors={theme.colors}
  />
));
```

## Color Token Structure

### Brand Colors

Main brand identity colors used throughout the app.

```tsx
colors.brand.primary; // Main CTAs, primary buttons
colors.brand.secondary; // Secondary actions, links
colors.brand.tertiary; // Subtle accents
colors.brand.primaryVariant; // Hover/pressed states
colors.brand.secondaryVariant;
```

### Background Colors

Surface and layout backgrounds.

```tsx
colors.background.app; // Main app background
colors.background.surface; // Cards, sheets
colors.background.surfaceAlt; // Nested surfaces, dialogs
colors.background.section; // Grouped content sections
colors.background.elevated; // FAB, tooltips
colors.background.input; // Input fields
colors.background.disabled; // Disabled elements
```

### Text Colors

All typography colors with semantic naming.

```tsx
colors.text.primary; // Main content
colors.text.secondary; // Subheadings
colors.text.tertiary; // Metadata, timestamps
colors.text.muted; // Placeholders, disabled
colors.text.inverse; // Text on dark backgrounds
colors.text.accent; // Highlighted text
colors.text.link; // Clickable links
colors.text.linkHover; // Link hover state
```

### Border Colors

```tsx
colors.border.default; // Standard borders
colors.border.subtle; // Light dividers
colors.border.strong; // Emphasized borders
colors.border.focus; // Focus states
colors.border.disabled; // Disabled elements
```

### Icon Colors

```tsx
colors.icon.primary; // Main interactive icons
colors.icon.secondary; // Supporting icons
colors.icon.tertiary; // Subtle icons
colors.icon.muted; // Disabled icons
colors.icon.inverse; // Icons on dark backgrounds
colors.icon.accent; // Special attention icons
```

### State Colors

Feedback and status indicators.

```tsx
colors.state.success; // Success messages
colors.state.successBg; // Success backgrounds
colors.state.warning; // Warnings
colors.state.warningBg; // Warning backgrounds
colors.state.error; // Errors
colors.state.errorBg; // Error backgrounds
colors.state.info; // Info messages
colors.state.infoBg; // Info backgrounds
colors.state.disabled; // Disabled state
```

### Overlay Colors

Modal overlays, shadows, and interactive feedback.

```tsx
colors.overlay.modal; // Modal backdrop
colors.overlay.pressed; // Press ripple effect
colors.overlay.hover; // Hover feedback
colors.overlay.focus; // Focus indicator
colors.overlay.shadow; // Drop shadows
```

### Gradient Colors

Multi-color gradients for special effects.

```tsx
colors.gradient.primary; // [start, end]
colors.gradient.secondary;
colors.gradient.sacred; // For Quran, prayers
colors.gradient.success;
colors.gradient.premium;
```

### Shadow Configuration

```tsx
colors.shadow.color; // Shadow color
colors.shadow.elevation; // Default elevation
colors.shadow.elevationSmall; // Small elevation
colors.shadow.elevationMedium; // Medium elevation
colors.shadow.elevationLarge; // Large elevation
```

## Usage Examples

### Button Component

```tsx
import { useTheme } from '@/hooks/useTheme';

const PrimaryButton = ({ onPress, children }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      style={{
        backgroundColor: colors.brand.primary,
        borderRadius: 8,
        padding: 16,
      }}
      onPress={onPress}
    >
      <Text style={{ color: colors.text.inverse }}>{children}</Text>
    </Pressable>
  );
};
```

### Prayer Time Card

```tsx
const PrayerCard = ({ prayer, isActive, isPassed }) => {
  const { colors } = useTheme();

  const backgroundColor = isActive
    ? colors.brand.primary
    : isPassed
      ? colors.background.section
      : colors.background.surface;

  const textColor = isActive
    ? colors.text.inverse
    : isPassed
      ? colors.text.muted
      : colors.text.primary;

  return (
    <View style={{ backgroundColor, padding: 16, borderRadius: 12 }}>
      <Text style={{ color: textColor }}>{prayer.name}</Text>
      <Text style={{ color: textColor }}>{prayer.time}</Text>
    </View>
  );
};
```

### Quran Reader

```tsx
const QuranVerse = ({ verse, isHighlighted }) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.background.section,
        padding: 20,
      }}
    >
      {isHighlighted && (
        <View
          style={{
            backgroundColor: colors.overlay.focus,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 24,
          textAlign: 'right',
        }}
      >
        {verse.arabicText}
      </Text>
      <View
        style={{
          backgroundColor: colors.brand.tertiary,
          borderRadius: 16,
          padding: 8,
        }}
      >
        <Text style={{ color: colors.text.inverse }}>{verse.number}</Text>
      </View>
    </View>
  );
};
```

### Custom Theme Picker

```tsx
import { createCustomTheme } from '@/theme/config';
import { useState } from 'react';

const ThemeCustomizer = () => {
  const [color, setColor] = useState('#0FA18F');
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const customTheme = createCustomTheme(color, mode, 'My Custom Theme');

  return (
    <View>
      <ColorPicker value={color} onChange={setColor} />
      <SegmentedControl
        values={['light', 'dark']}
        selectedIndex={mode === 'light' ? 0 : 1}
        onChange={(index) => setMode(index === 0 ? 'light' : 'dark')}
      />
      <ThemePreview theme={customTheme} />
    </View>
  );
};
```

## TypeScript Integration

All color tokens have full TypeScript support with detailed documentation.

```tsx
import type { ThemeColors } from '@/theme/types';

// Autocomplete will show all available color tokens
// with usage documentation
function MyComponent({ colors }: { colors: ThemeColors }) {
  // Hover over any color to see its documentation
  const primary = colors.brand.primary;

  // TypeScript will catch typos
  // const invalid = colors.brand.primaryy; // ❌ Error
}
```

## Best Practices

1. **Use Semantic Tokens**: Always use semantic color tokens instead of hard-coded values

   ```tsx
   // ✅ Good
   backgroundColor: colors.background.surface;

   // ❌ Bad
   backgroundColor: '#FFFFFF';
   ```

2. **Follow Usage Guidelines**: Each color token has `@usage` and `@examples` in its documentation

3. **Test Both Modes**: Always test your UI in both light and dark modes
   ```tsx
   const theme = PRESETS.emerald.light; // Test light
   const darkTheme = PRESETS.emerald.dark; // Test dark
   ```

## Migration Guide

### From Old Theme System

```tsx
// Old
const oldColor = colors.brand.primary; // "#b39262"

// New - More semantic and comprehensive
const newColor = colors.brand.primary; // "#B08A54"
const hoverColor = colors.brand.primaryVariant; // For hover states
const accentColor = colors.text.accent; // For sacred text
```

### Adding New Components

When creating new components, choose the appropriate semantic token:

```tsx
// For a new notification badge
backgroundColor: colors.state.error;
textColor: colors.background.elevated;

// For a new success message
backgroundColor: colors.state.successBg;
textColor: colors.state.success;
borderColor: colors.state.success;
```

## Advanced Usage

### Dynamic Theme Switching

```tsx
import { useState } from 'react';
import { PRESETS } from '@/theme/config';

const App = () => {
  const [currentTheme, setCurrentTheme] = useState(PRESETS.emerald.light);

  const switchToDark = () => {
    setCurrentTheme(PRESETS.emerald.dark);
  };

  const switchPreset = (preset: keyof typeof PRESETS) => {
    setCurrentTheme(PRESETS[preset].light);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <YourApp />
    </ThemeProvider>
  );
};
```

### Saving User Preferences

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createCustomTheme } from '@/theme/config';

// Save custom theme
const saveCustomTheme = async (color: string, mode: 'light' | 'dark') => {
  const theme = createCustomTheme(color, mode);
  await AsyncStorage.setItem('userTheme', JSON.stringify(theme));
};

// Load custom theme
const loadCustomTheme = async () => {
  const saved = await AsyncStorage.getItem('userTheme');
  return saved ? JSON.parse(saved) : PRESETS.emerald.light;
};
```

## Contributing

When adding new color tokens:

1. Add the property to the appropriate interface in `src/theme/types.ts`
2. Add comprehensive TypeScript documentation with `@usage` and `@examples`
3. Update both `light-theme.ts` and `dark-theme.ts`
4. Update the theme generator in `theme-generator.ts`
5. Add usage examples to this README

## Support

For questions or issues with the theme system, please refer to:

- TypeScript hover documentation for each color token
- This README for usage examples
- `src/theme/types.ts` for complete type definitions
