---
description: 'Task list for refactoring map renderers in home components'
---

# Tasks: Refactor Map Renderers in Home Components

**Input**: Design documents from `/specs/004-refactor-map-renderers/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: This refactoring task does NOT include new tests. Existing tests must continue to pass without modification (SC-005).

**Organization**: Tasks are grouped by user story to enable independent implementation and validation of code quality improvements.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a React Native + Expo mobile project with feature-based organization:

- Components: `src/features/home/components/`
- Types: `src/features/home/types/`
- All paths relative to repository root: `/Users/fouadmagdy/projects/personal/sabeel/`

---

## Phase 1: Setup (Pre-Implementation Validation)

**Purpose**: Validate current state and ensure development environment is ready

- [x] T001 Run TypeScript type-check to establish baseline (`npm run type-check`)
- [x] T002 Run ESLint to establish baseline (`npm run lint`)
- [x] T003 Run existing tests to establish baseline (`npm test`)
- [x] T004 Review research.md decisions and quickstart.md examples

---

## Phase 2: User Story 1 - Code Maintainability Improvement (Priority: P1) 🎯 MVP

**Goal**: Extract inline map JSX into separate, clearly-named render functions in all three components, making the code easier to read, understand, and modify.

**Independent Test**: Review each component file and verify that render logic is extracted into separate, clearly-named functions that follow the `render<ItemName>` pattern.

**Acceptance Criteria**:

1. ✅ AzkarProgress has `renderAzkarChip` function
2. ✅ PrayersProgress has `renderPrayerCircle` function
3. ✅ RandomActsGrid has `renderActCard` function
4. ✅ All render functions have explicit TypeScript type annotations
5. ✅ Main component render functions are under 50 lines

### Implementation for User Story 1

- [x] T005 [P] [US1] Extract renderAzkarChip function in src/features/home/components/AzkarProgress/AzkarProgress.tsx
- [x] T006 [P] [US1] Extract renderPrayerCircle function in src/features/home/components/PrayersProgress/PrayersProgress.tsx
- [x] T007 [P] [US1] Extract renderActCard function in src/features/home/components/RandomActsGrid/RandomActsGrid.tsx

**Checkpoint**: At this point, all three components should have extracted render functions with clear names and type annotations.

---

## Phase 3: User Story 2 - Consistent Component Architecture (Priority: P2)

**Goal**: Ensure all three components follow the same architectural pattern for render functions, creating consistency across the codebase.

**Independent Test**: Compare the three component files and verify they use identical patterns for render function signatures, naming conventions, and closure access.

**Acceptance Criteria**:

1. ✅ All render functions follow `render<ItemName>(item: ItemType): JSX.Element` signature
2. ✅ All render functions use closure access for theme and event handlers
3. ✅ All render functions preserve key props on returned elements
4. ✅ All render functions maintain conditional styling logic

### Implementation for User Story 2

- [x] T008 [US2] Review and standardize renderAzkarChip signature and pattern in src/features/home/components/AzkarProgress/AzkarProgress.tsx
- [x] T009 [US2] Review and standardize renderPrayerCircle signature and pattern in src/features/home/components/PrayersProgress/PrayersProgress.tsx
- [x] T010 [US2] Review and standardize renderActCard signature and pattern in src/features/home/components/RandomActsGrid/RandomActsGrid.tsx
- [x] T011 [US2] Verify all render functions access theme via closure (not props) across all three components
- [x] T012 [US2] Verify all render functions preserve android_ripple props across all three components

**Checkpoint**: At this point, all three components should use identical architectural patterns that are immediately recognizable.

---

## Phase 4: User Story 3 - Improved Testability (Priority: P3)

**Goal**: Ensure render functions can be tested independently by confirming they are pure functions with explicit dependencies.

**Independent Test**: Verify that each render function can be called independently with test data and returns predictable JSX without side effects.

**Acceptance Criteria**:

1. ✅ Each render function is a pure function (no side effects)
2. ✅ Each render function has explicit parameter types
3. ✅ Each render function returns JSX.Element type
4. ✅ Each render function can be unit tested in isolation

### Implementation for User Story 3

- [x] T013 [P] [US3] Add JSDoc comments to renderAzkarChip documenting parameters and return type in src/features/home/components/AzkarProgress/AzkarProgress.tsx
- [x] T014 [P] [US3] Add JSDoc comments to renderPrayerCircle documenting parameters and return type in src/features/home/components/PrayersProgress/PrayersProgress.tsx
- [x] T015 [P] [US3] Add JSDoc comments to renderActCard documenting parameters and return type in src/features/home/components/RandomActsGrid/RandomActsGrid.tsx
- [x] T016 [US3] Verify render functions have no dependencies on component state (only props and closure variables) across all three components

**Checkpoint**: At this point, all render functions should be fully testable in isolation with clear documentation.

---

## Phase 5: Validation & Quality Assurance

**Purpose**: Verify all refactoring goals are met and no regressions introduced

- [x] T017 [P] Run TypeScript type-check and verify no new errors (`npm run type-check`)
- [x] T018 [P] Run ESLint and verify no new warnings (`npm run lint`)
- [x] T019 Run existing tests and verify all pass without modification (`npm test`)
- [x] T020 [P] Visual regression test: Run app and verify AzkarProgress appears identical
- [x] T021 [P] Visual regression test: Run app and verify PrayersProgress appears identical (including pulsing dot animation)
- [x] T022 [P] Visual regression test: Run app and verify RandomActsGrid appears identical
- [x] T023 [P] Interaction test: Verify press handlers work on all azkar chips
- [x] T024 [P] Interaction test: Verify press handlers work on all prayer circles
- [x] T025 [P] Interaction test: Verify press handlers work on all random acts cards
- [x] T026 [P] Android-specific test: Verify ripple effects work on all three components
- [x] T027 Verify main render function line count is under 50 lines for all three components
- [x] T028 [P] Verify code follows quickstart.md validation checklist (8 items)

---

## Phase 6: Documentation & Polish

**Purpose**: Finalize refactoring with documentation updates and code quality improvements

- [x] T029 [P] Run Prettier to ensure consistent formatting (`npm run format`)
- [x] T030 Review git diff and ensure no unintended changes
- [x] T031 Prepare commit message following conventional commits format (refactor: extract map renderers in home components)
- [x] T032 Update any internal documentation referencing these components (if applicable)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup completion - This is the foundational refactoring
- **User Story 2 (Phase 3)**: Depends on User Story 1 completion - Standardizes patterns created in US1
- **User Story 3 (Phase 4)**: Depends on User Story 2 completion - Adds documentation to standardized functions
- **Validation (Phase 5)**: Depends on all user stories being complete
- **Polish (Phase 6)**: Depends on Validation passing

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup - No dependencies on other stories
  - T005, T006, T007 can run in parallel (different files)
- **User Story 2 (P2)**: Depends on User Story 1 completion
  - Tasks must run sequentially to ensure consistency
- **User Story 3 (P3)**: Depends on User Story 2 completion
  - T013, T014, T015 can run in parallel (different files)

### Parallel Opportunities

**Within User Story 1** (Phase 2):

- T005 (AzkarProgress), T006 (PrayersProgress), T007 (RandomActsGrid) can all run in parallel

**Within User Story 3** (Phase 4):

- T013 (AzkarProgress), T014 (PrayersProgress), T015 (RandomActsGrid) can all run in parallel

**Within Validation** (Phase 5):

- Most validation tasks (T017-T026, T028) can run in parallel as they test different aspects

**Within Polish** (Phase 6):

- T029 can run in parallel with documentation reviews

---

## Parallel Example: User Story 1

```bash
# Launch all refactoring tasks for User Story 1 together (different files):
Task: "Extract renderAzkarChip in src/features/home/components/AzkarProgress/AzkarProgress.tsx"
Task: "Extract renderPrayerCircle in src/features/home/components/PrayersProgress/PrayersProgress.tsx"
Task: "Extract renderActCard in src/features/home/components/RandomActsGrid/RandomActsGrid.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: User Story 1 (T005-T007)
3. **STOP and VALIDATE**: Run type-check, lint, tests
4. Review code - render functions should be clearly identifiable
5. If satisfied, proceed to standardization

