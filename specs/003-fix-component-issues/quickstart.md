# Quick Start Guide: Component Design Compliance Fixes

**Feature**: 003-fix-component-issues
**Branch**: `003-fix-component-issues`
**Date**: 2026-02-14

## Overview

This guide provides quick commands and testing steps for implementing and verifying the three component compliance fixes.

## Prerequisites

```bash
# Ensure you're on the feature branch
git checkout 003-fix-component-issues

# Install dependencies (if not already)
npm install

# Start development server
npm start
```

## Implementation Order

Follow this order to minimize risk and enable incremental testing:

1. **CircularProgress** (P1) - Lowest risk, easiest to verify
2. **Card** (P1) - Medium complexity, visual testing required
3. **DatePicker i18n** (P2) - Straightforward string replacement
4. **DatePicker Components** (P3) - Typography integration

---

## 1. CircularProgress: Fix Deprecated Rotation

### Changes Required

**File**: `src/common/components/CircularProgress/CircularProgress.tsx`

**Line 135-137**: Replace `rotation` and `origin` props with `transform`

```diff
  <Circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    stroke={progressColor}
    strokeWidth={strokeWidth}
    strokeDasharray={`${circumference} ${circumference}`}
    strokeDashoffset={strokeDashoffset}
    strokeLinecap="round"
-   rotation={-90}
-   origin={`${size / 2}, ${size / 2}`}
+   transform={`rotate(-90 ${size / 2} ${size / 2})`}
  />
```

### Testing Commands

```bash
# Type check
npm run type-check

# Lint check
npm run lint

# Start app and check console
npm start
# Open app, navigate to any screen with CircularProgress
# Verify: NO deprecation warnings in console
```

### Manual Testing Checklist

- [ ] Render CircularProgress in multiple sizes (24, 48, 64, 128)
- [ ] Test indeterminate spinning animation (verify smooth rotation)
- [ ] Test static progress display (verify arc position at -90° start)
- [ ] Check console for deprecation warnings (should be 0)
- [ ] Visual regression: Compare before/after screenshots
- [ ] Test on both iOS and Android

**Success Criteria**: SC-001 ✓ (100% warning-free)

---

## 2. Card: Add Pressable Feedback

### Changes Required

**File 1**: `src/common/components/Card/Card.tsx`

Add imports and logic (lines 1-10):

```typescript
import { useCallback, useMemo } from 'react';
import { Platform, type StyleProp, type ViewStyle } from 'react-native';
```

Add helper functions (after line 36, before render):

```typescript
const isDisabled = disabled || loading;

const getPressedStyle = useCallback(
  (pressed: boolean): StyleProp<ViewStyle> => {
    if (!pressed || isDisabled || Platform.OS === 'android') return undefined;
    return { opacity: 0.85 };
  },
  [isDisabled]
);

const androidRipple = useMemo(() => {
  if (Platform.OS !== 'android' || isDisabled) return undefined;
  return {
    color: variant === 'elevated' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.08)',
    borderless: false,
    foreground: true,
  };
}, [variant, isDisabled]);
```

Update Pressable render (lines 91-98):

```diff
  <Pressable
    onPress={onPress}
    disabled={loading}
+   style={({ pressed }) => [
+     styles.container,
+     { overflow: 'hidden' as const },
+     getPressedStyle(pressed),
+     style
+   ]}
+   android_ripple={androidRipple}
  >
-   {({ pressed }) => (
-     <View style={[styles.container, pressed && styles.pressedState, style]}>
        {renderContent()}
-     </View>
-   )}
  </Pressable>
```

**File 2**: `src/common/components/Card/Card.styles.ts`

