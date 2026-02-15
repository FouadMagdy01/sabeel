# Tasks: DatePicker Enhancements

**Input**: Design documents from `/specs/007-datepicker-enhancements/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/datepicker-api.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extend types, add i18n keys, and prepare foundational code shared across all user stories

- [x] T001 Extend DatePicker type definitions with new props (`mode`, `timeFormat`, `minuteStep`, `minTime`, `maxTime`, `DatePickerMode`, `TimeFormat`, `TimeValue`, `DatePickerViewMode`) in `src/common/components/DatePicker/DatePicker.types.ts` — see contracts/datepicker-api.md for full interface
- [x] T002 [P] Add English i18n keys for time picker, year selector, and month grid under `auth.calendar` namespace in `src/i18n/locales/en.json` — keys: `time.hours`, `time.minutes`, `time.am`, `time.pm`, `selectTime`, `selectDateTime`, `selectYear`, `yearInput` (see research.md R7)
- [x] T003 [P] Add Arabic i18n keys matching T002 in `src/i18n/locales/ar.json` — translations: `الساعات`, `الدقائق`, `ص`, `م`, `اختر الوقت`, `اختر التاريخ والوقت`, `اختر السنة`, `أدخل السنة`
- [x] T004 Update exports in `src/common/components/DatePicker/index.ts` to export new types: `DatePickerMode`, `TimeFormat`, `TimeValue`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared styles and view mode state management that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Add `viewMode` state (`'calendar' | 'year' | 'month'`) and `selectedHour`/`selectedMinute` state to `src/common/components/DatePicker/DatePicker.tsx` — add new props to the component signature (`mode`, `timeFormat`, `minuteStep`, `minTime`, `maxDate` with defaults from contracts). Wire `mode` default to `'date'`. Do NOT yet add conditional rendering for sub-views (that comes in user story phases)
- [x] T006 Add validation helper for `minDate`/`maxDate` constraints in `src/common/components/DatePicker/DatePicker.tsx` — when `minDate > maxDate`, log console warning and use fallback values (1900-01-01 / 2100-12-31) per FR-026. Add date auto-adjust helper for leap year edge case (FR-028): when selected day exceeds days in month, clamp to last valid day
- [x] T007 Add shared styles for year selector, month grid, and time wheel picker to `src/common/components/DatePicker/DatePicker.styles.ts` — styles needed: `yearSelectorContainer`, `yearItem`, `yearItemSelected`, `yearItemDisabled`, `yearInputContainer`, `yearInput`, `monthGrid`, `monthItem`, `monthItemSelected`, `monthItemDisabled`, `timePickerContainer`, `timeWheelContainer`, `timeWheelItem`, `timeWheelItemSelected`, `timeWheelSeparator`, `amPmToggle`, `amPmButton`, `amPmButtonActive`, `monthYearTappable`. All styles MUST use `StyleSheet.create((theme) => ({...}))` with semantic tokens per Constitution Principle I
- [x] T008 Update the modal header title and the picker button display text in `src/common/components/DatePicker/DatePicker.tsx` — modal title changes based on `mode`: "Select Date" (date), "Select Time" (time), "Select Date & Time" (datetime) using i18n keys. Display text in trigger button changes based on mode and value: date-only shows `"MMM dd, yyyy"`, time-only shows `"HH:mm"` or `"h:mm AM/PM"`, datetime shows `"MMM dd, yyyy · HH:mm"`. Add `formatTime` helper and update `formatDate` to handle all modes per contracts display format table
- [x] T009 Make month and year labels tappable in the calendar header of `src/common/components/DatePicker/DatePicker.tsx` — split the current `monthYearDisplay` text into two separate tappable `Pressable` components: one for month name and one for year number. Tapping month sets `viewMode` to `'month'`, tapping year sets `viewMode` to `'year'`. Use `monthYearTappable` style from T007. Keep existing arrow navigation buttons unchanged

**Checkpoint**: Foundation ready — types defined, i18n keys added, styles prepared, header tappable, view mode state wired

---

## Phase 3: User Story 1 — Direct Year Selection (Priority: P1) 🎯 MVP

**Goal**: Users can tap the year display to open a scrollable year list (1900–2100) with tap-to-type numeric input, select a year, and have the calendar update immediately

**Independent Test**: Open DatePicker → tap year → year selector appears → scroll or type year → select → calendar shows that year

### Implementation for User Story 1

- [x] T010 [US1] Create `YearSelector` sub-component in `src/common/components/DatePicker/YearSelector.tsx` — FlatList with 201 items (1900–2100), `snapToInterval` disabled (regular list scrolling for year selection), `initialScrollIndex` pointing to `selectedYear - 1900`, `getItemLayout` for O(1) scroll. Each item renders year number with `Typography`. Selected year highlighted with `brand.primary` background, disabled years (outside minYear/maxYear) shown with muted styling and non-pressable. Tapping a year item calls `onSelectYear(year)`. Props: `YearSelectorProps` from data-model.md
- [x] T011 [US1] Add tap-to-type numeric input to `YearSelector` in `src/common/components/DatePicker/YearSelector.tsx` — at the top of the year list, show the currently selected year as tappable text. When tapped, toggle a `TextInput` with `keyboardType="number-pad"`, `maxLength={4}`, placeholder from i18n key `auth.calendar.yearInput`. On submit: validate input is 4 digits, within minYear–maxYear range. If valid, call `onSelectYear` and scroll FlatList to that year. If invalid, dismiss input with no state change. Use `yearInputContainer` and `yearInput` styles from T007
- [x] T012 [US1] Integrate `YearSelector` into DatePicker modal in `src/common/components/DatePicker/DatePicker.tsx` — when `viewMode === 'year'`, render `YearSelector` in place of the calendar grid (inside `calendarContainer`). Pass `selectedYear` from `viewDate.getFullYear()`, compute `minYear`/`maxYear` from `minDate`/`maxDate` props (fallback 1900/2100). On `onSelectYear`: update `viewDate` to the selected year (preserve month, auto-adjust day via T006 helper), set `viewMode` back to `'calendar'`

**Checkpoint**: User Story 1 complete — year selector fully functional with scroll + type. Calendar updates to selected year. Existing date-only behavior unchanged.

---

## Phase 4: User Story 2 — Month Selection Enhancement (Priority: P2)

**Goal**: Users can tap the month display to open a 4×3 grid of localized month names, select a month, and have the calendar update immediately

**Independent Test**: Open DatePicker → tap month name → month grid appears → tap a month → calendar shows that month

### Implementation for User Story 2

- [x] T013 [US2] Create `MonthGrid` sub-component in `src/common/components/DatePicker/MonthGrid.tsx` — render a 4×3 grid (4 columns, 3 rows) using `flexDirection: 'row'` with `flexWrap: 'wrap'` and each item `width: '25%'`. Each cell is a `Pressable` showing localized month name from `auth.calendar.months.*` via `useTranslation()`. Selected month highlighted with `brand.primary` background and `text.inverse` color. Disabled months (outside minDate/maxDate range for the given `year`) shown with muted styling and non-pressable. Props: `MonthGridProps` from data-model.md. Tapping a month calls `onSelectMonth(monthIndex)`
- [x] T014 [US2] Integrate `MonthGrid` into DatePicker modal in `src/common/components/DatePicker/DatePicker.tsx` — when `viewMode === 'month'`, render `MonthGrid` in place of the calendar grid. Pass `selectedMonth` from `viewDate.getMonth()`, `year` from `viewDate.getFullYear()`, `minDate`/`maxDate` props. On `onSelectMonth`: update `viewDate` to the selected month (preserve year, auto-adjust day via T006 helper), set `viewMode` back to `'calendar'`. Ensure FR-012: if `viewMode` is set to `'month'`, it automatically means year selector is closed (single state variable guarantees this)

**Checkpoint**: User Story 2 complete — month grid functional. Combined with US1, users can now navigate to any year+month in 2 taps.

---

## Phase 5: User Story 3 — Time Picking Mode (Priority: P1)

**Goal**: Users can select hours and minutes using scrollable wheels. Supports three modes: date-only (existing), time-only, and datetime (calendar + time)

**Independent Test**: Set `mode="datetime"` → open picker → see calendar + time wheels → scroll to select time → confirm → Date object has correct date+time

### Implementation for User Story 3

- [x] T015 [US3] Create `TimeWheelPicker` sub-component in `src/common/components/DatePicker/TimeWheelPicker.tsx` — render side-by-side scrollable wheels for hours and minutes (and optionally AM/PM). Each wheel is a `FlatList` with `snapToInterval={ITEM_HEIGHT}` (ITEM_HEIGHT = 44), `decelerationRate="fast"`, `showsVerticalScrollIndicator={false}`, `getItemLayout` for O(1) scroll. Add 2 padding items at top and bottom so first/last values can center in the visible area (visible window = 5 items). Hour wheel: 0–23 for 24h mode, 1–12 for 12h mode. Minute wheel: values from 0 to 55 in steps of `minuteStep` (default 5). Use `onMomentumScrollEnd` to calculate selected index from `contentOffset.y / ITEM_HEIGHT` and call `onTimeChange(hours, minutes)`. Selected item (center) uses `timeWheelItemSelected` style with `brand.primary` color, others use muted. Add colon separator between wheels using `timeWheelSeparator` style. Props: `TimeWheelPickerProps` from data-model.md
- [x] T016 [US3] Add AM/PM toggle to `TimeWheelPicker` in `src/common/components/DatePicker/TimeWheelPicker.tsx` — when `timeFormat === '12h'`, render an AM/PM toggle alongside the hour and minute wheels. Toggle is two vertically stacked `Pressable` buttons ("AM"/"PM" from i18n keys `auth.calendar.time.am`/`auth.calendar.time.pm`). Active state uses `amPmButtonActive` style with `brand.primary` background. Internally convert 12h display to 24h for the `onTimeChange` callback (e.g., 12 PM → 12, 1 PM → 13, 12 AM → 0). Initialize AM/PM from the current `hours` prop (0–11 = AM, 12–23 = PM)
- [x] T017 [US3] Add time constraint enforcement to `TimeWheelPicker` in `src/common/components/DatePicker/TimeWheelPicker.tsx` — when `minTime` or `maxTime` are provided, disable (muted styling + non-scrollable-past) hours and minutes outside the allowed range. For the minute wheel, recalculate available minutes when hour changes (e.g., if minTime is 09:30 and selected hour is 9, minutes 0–25 are disabled). Use `timeWheelItemDisabled` style variant
- [x] T018 [US3] Integrate `TimeWheelPicker` into DatePicker modal in `src/common/components/DatePicker/DatePicker.tsx` — conditional rendering based on `mode` prop: when `mode === 'datetime'`, render `TimeWheelPicker` below the calendar grid (between calendar and footer). When `mode === 'time'`, render `TimeWheelPicker` only (hide calendar and month/year header). When `mode === 'date'` (default), hide time picker entirely. Pass `selectedHour`/`selectedMinute` state, resolved `timeFormat` (prop override or locale detection), `minuteStep`, `minTime`/`maxTime`. On `onTimeChange`: update `selectedHour` and `selectedMinute` state
- [x] T019 [US3] Update `handleConfirm` in `src/common/components/DatePicker/DatePicker.tsx` to combine date and time — when `mode === 'datetime'`: create Date from `selectedDate` + `selectedHour`/`selectedMinute`. When `mode === 'time'`: create Date from today + `selectedHour`/`selectedMinute`. When `mode === 'date'`: existing behavior (time set to 00:00:00). Update `handleOpen` to initialize `selectedHour`/`selectedMinute` from `value` prop (extract hours/minutes if value exists, else default to 0/0). Update `handleClear` to work with all modes

**Checkpoint**: User Story 3 complete — time picker works in all three modes. Date+time combined correctly in returned Date object. Existing date-only behavior unchanged.

---

## Phase 6: User Story 4 — Time Format Localization (Priority: P3)

**Goal**: Time picker auto-detects 12h/24h format from device locale, with override via `timeFormat` prop

**Independent Test**: Change app locale to Arabic → time picker shows 12h with AM/PM. Set `timeFormat="24h"` explicitly → shows 24h regardless of locale

### Implementation for User Story 4

- [x] T020 [US4] Implement locale-based time format detection in `src/common/components/DatePicker/DatePicker.tsx` — create a `useTimeFormat` helper (inline, not a separate hook file) that resolves the effective time format: (1) if `timeFormat` prop is provided, use it directly; (2) otherwise, detect from `i18n.language` — Arabic (`ar`) and English-US (`en-US`, `en`) → `'12h'`, other locales → `'24h'`. Pass the resolved format to `TimeWheelPicker`. This satisfies FR-017 and the US4 acceptance scenarios

**Checkpoint**: User Story 4 complete — time format auto-detects from locale, overridable via prop.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation, cleanup, and cross-story integration verification

- [x] T021 [P] Verify backward compatibility by confirming existing DatePicker usage (no `mode` prop) works identically to before — open `app/(auth)/Signup.tsx` (or any screen using DatePicker), verify: date-only selection works, clear button works, minDate/maxDate constraints work, error states display correctly. No regressions per FR-023/FR-024/FR-025
- [x] T022 [P] Verify RTL layout for all new sub-components — switch app to Arabic locale, open DatePicker, verify: year selector reads right-to-left, month grid reads right-to-left, time wheel labels in Arabic, AM/PM toggle in Arabic. No layout breaks
- [x] T023 Run `npm run validate` (type-check + lint + format) and fix any issues — ensure no TypeScript errors, no ESLint violations (no inline styles, no hardcoded strings, no `any` types), formatting matches Prettier config
- [x] T024 Verify edge cases: (1) select Feb 29 → change year to non-leap → confirms auto-adjust to Feb 28; (2) set `minDate` > `maxDate` → verify console warning and fallback range; (3) midnight (00:00) and 23:55 selectable in time picker; (4) year selector boundaries (1900 and 2100) are selectable

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion (T001 specifically for types) — BLOCKS all user stories
- **User Stories (Phases 3–6)**: All depend on Phase 2 completion
  - US1 (Phase 3) and US3 (Phase 5) are both P1 — start US1 first since US3 time picker benefits from the viewMode infrastructure
  - US2 (Phase 4) can run in parallel with US3 (different sub-components, different files)
  - US4 (Phase 6) depends on US3 completion (needs TimeWheelPicker to exist)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Year Selection)**: Depends on Phase 2 only — fully independent
- **US2 (Month Grid)**: Depends on Phase 2 only — fully independent, can parallelize with US1 or US3
- **US3 (Time Picking)**: Depends on Phase 2 only — fully independent of US1/US2
- **US4 (Time Localization)**: Depends on US3 (needs TimeWheelPicker from T015–T017)

### Within Each User Story

- Sub-component creation before integration into DatePicker
- Core functionality before constraint enforcement
- Integration into modal before updating confirm/clear handlers

### Parallel Opportunities

- T002 + T003 (i18n en + ar) can run in parallel
- T010 + T013 + T015 (YearSelector + MonthGrid + TimeWheelPicker) can all run in parallel after Phase 2
- T021 + T022 (backward compat + RTL verification) can run in parallel

---

## Parallel Example: After Phase 2 Completion

```bash
# Launch independent sub-components in parallel:
Task: "T010 [US1] Create YearSelector in src/common/components/DatePicker/YearSelector.tsx"
Task: "T013 [US2] Create MonthGrid in src/common/components/DatePicker/MonthGrid.tsx"
Task: "T015 [US3] Create TimeWheelPicker in src/common/components/DatePicker/TimeWheelPicker.tsx"

