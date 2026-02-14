# Tasks: Component Design System Compliance & Enhancement

**Input**: Design documents from `/specs/002-component-design-compliance/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-api.md

**Tests**: Not requested - manual visual testing via test matrix checklist (FR-007).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Branch setup and shared type definitions

- [x] T001 Create shared type definitions (ComponentSize, SemanticColor, DisableableProps, LoadableProps) in src/common/components/shared.types.ts
- [x] T002 Create test matrix checklist template at specs/002-component-design-compliance/checklists/test-matrix.md covering 130 combinations (13 components x 5 themes x 2 modes)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Fix structural compliance issues that MUST be complete before enhancement or migration

**CRITICAL**: No enhancement (US2) or migration (US3) work can begin until structural fixes are done

- [x] T003 [P] Create missing CircularProgress styles file at src/common/components/CircularProgress/CircularProgress.styles.ts extracting inline SVG props to theme-driven styles
- [x] T004 [P] Create missing CustomTabBar types file at src/common/components/CustomTabBar/CustomTabBar.types.ts extracting inline type definitions

**Checkpoint**: Structural compliance fixed - all 13 components have complete file structure (.tsx, .styles.ts, .types.ts, index.ts)

---

## Phase 3: User Story 1 - Component Audit & Compliance (Priority: P1) MVP

**Goal**: All 13 common components use semantic color tokens, follow unistyles pattern, and have no hardcoded values

**Independent Test**: Run `npm run validate`, then visually verify each component renders correctly in light/dark mode with Emerald + one other theme preset

### Implementation for User Story 1

#### Hardcoded Value Remediation

- [x] T005 [P] [US1] Replace hardcoded ripple opacity in src/common/components/Button/button.styles.ts with theme overlay token
- [x] T006 [P] [US1] Replace hardcoded blur intensity in src/common/components/CustomTabBar/CustomTabBar.styles.ts with theme constant (SKIPPED - platform-specific BlurView config, not theme issue)
- [x] T007 [P] [US1] Replace hardcoded opacity 0.5 in src/common/components/Divider/Divider.styles.ts with theme overlay token
- [x] T008 [P] [US1] Replace hardcoded marginBottom:2 in src/common/components/Input/Input.styles.ts with theme spacing metric
- [x] T009 [P] [US1] Replace hardcoded shadow props in src/common/components/SegmentedControl/SegmentedControl.styles.ts with theme shadow tokens
- [x] T010 [P] [US1] Replace hardcoded letterSpacing:3 in src/common/components/Typography/Typography.styles.ts with theme metric
- [x] T011 [P] [US1] Extract inline SVG color/size props in src/common/components/CircularProgress/CircularProgress.tsx to use CircularProgress.styles.ts

#### JSDoc Documentation

- [x] T012 [P] [US1] Add component-level JSDoc with @example to src/common/components/Card/Card.tsx
- [x] T013 [P] [US1] Add component-level JSDoc with @example to src/common/components/CircularProgress/CircularProgress.tsx
- [x] T014 [P] [US1] Add complete JSDoc (component + all props with @param, @example, @default) to src/common/components/CustomTabBar/CustomTabBar.tsx and CustomTabBar.types.ts
- [x] T015 [P] [US1] Add component-level JSDoc with @example to src/common/components/Divider/Divider.tsx
- [x] T016 [P] [US1] Add complete JSDoc (component + all props with @param, @example, @default) to src/common/components/SegmentedControl/SegmentedControl.tsx and SegmentedControl.types.ts
- [x] T017 [P] [US1] Add component-level JSDoc with @example to src/common/components/Typography/Typography.tsx

#### Validation

- [x] T018 [US1] Run `npm run validate` to confirm zero type errors and lint violations after compliance fixes (Note: Pre-existing errors unrelated to Phase 3 changes - Icon casing, DatePicker Button variant)

**Checkpoint**: All 13 components are design-system compliant. No hardcoded values, complete file structure, JSDoc documentation on all components.

---

## Phase 4: User Story 2 - Component Enhancement & API Consistency (Priority: P2)

**Goal**: Enhance 11 components with industry-standard variants matching MUI/Ant Design intersection

**Independent Test**: Verify enhanced props work in both light/dark mode, check TypeScript IntelliSense shows new props with JSDoc, run `npm run validate`

### Implementation for User Story 2

#### DatePicker Refactor (CRITICAL - Must complete first)

- [x] T018A [US2] **CRITICAL REFACTOR**: Fix DatePicker component - replace @react-navigation/elements Button with our Button component, remove all hardcoded strings (use i18n t()), fix TypeScript errors, maintain all existing functionality in src/common/components/DatePicker/datePicker.tsx

**Note**: This is a blocking prerequisite for T042-T043 (DatePicker enhancement). Must be completed before other Phase 4 tasks.

#### Button Enhancement

- [x] T019 [P] [US2] Add `fullWidth` prop and color variants (success, error, warning, info) to types in src/common/components/Button/button.types.ts
- [x] T020 [US2] Implement `fullWidth` layout and new color variant styles in src/common/components/Button/button.styles.ts
- [x] T021 [US2] Update Button component to handle `fullWidth` and new color variants in src/common/components/Button/button.tsx

#### Card Enhancement

- [x] T022 [P] [US2] Add `onPress` and `loading` props to types in src/common/components/Card/Card.types.ts
- [x] T023 [US2] Implement pressable wrapper (conditional on `onPress`) and loading skeleton in src/common/components/Card/Card.tsx
- [x] T024 [US2] Add press/loading styles in src/common/components/Card/Card.styles.ts

#### Typography Enhancement

- [x] T025 [P] [US2] Add `strikethrough`, `underline` props and `disabled` color variant to types in src/common/components/Typography/Typography.types.ts
- [x] T026 [US2] Implement strikethrough/underline text decoration and disabled color in src/common/components/Typography/Typography.tsx and Typography.styles.ts

#### Input Enhancement

- [x] T027 [P] [US2] Add `clearable`, `required`, `showCount` props to types in src/common/components/Input/Input.types.ts
- [x] T028 [US2] Implement clear button, required indicator (\*), and character count display in src/common/components/Input/Input.tsx and Input.styles.ts

#### SegmentedControl Rewrite

- [x] T029 [US2] Define new SegmentOption interface and enhanced SegmentedControlProps (options, value, onChange, size, disabled, fullWidth) in src/common/components/SegmentedControl/SegmentedControl.types.ts with backward-compatible legacy props (segments, selectedIndex, onSegmentChange)
- [x] T030 [US2] Implement new structured options API with internal conversion from legacy string[] format in src/common/components/SegmentedControl/SegmentedControl.tsx
- [x] T031 [US2] Add size variants, disabled styles, and fullWidth layout in src/common/components/SegmentedControl/SegmentedControl.styles.ts

#### SearchInput Enhancement

- [x] T032 [P] [US2] Add `onSearch`, `loading`, `size`, `disabled` props to types in src/common/components/SearchInput/SearchInput.types.ts
- [x] T033 [US2] Implement onSearch (enter key), loading indicator, size variants, and disabled state in src/common/components/SearchInput/SearchInput.tsx and SearchInput.styles.ts

#### CircularProgress Enhancement

- [x] T034 [P] [US2] Add `indeterminate`, `showLabel`, `status`, `children` props to types in src/common/components/CircularProgress/CircularProgress.types.ts
- [x] T035 [US2] Implement indeterminate spinning animation (react-native-reanimated), percentage label, status colors, and children center content in src/common/components/CircularProgress/CircularProgress.tsx and CircularProgress.styles.ts

#### Select Enhancement

- [x] T036 [P] [US2] Add `searchable`, `allowClear`, `loading` props to types in src/common/components/Select/Select.types.ts
- [x] T037 [US2] Implement search filtering, clear button, and loading indicator in src/common/components/Select/select.tsx and Select.styles.ts

#### IconButton Enhancement

- [x] T038 [P] [US2] Add `loading` prop to types in src/common/components/IconButton/iconButton.types.ts
- [x] T039 [US2] Implement loading spinner state replacing icon in src/common/components/IconButton/iconButton.tsx and iconButton.styles.ts

#### Divider Enhancement

- [x] T040 [P] [US2] Add `children` (label text), `dashed`, `textAlign` props to types in src/common/components/Divider/Divider.types.ts
- [x] T041 [US2] Implement text label rendering, dashed border style, and text alignment in src/common/components/Divider/Divider.tsx and Divider.styles.ts

#### DatePicker Enhancement

- [x] T042 [P] [US2] Add `clearable` and `format` props to types in src/common/components/DatePicker/DatePicker.types.ts
- [x] T043 [US2] Implement clear button and date format display in src/common/components/DatePicker/datePicker.tsx and DatePicker.styles.ts

#### Validation

- [x] T044 [US2] Run `npm run validate` to confirm zero type errors and lint violations after all enhancements (Note: Pre-existing errors in Icon casing remain, unrelated to Phase 4)
- [x] T045 [US2] Update index.ts barrel exports for any new types exported from src/common/components/\*/index.ts

**Checkpoint**: All 11 components enhanced with MUI/Ant Design intersection variants. SegmentedControl has backward-compatible API rewrite. All pass type-check and lint.

---

## Phase 5: User Story 3 - Codebase Component Migration (Priority: P3)

**Goal**: Replace React Native primitives with common components in 8 feature files

**Independent Test**: Visually compare each migrated screen before/after - appearance and behavior must be identical. Run `npm run validate`.

### Implementation for User Story 3

#### Screen Migrations (High Visibility)

- [ ] T046 [P] [US3] Migrate Text to Typography and Pressable to Button in app/(main)/(tabs)/prayers/index.tsx
- [ ] T047 [P] [US3] Migrate Text to Typography in app/(main)/(tabs)/settings/index.tsx

#### Feature Component Migrations (Major Refactoring)

- [ ] T048 [P] [US3] Migrate Pressable share button to IconButton in src/features/home/components/VerseOfTheDay/VerseOfTheDay.tsx
- [ ] T049 [P] [US3] Migrate View-as-card pattern to Card component and Pressable to Card onPress in src/features/home/components/RandomActsGrid/RandomActsGrid.tsx
- [ ] T050 [P] [US3] Migrate Pressable wrapping card to Card onPress in src/features/library/components/FeaturedReciterCard/FeaturedReciterCard.tsx
- [ ] T051 [P] [US3] Migrate Text to Typography and Pressable to Button in src/features/library/components/LibraryTabBar/LibraryTabBar.tsx

#### Feature Component Migrations (Minor Adjustments)

- [ ] T052 [P] [US3] Migrate Pressable chips to Button small variant in src/features/home/components/AzkarProgress/AzkarProgress.tsx
- [ ] T053 [P] [US3] Migrate Pressable circles to IconButton in src/features/home/components/PrayersProgress/PrayersProgress.tsx

#### Validation

- [ ] T054 [US3] Run `npm run validate` to confirm zero type errors and lint violations after all migrations
- [ ] T055 [US3] Update style files for migrated components to remove unused primitive styles (cleanup dead code)

**Checkpoint**: All 8 feature files migrated from React Native primitives to common components. Zero visual regressions.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and cleanup

- [ ] T056 [P] Complete test matrix checklist - validate all 130 combinations (13 components x 5 themes x 2 modes) in running app
- [ ] T057 [P] Create component migration patterns guide for future development per FR-019 at specs/002-component-design-compliance/migration-guide.md
- [ ] T058 Run final `npm run validate` across entire codebase
- [ ] T059 Review and clean up any unused imports, dead styles, or orphaned type definitions across all modified files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS user stories
- **US1 - Compliance (Phase 3)**: Depends on Foundational (Phase 2) - fixes hardcoded values and adds JSDoc
- **US2 - Enhancement (Phase 4)**: Depends on US1 completion (enhanced props build on compliant base)
- **US3 - Migration (Phase 5)**: Depends on US2 completion (migrations use enhanced component APIs)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 - enhancements build on top of compliant components
- **User Story 3 (P3)**: Depends on US2 - migrations use enhanced component props (onPress, fullWidth, etc.)

### Within Each User Story

- Type definitions before component implementation
- Component implementation before style updates
- All component changes before validation step
- Validation must pass before moving to next phase

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel
- **Phase 2**: T003 and T004 can run in parallel (different components)
- **Phase 3 (US1)**: All T005-T011 hardcoded fixes can run in parallel (different files). All T012-T017 JSDoc tasks can run in parallel (different files)
- **Phase 4 (US2)**: All type definition tasks (T019, T022, T025, T027, T032, T034, T036, T038, T040, T042) can run in parallel. Implementation tasks within each component are sequential.
- **Phase 5 (US3)**: All migration tasks T046-T053 can run in parallel (different files)
- **Phase 6**: T056 and T057 can run in parallel

---

## Parallel Example: User Story 1 - Compliance Fixes

```bash
# Launch all hardcoded value fixes in parallel (different files):
Task: "Replace hardcoded ripple opacity in Button styles"
Task: "Replace hardcoded blur intensity in CustomTabBar styles"
Task: "Replace hardcoded opacity in Divider styles"
Task: "Replace hardcoded marginBottom in Input styles"
Task: "Replace hardcoded shadow props in SegmentedControl styles"
Task: "Replace hardcoded letterSpacing in Typography styles"
Task: "Extract inline SVG props in CircularProgress"