Remove `pressedState` if it exists (it's now applied inline via opacity).

### Testing Commands

```bash
# Type check
npm run type-check

# Lint check
npm run lint

# Run app
npm start
# Test on both iOS and Android simulators
```

### Manual Testing Checklist

**iOS Testing:**

- [ ] Press Card, verify opacity reduces to 0.85
- [ ] Release Card, verify opacity returns to 1.0
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Verify feedback appears within 50ms
- [ ] Compare with Button component feedback (should match feel)
- [ ] Test disabled Card (no feedback should appear)

**Android Testing:**

- [ ] Press Card, verify ripple effect appears
- [ ] Verify ripple color matches card variant
- [ ] Test disabled Card (no ripple)
- [ ] Compare with Button ripple

**Success Criteria**: SC-002 ✓ (50ms feedback, matches Button timing)

---

## 3. DatePicker: i18n Translation Migration

### Changes Required

**File**: `src/common/components/DatePicker/DatePicker.tsx`

**Step 1**: Remove hardcoded constants (lines 11-26)

```diff
- const MONTHS = [
-   'january',
-   'february',
-   'march',
-   'april',
-   'may',
-   'june',
-   'july',
-   'august',
-   'september',
-   'october',
-   'november',
-   'december',
- ] as const;
-
- const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
```

**Step 2**: Update `monthYearDisplay` computation (lines 197-201)

```diff
  const monthYearDisplay = useMemo(() => {
-   const monthKey = MONTHS[viewDate.getMonth()];
+   const monthKeys = ['january', 'february', 'march', 'april', 'may', 'june',
+                      'july', 'august', 'september', 'october', 'november', 'december'];
+   const monthKey = monthKeys[viewDate.getMonth()];
    const monthName = t(`auth.calendar.months.${monthKey}`);
    return `${monthName} ${viewDate.getFullYear()}`;
  }, [viewDate, t]);
```

**Step 3**: Update weekday headers rendering (lines 265-270)

```diff
+ const weekdayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
+
  <View style={styles.weekdaysRow}>
-   {WEEKDAYS.map((day) => (
+   {weekdayKeys.map((day) => (
      <View key={day} style={styles.weekdayCell}>
        <Text style={styles.weekdayText}>{t(`auth.calendar.weekdays.${day}`)}</Text>
      </View>
    ))}
  </View>
```

### Testing Commands

```bash
# Verify translations exist
grep -A 15 '"months"' src/i18n/locales/en.json
grep -A 15 '"months"' src/i18n/locales/ar.json
grep -A 8 '"weekdays"' src/i18n/locales/en.json
grep -A 8 '"weekdays"' src/i18n/locales/ar.json

# Type check
npm run type-check

# Lint check (verify no hardcoded string warnings)
npm run lint

# Run app
npm start
```

### Manual Testing Checklist

**English Mode:**

- [ ] Open DatePicker
- [ ] Verify all 12 month names appear in English
- [ ] Verify all 7 weekday abbreviations appear in English
- [ ] Navigate through multiple months
- [ ] Select a date and confirm

**Arabic Mode:**

- [ ] Switch app language to Arabic (Settings)
- [ ] Open DatePicker
- [ ] Verify all 12 month names appear in Arabic (يناير, فبراير, etc.)
- [ ] Verify all 7 weekday abbreviations appear in Arabic (أحد, إثنين, etc.)
- [ ] Verify RTL layout is preserved
- [ ] Navigate through multiple months
- [ ] Select a date and confirm

**Language Switching:**

- [ ] Open DatePicker in English
- [ ] Switch language to Arabic (without closing picker)
- [ ] Verify weekday/month names update immediately
- [ ] Switch back to English
- [ ] Verify updates work in both directions

**Fallback Testing:**

- [ ] Temporarily remove one translation key
- [ ] Verify fallback to English occurs gracefully
- [ ] Restore translation key

**Success Criteria**: SC-003 ✓ (100% translation accuracy for 19 strings)

---

## 4. DatePicker: Typography Integration

### Changes Required

**File**: `src/common/components/DatePicker/DatePicker.tsx`

**Step 1**: Update imports (line 3)

```diff
+ import { Typography } from '@/common/components/Typography';
  import { Button } from '@/common/components/Button';
  import { Icon } from '@/common/components/Icon';
  import { IconButton } from '@/common/components/IconButton';
```

**Step 2**: Replace Text instances

**Line 205** - Label:

```diff
- {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
+ {label && <Typography type="label" size="sm" style={labelStyle}>{label}</Typography>}
```

**Line 214** - Picker display text:

```diff
- <Text style={styles.pickerText}>{displayText}</Text>
+ <Typography type="body" size="md" color={!value ? 'muted' : 'primary'}>
+   {displayText}
+ </Typography>
```

**Line 226** - Helper/error text:

```diff
- {displayHelperText && <Text style={styles.helperText}>{displayHelperText}</Text>}
+ {displayHelperText && (
+   <Typography type="caption" size="xs" color={error ? 'error' : 'muted'}>
+     {displayHelperText}
+   </Typography>
+ )}
```

**Line 232** - Modal title:

```diff
- <Text style={styles.modalTitle}>{t('auth.calendar.selectDate')}</Text>
+ <Typography type="heading" size="lg" weight="semiBold">
+   {t('auth.calendar.selectDate')}
+ </Typography>
```

**Line 245** - Month/year text:

```diff
- <Text style={styles.monthYearText}>{monthYearDisplay}</Text>
+ <Typography type="heading" size="md" weight="medium">
+   {monthYearDisplay}
+ </Typography>
```

**Line 268** - Weekday headers:

```diff
- <Text style={styles.weekdayText}>{t(`auth.calendar.weekdays.${day}`)}</Text>
+ <Typography type="caption" size="xs" weight="medium" color="muted">
+   {t(`auth.calendar.weekdays.${day}`)}
+ </Typography>
```

**Lines 293-301** - Day numbers:

```diff
- <Text
-   style={[
-     styles.dayText,
-     isSelected && styles.dayTextSelected,
-     isDisabled && styles.dayTextDisabled,
-     !item.isCurrentMonth && styles.dayTextOtherMonth,
-   ]}
- >
-   {item.date.getDate()}
- </Text>
+ <Typography
+   type="body"
+   size="sm"
+   color={isSelected ? 'inverse' : isDisabled ? 'disabled' : !item.isCurrentMonth ? 'muted' : 'primary'}
+ >
+   {item.date.getDate()}
+ </Typography>
```

**Step 3**: Clean up unused styles (DatePicker.styles.ts)
Remove these style definitions if they're no longer used:

- `label`
- `pickerText`
- `helperText`
- `modalTitle`
- `monthYearText`
- `weekdayText`
- `dayText`
- `dayTextSelected`
- `dayTextDisabled`
- `dayTextOtherMonth`

### Testing Commands

```bash
# Type check
npm run type-check

# Lint check
npm run lint

# Check for unused styles
npm run lint -- --rule "no-unused-vars: error"

# Run app
npm start
```

### Manual Testing Checklist

**Visual Consistency:**

- [ ] Compare DatePicker text styles with other components
- [ ] Verify Cairo font family is applied
- [ ] Check text sizes match design system scale
- [ ] Verify colors use semantic tokens (primary, muted, etc.)

**Theme Switching:**

- [ ] Switch to light mode
- [ ] Open DatePicker, verify all text is readable
- [ ] Switch to dark mode
- [ ] Open DatePicker, verify all text is readable
- [ ] Check contrast ratios meet accessibility standards

**RTL Support:**

- [ ] Switch to Arabic
- [ ] Verify all Typography components support RTL
- [ ] Check text alignment
- [ ] Verify no layout breaks

**Regression Testing:**

- [ ] Take before/after screenshots
- [ ] Compare side-by-side
- [ ] Verify zero visual changes (except potential minor spacing)
- [ ] All previous functionality still works

**Success Criteria**:

- SC-004 ✓ (Visual regression pass)
- SC-005 ✓ (0 primitive Text usages remaining)

---

## Complete Testing Flow

### Pre-Implementation

```bash
# Create baseline screenshots
npm start
# Screenshot CircularProgress, Card (pressable), DatePicker (all states)
```

### Post-Implementation

```bash
# Full validation pipeline
npm run validate

# Verify no new warnings
npm run lint | grep -i "warning"

# Type safety check
npm run type-check

# Format check
npm run format:check
```

### Visual Regression

```bash
# Take post-change screenshots
npm start
# Screenshot same components/states as baseline

# Compare manually or use tool:
# - CircularProgress: animation smoothness, no console warnings
# - Card: opacity feedback on press (iOS), ripple (Android)
# - DatePicker: all text translated, Typography styling consistent
```

### Manual QA Checklist

**CircularProgress:**

- [ ] ✓ No deprecation warnings in console
- [ ] ✓ Animation behavior unchanged
- [ ] ✓ Visual appearance identical

**Card:**

- [ ] ✓ iOS: Opacity feedback 0.85 on press
- [ ] ✓ Android: Ripple effect on press
- [ ] ✓ Disabled state: No feedback
- [ ] ✓ Matches Button feedback feel
- [ ] ✓ Works in light/dark modes

**DatePicker:**

- [ ] ✓ All strings translated (English/Arabic)
- [ ] ✓ Language switching works
- [ ] ✓ RTL layout preserved
- [ ] ✓ Typography components applied
- [ ] ✓ Theme switching works
- [ ] ✓ Zero hardcoded strings

---

## Troubleshooting

### CircularProgress: Animation looks different

- **Issue**: Arc doesn't start at top
- **Fix**: Ensure transform has correct center coordinates: `rotate(-90 ${size / 2} ${size / 2})`
- **Verify**: Arc should start at 12 o'clock position

### Card: Pressable not responding

- **Issue**: `overflow: 'hidden'` not set
- **Fix**: Add `{ overflow: 'hidden' as const }` to style array
- **Verify**: Android ripple should be clipped to card bounds

### DatePicker: Translations not showing

- **Issue**: Translation keys don't match
- **Fix**: Verify keys match exactly: `auth.calendar.months.{january}` and `auth.calendar.weekdays.{sun}`
- **Verify**: Check src/i18n/locales/\*.json files

### Typography: Styles not applying

- **Issue**: Custom styles overriding Typography defaults
- **Fix**: Pass custom styles via `style` prop, not inline
- **Verify**: Typography should handle theme colors automatically

---

## Success Metrics

All success criteria from spec.md must pass:

- **SC-001**: ✓ CircularProgress 100% warning-free
- **SC-002**: ✓ Card feedback <50ms (manual timing)
- **SC-003**: ✓ DatePicker 100% translated (19 strings)
- **SC-004**: ✓ Visual regression pass (screenshots match)
- **SC-005**: ✓ 0 hardcoded strings, 0 primitive Text in DatePicker
- **SC-006**: ✓ Patterns documented for future fixes

---

## Next Steps

After all fixes implemented and tested:

1. **Commit changes**:

   ```bash
   git add -A
   git commit -m "fix: resolve component design compliance issues

   - CircularProgress: migrate deprecated rotation to transform
   - Card: add opacity pressable feedback (0.85)
   - DatePicker: replace hardcoded strings with i18n
   - DatePicker: migrate Text to Typography component

   Closes #003-fix-component-issues"
   ```

2. **Push and create PR**:

   ```bash
   git push origin 003-fix-component-issues
   gh pr create --title "Fix component design compliance issues" \
     --body "See specs/003-fix-component-issues/spec.md"
   ```

3. **PR Checklist**:
   - [ ] Include before/after screenshots
   - [ ] Document manual testing results
   - [ ] Confirm all success criteria met
   - [ ] Link to specification

---

**Last Updated**: 2026-02-14
**Status**: Ready for implementation
