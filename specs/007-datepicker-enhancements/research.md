# Research: DatePicker Enhancements

**Branch**: `007-datepicker-enhancements` | **Date**: 2026-02-15

## R1: Scrollable Wheel Implementation for Time Picker

**Decision**: Use React Native `FlatList` with snap-to-item behavior for scrollable time wheels.

**Rationale**: FlatList with `snapToInterval` and `decelerationRate="fast"` provides native-feeling snap-to-item scrolling. Combined with `getItemLayout` for fixed-height items, this avoids the need for any third-party wheel picker library. The approach is proven in production React Native apps and aligns with Constitution Principle V (no unnecessary dependencies).

**Alternatives considered**:

- `@react-native-picker/picker`: Native wheel on iOS but inconsistent Android behavior; adds dependency
- `react-native-wheel-scrollview-picker`: Third-party library with limited maintenance; adds dependency
- Custom `ScrollView` with `onMomentumScrollEnd`: Less precise snapping than FlatList with `snapToInterval`
- `Animated.ScrollView` with gesture handlers: Over-engineered for this use case

**Implementation approach**:

- FlatList with `snapToInterval={ITEM_HEIGHT}` for precise snapping
- `showsVerticalScrollIndicator={false}` for clean UI
- Padding items at top/bottom (2 transparent items each) so first/last values can center
- `onMomentumScrollEnd` to read selected index from `contentOffset.y / ITEM_HEIGHT`
- `scrollToIndex` for programmatic scroll (initial value, constraints)
- `getItemLayout` for O(1) scroll-to-index (all items same height)

## R2: Year Selector with Tap-to-Type

**Decision**: Use FlatList for scrollable year list (1900-2100) with a `TextInput` overlay activated on tap.

**Rationale**: FlatList handles the 200-item year list efficiently with virtualization. The tap-to-type feature uses a hidden `TextInput` that becomes visible when the user taps the current year display. This avoids modal-in-modal complexity and provides a clean UX.

**Alternatives considered**:

- Bottom sheet with year grid: Too many items (200) for a grid; scrollable list is more appropriate
- Scroll wheel (same as time picker): Year list is too long (200 items) for smooth wheel feel
- Search input always visible: Wastes space; most users will scroll

**Implementation approach**:

- FlatList with `initialScrollIndex` pointing to current/selected year
- Items show year number, with selected year highlighted (brand.primary background)
- Disabled years (outside minDate/maxDate range) shown with muted styling
- Tapping the year display at the top toggles a `TextInput` with `keyboardType="number-pad"`
- Input validates: must be 4 digits, within 1900-2100 range
- On valid input submit, FlatList scrolls to that year and selects it

## R3: Month Grid Layout

**Decision**: Use a 4×3 grid (4 columns × 3 rows) of Pressable buttons showing localized month names.

**Rationale**: 12 months fit perfectly in a 4×3 grid that fills the calendar area. This replaces the calendar day grid when activated, keeping the same modal real estate. Each button uses existing Typography and theme patterns.

**Alternatives considered**:

- 3×4 grid (3 columns × 4 rows): 4 columns uses horizontal space better on mobile
- Scrollable list: Unnecessary for only 12 items
- Horizontal scroll: Poor discoverability

**Implementation approach**:

- Grid uses `flexWrap: 'wrap'` with each item at `width: '25%'`
- Each month button shows localized name from `auth.calendar.months.*`
- Selected month highlighted with `brand.primary` background
- Months outside minDate/maxDate range for the current year are disabled (muted styling)
- Tapping a month closes the month grid and returns to calendar view for that month

## R4: View State Management

**Decision**: Use a single `viewMode` state in the DatePicker to manage which sub-view is displayed.

**Rationale**: The modal content area cycles between three views: `'calendar'` (default), `'year'`, and `'month'`. A simple state variable with conditional rendering keeps the logic straightforward and avoids animation library overhead for view switching.

**Implementation approach**:

```
type DatePickerViewMode = 'calendar' | 'year' | 'month';
const [viewMode, setViewMode] = useState<DatePickerViewMode>('calendar');
```

- Calendar view: existing day grid (default)
- Year view: YearSelector component (activated by tapping year in header)
- Month view: MonthGrid component (activated by tapping month in header)
- Selecting year/month returns to calendar view
- Only one selector open at a time (FR-012)

## R5: Time Display in Picker Button

**Decision**: When `mode` is "datetime" or "time", the picker button shows formatted time alongside date.

**Rationale**: Users need to see the selected time in the trigger button. Format follows locale (12h: "3:05 PM", 24h: "15:05").

**Implementation approach**:

- `formatTime(date, format)` utility function
- Display format: `"MMM dd, yyyy · HH:mm"` for datetime, `"HH:mm"` for time-only
- Time section appears below calendar in datetime mode, replaces calendar in time-only mode
- Separator (middot `·`) between date and time in display text

## R6: Backward Compatibility Strategy

**Decision**: All new props have defaults that preserve existing behavior. `mode` defaults to `"date"`.

**Rationale**: Existing consumers pass no `mode` prop and expect date-only behavior. Default values ensure zero breaking changes.

**Implementation approach**:

- `mode?: 'date' | 'time' | 'datetime'` defaults to `'date'`
- `timeFormat?: '12h' | '24h'` defaults to locale-based detection
- `minuteStep?: number` defaults to `5`
- `minTime?` / `maxTime?` default to `undefined` (no constraints)
- When `mode` is `'date'`, time components are set to `00:00:00` in the returned Date
- No existing prop signatures change

## R7: i18n Keys Structure

**Decision**: Add time-related keys under `auth.calendar.time` namespace.

**Rationale**: Calendar and time picker are part of the same component. Keeping keys under the existing `auth.calendar` namespace maintains consistency.

**New keys**:

```
auth.calendar.time.hours       → "Hours" / "الساعات"
auth.calendar.time.minutes     → "Minutes" / "الدقائق"
auth.calendar.time.am          → "AM" / "ص"
auth.calendar.time.pm          → "PM" / "م"
auth.calendar.selectTime       → "Select Time" / "اختر الوقت"
auth.calendar.selectDateTime   → "Select Date & Time" / "اختر التاريخ والوقت"
auth.calendar.selectYear       → "Select Year" / "اختر السنة"
auth.calendar.yearInput        → "Enter year" / "أدخل السنة"
```