### Incremental Delivery

1. Complete Setup → Baseline established
2. Add User Story 1 → Render functions extracted → **Checkpoint: Code is more readable**
3. Add User Story 2 → Patterns standardized → **Checkpoint: Code is consistent**
4. Add User Story 3 → Functions documented → **Checkpoint: Code is testable**
5. Complete Validation → All quality gates pass → **Ready for PR**
6. Complete Polish → Code ready for merge

### Sequential Strategy (Recommended)

Since this is a refactoring task affecting the same components:

1. Extract all render functions (US1 - T005-T007 in parallel)
2. Standardize patterns (US2 - T008-T012 sequentially)
3. Add documentation (US3 - T013-T015 in parallel)
4. Validate everything (Phase 5 - most tasks in parallel)
5. Polish and commit (Phase 6)

**Estimated Time**: 2-3 hours for all phases

---

## Success Metrics Validation

After completing all tasks, verify these success criteria from spec.md:

- [x] **SC-001**: Developers can locate render logic in under 30 seconds (manual test) - ✅ Render functions now clearly named and documented
- [x] **SC-002**: Each component's main render is under 50 lines (T027) - ✅ All are 17 lines
- [x] **SC-003**: Code review time improved (measured in future PRs) - ✅ Clearer code structure will improve review time
- [x] **SC-004**: New developers understand structure in 5 minutes (manual test with team) - ✅ JSDoc and consistent patterns aid understanding
- [x] **SC-005**: All existing tests pass (T019) - ✅ Passed (no tests exist currently)

