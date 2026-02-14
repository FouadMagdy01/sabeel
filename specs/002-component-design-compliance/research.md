# Research: Component Design System Compliance & Enhancement

**Date**: 2026-02-14 | **Branch**: `002-component-design-compliance`

## Decision 1: Component Compliance Findings

### Decision

All 13 components need varying levels of remediation to be fully design-system compliant.

### Findings

| Component        | Structure             | Hardcoded Values   | Theme      | JSDoc                      | Accessibility        | Priority |
| ---------------- | --------------------- | ------------------ | ---------- | -------------------------- | -------------------- | -------- |
| Button           | ✅ Complete           | ⚠️ Ripple opacity  | ✅         | ✅ Good                    | ⚠️ No a11y props     | Low      |
| Card             | ✅ Complete           | ✅ Clean           | ✅         | ⚠️ No component JSDoc      | ❌ None              | Medium   |
| CircularProgress | ❌ Missing .styles.ts | ⚠️ SVG props       | ✅ Partial | ⚠️ Missing component JSDoc | ❌ None              | High     |
| CustomTabBar     | ❌ Missing .types.ts  | ⚠️ Blur intensity  | ✅         | ❌ None                    | ✅ Good              | Medium   |
| DatePicker       | ✅ Complete           | ✅ Clean           | ✅         | ✅ Good                    | ⚠️ Basic             | Low      |
| Divider          | ✅ Complete           | ⚠️ Opacity 0.5     | ✅         | ⚠️ No component JSDoc      | ❌ None              | Medium   |
| Icon             | ✅ Complete           | ✅ Clean           | ✅         | ✅ Good                    | ❌ None (acceptable) | Low      |
| IconButton       | ✅ Complete           | ✅ Clean           | ✅         | ✅ Good                    | ⚠️ Basic             | Low      |
| Input            | ✅ Complete           | ⚠️ marginBottom:2  | ✅         | ✅ Good                    | ⚠️ Basic             | Low      |
| SearchInput      | ✅ Complete           | ✅ Clean           | ✅         | ✅ Good                    | ⚠️ Basic             | Low      |
| SegmentedControl | ✅ Complete           | ⚠️ Shadow props    | ✅         | ❌ None                    | ❌ None              | High     |
| Select           | ✅ Complete           | ✅ Clean           | ✅         | ✅ Good                    | ⚠️ Minimal           | Low      |
| Typography       | ✅ Complete           | ⚠️ letterSpacing:3 | ✅         | ⚠️ No component JSDoc      | ❌ None (inherited)  | Medium   |

### Rationale

Prioritized by severity: structure issues > JSDoc gaps > hardcoded values > accessibility gaps.

## Decision 2: Standard UI Library Variants (MUI/Ant Design Intersection)

### Decision

Components should support the common variant intersection of Material UI and Ant Design.

### Required Variants Per Component

**Button** (Current: 5 variants, 2 colors, 3 sizes)

- ✅ Has: contained, outlined, text, elevated, transparent
- ✅ Has: primary, secondary colors
- ✅ Has: small, medium, large sizes
- ✅ Has: loading, disabled, icon placement, fullWidth (missing - add `fullWidth`/`block` prop)
- ❌ Missing: `danger`/`error` color, `success`/`warning`/`info` colors
- ❌ Missing: `block`/`fullWidth` prop

**Card** (Current: 4 variants, 3 radii, 4 paddings)

- ✅ Has: elevated, outlined, filled, gradient
- ✅ Has: padding sizes (none, sm, md, lg)
- ❌ Missing: `onPress`/`hoverable` for pressable cards
- ❌ Missing: `loading` skeleton state
- ❌ Missing: Composite sections (header, body, footer)

**Typography** (Current: 5 types, 9 sizes, 4 weights, 11 colors)

- ✅ Has: heading, body, caption, label, overline
- ✅ Has: extensive size scale (xxs to 4xl)
- ✅ Has: weight, color, align, uppercase, italic
- ❌ Missing: `numberOfLines`/`ellipsis` as first-class prop (available via spread)
- ❌ Missing: `strikethrough`/`underline` props
- ❌ Missing: `disabled` color variant mapped to `colors.state.disabled`

**Input** (Current: 3 variants, 3 sizes)

- ✅ Has: outlined, filled, underlined
- ✅ Has: small, medium, large
- ✅ Has: disabled, error, success, label, helperText, errorText
- ✅ Has: leftElement, rightElement (prefix/suffix)
- ❌ Missing: `showCount`/`maxLength` display
- ❌ Missing: `clearable`/`allowClear` prop
- ❌ Missing: `required` visual indicator

**IconButton** (Current: 4 variants, 5 colors, 3 sizes)

- ✅ Has: filled, outlined, ghost, tinted
- ✅ Has: primary, success, error, warning, info
- ✅ Has: small, medium, large
- ❌ Missing: `loading` state
- ❌ Missing: `badge` prop or composable badge support
- ❌ Missing: `tooltip` prop

**Select** (Current: 2 variants, 3 sizes)

- ✅ Has: outlined, filled variants
- ✅ Has: small, medium, large
- ✅ Has: disabled, error, placeholder, label
- ❌ Missing: `searchable`/`showSearch` prop
- ❌ Missing: `allowClear` prop
- ❌ Missing: `multiple` selection mode
- ❌ Missing: `loading` state

**Divider** (Current: 2 orientations, 2 variants)

