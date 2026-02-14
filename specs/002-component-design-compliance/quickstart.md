# Quickstart: Component Design System Compliance

**Branch**: `002-component-design-compliance`

## Overview

This feature ensures all 13 common components comply with the Sabeel design system, enhances them with industry-standard variants, and migrates feature code to use them comprehensively.

## Prerequisites

- Node.js + npm installed
- Expo CLI (`npx expo`)
- Repository cloned and on branch `002-component-design-compliance`

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run validation (type-check + lint)
npm run validate
```

## Work Order

### Phase 1: Component Compliance (P1)

Fix structural and compliance issues in common components:

1. **CircularProgress** - Add missing `.styles.ts`, extract inline SVG props
2. **CustomTabBar** - Add missing `.types.ts`
3. **All components** - Replace hardcoded values with theme metrics
4. **All components** - Add JSDoc documentation where missing

### Phase 2: Component Enhancement (P2)

Add industry-standard variants:

1. **Button** - Add `fullWidth`, expand color options (success, error, warning, info)
2. **Card** - Add `onPress`, `loading` props
3. **Typography** - Add `strikethrough`, `underline`, `disabled` color
4. **Input** - Add `clearable`, `required`, `showCount`
5. **SegmentedControl** - Full rewrite of API (structured options, sizes, disabled)
6. **SearchInput** - Add `onSearch`, `loading`, `size`, `disabled`
7. **CircularProgress** - Add `indeterminate`, `showLabel`, `status`, `children`
8. **Select** - Add `searchable`, `allowClear`, `loading`
9. **IconButton** - Add `loading` state
10. **Divider** - Add text label support, dashed variant
11. **DatePicker** - Add `clearable`, `format`

### Phase 3: Codebase Migration (P3)

Replace React Native primitives with common components:

1. `prayers/index.tsx` - Text → Typography, Pressable → Button
2. `settings/index.tsx` - Text → Typography
3. `VerseOfTheDay.tsx` - Pressable → IconButton
4. `RandomActsGrid.tsx` - View-as-card → Card
5. `FeaturedReciterCard.tsx` - Pressable → Card onPress
6. `LibraryTabBar.tsx` - Text → Typography, Pressable → Button
7. `AzkarProgress.tsx` - Pressable chips → Button small
8. `PrayersProgress.tsx` - Pressable circles → IconButton

## Key Files

```
src/common/components/     # Common components (modify here)
src/features/home/         # Home feature components (migrate)
src/features/library/      # Library feature components (migrate)
app/(main)/(tabs)/         # Screen files (migrate)
src/theme/                 # Design system (source of truth)
```

## Testing

After each component change:

1. Run `npm run validate` (type-check + lint)
2. Visually verify in Expo on both light and dark modes
3. Check against at least 2 theme presets (Emerald + one other)
4. Complete the test matrix checklist for final verification

## Constitution Compliance Reminders

- **Theme-Driven Styling**: Use `StyleSheet.create((theme) => ({...}))`, no inline styles
- **i18n First**: All user-facing strings via `t()` from react-i18next
- **Component Architecture**: Each folder: `.tsx`, `.styles.ts`, `.types.ts`, `index.ts`
- **Code Quality**: No `any` types, no unused imports, pass ESLint + Prettier
- **YAGNI**: Only add variants that match MUI/Ant Design intersection, not speculative features
