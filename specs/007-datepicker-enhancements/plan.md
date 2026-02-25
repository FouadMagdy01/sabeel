# Implementation Plan: DatePicker Enhancements

**Branch**: `007-datepicker-enhancements` | **Date**: 2026-02-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-datepicker-enhancements/spec.md`

## Summary

Enhance the existing DatePicker component with three capabilities: (1) direct year selection via a scrollable list with tap-to-type numeric input, (2) month grid selector for quick month navigation, and (3) a time picking mode using scrollable wheels with 5-minute increments. The implementation extends the current modal-based calendar picker by adding view states (calendar, year selector, month selector) and a new time wheel sub-component, all within the existing component folder structure and theme system.

## Technical Context

**Language/Version**: TypeScript 5.9.2
**Primary Dependencies**: React Native 0.81.5, Expo SDK 54, react-native-unistyles 3.0.20, react-native-reanimated 4.1.1, react-i18next 16.5.3
**Storage**: N/A (component-level state only)
**Testing**: Jest + jest-expo + @testing-library/react-native
**Target Platform**: iOS + Android (via Expo)
**Project Type**: Mobile
**Performance Goals**: 60 fps scrolling on year/time wheels, <100ms view transitions
**Constraints**: Must maintain backward compatibility with existing DatePicker API, all styling through unistyles theme system
**Scale/Scope**: Single component enhancement (DatePicker), ~5 files modified/created

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                      | Status | Notes                                                                                                                                                                                             |
| ------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Theme-Driven Styling        | PASS   | All new styles use `StyleSheet.create((theme) => ({...}))`. Semantic tokens for colors. Responsive metrics for sizing.                                                                            |
| II. Internationalization First | PASS   | New i18n keys for time picker labels (AM/PM, hours, minutes), month grid, year selector. Both en.json and ar.json updated. RTL layout preserved.                                                  |
| III. Component Architecture    | PASS   | Extends existing `DatePicker/` folder. New sub-components (TimeWheelPicker, YearSelector, MonthGrid) stay within same folder as private components. Types in `.types.ts`, styles in `.styles.ts`. |
| IV. Code Quality Enforcement   | PASS   | No `any` types. No inline styles. No hardcoded strings. Conventional commits.                                                                                                                     |
| V. Simplicity and YAGNI        | PASS   | No new dependencies added. Uses existing FlatList for scrollable wheels (no third-party wheel library). Reuses existing Modal pattern instead of introducing new overlay system.                  |

**Gate Result**: ✅ ALL PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/007-datepicker-enhancements/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (component API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/common/components/DatePicker/
├── DatePicker.tsx              # Main component (MODIFIED - add mode prop, view states, time section)
├── DatePicker.styles.ts        # Styles (MODIFIED - add year/month/time selector styles)
├── DatePicker.types.ts         # Types (MODIFIED - add mode, timeFormat, minTime, maxTime props)
├── YearSelector.tsx            # NEW - Scrollable year list with tap-to-type input
├── MonthGrid.tsx               # NEW - 3x4 grid of month buttons
├── TimeWheelPicker.tsx         # NEW - Scrollable wheel for hour/minute/AM-PM
├── index.ts                    # Exports (MODIFIED - export new types)

src/i18n/locales/
├── en.json                     # MODIFIED - add time picker keys
└── ar.json                     # MODIFIED - add time picker keys
```

**Structure Decision**: All new sub-components are co-located within the existing `DatePicker/` folder as private components (not exported from `src/common/components/`). This follows Constitution Principle III while keeping the feature self-contained. No new top-level component folders needed.

## Post-Design Constitution Re-Check

_Re-evaluated after Phase 1 design artifacts were generated._

| Principle                      | Status  | Post-Design Notes                                                                                                                                                                                               |
| ------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Theme-Driven Styling        | ✅ PASS | All styles in `DatePicker.styles.ts` use `StyleSheet.create((theme) => ({...}))`. No inline styles in any sub-component. Semantic tokens used throughout (brand.primary, text.primary, background.modal, etc.). |
| II. Internationalization First | ✅ PASS | 8 new i18n keys defined in research.md under `auth.calendar.time.*` and `auth.calendar.selectTime/selectDateTime/selectYear/yearInput`. Both en.json and ar.json to be updated.                                 |
| III. Component Architecture    | ✅ PASS | 3 new sub-components (YearSelector, MonthGrid, TimeWheelPicker) co-located in `DatePicker/` folder. Each has typed props. No business logic in components.                                                      |
| IV. Code Quality Enforcement   | ✅ PASS | All types fully defined in contracts (no `any`). Conventional commits will be used.                                                                                                                             |
| V. Simplicity and YAGNI        | ✅ PASS | Zero new dependencies. FlatList used for wheels (built-in). No premature abstractions. Sub-components are minimal and focused.                                                                                  |

**Post-Design Gate Result**: ✅ ALL PASS — ready for task generation.

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