# After sub-components complete, integrations can proceed sequentially:
Task: "T012 [US1] Integrate YearSelector into DatePicker modal"
Task: "T014 [US2] Integrate MonthGrid into DatePicker modal"
Task: "T018 [US3] Integrate TimeWheelPicker into DatePicker modal"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T009)
3. Complete Phase 3: User Story 1 — Year Selection (T010–T012)
4. **STOP and VALIDATE**: Tap year → select from list or type → calendar updates
5. This alone solves the #1 pain point (clicking arrows to reach old years)

### Incremental Delivery

1. Setup + Foundational → Types, i18n, styles, header tappable
2. Add US1 (Year Selection) → **MVP! Primary pain point solved**
3. Add US2 (Month Grid) → Complete fast-navigation system (year + month)
4. Add US3 (Time Picking) → Unlocks all time-dependent features
5. Add US4 (Time Localization) → Locale-aware time format
6. Polish → Backward compat, RTL, edge cases, validation

### Sequential Execution (Solo Developer)

1. T001 → T002+T003 (parallel) → T004
2. T005 → T006 → T007 → T008 → T009
3. T010 → T011 → T012 (checkpoint: year selection works)
4. T013 → T014 (checkpoint: month grid works)
5. T015 → T016 → T017 → T018 → T019 (checkpoint: time picker works)
6. T020 (checkpoint: locale detection works)
7. T021+T022 (parallel) → T023 → T024

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All styles MUST use `StyleSheet.create((theme) => ({...}))` (Constitution Principle I)
- All user-facing text MUST use i18n keys (Constitution Principle II)
- No `any` types, no inline styles, no hardcoded strings (Constitution Principle IV)