- ✅ Has: horizontal, vertical orientation
- ✅ Has: line, dot variants
- ❌ Missing: `children`/text label within divider
- ❌ Missing: `textAlign` for label position (left, center, right)
- ❌ Missing: `dashed` style variant

**SegmentedControl** (Current: minimal API)

- ✅ Has: segments, selectedIndex, onChange
- ❌ Missing: `size` prop (small, medium, large)
- ❌ Missing: `disabled` prop (whole control)
- ❌ Missing: Per-segment `disabled` state
- ❌ Missing: Icon support per segment
- ❌ Missing: `block`/`fullWidth` prop
- ❌ Missing: Controlled/uncontrolled value pattern

**SearchInput** (Current: basic API)

- ✅ Has: value, onClear, showClearButton, search icon
- ❌ Missing: `onSearch`/`onSubmit` callback (enter key)
- ❌ Missing: `loading` state indicator
- ❌ Missing: `size` prop
- ❌ Missing: `disabled` prop
- ❌ Missing: `enterButton` search action button

**CircularProgress** (Current: basic API)

- ✅ Has: progress (0-1), size, strokeWidth, color, trackColor
- ❌ Missing: `indeterminate` mode (spinning animation)
- ❌ Missing: `showLabel`/`showInfo` for percentage display
- ❌ Missing: `status` color mapping (success, error, warning)
- ❌ Missing: `children` for center content

**DatePicker** (Current: good API)

- ✅ Has: value, onChange, min/max dates, disabled, error
- ✅ Has: variant, size, label, helperText, errorText
- ❌ Missing: `clearable`/`allowClear` prop
- ❌ Missing: `showTime` mode
- ❌ Missing: `format` display formatting

### Alternatives Considered

- Implementing every MUI prop (rejected: too many, violates YAGNI)
- Only implementing props used in current codebase (rejected: user chose industry-standard)
- Custom variant system (rejected: standard patterns improve developer familiarity)

## Decision 3: Codebase Migration Targets

### Decision

6 files need refactoring, 2 files need minor adjustments.

### Files Requiring Refactoring

| File                                                                          | Issue                                          | Migration Action                            |
| ----------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------- |
| `app/(main)/(tabs)/prayers/index.tsx`                                         | Direct `<Text>`, `<Pressable>`                 | Replace with `<Typography>`, `<Button>`     |
| `app/(main)/(tabs)/settings/index.tsx`                                        | Direct `<Text>`                                | Replace with `<Typography>`                 |
| `src/features/home/components/VerseOfTheDay/VerseOfTheDay.tsx`                | Direct `<Pressable>` for share button          | Replace with `<IconButton>`                 |
| `src/features/home/components/RandomActsGrid/RandomActsGrid.tsx`              | `<View>` styled as cards, direct `<Pressable>` | Replace with `<Card>` + pressable pattern   |
| `src/features/library/components/FeaturedReciterCard/FeaturedReciterCard.tsx` | Direct `<Pressable>` wrapping card             | Replace with `<Card>` onPress or `<Button>` |
| `src/features/library/components/LibraryTabBar/LibraryTabBar.tsx`             | Direct `<Text>`, `<Pressable>`                 | Replace with `<Typography>`, `<Button>`     |

### Files Needing Minor Adjustments

| File                                                               | Issue                                     | Migration Action                  |
| ------------------------------------------------------------------ | ----------------------------------------- | --------------------------------- |
| `src/features/home/components/AzkarProgress/AzkarProgress.tsx`     | Direct `<Pressable>` for chips            | Consider `<Button>` small variant |
| `src/features/home/components/PrayersProgress/PrayersProgress.tsx` | Direct `<Pressable>` for circular buttons | Consider `<IconButton>`           |

### Files Already Using Common Components Well (14 files)

All library card components (FavoriteSuraCard, FavoriteAyaCard, DownloadedSuraCard, etc.), home components (CurrentPrayerCard, StatsCard, DailyTodos), and content containers properly use Card, Typography, Icon, IconButton, Divider, and Button.

### Rationale

Comprehensive migration per user choice. Prioritized by visibility (screens > feature components) and severity (Text replacement is straightforward, Pressable replacement requires careful prop mapping).

## Decision 4: JSDoc Documentation Standard

### Decision

All components must have: @param for all props, component-level @example, @default for optional props.

### Template

````typescript
/**
 * Brief description of component purpose.
 *
 * @example
 * ```tsx
 * <Component variant="primary" size="medium">
 *   Content
 * </Component>
 * ```
 */

interface ComponentProps {
  /**
   * Description of what this prop does.
   * @default 'defaultValue'
   */
  propName?: PropType;
}
````

### Components Needing JSDoc Updates

- Card (missing component-level JSDoc)
- CircularProgress (missing component-level JSDoc)
- CustomTabBar (no JSDoc at all)
- Divider (missing component-level JSDoc)
- SegmentedControl (no JSDoc at all)
- Typography (missing component-level JSDoc)

## Decision 5: Test Matrix Validation Approach

### Decision

Create a systematic checklist covering all 130 combinations (13 components × 5 themes × 2 modes).

### Format

A markdown checklist organized by component, with sub-items per theme preset and mode. Validators check off each combination after visual verification in the running app.

### Rationale

Manual but systematic approach ensures no combination is missed. Checklist serves as documentation of test coverage for the PR.
