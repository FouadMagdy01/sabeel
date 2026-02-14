# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sabeel is an Islamic mobile application built with React Native and Expo, featuring prayer times, Quran reading, daily tasks, and spiritual tracking. The app uses a comprehensive theming system with support for multiple Islamic-inspired color schemes and full light/dark mode support.

## Tech Stack

- **Framework**: React Native 0.81.5 + Expo SDK 54
- **Routing**: expo-router (file-based routing)
- **Language**: TypeScript 5.9.2
- **Styling**: react-native-unistyles 3.0.20
- **State Management**: @tanstack/react-query 5.90.20
- **Backend**: Supabase (@supabase/supabase-js)
- **i18n**: react-i18next 16.5.3
- **Storage**: react-native-mmkv 4.1.0
- **Animations**: react-native-reanimated 4.1.1
- **Fonts**: Cairo family (Arabic + English support)

## Commands

```bash
# Development
npm start                  # Start Expo development server
npm run android            # Run on Android device/emulator
npm run ios                # Run on iOS device/simulator
npm run web                # Run web version

# Code Quality
npm run validate           # Run all checks (type-check + lint + format:check)
npm run type-check         # TypeScript type checking
npm run lint               # Run ESLint
npm run lint:fix           # Auto-fix ESLint errors
npm run format             # Format all files with Prettier
npm run format:check       # Check formatting without modifying files

# Testing
npm test                   # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report

# Building
npm run build:android      # Build Android APK
npm run build:ios          # Build iOS app
```

## Project Structure

```
src/
├── common/
│   └── components/        # Reusable UI components (Button, Icon, Input, etc.)
├── features/              # Feature-specific modules
│   ├── auth/             # Authentication flows
│   ├── home/             # Home screen components and logic
│   └── library/          # Library feature
├── theme/                # Complete theming system
│   ├── types.ts          # TypeScript definitions for theme
│   ├── light-theme.ts    # Light mode color tokens
│   ├── dark-theme.ts     # Dark mode color tokens
│   ├── config.ts         # Theme configuration and presets
│   ├── metrics.ts        # Responsive sizing utilities (rf, hs, vs)
│   └── README.md         # Theme system documentation
├── i18n/                 # Internationalization
│   ├── locales/          # Translation files (en.json, ar.json)
│   └── config.ts         # i18n configuration
├── providers/            # React context providers
├── services/             # API and backend services
├── integrations/         # Third-party integrations
└── utils/                # Utility functions

app/                      # Expo Router file-based routing
├── _layout.tsx          # Root layout with providers
├── (auth)/              # Authentication routes
└── (main)/              # Main app routes
    └── (tabs)/          # Bottom tab navigation
```

## Path Aliases

TypeScript and Babel are configured with path aliases:

- `@/*` → `src/*` (e.g., `@/common/components/Button`)
- `~/*` → `app/*` (e.g., `~/screens/Home`)

## Theme System

The app uses a comprehensive semantic token system with 5 predefined Islamic-themed presets (Emerald, Desert, Sapphire, Moonlight, Royal), each with light and dark variants.

### Key Concepts

- **Semantic Tokens**: Use `colors.brand.primary`, `colors.text.secondary`, etc. instead of hardcoded values
- **No `.name` Property**: Theme object doesn't have `.name`. Use `theme.colors.mode` to check light/dark
- **Responsive Metrics**: Use `rf(16)` for font sizes, `hs(20)` for horizontal spacing, `vs(24)` for vertical spacing
- **Styling Pattern**: Use `createStyleSheet((theme) => ({...}))` from react-native-unistyles

### Quick Reference

```tsx
import { createStyleSheet } from 'react-native-unistyles';

const styles = createStyleSheet((theme) => ({
  button: {
    backgroundColor: theme.colors.brand.primary,
    paddingHorizontal: spacing.p16,
    paddingVertical: spacingV.p12,
    borderRadius: 8,
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: fontSize.md,
  },
}));
```

For detailed guidance, see:

