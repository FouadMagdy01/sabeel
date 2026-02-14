# Tasks: Fix Component Design Compliance Issues

**Input**: Design documents from `/specs/003-fix-component-issues/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: Manual testing only (no automated test suite exists for these components per repository audit)

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Pre-Implementation)

**Purpose**: Baseline preparation and validation

- [ ] T001 Capture baseline screenshots of CircularProgress in multiple sizes (24, 48, 64, 128px) for visual regression comparison
- [ ] T002 [P] Capture baseline screenshots of Card component with pressable enabled in light/dark modes for visual regression comparison
- [ ] T003 [P] Capture baseline screenshots of DatePicker in English and Arabic modes for visual regression comparison
- [x] T004 [P] Run `npm run validate` to ensure clean baseline (type-check + lint + format)
- [x] T005 Verify i18n translation keys exist in src/i18n/locales/en.json and src/i18n/locales/ar.json (auth.calendar.months._, auth.calendar.weekdays._)

---

## Phase 2: User Story 1 - Remove Deprecated CircularProgress Properties (Priority: P1) 🎯 MVP

**Goal**: Eliminate deprecation warnings from CircularProgress component by migrating from deprecated `rotation` prop to standard SVG `transform` attribute

**Independent Test**: Render CircularProgress component, verify no deprecation warnings in console, and confirm visual rotation behavior is identical to baseline

### Implementation for User Story 1

- [x] T006 [US1] Open src/common/components/CircularProgress/CircularProgress.tsx and locate the Circle component at lines 126-137
- [x] T007 [US1] Remove `rotation={-90}` prop from Circle component (line 135)
- [x] T008 [US1] Remove `origin={\`${size / 2}, ${size / 2}\`}` prop from Circle component (line 136)
- [x] T009 [US1] Add `transform={\`rotate(-90 ${size / 2} ${size / 2})\`}` prop to Circle component after strokeLinecap prop (line 134)
- [x] T010 [US1] Run `npm run type-check` to verify TypeScript compilation passes
- [x] T011 [US1] Run `npm run lint` to verify no linting errors
- [ ] T012 [US1] Start development server with `npm start` and navigate to screens containing CircularProgress
- [ ] T013 [US1] Verify zero deprecation warnings appear in developer console
- [ ] T014 [US1] Test CircularProgress indeterminate spinning animation (verify smooth 360° rotation)
- [ ] T015 [US1] Test CircularProgress static progress display (verify arc starts at -90° top position)
- [ ] T016 [US1] Compare post-change screenshots with T001 baseline for visual regression (should be identical)
- [ ] T017 [US1] Test CircularProgress on both iOS simulator and Android emulator

**Checkpoint**: CircularProgress renders without warnings, animation behavior unchanged, visual parity confirmed ✅ SC-001

---

## Phase 3: User Story 2 - Add Pressable Styling to Card Component (Priority: P1)

**Goal**: Provide clear visual feedback (opacity 0.85) when users press Card components, matching Button component interaction patterns

**Independent Test**: Render pressable Card, tap it, verify opacity reduces to 0.85 on press (iOS) or ripple effect (Android), matching Button component feel

### Implementation for User Story 2

- [x] T018 [P] [US2] Open src/common/components/Card/Card.tsx and add imports: `useCallback`, `useMemo` from 'react' and `Platform`, `StyleProp`, `ViewStyle` from 'react-native' (lines 1-5)
- [x] T019 [P] [US2] Open src/common/components/Button/button.tsx and review getPressedStyle function (lines 100-119) for reference pattern
- [x] T020 [US2] In Card.tsx after line 36 (before render), add `const isDisabled = disabled || loading;`
- [x] T021 [US2] In Card.tsx, add getPressedStyle callback using useCallback: returns `{ opacity: 0.85 }` if pressed and not disabled (early return undefined for Android)
- [x] T022 [US2] In Card.tsx, add androidRipple using useMemo: returns ripple config with `color: variant === 'elevated' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.08)'` (early return undefined if iOS)
- [x] T023 [US2] Locate Card.tsx Pressable render at lines 59-74 (gradient variant) and update to use `style={({ pressed }) => [gradientStyle, pressed && styles.pressedState]}` with `android_ripple={androidRipple}`
- [x] T024 [US2] Locate Card.tsx Pressable render at lines 89-98 (regular variant) and update to use `style={({ pressed }) => [styles.container, { overflow: 'hidden' as const }, getPressedStyle(pressed), style]}` with `android_ripple={androidRipple}` and `disabled={isDisabled}`
- [x] T025 [US2] Remove render prop pattern `{({ pressed }) => <View ...>}` and replace with direct children `{renderContent()}`
- [x] T026 [US2] Run `npm run type-check` to verify TypeScript compilation passes
- [x] T027 [US2] Run `npm run lint` to verify no linting errors
- [ ] T028 [US2] Start development server on iOS simulator, render pressable Card, press and verify opacity reduces to 0.85
- [ ] T029 [US2] On iOS simulator, release Card press and verify opacity returns to 1.0
- [ ] T030 [US2] Test Card pressable in both light mode and dark mode to verify feedback remains visible
- [ ] T031 [US2] Test disabled Card (loading or disabled prop true) and verify no feedback appears
- [ ] T032 [US2] Start development server on Android emulator, render pressable Card, press and verify ripple effect appears
- [ ] T033 [US2] On Android emulator, verify ripple color matches card variant (elevated vs filled)
- [ ] T034 [US2] Compare Card pressable feedback with Button component (should match feel and timing)
- [ ] T035 [US2] Measure press-to-feedback timing (should be <50ms, visually instant)
- [ ] T036 [US2] Compare post-change screenshots with T002 baseline for visual regression

**Checkpoint**: Card provides instant opacity feedback (iOS) or ripple (Android), disabled state works, matches Button pattern ✅ SC-002

---

## Phase 4: User Story 3 - Replace DatePicker Hardcoded Strings with Translations (Priority: P2)

**Goal**: Display weekday and month names from i18n translation files instead of hardcoded English arrays, supporting both English and Arabic

**Independent Test**: Switch app language to Arabic, open DatePicker, verify all weekday/month names display in Arabic; switch back to English and verify English displays

### Implementation for User Story 3

- [x] T037 [P] [US3] Open src/common/components/DatePicker/DatePicker.tsx and locate MONTHS constant array (lines 11-24)
- [x] T038 [P] [US3] Delete MONTHS constant array completely (lines 11-24)
- [x] T039 [P] [US3] Locate WEEKDAYS constant array (line 26)
- [x] T040 [US3] Delete WEEKDAYS constant array (line 26)
- [x] T041 [US3] Locate monthYearDisplay useMemo at lines 197-201
- [x] T042 [US3] Inside monthYearDisplay useMemo, add local monthKeys array: `const monthKeys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];`
- [x] T043 [US3] Update monthYearDisplay to use `const monthKey = monthKeys[viewDate.getMonth()];` and keep existing `t('auth.calendar.months.${monthKey}')` call
- [x] T044 [US3] Locate weekdays rendering at lines 265-270
- [x] T045 [US3] Above the weekdaysRow View, add local weekdayKeys array: `const weekdayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];`
- [x] T046 [US3] Update weekdays map to use `weekdayKeys.map((day) =>` instead of `WEEKDAYS.map((day) =>`
- [x] T047 [US3] Verify translation call remains `t(\`auth.calendar.weekdays.${day}\`)` (no changes to t() calls)
- [x] T048 [US3] Run `npm run type-check` to verify TypeScript compilation passes
- [x] T049 [US3] Run `npm run lint` to verify no hardcoded string warnings remain
- [ ] T050 [US3] Start app in English mode, open DatePicker, verify all 12 month names appear in English
- [ ] T051 [US3] In English mode, verify all 7 weekday abbreviations appear in English
- [ ] T052 [US3] Navigate through multiple months in DatePicker and verify month names translate correctly
- [ ] T053 [US3] Switch app language to Arabic (via Settings), open DatePicker, verify all 12 month names appear in Arabic (يناير, فبراير, مارس, etc.)
- [ ] T054 [US3] In Arabic mode, verify all 7 weekday abbreviations appear in Arabic (أحد, إثنين, ثلاثاء, etc.)
- [ ] T055 [US3] Verify RTL layout is preserved for Arabic DatePicker display
- [ ] T056 [US3] Test language switching: open DatePicker in English, switch to Arabic without closing, verify text updates immediately
- [ ] T057 [US3] Test language switching: switch back from Arabic to English and verify updates work bidirectionally
- [ ] T058 [US3] Test fallback: temporarily remove one translation key, verify fallback to English occurs gracefully, then restore key
- [ ] T059 [US3] Compare post-change screenshots with T003 baseline for visual regression

**Checkpoint**: DatePicker displays 100% translated weekday/month names in English and Arabic, language switching works ✅ SC-003

---

## Phase 5: User Story 4 - Replace DatePicker Primitives with Design System Components (Priority: P3)

**Goal**: Replace primitive React Native Text components with Typography component from design system for visual consistency and theme integration

**Independent Test**: Review DatePicker code, verify all Text components replaced with Typography, verify visual rendering matches baseline and theme switching works

### Implementation for User Story 4

- [x] T060 [P] [US4] Open src/common/components/DatePicker/DatePicker.tsx and add Typography import: `import { Typography } from '@/common/components/Typography';` (line 3)
- [x] T061 [P] [US4] Open src/common/components/Typography/Typography.tsx for reference on props (type, size, weight, color variants)
- [x] T062 [US4] Locate label Text at line 205, replace with `<Typography type="label" size="sm" style={labelStyle}>{label}</Typography>`
- [x] T063 [US4] Locate pickerText Text at line 214, replace with `<Typography type="body" size="md" color={!value ? 'muted' : 'primary'}>{displayText}</Typography>`
- [x] T064 [US4] Locate helperText Text at line 226, replace with conditional `<Typography type="caption" size="xs" color={error ? 'error' : 'muted'}>{displayHelperText}</Typography>`
- [x] T065 [US4] Locate modalTitle Text at line 232, replace with `<Typography type="heading" size="lg" weight="semiBold">{t('auth.calendar.selectDate')}</Typography>`
- [x] T066 [US4] Locate monthYearText Text at line 245, replace with `<Typography type="heading" size="md" weight="medium">{monthYearDisplay}</Typography>`
- [x] T067 [US4] Locate weekdayText Text at line 268, replace with `<Typography type="caption" size="xs" weight="medium" color="muted">{t(\`auth.calendar.weekdays.${day}\`)}</Typography>`
- [x] T068 [US4] Locate dayText Text at lines 293-301, replace with `<Typography type="body" size="sm" color={isSelected ? 'inverse' : isDisabled ? 'disabled' : !item.isCurrentMonth ? 'muted' : 'primary'}>{item.date.getDate()}</Typography>`
- [x] T069 [US4] Remove all Text style props (styles.label, styles.pickerText, styles.helperText, styles.modalTitle, styles.monthYearText, styles.weekdayText, styles.dayText, etc.) since Typography handles styling
- [x] T070 [US4] Run `npm run type-check` to verify TypeScript compilation passes with Typography types
- [x] T071 [US4] Run `npm run lint` to verify no primitive Text usage warnings remain
- [ ] T072 [US4] Start app, open DatePicker, compare text styles with other components (Button, Card) to verify consistency
- [ ] T073 [US4] Verify Cairo font family is applied to all DatePicker text via Typography
- [ ] T074 [US4] Verify text sizes match design system scale (xxs, xs, sm, md, lg, xl)
- [ ] T075 [US4] Verify semantic color tokens are used (primary, muted, error, inverse, disabled) instead of hardcoded colors
- [ ] T076 [US4] Switch to light mode, open DatePicker, verify all text is readable with sufficient contrast
- [ ] T077 [US4] Switch to dark mode, open DatePicker, verify all text is readable with sufficient contrast
- [ ] T078 [US4] Switch to Arabic, verify all Typography components support RTL correctly
- [ ] T079 [US4] Verify text alignment and no layout breaks in RTL mode
- [ ] T080 [US4] Take post-change screenshots and compare with T003 baseline for visual regression (should be near-identical except potential minor spacing improvements)
- [ ] T081 [US4] Open src/common/components/DatePicker/DatePicker.styles.ts and identify unused style definitions (label, pickerText, helperText, modalTitle, monthYearText, weekdayText, dayText, dayTextSelected, dayTextDisabled, dayTextOtherMonth)
- [ ] T082 [US4] Remove unused style definitions from DatePicker.styles.ts (clean up technical debt)
- [ ] T083 [US4] Run `npm run lint -- --rule "no-unused-vars: error"` to verify no unused style variables remain

**Checkpoint**: DatePicker uses Typography for all text, visual consistency achieved, theme switching works, 0 primitive Text remaining ✅ SC-004, SC-005

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and quality assurance across all user stories

- [x] T084 Run complete validation pipeline with `npm run validate` (type-check + lint + format:check)
- [x] T085 Verify no new warnings introduced: `npm run lint | grep -i "warning"` should return empty
- [x] T086 Run format check: `npm run format:check` should pass
- [ ] T087 [P] Manually verify all success criteria from spec.md (SC-001 through SC-006)
- [ ] T088 [P] Execute complete manual QA checklist from quickstart.md
- [ ] T089 [P] Test all three components together: CircularProgress on loading Card, DatePicker with theme switching
- [ ] T090 Verify no regressions in other components (smoke test home screen, library screen, etc.)
- [ ] T091 [P] Document patterns established for future component fixes in research.md (already done, verify completeness)
- [ ] T092 Commit changes with conventional commit message: `fix: resolve component design compliance issues`
- [ ] T093 Create PR with before/after screenshots and manual testing results summary

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **User Story 1 (Phase 2)**: Depends on Setup (T001 baseline) - Can start after T001-T005
- **User Story 2 (Phase 3)**: Depends on Setup (T002 baseline) - Can start after T001-T005 in parallel with US1
- **User Story 3 (Phase 4)**: Depends on Setup (T003 baseline) - Can start after T001-T005 in parallel with US1/US2
- **User Story 4 (Phase 5)**: Depends on US3 completion (T059) - Must complete after US3 since it modifies same file
- **Polish (Phase 6)**: Depends on all user stories (US1-US4) completion

### User Story Dependencies

- **User Story 1 (CircularProgress)**: Independent - No dependencies on other stories
- **User Story 2 (Card)**: Independent - No dependencies on other stories
- **User Story 3 (DatePicker i18n)**: Independent - No dependencies on other stories
- **User Story 4 (DatePicker Typography)**: Depends on US3 - Same file (DatePicker.tsx), must complete US3 first to avoid merge conflicts

### Within Each User Story

- **US1 (CircularProgress)**: Linear sequence T006→T017 (simple 1-line change, minimal steps)
- **US2 (Card)**: T018-T019 can run in parallel (reading reference files), then T020-T036 linear
- **US3 (DatePicker i18n)**: T037-T040 deletions can run in parallel, then T041-T059 linear
- **US4 (DatePicker Typography)**: T060-T061 can run in parallel (imports/reference), then T062-T083 linear

### Parallel Opportunities

**Phase 1 Setup**: All tasks T001-T005 can run in parallel (different activities)

**User Stories**: US1, US2, US3 can all run in parallel (different files) - HOWEVER, US4 must wait for US3 completion

**Within User Stories**:

- US1: T006-T009 (code changes) before T010-T017 (validation)
- US2: T018-T019 (parallel reading), then T020-T025 (coding), then T026-T036 (validation)
- US3: T037-T040 (parallel deletions), then T041-T059 (linear implementation)
- US4: T060-T061 (parallel reading), then T062-T083 (linear text replacements)

---

## Parallel Example: User Story 2 (Card Pressable)

```bash
# Launch reference reading tasks in parallel:
Task T018: "Add imports to Card.tsx"
Task T019: "Review Button.tsx getPressedStyle pattern"

# After reading, implement sequentially:
Task T020: Add isDisabled constant
Task T021: Add getPressedStyle callback
Task T022: Add androidRipple config
Task T023-T025: Update Pressable renders

# Launch validation tasks in parallel where possible:
Task T026: Type check
Task T027: Lint check
# Then manual testing T028-T036 sequentially (iOS → Android → comparison)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005) - ~5 minutes
2. Complete Phase 2: User Story 1 (T006-T017) - ~15 minutes
3. **STOP and VALIDATE**: Verify CircularProgress works independently, no warnings ✅
4. If satisfied, proceed to US2; if not, fix US1 first

**Rationale**: US1 is lowest risk, easiest to verify, provides immediate value (removes deprecation warnings)

### Incremental Delivery (All User Stories)

1. Complete Setup (T001-T005) → Baselines captured
2. Add User Story 1 (T006-T017) → Test independently → ✅ SC-001 (CircularProgress warning-free)
3. Add User Story 2 (T018-T036) → Test independently → ✅ SC-002 (Card feedback <50ms)
4. Add User Story 3 (T037-T059) → Test independently → ✅ SC-003 (DatePicker 100% translated)
5. Add User Story 4 (T060-T083) → Test independently → ✅ SC-004, SC-005 (Typography integration)
6. Polish (T084-T093) → Final validation → Create PR

**Rationale**: Each story adds incremental value, can be demoed independently, reduces risk

### Parallel Team Strategy

With 3 developers:

1. Team completes Setup together (T001-T005)
2. Once Setup done:
   - **Developer A**: User Story 1 (CircularProgress) - T006-T017
   - **Developer B**: User Story 2 (Card) - T018-T036
   - **Developer C**: User Story 3 (DatePicker i18n) - T037-T059
3. After US1-US3 complete:
   - **Developer A or B or C**: User Story 4 (DatePicker Typography) - T060-T083
4. Team reviews Polish phase together (T084-T093)

**Rationale**: US1, US2, US3 are independent (different files), can be developed in parallel to reduce total time

---

## Notes

- **[P] tasks**: Different files, no dependencies, can run in parallel
- **[Story] label**: Maps task to specific user story (US1, US2, US3, US4) for traceability
- **File conflicts**: US3 and US4 both modify DatePicker.tsx - US4 must wait for US3 completion
- **No automated tests**: Manual testing only per repository audit (no test files exist for these components)
- **Visual regression**: Screenshot comparison is primary validation method
- **Commit strategy**: Commit after each user story completion (4 commits total) or single commit after all complete
- **Independence**: Each user story should be fully functional and testable on its own
- **Stop at any checkpoint**: Validate story works before proceeding to next

---

**Total Tasks**: 93
**Task Breakdown by User Story**:

- Setup: 5 tasks (T001-T005)
- User Story 1 (CircularProgress): 12 tasks (T006-T017)
- User Story 2 (Card): 19 tasks (T018-T036)
- User Story 3 (DatePicker i18n): 23 tasks (T037-T059)
- User Story 4 (DatePicker Typography): 24 tasks (T060-T083)
- Polish: 10 tasks (T084-T093)

**Parallel Opportunities**: 9 tasks marked [P], plus US1/US2/US3 can run in parallel (40+ tasks in parallel with 3 developers)

**MVP Scope**: User Story 1 only (T001-T017) = 17 tasks, ~20 minutes, delivers immediate value (removes deprecation warnings)

**Format Validation**: ✅ All tasks follow checklist format `- [ ] [ID] [P?] [Story?] Description with file path`
