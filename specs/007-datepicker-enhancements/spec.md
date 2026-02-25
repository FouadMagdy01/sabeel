# Feature Specification: DatePicker Enhancements

**Feature Branch**: `007-datepicker-enhancements`
**Created**: 2026-02-15
**Status**: Draft
**Input**: User description: "i want to do some modifications to the date picker\nit has two main killing issues now\n1- user has to click the arrow back a lot to go to older years\nfix this problem and add any other thing to use the year directly\n2- no time support: i want this to have time picking mode"

## Clarifications

### Session 2026-02-15

- Q: What interaction pattern should the time picker use for selecting hours and minutes? → A: Scrollable wheels (like iOS native time picker)
- Q: What happens when `minDate` is in the future and `maxDate` is in the past (invalid configuration)? → A: Use fallback values (minDate: 1900-01-01, maxDate: 2100-12-31) and log console warning
- Q: What happens when the user has a date selected and changes the year to one where that date doesn't exist (e.g., Feb 29 in a non-leap year)? → A: Auto-adjust to the last valid day of that month (Feb 28)
- Q: What granularity should the minute selector use in the time picker? → A: 5-minute increments (0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55)
- Q: How should the year selector support both scrolling and direct numeric input? → A: Scrollable list where tapping the displayed year activates numeric keyboard input

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Direct Year Selection (Priority: P1)

Users need to select dates from distant past (e.g., birth dates) or future (e.g., event dates) without repeatedly clicking navigation arrows to traverse years. The current implementation forces users to click the back arrow dozens of times to reach older years, creating a frustrating experience.

**Why this priority**: This is the primary pain point identified by users. Birth date selection (for user profiles, age verification) requires navigating back 20-50 years, making the current implementation unusable for this common use case.

**Independent Test**: Can be fully tested by opening the date picker, selecting a year directly from a picker/dropdown, and confirming the calendar navigates to that year. Delivers immediate value by reducing task completion time from 30+ clicks to 2-3 interactions.

**Acceptance Scenarios**:

1. **Given** the date picker is opened, **When** user taps on the year display (currently showing "January 2026"), **Then** a scrollable year list appears with the current year highlighted
2. **Given** the year selector is open, **When** user scrolls through the year list, **Then** years scroll smoothly and the selected year is highlighted
3. **Given** the year selector is open, **When** user taps on the displayed year number, **Then** a numeric keyboard appears allowing direct year input (1900-2100)
4. **Given** user is typing a year via keyboard, **When** user enters a valid 4-digit year and confirms, **Then** the year list scrolls to that year and highlights it
5. **Given** a year is selected from the year picker, **When** user confirms the selection, **Then** the calendar view updates to show the selected year while maintaining the current month, and the year selector closes
6. **Given** the user has selected a year far in the past (e.g., 1990), **When** the calendar view updates, **Then** the month navigation arrows work correctly to navigate between months in that year
7. **Given** a `minDate` or `maxDate` constraint is set, **When** the year picker is opened, **Then** years outside the valid range are disabled or hidden

---

### User Story 2 - Month Selection Enhancement (Priority: P2)

Users want to quickly jump to a specific month without clicking navigation arrows multiple times. When combined with year selection, this creates a complete fast-navigation system for any date.

**Why this priority**: Complements P1 by enabling 2-step navigation (year → month) instead of iterative arrow clicking. Common for scenarios like "select your graduation date" or "when did you start working here?"

**Independent Test**: Can be tested by tapping on the month display, selecting a different month from a picker, and verifying the calendar updates. Works independently of year selection feature.

**Acceptance Scenarios**:

1. **Given** the date picker is opened, **When** user taps on the month display (currently showing "January 2026"), **Then** a month selection interface appears showing all 12 months
2. **Given** the month selector is open, **When** user taps a month name, **Then** the calendar view updates to show the selected month and the month selector closes
3. **Given** a `minDate` or `maxDate` constraint is set, **When** the month picker is opened for a boundary year, **Then** months outside the valid range are disabled
4. **Given** both month and year selectors can be opened, **When** user opens the month selector while the year selector is already open, **Then** the year selector closes first (only one selector open at a time)

---

### User Story 3 - Time Picking Mode (Priority: P1)

Users need to select time in addition to date for scheduling scenarios (prayer times, event scheduling, reminder setting). The current date-only picker cannot support time-sensitive features like custom prayer alarms or event notifications.

