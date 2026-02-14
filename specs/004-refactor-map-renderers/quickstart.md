# Quickstart: Refactor Map Renderers

**Feature**: 004-refactor-map-renderers
**Date**: 2026-02-14

## What This Refactor Does

Improves code maintainability by extracting inline map function JSX into separate render functions in three home screen components:

1. **AzkarProgress** - Extract azkar chip rendering
2. **PrayersProgress** - Extract prayer circle rendering
3. **RandomActsGrid** - Extract random acts card rendering

## Before & After Example

### Before (AzkarProgress.tsx)

```tsx
<View style={styles.chipsRow}>
  {azkar.map((item) => {
    const isCompleted = item.status === 'completed';
    return (
      <Pressable
        key={item.type}
        style={isCompleted ? styles.chipCompleted : styles.chipUncompleted}
        onPress={() => onAzkarPress(item)}
      >
        <Icon /* ... */ />
        <Typography>{item.type}</Typography>
      </Pressable>
    );
  })}
</View>
```

### After (AzkarProgress.tsx)

```tsx
// Render function defined above the main component return
const renderAzkarChip = (item: AzkarData): JSX.Element => {
  const isCompleted = item.status === 'completed';
  return (
    <Pressable
      key={item.type}
      style={isCompleted ? styles.chipCompleted : styles.chipUncompleted}
      onPress={() => onAzkarPress(item)}
    >
      <Icon /* ... */ />
      <Typography>{item.type}</Typography>
    </Pressable>
  );
};

// In the component's return statement
<View style={styles.chipsRow}>{azkar.map(renderAzkarChip)}</View>;
```

## Benefits

✅ **Improved Readability**: Main component render is cleaner, easier to scan
✅ **Better Maintainability**: Render logic is isolated and easier to find
✅ **Enhanced Testability**: Render functions can be tested independently
✅ **Consistent Pattern**: Same renderItem pattern across all three components

## Files Changed

```
src/features/home/components/AzkarProgress/AzkarProgress.tsx
src/features/home/components/PrayersProgress/PrayersProgress.tsx
src/features/home/components/RandomActsGrid/RandomActsGrid.tsx
```

**No changes to**:

- `.styles.ts` files (styles remain unchanged)
- `.types.ts` files (may add types only if needed)
- `index.ts` files (public exports unchanged)
- Visual appearance or behavior

## Testing

Run existing tests to verify no behavior changes:

```bash
npm test -- AzkarProgress
npm test -- PrayersProgress
npm test -- RandomActsGrid
```

All tests should pass without modification.

## Validation

After refactoring, verify:

1. ✅ Each component has a clearly-named render function
2. ✅ Main component render is under 50 lines
3. ✅ All event handlers work (press interactions)
4. ✅ Styling is unchanged (completed, locked, current states)
5. ✅ Animations work (PrayersProgress pulsing dot)
6. ✅ Ripple effects work on Android
7. ✅ TypeScript compiles without errors
8. ✅ ESLint passes without warnings

## Next Steps

1. Review the implementation plan: `specs/004-refactor-map-renderers/plan.md`
2. Generate tasks: Run `/speckit.tasks`
3. Implement the refactoring task-by-task
4. Test thoroughly before committing
5. Create PR with before/after comparisons
