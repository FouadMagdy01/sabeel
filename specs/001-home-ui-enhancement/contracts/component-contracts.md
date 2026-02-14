# Component Contracts: Home Screen UI Enhancement

**Feature**: 001-home-ui-enhancement
**Date**: 2026-02-14
**Purpose**: Define component interfaces (props) for redesigned components

## Overview

This feature does not introduce new API endpoints or backend contracts. Instead, it defines React component prop contracts for the two modified UI components.

## Component Contracts

### AzkarProgress Component

**Location**: `src/features/home/components/AzkarProgress/AzkarProgress.tsx`

**Purpose**: Display Azkar completion progress in a hybrid card with header progress indicator and chip items.

**Props Interface**:

```typescript
interface AzkarProgressProps {
  azkar: AzkarData[]; // Array of exactly 3 Azkar items
  onAzkarPress: (azkar: AzkarData) => void; // Callback when chip is pressed
}
```

**Prop Validation**:

- `azkar`: MUST be non-empty array of AzkarData
  - Expected length: 3 (Morning, Evening, Night)
  - Each item MUST have valid `type` and `status`
- `onAzkarPress`: MUST be a function
  - Called with the pressed AzkarData item
  - Enables parent component to handle navigation or modal display

**Return Type**: `JSX.Element`

**Side Effects**: None (pure presentation component)

**Examples**:

```typescript
// Typical usage in DailyTodos component
<AzkarProgress
  azkar={DUMMY_AZKAR}
  onAzkarPress={(a) => navigateToAzkarDetail(a.type)}
/>
```

**Accessibility**:

- Each chip MUST have minimum 44x44pt touch target (FR-005)
- Pressable elements provide visual feedback per platform
- Status indicated visually (color + icon) for color-blind users

---

### RandomActsGrid Component

**Location**: `src/features/home/components/RandomActsGrid/RandomActsGrid.tsx`

**Purpose**: Display random acts in a vertical list of equal-sized cards with completion progress.

**Props Interface**:

```typescript
interface RandomActsGridProps {
  acts: RandomActData[]; // Array of 3-6 random act items
  onActPress: (act: RandomActData) => void; // Callback when card is pressed
}
```

**Prop Validation**:

- `acts`: MUST be non-empty array of RandomActData
  - Expected length: 3-6 items
  - Each item MUST have valid `id`, `title`, `iconFamily`, `iconName`, `status`
- `onActPress`: MUST be a function
  - Called with the pressed RandomActData item
  - Enables parent to handle completion logic or detail view

**Return Type**: `JSX.Element`

**Side Effects**: None (pure presentation component)

**Examples**:

```typescript
// Typical usage in DailyTodos component
<RandomActsGrid
  acts={DUMMY_RANDOM_ACTS}
  onActPress={(act) => handleActCompletion(act.id)}
/>
```

**Accessibility**:

- Each card MUST have minimum 44x44pt touch target
- Equal-sized cards ensure consistent interaction area
- Status indicated visually (color + icon + badge)

---

## Style Contracts

Both components MUST adhere to design system contracts:

### Color Usage

```typescript
// MUST use semantic tokens only
theme.colors.brand.*        // Brand colors
theme.colors.text.*         // Text colors
theme.colors.background.*   // Background colors
theme.colors.state.*        // State colors (success, info, etc.)
theme.colors.icon.*         // Icon color variants
theme.colors.overlay.*      // Interaction overlays
```

### Spacing Usage

```typescript
// MUST use metric functions
theme.metrics.spacing.*     // Horizontal spacing (p4, p8, p12, p16, p24)
theme.metrics.spacingV.*    // Vertical spacing
theme.metrics.fontSize.*    // Font sizes
```

### Component Dependencies

```typescript
// MUST use existing design system components
import { Card } from '@/common/components/Card';
import { Typography } from '@/common/components/Typography';
import { Icon } from '@/common/components/Icon';
import { CircularProgress } from '@/common/components/CircularProgress';
```

---

## Backwards Compatibility

**Breaking Changes**: None

Both components maintain their existing prop interfaces. The redesign is purely visual - no prop changes, no behavioral changes to callbacks.

**Migration Path**: N/A (backwards compatible)

---

## Testing Contract

### Unit Test Coverage (Optional)

If tests are added (per constitution, tests are optional):

**AzkarProgress**:

- Renders 3 chips for 3 azkar items
- Calculates percentage correctly (0%, 33%, 67%, 100%)
- Calls onAzkarPress with correct item when chip pressed
- Displays correct icons for completed/uncompleted status

**RandomActsGrid**:

- Renders all act cards in vertical list
- Orders cards: completed → unlocked → locked
- Calculates percentage correctly
- Calls onActPress with correct item when card pressed
- Displays correct icons/badges for each status

### Visual Regression Testing (Recommended)

- Screenshot tests for light mode
- Screenshot tests for dark mode
- Screenshot tests for different azkar/act completion states
- Screenshot tests for responsive layouts (320px, 375px, 414px, 768px, 1024px widths)

---

## Integration Points

### Parent Component: DailyTodos

**Location**: `src/features/home/components/DailyTodos/DailyTodos.tsx`

**Integration**:

- DailyTodos renders both components
- DailyTodos provides callback handlers
- DailyTodos handles data fetching/state (out of scope for this feature)
- No changes required to DailyTodos beyond existing props

**Example Integration**:

```typescript
<View style={styles.container}>
  <Typography type="overline">{t('screens.home.dailyTodos.sectionTitle')}</Typography>
  <PrayersProgress prayers={prayers} onPrayerPress={onPrayerPress} />
  <AzkarProgress azkar={azkar} onAzkarPress={onAzkarPress} />  {/* Redesigned */}
  <RandomActsGrid acts={randomActs} onActPress={onActPress} />   {/* Redesigned */}
</View>
```

---

## No API/Backend Contracts

This feature is **purely frontend UI redesign**. There are:

- No REST API endpoints
- No GraphQL queries/mutations
- No database schema changes
- No backend service modifications
- No WebSocket contracts
- No external service integrations

All data is consumed from existing in-memory structures passed via props.

---

**Phase 1 Complete**: Component contracts documented

**Next**: Create quickstart.md
