# Research: Refactor Map Renderers in Home Components

**Phase**: 0 - Outline & Research
**Date**: 2026-02-14
**Feature**: 004-refactor-map-renderers

## Research Objectives

This refactoring task has clear requirements with minimal technical unknowns. Research focused on:

1. **Best practices for extracting render logic in React Native functional components**
2. **TypeScript patterns for render function props**
3. **Performance implications of different extraction approaches**

## Research Findings

### 1. Render Function vs. Separate Component

**Decision**: Use inline render functions (not separate components)

**Rationale**:

- **Performance**: Inline functions avoid unnecessary component mounting/unmounting overhead
- **Simplicity**: No need for component lifecycle when logic is purely presentational
- **Context Access**: Direct access to parent component's theme, translations, and event handlers without prop drilling
- **Project Consistency**: Simpler than introducing new component files, aligns with Principle V (Simplicity)

**Pattern**:

```typescript
const renderItem = (item: ItemType, index: number): JSX.Element => {
  return (
    <Pressable key={item.id} onPress={() => handlePress(item)}>
      {/* JSX content */}
    </Pressable>
  );
};

// Usage in main component
{items.map((item, index) => renderItem(item, index))}
```

**Alternatives Considered**:

- **Separate Component Files**: Rejected - adds file bloat for simple presentational logic, violates YAGNI
- **React.memo'd Components**: Rejected - premature optimization, no performance issues identified
- **HOC Pattern**: Rejected - over-engineering for this use case

---

### 2. Naming Convention

**Decision**: Use `render<ItemName>` pattern (e.g., `renderAzkarChip`, `renderPrayerCircle`, `renderActCard`)

**Rationale**:

- **Consistency**: Matches React Native FlatList's `renderItem` convention
- **Clarity**: Prefix `render` clearly indicates the function returns JSX
- **Descriptive**: Suffix describes what is being rendered

**Specific Names**:

- `AzkarProgress.tsx`: `renderAzkarChip(item: AzkarData): JSX.Element`
- `PrayersProgress.tsx`: `renderPrayerCircle(prayer: PrayerData): JSX.Element`
- `RandomActsGrid.tsx`: `renderActCard(act: RandomActData): JSX.Element`

**Alternatives Considered**:

- `Item` suffix (e.g., `renderAzkarItem`): Rejected - less descriptive than component-specific naming
- CamelCase components (e.g., `AzkarChip`): Rejected - would require separate component files

---

### 3. Type Safety Patterns

**Decision**: Define explicit return types and parameter types for render functions

**Rationale**:

- **Type Safety**: Ensures correct data flow and catches errors at compile time
- **Documentation**: Function signatures serve as inline documentation
- **Constitution Compliance**: Principle IV requires no `any` types

**Pattern**:

```typescript
// In Component.types.ts (if complex) or inline (if simple)
interface RenderItemProps {
  item: ItemType;
  theme: UnistylesTheme;
  onPress: (item: ItemType) => void;
}

// In Component.tsx
const renderItem = ({ item, theme, onPress }: RenderItemProps): JSX.Element => {
  // Implementation
};
```

**For this refactor**: Since render functions have simple signatures and access parent scope, inline type annotations are sufficient. No need for separate interface files unless functions become complex.

---

### 4. Event Handler Preservation

**Decision**: Maintain closures over parent scope for event handlers

**Rationale**:

- **Simplicity**: Render functions can directly access `onAzkarPress`, `onPrayerPress`, `onActPress` from parent scope
- **No Prop Drilling**: Avoids passing handlers as parameters to render functions
- **Existing Pattern**: Components already use closures for event handlers in inline JSX

**Pattern**:

```typescript
export function AzkarProgress({ azkar, onAzkarPress }: AzkarProgressProps) {
  const { theme } = useUnistyles();

  const renderAzkarChip = (item: AzkarData): JSX.Element => {
    return (
      <Pressable onPress={() => onAzkarPress(item)}>
        {/* Accesses theme and onAzkarPress from parent scope */}
      </Pressable>
    );
  };

  return (
    <View>
      {azkar.map(renderAzkarChip)}
    </View>
  );
}
```

---

### 5. Animation and Reanimated Compatibility

**Decision**: Keep `PulsingDot` component separate (already extracted in PrayersProgress)

**Rationale**:

- **Reanimated Requirements**: Animated components using `useSharedValue` and `useAnimatedStyle` should remain as separate components
- **Hook Rules**: React hooks must be at component level, not inside render functions
- **Already Correct**: `PulsingDot` is already properly extracted

**Action**: No changes needed for `PulsingDot` - only extract the main prayer circle rendering logic.

---

### 6. Key Prop Handling

**Decision**: Keep `key` prop on the element returned by render function

**Rationale**:

- **React Best Practice**: Keys should be on the outermost element in a map
- **Existing Pattern**: Current code already uses `key={item.type}` or `key={prayer.name}` or `key={act.id}`

**Pattern**:

```typescript
const renderItem = (item: ItemType): JSX.Element => {
  return (
    <Pressable key={item.id}>
      {/* content */}
    </Pressable>
  );
};

// Usage
{items.map(renderItem)}
```

---

### 7. Android Ripple Effect Preservation

**Decision**: Preserve all `android_ripple` props in extracted render functions

**Rationale**:

- **Platform Behavior**: Android ripple effects are part of the component's UX
- **Theme Integration**: Ripple colors use theme tokens (e.g., `theme.colors.overlay.pressed`)
- **FR-004 Requirement**: Must maintain all existing functionality

**Pattern**: All `android_ripple` configurations will be copied as-is into render functions.

---

### 8. Conditional Styling Logic

**Decision**: Keep conditional style logic inside render functions

**Rationale**:

- **Cohesion**: Style selection based on item state (completed, locked, current) belongs with rendering
- **Readability**: Keeps related logic together

**Example from RandomActsGrid**:

```typescript
const renderActCard = (act: RandomActData): JSX.Element => {
  const isCompleted = act.status === 'completed';
  const isLocked = act.status === 'locked';

  return (
    <View style={[
      styles.actCard,
      isCompleted && styles.cardCompleted,
      !isCompleted && !isLocked && styles.cardUnlocked,
      isLocked && styles.cardLocked,
    ]}>
      {/* content */}
    </View>
  );
};
```

---

## Summary

All technical decisions are resolved. The refactoring approach is clear:

1. **Extract inline map JSX into `render<ItemName>` functions**
2. **Use inline function definitions with TypeScript type annotations**
3. **Preserve all existing behavior** (event handlers, ripple effects, animations, conditional styling)
4. **Maintain closure access to parent scope** (theme, translations, event handlers)
5. **No new files or dependencies required**

This approach satisfies all functional requirements (FR-001 through FR-008) and aligns with all constitution principles.

---

## Next Steps

**Phase 1**: Not applicable (no data model or API contracts for UI refactoring)
**Phase 2**: Generate `tasks.md` with specific implementation tasks for each component
