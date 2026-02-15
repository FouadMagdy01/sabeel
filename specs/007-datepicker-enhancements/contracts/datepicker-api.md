# Component API Contract: DatePicker

**Branch**: `007-datepicker-enhancements` | **Date**: 2026-02-15

## DatePicker Component API

### Props Interface (Full — Extended)

```typescript
export type DatePickerMode = 'date' | 'time' | 'datetime';
export type DatePickerSize = 'small' | 'medium' | 'large';
export type DatePickerVariant = 'outlined' | 'filled';
export type TimeFormat = '12h' | '24h';

export interface TimeValue {
  hours: number; // 0-23
  minutes: number; // 0-55 (multiples of minuteStep)
}

export interface DatePickerProps {
  // === EXISTING PROPS (unchanged) ===

  /** Currently selected date/time value */
  value?: Date | null;

  /** Callback when date/time changes */
  onValueChange: (date: Date | null) => void;

  /** Placeholder text when no value is selected */
  placeholder?: string;

  /** Label text displayed above the picker */
  label?: string;

  /** Visual variant @default 'outlined' */
  variant?: DatePickerVariant;

  /** Size of the picker @default 'medium' */
  size?: DatePickerSize;

  /** Whether the picker is disabled @default false */
  disabled?: boolean;

  /** Whether the picker has an error @default false */
  error?: boolean;

  /** Error message to display */
  errorText?: string;

  /** Helper text displayed below the picker */
  helperText?: string;

  /** Minimum selectable date */
  minDate?: Date;

  /** Maximum selectable date */
  maxDate?: Date;

  /** Date format for display @default 'MMM dd, yyyy' */
  dateFormat?: string;

  /** Show clear button when value selected @default false */
  clearable?: boolean;

  /** Custom container style */
  containerStyle?: StyleProp<ViewStyle>;

  /** Custom picker button style */
  pickerStyle?: StyleProp<ViewStyle>;

  /** Custom label style */
  labelStyle?: StyleProp<TextStyle>;

  // === NEW PROPS ===

  /**
   * Picker mode determining which controls are shown.
   * - 'date': Calendar only (default, backward compatible)
   * - 'time': Time wheels only (no calendar)
   * - 'datetime': Calendar + time wheels
   * @default 'date'
   */
  mode?: DatePickerMode;

  /**
   * Time display format. When not specified, auto-detects from locale.
   * - '12h': 1-12 with AM/PM
   * - '24h': 0-23
   * @default locale-based
   */
  timeFormat?: TimeFormat;

  /**
   * Minute wheel step increment.
   * @default 5
   */
  minuteStep?: number;

  /**
   * Minimum selectable time (applied when selected date matches minDate).
   * Only relevant when mode is 'time' or 'datetime'.
   */
  minTime?: TimeValue;

  /**
   * Maximum selectable time (applied when selected date matches maxDate).
   * Only relevant when mode is 'time' or 'datetime'.
   */
  maxTime?: TimeValue;
}
```

## Usage Examples

### Date Only (existing behavior, unchanged)

```tsx
<DatePicker
  label="Date of Birth"
  value={dateOfBirth}
  onValueChange={setDateOfBirth}
  placeholder="Select your birth date"
  maxDate={new Date()}
/>
```

### DateTime Mode

```tsx
<DatePicker
  mode="datetime"
  label="Event Date & Time"
  value={eventDateTime}
  onValueChange={setEventDateTime}
  placeholder="Select date and time"
  timeFormat="12h"
/>
```

### Time Only Mode

```tsx
<DatePicker
  mode="time"
  label="Prayer Alarm"
  value={alarmTime}
  onValueChange={setAlarmTime}
  placeholder="Set alarm time"
  timeFormat="24h"
  minuteStep={5}
/>
```

### With Time Constraints

```tsx
<DatePicker
  mode="datetime"
  label="Appointment"
  value={appointment}
  onValueChange={setAppointment}
  minDate={new Date()}
  minTime={{ hours: 9, minutes: 0 }}
  maxTime={{ hours: 17, minutes: 0 }}
/>
```

## Internal Sub-Component APIs

### YearSelector

```typescript
interface YearSelectorProps {
  selectedYear: number;
  minYear: number;
  maxYear: number;
  onSelectYear: (year: number) => void;
}
```

### MonthGrid

```typescript
interface MonthGridProps {
  selectedMonth: number; // 0-11
  year: number; // For constraint checking
  minDate?: Date;
  maxDate?: Date;
  onSelectMonth: (month: number) => void;
}
```

### TimeWheelPicker

```typescript
interface TimeWheelPickerProps {
  hours: number; // 0-23 (internal 24h)
  minutes: number; // 0-55 (step of minuteStep)
  timeFormat: '12h' | '24h';
  minuteStep: number;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  onTimeChange: (hours: number, minutes: number) => void;
}
```

## Behavioral Contract

### Return Value

| Mode         | Return Value                              |
| ------------ | ----------------------------------------- |
| `'date'`     | `Date` with time set to `00:00:00.000`    |
| `'time'`     | `Date` with today's date + selected time  |
| `'datetime'` | `Date` with selected date + selected time |
| Cleared      | `null`                                    |

### Error Handling

| Condition                            | Behavior                                     |
| ------------------------------------ | -------------------------------------------- |
| `minDate > maxDate`                  | Console warning; fallback to 1900-2100 range |
| Invalid year input (non-numeric)     | Input rejected, no state change              |
| Year input out of range              | Input rejected, stays at current             |
| Feb 29 → non-leap year               | Auto-adjust to Feb 28                        |
| `mode` changes from datetime to date | Preserve date, reset time to 00:00           |

### Display Format

| Mode               | Button Display             |
| ------------------ | -------------------------- |
| `'date'`           | `"Feb 15, 2026"`           |
| `'time'` (12h)     | `"3:05 PM"`                |
| `'time'` (24h)     | `"15:05"`                  |
| `'datetime'` (12h) | `"Feb 15, 2026 · 3:05 PM"` |
| `'datetime'` (24h) | `"Feb 15, 2026 · 15:05"`   |
| No value           | Placeholder text           |

### Modal Title

| Mode         | Title (en)           | Title (ar)            |
| ------------ | -------------------- | --------------------- |
| `'date'`     | "Select Date"        | "اختر التاريخ"        |
| `'time'`     | "Select Time"        | "اختر الوقت"          |
| `'datetime'` | "Select Date & Time" | "اختر التاريخ والوقت" |