# Then launch all JSDoc tasks in parallel (different files):
Task: "Add JSDoc to Card"
Task: "Add JSDoc to CircularProgress"
Task: "Add JSDoc to CustomTabBar"
Task: "Add JSDoc to Divider"
Task: "Add JSDoc to SegmentedControl"
Task: "Add JSDoc to Typography"
```

## Parallel Example: User Story 3 - Migration

```bash
# Launch all migrations in parallel (different files):
Task: "Migrate prayers/index.tsx"
Task: "Migrate settings/index.tsx"
Task: "Migrate VerseOfTheDay.tsx"
Task: "Migrate RandomActsGrid.tsx"
Task: "Migrate FeaturedReciterCard.tsx"
Task: "Migrate LibraryTabBar.tsx"
Task: "Migrate AzkarProgress.tsx"
Task: "Migrate PrayersProgress.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (shared types + test matrix template)
2. Complete Phase 2: Foundational (structural fixes)
3. Complete Phase 3: User Story 1 (compliance)
4. **STOP and VALIDATE**: All 13 components are design-system compliant
5. Run test matrix for compliance validation

### Incremental Delivery

1. Complete Setup + Foundational -> Structure ready
2. Add User Story 1 -> Test compliance -> Validate (MVP!)
3. Add User Story 2 -> Test enhancements -> Validate
4. Add User Story 3 -> Test migrations -> Validate
5. Each story adds value without breaking previous stories

### Sequential Execution (Recommended)

This feature has sequential dependencies (US1 -> US2 -> US3), so the recommended approach is:

1. Phase 1 + 2: Setup & Foundational (2 tasks each, parallel within phase)
2. Phase 3: Compliance fixes (14 tasks, highly parallelizable)
3. Phase 4: Enhancements (27 tasks, parallel by component)
4. Phase 5: Migrations (10 tasks, highly parallelizable)
5. Phase 6: Polish (4 tasks)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 -> US2 -> US3 is sequential (each builds on previous)
- Within each story, most tasks can run in parallel (different component files)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Run `npm run validate` after each phase completion
- Visual testing against Emerald theme + one other preset minimum per checkpoint
