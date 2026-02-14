# Research: Home Screen UI Enhancement

**Feature**: 001-home-ui-enhancement
**Date**: 2026-02-14
**Purpose**: Resolve technical unknowns and document design patterns for Azkar and Random Acts UI redesign

## Overview

This research phase validates that all necessary design system components exist and documents the patterns for implementing the hybrid card-with-chips (Azkar) and vertical list (Random Acts) layouts using the existing design system.

## Research Tasks Completed

### 1. Design System Component Availability

**Question**: Do all required design system components exist and support the needed variants?

**Findings**:

- ✅ **Card component** exists at `src/common/components/Card/Card.tsx`
  - Supports `variant` prop (likely including "elevated" based on current usage)
  - Supports `padding` prop for consistent spacing
  - Already used in current AzkarProgress and RandomActsGrid

- ✅ **Typography component** exists at `src/common/components/Typography/Typography.tsx`
  - Supports semantic sizing (`size`, `weight`)
  - Supports semantic colors (`color` prop for theme tokens)
  - Already used throughout home components

- ✅ **Icon component** exists at `src/common/components/Icon/Icon.tsx`
  - Wrapper around expo-vector-icons
  - Supports `variant` for semantic colors
  - Supports `familyName` and `iconName` props

- ✅ **CircularProgress component** exists at `src/common/components/CircularProgress/CircularProgress.tsx`
  - Accepts `progress` (0-1) and `color` props
  - Already used in current AzkarProgress and RandomActsGrid

**Decision**: All required components exist. No new shared components needed.

**Rationale**: Leveraging existing components ensures visual consistency and reduces implementation scope per Constitution Principle V (Simplicity and YAGNI).

---

### 2. Theme System Patterns for Chip Spacing

**Question**: What are the best practices for improving chip spacing while maintaining minimum touch targets?

**Findings**:

- Current chips likely use minimal spacing creating visual clutter
- Theme metrics provide: `spacing.p4`, `spacing.p8`, `spacing.p12`, `spacing.p16`, `spacing.p24`
- Minimum touch target: 44x44 points (FR-005)
- Best practice for chip rows: `gap` between chips + `paddingHorizontal` inside chips

**Decision**: Use `gap: theme.metrics.spacing.p12` between chips and ensure each chip has minimum 44pt height with adequate horizontal padding.

**Rationale**: 12pt gap provides visual breathing room without excessive whitespace. Ensures tappability per iOS/Android HIG.

**Alternatives Considered**:

- 8pt gap: Too tight, doesn't solve visual clutter issue
- 16pt gap: Excessive for a compact card design

---

### 3. Vertical List Layout Pattern for Random Acts

**Question**: What's the best approach for equal-sized cards in a vertical list in React Native?

**Findings**:

- React Native doesn't have native equal-height grid like CSS Grid
- Options:
  1. FlatList with fixed `itemHeight` (best for many items, supports virtualization)
  2. ScrollView with flex-based equal sizing (simple, good for <10 items)
  3. Manual View with mapped children (simplest, no scroll needed if fits)

**Decision**: Use View with `.map()` for rendering cards since Random Acts are typically 3-6 items (per spec assumption) and fit on screen.

**Rationale**:

- No virtualization needed for <10 items
- Simpler than FlatList (no keyExtractor, renderItem abstraction)
- Parent ScrollView (DailyTodos) already handles scrolling
- Aligns with Constitution Principle V (Simplicity)

**Alternatives Considered**:

- FlatList: Over-engineering for known small dataset
- FlexBox equal heights: Not needed since cards have similar content

---

### 4. Platform-Specific Press Feedback Patterns

**Question**: How to implement proper press feedback on iOS vs Android while using design system overlay states?

**Findings**:

- Android: Use `android_ripple` prop with `theme.colors.overlay.pressed`
- iOS: Use Pressable `style` function with `pressed` state
- Current codebase pattern (from RandomActsGrid):
  ```typescript
  <Pressable
    style={({ pressed }) => [
      baseStyle,
      Platform.OS === 'ios' && pressed ? pressedStyle : undefined
    ]}
    android_ripple={{ color: theme.colors.overlay.pressed }}
  >
  ```

**Decision**: Use existing Pressable pattern with platform-specific feedback.

**Rationale**: Already established in codebase, leverages design system overlay colors, provides native feel per platform.

---

### 5. Progress Indicator Positioning in Hybrid Card

**Question**: Should progress indicator be in header row with title, or separate row above chips?

**Findings**:

- Current AzkarProgress has header row with title + progress
- User Story 1 emphasizes "progress at top" for clarity
- Two options:
  1. Keep header row (title left, progress right) - compact
  2. Separate rows (title row, then progress row, then chips) - clearest hierarchy

**Decision**: Keep header row pattern (title left, progress right) but improve visual hierarchy with better spacing and sizing.

**Rationale**:

- More compact (preserves vertical space)
- Familiar pattern from current design
- Clear hierarchy achievable via size/weight/color contrast
- Aligns with "hybrid" approach (balance between compact and clarity)

**Alternatives Considered**:

- Separate progress row: Takes more vertical space, may not improve clarity enough to justify

---

### 6. Card Ordering for Completed vs Unlocked Random Acts

**Question**: In the vertical list, should completed acts appear first, last, or mixed with unlocked?

**Findings**:

- User motivation research suggests showing completed items maintains engagement
- Current grid shows completed prominently (left side)
- Options:
  1. Completed first (celebrates achievement)
  2. Unlocked first (focus on available actions)
  3. Mixed/sorted by other criteria

**Decision**: Show completed acts first in the vertical list.

**Rationale**:

- Maintains motivational aspect of seeing achievement
- Users scan top-to-bottom on mobile
- Completed acts with visual distinction (success color/icon) won't block unlocked acts when using equal sizing
- Natural reading order: "You completed X, now try Y"

**Alternatives Considered**:

- Unlocked first: Deprioritizes user achievement, less motivating
- Mixed: Unclear sorting logic, reduces scannability

---

## Summary of Technical Decisions

| Decision               | Outcome                    | Impact on Implementation                   |
| ---------------------- | -------------------------- | ------------------------------------------ |
| Component availability | All exist                  | Zero new shared components                 |
| Chip spacing           | 12pt gap, 44pt min height  | Update AzkarProgress.styles.ts             |
| Random Acts layout     | View + .map()              | Simple iteration in RandomActsGrid.tsx     |
| Press feedback         | Existing Pressable pattern | Reuse current platform handling            |
| Progress positioning   | Header row                 | Modify spacing/hierarchy in styles         |
| Card ordering          | Completed first            | Simple `.filter()` + `.concat()` in render |

**Research Complete**: All NEEDS CLARIFICATION items resolved. No architectural blockers identified.

**Next Phase**: Phase 1 - Data Model and Contracts (minimal for UI-only feature)
