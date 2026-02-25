# Data Model: DatePicker Enhancements

**Branch**: `007-datepicker-enhancements` | **Date**: 2026-02-15

## Overview

This feature has no persistent data model (no database, no API). All state is component-local. This document defines the TypeScript type contracts and internal state shapes used by the enhanced DatePicker.

## Entity: DatePickerProps (Extended)

The existing `DatePickerProps` interface is extended with new optional props. All additions are backward-compatible.

### New Props

| Prop         | Type                                 | Default      | Description                           |
| ------------ | ------------------------------------ | ------------ | ------------------------------------- |
| `mode`       | `'date' \| 'time' \| 'datetime'`     | `'date'`     | Determines which pickers are shown    |
| `timeFormat` | `'12h' \| '24h'`                     | Locale-based | Overrides locale-detected time format |
| `minuteStep` | `number`                             | `5`          | Minute increment for the minute wheel |
| `minTime`    | `{ hours: number; minutes: number }` | `undefined`  | Minimum selectable time (same date)   |
| `maxTime`    | `{ hours: number; minutes: number }` | `undefined`  | Maximum selectable time (same date)   |

### Preserved Props (no changes)

`value`, `onValueChange`, `placeholder`, `label`, `variant`, `size`, `disabled`, `error`, `errorText`, `helperText`, `minDate`, `maxDate`, `dateFormat`, `clearable`, `containerStyle`, `pickerStyle`, `labelStyle`

## Entity: Internal State

### DatePicker Component State

| State            | Type                 | Purpose                                    |
| ---------------- | -------------------- | ------------------------------------------ |
| `isOpen`         | `boolean`            | Modal visibility                           |
| `viewDate`       | `Date`               | Currently displayed month/year in calendar |
| `selectedDate`   | `Date \| null`       | Pending date selection (before confirm)    |
| `selectedHour`   | `number`             | Pending hour selection (0-23 internal)     |
| `selectedMinute` | `number`             | Pending minute selection (0, 5, 10...55)   |
| `viewMode`       | `DatePickerViewMode` | Current sub-view: calendar, year, or month |

### DatePickerViewMode

```
type DatePickerViewMode = 'calendar' | 'year' | 'month';
```

**State transitions**:

- `calendar` → `year` (tap year display)
- `calendar` → `month` (tap month display)
- `year` → `calendar` (select year or dismiss)
- `month` → `calendar` (select month or dismiss)
- `year` ↔ `month` not allowed (FR-012: only one selector open at a time)

### TimeValue (Internal)

```
interface TimeValue {
  hours: number;   // 0-23 (always 24h internally)
  minutes: number; // 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55
}
```

## Entity: YearSelector Props

| Prop           | Type                     | Description                                    |
| -------------- | ------------------------ | ---------------------------------------------- |
| `selectedYear` | `number`                 | Currently selected year                        |
| `minYear`      | `number`                 | Minimum selectable year (from minDate or 1900) |
| `maxYear`      | `number`                 | Maximum selectable year (from maxDate or 2100) |
| `onSelectYear` | `(year: number) => void` | Callback when year selected                    |

## Entity: MonthGrid Props

| Prop            | Type                      | Description                            |
| --------------- | ------------------------- | -------------------------------------- |
| `selectedMonth` | `number`                  | Currently selected month (0-11)        |
| `year`          | `number`                  | Current year (for constraint checking) |
| `minDate`       | `Date \| undefined`       | Minimum date constraint                |
| `maxDate`       | `Date \| undefined`       | Maximum date constraint                |
| `onSelectMonth` | `(month: number) => void` | Callback when month selected           |

## Entity: TimeWheelPicker Props

| Prop           | Type                                       | Description                   |
| -------------- | ------------------------------------------ | ----------------------------- |
| `hours`        | `number`                                   | Current hour (0-23)           |
| `minutes`      | `number`                                   | Current minute (0-55, step 5) |
| `timeFormat`   | `'12h' \| '24h'`                           | Display format                |
| `minuteStep`   | `number`                                   | Minute increment (default 5)  |
| `minTime`      | `TimeValue \| undefined`                   | Minimum time constraint       |
| `maxTime`      | `TimeValue \| undefined`                   | Maximum time constraint       |
| `onTimeChange` | `(hours: number, minutes: number) => void` | Callback on change            |

## Validation Rules

1. **Year range**: 1900 ≤ year ≤ 2100
2. **Hour range**: 0 ≤ hours ≤ 23 (internal), displayed as 1-12 in 12h mode
3. **Minute values**: Must be multiples of `minuteStep` (default 5)
4. **Date auto-adjust**: When year/month change creates invalid date (e.g., Feb 29 → non-leap year), day auto-adjusts to last valid day of month
5. **Invalid constraints**: When `minDate > maxDate`, fallback to 1900-01-01 / 2100-12-31 with console warning
6. **Time constraints**: `minTime`/`maxTime` only apply when selected date matches the constraint date boundary