**Why this priority**: Critical for core app features like prayer time customization and event scheduling. Without time support, features requiring datetime input cannot be implemented, blocking development of time-sensitive functionality.

**Independent Test**: Can be tested by enabling time mode on the picker, selecting both date and time, and verifying the returned value includes hours and minutes. Delivers value for any time-dependent feature in the app.

**Acceptance Scenarios**:

1. **Given** the DatePicker has a `mode` prop set to "datetime", **When** the picker modal opens, **Then** the interface displays both calendar and time selection controls
2. **Given** the time mode is enabled, **When** user selects hours and minutes using scrollable wheels, **Then** the selected time is displayed and updates in real-time
3. **Given** both date and time are selected, **When** user taps confirm, **Then** the `onValueChange` callback receives a Date object with both date and time components set correctly
4. **Given** the `mode` is set to "time" only, **When** the picker opens, **Then** only the time selection interface is shown without the calendar
5. **Given** the time picker uses 12-hour format, **When** user selects hours, **Then** AM/PM toggle is displayed and the time is converted correctly to 24-hour format in the Date object
6. **Given** the time picker uses 24-hour format, **When** user selects hours, **Then** hours range from 00-23 and no AM/PM toggle is shown

---

### User Story 4 - Time Format Localization (Priority: P3)

Users from different regions expect time to be displayed in their preferred format (12-hour vs 24-hour) based on their locale settings or app language.

**Why this priority**: Enhances usability for international users but not critical for core functionality. Can default to 24-hour format initially with localization added later.

**Independent Test**: Can be tested by changing the app locale and verifying the time picker switches between 12-hour (with AM/PM) and 24-hour formats accordingly.

**Acceptance Scenarios**:

1. **Given** the app locale is set to English (US) or Arabic, **When** the time picker opens, **Then** it displays 12-hour format with AM/PM selector
2. **Given** the app locale is set to English (UK) or other 24-hour regions, **When** the time picker opens, **Then** it displays 24-hour format without AM/PM
3. **Given** a `timeFormat` prop is explicitly set to "12h" or "24h", **When** the time picker opens, **Then** it uses the specified format regardless of locale

---

### Edge Cases

- What happens when a user selects a year far outside the typical range (e.g., year 1900 or 2100)?
- **Leap year handling**: When a selected date doesn't exist in the new year (e.g., Feb 29 → non-leap year), the system auto-adjusts to the last valid day of that month (Feb 28) to preserve user intent
- **Invalid date constraints**: When `minDate` is in the future and `maxDate` is in the past, the system logs a console warning and uses fallback values (minDate: 1900-01-01, maxDate: 2100-12-31) to allow all valid dates
- How does the time picker handle edge times like 00:00 (midnight) and 23:59?
- What happens when switching from "datetime" mode to "date" only mode with a previously selected time value?
- How does the system handle time zone differences when storing and displaying datetime values?

## Requirements _(mandatory)_

### Functional Requirements

#### Year Selection

- **FR-001**: DatePicker MUST provide a tappable year display that opens a year selection interface
- **FR-002**: Year selector MUST allow selection of years from a reasonable range (1900-2100)
- **FR-003**: Year selector MUST display as a scrollable list of years
- **FR-003a**: Tapping the displayed year number in the year selector MUST activate a numeric keyboard for direct year input
- **FR-004**: Selected year MUST be highlighted in the year list with visual indication
- **FR-005**: Calendar view MUST update to the selected year while preserving the current month when year is changed
- **FR-006**: Year selector MUST respect `minDate` and `maxDate` constraints by disabling or hiding out-of-range years
- **FR-007**: Year selector MUST close automatically when a year is selected or when user taps outside the selector

#### Month Selection

- **FR-008**: DatePicker MUST provide a tappable month display that opens a month selection interface
- **FR-009**: Month selector MUST display all 12 months in a grid or list layout with localized names
- **FR-010**: Calendar view MUST update to the selected month when a month is chosen
- **FR-011**: Month selector MUST respect `minDate` and `maxDate` constraints by disabling out-of-range months
- **FR-012**: System MUST ensure only one selector (year or month) can be open at a time

#### Time Picking

