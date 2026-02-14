# Test Matrix Checklist: Component Design System Compliance

**Purpose**: Systematically validate all 130 combinations (13 components × 5 themes × 2 modes) to ensure zero visual regressions and complete theme support.

**Created**: 2026-02-14
**Feature**: Component Design System Compliance & Enhancement

## How to Use This Checklist

1. Start the Expo development server: `npx expo start`
2. For each theme preset:
   - Switch to the theme in app settings
   - Toggle between light and dark modes
   - Navigate to screens that showcase each component
   - Check off items as you verify visual correctness
3. Mark items with ⚠️ if visual issues are found
4. Document any issues in the "Issues Found" section at the bottom

---

## Theme: Emerald

### Light Mode

- [ ] Button - All variants (contained, outlined, text, elevated, transparent) and sizes render correctly
- [ ] Card - All variants (elevated, outlined, filled, gradient) render with correct colors and shadows
- [ ] CircularProgress - Progress indicator uses correct brand colors and trackColor
- [ ] CustomTabBar - Tab bar background, blur effect, and text colors are correct
- [ ] DatePicker - Calendar styling uses correct background and text colors
- [ ] Divider - Line color matches border tokens, no hardcoded opacity
- [ ] Icon - All icon variants (primary, secondary, tertiary, muted, inverse, accent) render correctly
- [ ] IconButton - All variants and colors render correctly
- [ ] Input - Border colors, background, text, and focus states use theme tokens
- [ ] SearchInput - Search icon, clear button, and input styling match theme
- [ ] SegmentedControl - Background, selected state, and text colors are correct
- [ ] Select - Dropdown styling, selected item, and border colors match theme
- [ ] Typography - All color variants (11 total) render with correct theme colors

### Dark Mode

- [ ] Button - All variants and sizes render correctly with dark theme colors
- [ ] Card - All variants adapt to dark mode (elevated shows proper elevation, gradient inverts if needed)
- [ ] CircularProgress - Uses dark mode brand colors
- [ ] CustomTabBar - Dark blur effect and inverse text colors work correctly
- [ ] DatePicker - Dark mode calendar styling
- [ ] Divider - Dark mode border color
- [ ] Icon - All icon variants work in dark mode
- [ ] IconButton - All variants adapt to dark mode
- [ ] Input - Dark mode background, text, and border colors
- [ ] SearchInput - Dark mode styling
- [ ] SegmentedControl - Dark mode background and selection colors
- [ ] Select - Dark mode dropdown styling
- [ ] Typography - All color variants work in dark mode

---

## Theme: Desert

### Light Mode

- [ ] Button
- [ ] Card
- [ ] CircularProgress
- [ ] CustomTabBar
- [ ] DatePicker
- [ ] Divider
- [ ] Icon
- [ ] IconButton
- [ ] Input
- [ ] SearchInput
- [ ] SegmentedControl
- [ ] Select
- [ ] Typography

### Dark Mode

- [ ] Button
- [ ] Card
- [ ] CircularProgress
- [ ] CustomTabBar
- [ ] DatePicker
- [ ] Divider
- [ ] Icon
- [ ] IconButton
- [ ] Input
- [ ] SearchInput
- [ ] SegmentedControl
- [ ] Select
- [ ] Typography

---

## Theme: Sapphire

### Light Mode

- [ ] Button
- [ ] Card
- [ ] CircularProgress
- [ ] CustomTabBar
- [ ] DatePicker
- [ ] Divider
- [ ] Icon
- [ ] IconButton
- [ ] Input
- [ ] SearchInput
- [ ] SegmentedControl
- [ ] Select
- [ ] Typography

### Dark Mode

- [ ] Button
- [ ] Card
- [ ] CircularProgress
- [ ] CustomTabBar
- [ ] DatePicker
- [ ] Divider
- [ ] Icon
- [ ] IconButton
- [ ] Input
- [ ] SearchInput
- [ ] SegmentedControl
- [ ] Select
- [ ] Typography

---

## Theme: Moonlight

### Light Mode

- [ ] Button
- [ ] Card
- [ ] CircularProgress
- [ ] CustomTabBar
- [ ] DatePicker
- [ ] Divider
- [ ] Icon
- [ ] IconButton
- [ ] Input
- [ ] SearchInput
- [ ] SegmentedControl
- [ ] Select
- [ ] Typography

### Dark Mode

- [ ] Button
- [ ] Card
- [ ] CircularProgress
- [ ] CustomTabBar
- [ ] DatePicker
- [ ] Divider
- [ ] Icon
- [ ] IconButton
- [ ] Input
- [ ] SearchInput
- [ ] SegmentedControl
- [ ] Select
- [ ] Typography

---

## Theme: Royal

### Light Mode

- [ ] Button
- [ ] Card
- [ ] CircularProgress
- [ ] CustomTabBar
- [ ] DatePicker
- [ ] Divider
- [ ] Icon
- [ ] IconButton
- [ ] Input
- [ ] SearchInput
- [ ] SegmentedControl
- [ ] Select
- [ ] Typography

### Dark Mode

- [ ] Button
- [ ] Card
- [ ] CircularProgress
- [ ] CustomTabBar
- [ ] DatePicker
- [ ] Divider
- [ ] Icon
- [ ] IconButton
- [ ] Input
- [ ] SearchInput
- [ ] SegmentedControl
- [ ] Select
- [ ] Typography

---

## Summary

**Total Combinations**: 130 (13 components × 5 themes × 2 modes)

**Completed**: 0/130
**Passed**: 0
**Failed**: 0
**Not Tested**: 130

---

## Issues Found

_Document any visual regressions, color mismatches, or styling issues here:_

<!-- Example:
- **Button (Emerald Dark)**: Outlined variant border too faint - needs higher contrast
- **Card (Royal Light)**: Gradient colors inverted - should use lighter gradient
-->

---

## Sign-off

- [ ] All 130 combinations tested and verified
- [ ] Zero visual regressions confirmed
- [ ] All components use semantic color tokens (verified via code review)
- [ ] All hardcoded values removed (verified via code review)
- [ ] `npm run validate` passes with zero errors

**Tested by**: **\*\*\*\***\_**\*\*\*\***
**Date**: **\*\*\*\***\_**\*\*\*\***
**Approved by**: **\*\*\*\***\_**\*\*\*\***
