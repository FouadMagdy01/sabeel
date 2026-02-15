# Quickstart: DatePicker Enhancements

**Branch**: `007-datepicker-enhancements` | **Date**: 2026-02-15

## Prerequisites

- Node.js + npm installed
- Expo CLI installed
- Project dependencies installed (`npm install`)

## Development Setup

```bash
# Switch to feature branch
git checkout 007-datepicker-enhancements

# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Key Files to Work With

| File                                                    | Purpose                                              |
| ------------------------------------------------------- | ---------------------------------------------------- |
| `src/common/components/DatePicker/DatePicker.tsx`       | Main component — add mode prop handling, view states |
| `src/common/components/DatePicker/DatePicker.styles.ts` | All styles — add year/month/time selectors           |
| `src/common/components/DatePicker/DatePicker.types.ts`  | TypeScript interfaces — add new props                |
| `src/common/components/DatePicker/YearSelector.tsx`     | NEW: Scrollable year list with numeric input         |
| `src/common/components/DatePicker/MonthGrid.tsx`        | NEW: Month selection grid (4×3)                      |
| `src/common/components/DatePicker/TimeWheelPicker.tsx`  | NEW: Scrollable wheel time picker                    |
| `src/common/components/DatePicker/index.ts`             | Exports — add new types                              |
| `src/i18n/locales/en.json`                              | English translations — add time keys                 |
| `src/i18n/locales/ar.json`                              | Arabic translations — add time keys                  |

## Implementation Order

1. **Types first**: Update `DatePicker.types.ts` with new prop types (`DatePickerMode`, `TimeFormat`, `TimeValue`, etc.)
2. **i18n keys**: Add translation keys for time picker, year selector, month grid
3. **YearSelector**: Build as standalone sub-component with FlatList + TextInput
4. **MonthGrid**: Build as standalone sub-component with Pressable grid
5. **TimeWheelPicker**: Build as standalone sub-component with FlatList snap-to-item
6. **Integrate into DatePicker**: Add `viewMode` state, conditional rendering, mode handling
7. **Styles**: Add all new styles to `DatePicker.styles.ts`
8. **Update exports**: Add new types to `index.ts`

## Validation Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Full validation (type-check + lint + format)
npm run validate

# Run tests
npm test
```

## Quick Testing Checklist

- [ ] Open DatePicker in date mode — existing behavior unchanged
- [ ] Tap year display → year selector appears, scroll works, tap-to-type works
- [ ] Tap month display → month grid appears, selection works
- [ ] Set `mode="datetime"` → both calendar and time wheels appear
- [ ] Set `mode="time"` → only time wheels appear
- [ ] 12h format shows AM/PM toggle; 24h format shows 0-23 hours
- [ ] Minutes scroll in 5-min increments
- [ ] minDate/maxDate constraints disable correct years and months
- [ ] Selecting Feb 29 then switching to non-leap year → auto-adjusts to Feb 28
- [ ] Confirm returns correct Date object with date + time components
- [ ] Clear button works in all modes
- [ ] RTL layout (Arabic locale) renders correctly

## Architecture Notes

### Styling Pattern

All styles use `react-native-unistyles`:

```typescript
import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  yearItem: {
    paddingVertical: theme.metrics.spacingV.p12,
    paddingHorizontal: theme.metrics.spacing.p16,
    alignItems: 'center',
  },
  yearItemSelected: {
    backgroundColor: theme.colors.brand.primary,
    borderRadius: 8,
  },
}));
```

### i18n Pattern

All user-facing text uses translation keys:

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
// Usage: t('auth.calendar.time.am')
```

### FlatList Wheel Pattern

Time wheels use FlatList with snap behavior:

```typescript
<FlatList
  data={items}
  snapToInterval={ITEM_HEIGHT}
  decelerationRate="fast"
  showsVerticalScrollIndicator={false}
  getItemLayout={(_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  onMomentumScrollEnd={(e) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    onSelect(items[index]);
  }}
/>
```