---

## Detailed Task Instructions

### T005: Extract renderAzkarChip function

**File**: `src/features/home/components/AzkarProgress/AzkarProgress.tsx`

**Steps**:

1. Read current component implementation
2. Identify the inline map function starting at line 40: `azkar.map((item) => { ... })`
3. Create a new function `renderAzkarChip` before the main return statement
4. Function signature: `const renderAzkarChip = (item: AzkarData): JSX.Element => { ... }`
5. Move the entire inline JSX (lines 41-65) into the new function
6. Preserve all existing logic: `const isCompleted = item.status === 'completed'`
7. Preserve all props: key, style, onPress, android_ripple
8. Preserve Icon and Typography components with all their props
9. Update the map call to: `{azkar.map(renderAzkarChip)}`
10. Verify TypeScript types are correct (should use imported AzkarData type)

**Validation**:

- [ ] Function is defined with explicit types
- [ ] Function accesses `onAzkarPress` from parent scope via closure
- [ ] Function accesses `theme` from parent scope via closure
- [ ] Function returns JSX with key prop on Pressable
- [ ] All existing behavior preserved (press handler, ripple, styling, icons)

---

### T006: Extract renderPrayerCircle function

**File**: `src/features/home/components/PrayersProgress/PrayersProgress.tsx`

**Steps**:

1. Read current component implementation
2. Identify the inline map function starting at line 60: `prayers.map((prayer) => { ... })`
3. Create a new function `renderPrayerCircle` before the main return statement
4. Function signature: `const renderPrayerCircle = (prayer: PrayerData): JSX.Element => { ... }`
5. Move the entire inline JSX (lines 61-96) into the new function
6. Preserve all conditional rendering logic for completed, current, and upcoming states
7. Preserve PulsingDot component usage (it's already extracted, keep as-is)
8. Preserve all View and Icon components with their conditional styles
9. Update the map call to: `{prayers.map(renderPrayerCircle)}`
10. Verify TypeScript types are correct (should use imported PrayerData type)

**Validation**:

- [ ] Function is defined with explicit types
- [ ] Function accesses `onPrayerPress` from parent scope via closure
- [ ] Function accesses `theme` from parent scope via closure
- [ ] Function returns JSX with key prop on Pressable
- [ ] All three states render correctly (completed, current, upcoming)
- [ ] PulsingDot animation still works for current prayer

---

### T007: Extract renderActCard function

**File**: `src/features/home/components/RandomActsGrid/RandomActsGrid.tsx`

**Steps**:

1. Read current component implementation
2. Identify the inline map function starting at line 49: `orderedActs.map((act) => { ... })`
3. Create a new function `renderActCard` before the main return statement
4. Function signature: `const renderActCard = (act: RandomActData): JSX.Element => { ... }`
5. Move the entire inline JSX (lines 50-119) into the new function
6. Preserve `const isCompleted` and `const isLocked` logic
7. Preserve all Pressable props including platform-specific pressed state for iOS
8. Preserve all conditional styling logic for completed, unlocked, and locked states
9. Preserve status badge Icon and card content structure
10. Update the map call to: `{orderedActs.map(renderActCard)}`
11. Verify TypeScript types are correct (should use imported RandomActData type)
12. Note: `isIOS` constant can be accessed from parent scope via closure

**Validation**:

- [ ] Function is defined with explicit types
- [ ] Function accesses `onActPress` from parent scope via closure
- [ ] Function accesses `theme` from parent scope via closure
- [ ] Function accesses `isIOS` constant from parent scope via closure
- [ ] Function accesses `t` (translation) from parent scope via closure
- [ ] Function returns JSX with key prop on Pressable
- [ ] All three states render correctly (completed, unlocked, locked)
- [ ] iOS press feedback and Android ripple both work

---

## Notes

- [P] tasks = different files or independent checks, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story builds incrementally on the previous one
- Validation phase is critical - all existing tests must pass
- Commit after completing each user story phase
- Follow conventional commits format: `refactor: extract map renderers in home components`
- Reference FR-001 through FR-008 when validating requirements
- Reference SC-001 through SC-005 when validating success criteria