- **FR-013**: DatePicker MUST accept a `mode` prop with values: "date" (default), "time", or "datetime"
- **FR-014**: When `mode` is "datetime", the picker MUST display both calendar and time selection controls
- **FR-015**: When `mode` is "time", the picker MUST display only time selection controls without the calendar
- **FR-016**: Time selector MUST provide separate scrollable wheel controls for hours and minutes
- **FR-016a**: Minute wheel MUST increment in 5-minute steps (0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55)
- **FR-017**: System MUST support both 12-hour and 24-hour time formats with appropriate hour ranges
- **FR-018**: When using 12-hour format, the picker MUST provide an AM/PM toggle control
- **FR-019**: Selected time MUST be combined with the selected date in the returned Date object
- **FR-020**: Time selection MUST update in real-time as user changes hour/minute values
- **FR-021**: When `mode` changes from "datetime" to "date", the system MUST preserve the date portion and reset time to 00:00
- **FR-022**: Time picker MUST accept optional `minTime` and `maxTime` constraints for the same date

#### Backward Compatibility

- **FR-023**: Existing DatePicker usage without `mode` prop MUST continue to work as date-only picker (default behavior)
- **FR-024**: All existing props (`value`, `onValueChange`, `minDate`, `maxDate`, `clearable`, etc.) MUST remain functional
- **FR-025**: The returned Date object MUST have time components set to 00:00:00 when `mode` is "date"

#### Error Handling & Validation

- **FR-026**: When `minDate` > `maxDate` (invalid configuration), the system MUST log a console warning and use fallback values (minDate: 1900-01-01, maxDate: 2100-12-31)
- **FR-027**: The picker MUST handle invalid prop values gracefully without crashing, logging warnings for developer awareness
- **FR-028**: When year or month changes result in an invalid date (e.g., Feb 29 → non-leap year), the system MUST auto-adjust to the last valid day of that month

### Key Entities

- **DateTimeValue**: Represents the combined date and time selection, stored as a JavaScript Date object with both date (year/month/day) and time (hour/minute/second) components
- **TimeFormat**: Configuration for displaying time, includes format type (12h/24h), locale settings, and AM/PM state for 12-hour mode
- **DateRange**: Represents the valid selectable range defined by `minDate` and `maxDate`, used to disable out-of-range years, months, and times

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can select a birth date from 50 years ago in under 5 seconds (compared to 30+ seconds with arrow navigation)
- **SC-002**: Users can select any date within a 100-year range with no more than 3 interactions (year tap → select year → select day)
- **SC-003**: Time selection for datetime mode can be completed in under 10 seconds for any hour/minute combination
- **SC-004**: 95% of users successfully select a datetime value on first attempt without errors or confusion
- **SC-005**: The time picker displays in the correct format (12h/24h) based on locale with 100% accuracy
- **SC-006**: All existing date picker functionality remains unaffected (0 regressions in existing tests)
- **SC-007**: Year and month selectors respect date constraints with 100% accuracy (no out-of-range selections possible)
- **SC-008**: The enhanced picker maintains the same visual design language and theme compliance as the original component

## Assumptions

- The app will use the device's locale to determine default time format (12h vs 24h), with an optional override via props
- Time values will be stored in 24-hour format internally, converted for display only
- Year range of 1900-2100 covers all reasonable use cases (birth dates, historical events, future scheduling)
- Time picker will use 5-minute increment precision (no seconds, no 1-minute precision) as this is sufficient for prayer times, events, and reminders
- Existing minDate/maxDate constraints will apply to both date and time components (e.g., minDate="2026-02-15 10:00" prevents selecting earlier times on that date)
- The component will maintain a single Date object for both date and time, not separate date/time states
- Month selector will use a simple grid layout (3x4 or 4x3) rather than a scrollable list for quick selection
- Year selector will display as a scrollable list where tapping the year number activates keyboard input for direct entry

## Dependencies

- Existing DatePicker component implementation (src/common/components/DatePicker/)
- i18n translations for month names and time format labels (src/i18n/locales/)
- Theme system for consistent styling of new UI controls (src/theme/)
- React Native Modal and Pressable components for year/month/time selectors

## Out of Scope

- Timezone selection or conversion (app assumes all times are in user's local timezone)
- Date range selection (selecting start and end dates in one interaction)
- Recurring date/time patterns (e.g., "every Monday at 3 PM")
- Calendar events or agenda view integration
- Custom calendar systems (Hijri, Persian) - only Gregorian calendar supported
- Second-level time precision (only hours and minutes)
- Voice input or accessibility shortcuts for date/time selection
- Animated transitions between year/month/date views (basic modal transitions only)