- `src/theme/CHEAT_SHEET.md` - 5 most common patterns (30 sec read)
- `src/theme/QUICK_START.md` - Simple patterns for buttons, inputs, cards
- `src/theme/COMPONENT_GUIDE.md` - Complete component reference
- `src/theme/README.md` - Full theme system documentation

## Component Structure

Each component follows a consistent structure:

```
Component/
├── Component.tsx          # Main component implementation
├── Component.styles.ts    # Styles using createStyleSheet
├── Component.types.ts     # TypeScript interfaces
└── index.ts              # Public exports
```

### Component Organization

- **Common Components**: Reusable UI in `src/common/components/`
- **Feature Components**: Feature-specific in `src/features/<feature>/components/`

## Internationalization (i18n)

- All user-facing text must use `useTranslation()` hook
- Translation keys are nested in `src/i18n/locales/en.json` and `ar.json`
- ESLint enforces no hardcoded strings with `i18next/no-literal-string` rule

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<Text>{t('auth.login.title')}</Text>;
```

## Code Quality & Linting

### ESLint Rules (Strict Enforcement)

- **No `any` types**: All TypeScript must be properly typed
- **No inline styles**: Use `createStyleSheet` for all styling
- **No hardcoded strings**: Use i18n for all user-facing text
- **No unused imports/variables**: Automatically removed on commit
- **No color literals**: Use theme tokens (warns on hardcoded colors)

### Git Hooks (Husky)

- **pre-commit**: Runs lint-staged (ESLint + Prettier + TypeScript type-check on staged files)
- **commit-msg**: Validates commit messages with commitlint

### Commit Message Format

Follow conventional commits:

```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
Examples:
  feat: add tasbih counter component
  fix(prayers): resolve time calculation bug
  docs: update README with new features
```

## Icons

Use the `Icon` component wrapper (not direct @expo/vector-icons):

```tsx
import { Icon } from '@/common/components/Icon';

<Icon name="home" family="Ionicons" variant="primary" size={24} />;
```

Variants: `primary`, `secondary`, `tertiary`, `muted`, `inverse`, `accent`

## Fonts

Cairo font family is used throughout:

- Cairo-Regular (default)
- Cairo-Bold
- Cairo-SemiBold
- Cairo-Medium
- Cairo-Light
- Cairo-ExtraLight
- Cairo-ExtraBold
- Cairo-Black

## Testing

- Test files: `*.test.ts(x)` or `*.spec.ts(x)` or in `__tests__/` directories
- Uses Jest + jest-expo + @testing-library/react-native
- Run specific test: `npm test -- ComponentName.test.tsx`

## Important Notes

- **Expo Router**: File-based routing. Files in `app/` directory auto-generate routes
- **New Architecture**: Enabled (`newArchEnabled: true` in app.json)
- **React Compiler**: Experimental mode enabled
- **RTL Support**: App supports Arabic (RTL) via i18n
- **Type Safety**: Typed routes enabled with `experiments.typedRoutes: true`

## Excluded from Linting

These paths are intentionally excluded from ESLint:

- `src/theme/EXAMPLES.tsx` - Documentation with intentional inline styles
- `src/utils/**` - To be fixed in separate PR
- `src/services/**` - To be fixed in separate PR
- `src/common/components/Icon/**` - Icon components use color literals

## Active Technologies

- TypeScript 5.9.2, React Native 0.81.5, Expo SDK 54 + `react-native-unistyles` 3.0.20, `react-i18next` 16.5.3, `react-native-reanimated` 4.1.1, `react-native-svg` (003-fix-component-issues, 004-refactor-map-renderers)
- N/A (UI refactoring only) (003-fix-component-issues, 004-refactor-map-renderers)

## Recent Changes

- 003-fix-component-issues: Fixed component design compliance (CircularProgress SVG rotation, Card pressable feedback, DatePicker i18n + Typography)
- 004-refactor-map-renderers: Added TypeScript 5.9.2, React Native 0.81.5, Expo SDK 54 + react-native-unistyles 3.0.20, react-i18next 16.5.3, react-native-reanimated 4.1.1
