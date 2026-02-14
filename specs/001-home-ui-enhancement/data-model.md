# Data Model: Home Screen UI Enhancement

**Feature**: 001-home-ui-enhancement
**Date**: 2026-02-14
**Purpose**: Document data structures and relationships for Azkar and Random Acts components

## Overview

This feature is **UI-only** and does not introduce new data models. It consumes existing data structures defined in `src/features/home/types/home.types.ts`. This document captures the existing entities for reference during implementation.

## Existing Entities (No Modifications)

### AzkarData

Represents a single Azkar (Islamic remembrance) item with completion status.

**Source**: `src/features/home/types/home.types.ts`

**Structure**:

```typescript
export type AzkarType = 'Morning' | 'Evening' | 'Night';
export type AzkarStatus = 'completed' | 'uncompleted';

export interface AzkarData {
  type: AzkarType;
  status: AzkarStatus;
}
```

**Attributes**:

- `type` (AzkarType): The time period for the Azkar - Morning, Evening, or Night
- `status` (AzkarStatus): Completion state - completed or uncompleted

**Constraints**:

- Type is restricted to 3 values (Morning, Evening, Night)
- Status is binary (completed or uncompleted)
- No ID field - type serves as unique identifier

**Usage in AzkarProgress**:

- Array of exactly 3 items (one per type)
- Used to calculate progress percentage: `completedCount / total`
- Chip rendering: one chip per item
- Status determines chip visual state (colors, icons)

---

### RandomActData

Represents a random act of kindness that users can complete daily.

**Source**: `src/features/home/types/home.types.ts`

**Structure**:

```typescript
export type RandomActStatus = 'completed' | 'unlocked' | 'locked';

export interface RandomActData {
  id: string;
  title: string;
  iconFamily: IconFamilyName;
  iconName: string;
  status: RandomActStatus;
}
```

**Attributes**:

- `id` (string): Unique identifier for the act
- `title` (string): Display name of the act (localized key, not raw string per i18n rules)
- `iconFamily` (IconFamilyName): Icon library family from expo-vector-icons
- `iconName` (string): Specific icon name within the family
- `status` (RandomActStatus): Current state - completed, unlocked, or locked

**Constraints**:

- ID must be unique across all acts
- Title should reference i18n key, not hardcoded string
- IconFamily must be valid expo-vector-icons family
- Status transitions: locked → unlocked → completed (one-way)
- Only one act can have 'completed' status at a time (per spec assumption)

**Usage in RandomActsGrid**:

- Array of 3-6 items (per spec assumption)
- Used to calculate progress percentage: `completedCount / total`
- Card rendering: one card per item in vertical list
- Status determines card visual state:
  - `completed`: Success color, check icon badge
  - `unlocked`: Tertiary brand color, add icon badge
  - `locked`: Muted color, lock indicator

---

### Theme (Design System)

Provides semantic color tokens, responsive metrics, and typography configuration.

**Source**: `src/theme/config.ts`, `src/theme/light-theme.ts`, `src/theme/dark-theme.ts`

**Key Properties Used**:

- `theme.colors.mode`: 'light' | 'dark'
- `theme.colors.brand.*`: Brand color variants
- `theme.colors.text.*`: Text color tokens
- `theme.colors.background.*`: Background color tokens
- `theme.colors.state.*`: State colors (success, info, error, warning)
- `theme.colors.icon.*`: Icon color variants
- `theme.colors.overlay.*`: Interaction overlay colors (pressed, hover)
- `theme.metrics.spacing.*`: Horizontal spacing tokens
- `theme.metrics.spacingV.*`: Vertical spacing tokens
- `theme.metrics.fontSize.*`: Font size scale

**Usage in Components**:

- All styles use `StyleSheet.create((theme) => ({...}))`
- Colors reference semantic tokens only
- Spacing uses metric functions
- No hardcoded values per Constitution Principle I

---

## Data Flow

### AzkarProgress Component

```
Props: azkar: AzkarData[]
       onAzkarPress: (azkar: AzkarData) => void

Flow:
1. Calculate: completedCount = azkar.filter(a => a.status === 'completed').length
2. Calculate: progress = completedCount / azkar.length
3. Calculate: percentage = Math.round(progress * 100)
4. Render: Card container
5. Render: Header (title + percentage + CircularProgress)
6. Render: Chips row (.map over azkar array)
7. Each chip: Pressable with status-based styling
8. On press: call onAzkarPress(item)
```

**State**: None (stateless presentation component)

---

### RandomActsGrid Component

```
Props: acts: RandomActData[]
       onActPress: (act: RandomActData) => void

Flow:
1. Calculate: completedCount = acts.filter(a => a.status === 'completed').length
2. Calculate: progress = completedCount / acts.length
3. Calculate: percentage = Math.round(progress * 100)
4. Filter: completedActs = acts.filter(a => a.status === 'completed')
5. Filter: unlockedActs = acts.filter(a => a.status === 'unlocked')
6. Filter: lockedActs = acts.filter(a => a.status === 'locked')
7. Render: Progress header (title + percentage + CircularProgress)
8. Render: Vertical list (View with .map)
   Order: [...completedActs, ...unlockedActs, ...lockedActs]
9. Each card: Pressable with status-based styling
10. On press: call onActPress(item)
```

**State**: None (stateless presentation component)

---

## Validation Rules

### AzkarData Array

- MUST contain exactly 3 items
- Each type (Morning, Evening, Night) MUST appear exactly once
- Each item MUST have valid status

### RandomActData Array

- MUST contain 3-6 items (per spec assumption)
- Each id MUST be unique
- At most one item can have status 'completed'
- Each item MUST have valid iconFamily and iconName

**Note**: Validation is assumed to occur upstream (data layer). Components trust received data per Constitution Principle V (avoid over-engineering).

---

## No Schema Changes Required

This feature does NOT modify:

- Existing type definitions
- Data structures
- Database schemas
- API contracts
- State management

All changes are purely presentational (UI/styling).

---

## Next Phase

**Phase 1 Complete**: Data model documented (no changes needed)

**Next**: Create quickstart.md and contracts/ (minimal for UI-only feature)
