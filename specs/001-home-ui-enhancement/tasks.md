# Tasks: Home Screen UI Enhancement

**Input**: Design documents from `/specs/001-home-ui-enhancement/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-contracts.md

**Tests**: Tests are OPTIONAL per project constitution - not included in this task list

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Mobile React Native project with Expo:

- Feature components: `src/features/home/components/`
- Shared components: `src/common/components/`
- Theme system: `src/theme/`
- All paths are from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify development environment and prerequisites

**Duration**: 5-10 minutes

- [x] T001 Checkout feature branch `001-home-ui-enhancement`
- [x] T002 Start development environment with `npm start` and verify Expo DevTools loads
- [x] T003 [P] Review research.md design decisions (12pt chip spacing, vertical list pattern, completed-first ordering)

**Checkpoint**: Development environment ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify all required design system components and dependencies exist

**⚠️ CRITICAL**: These must be verified before component modification begins

**Duration**: 10-15 minutes

- [x] T004 [P] Verify Card component exists at src/common/components/Card/Card.tsx with variant and padding props
- [x] T005 [P] Verify Typography component exists at src/common/components/Typography/Typography.tsx with size, weight, color props
- [x] T006 [P] Verify Icon component exists at src/common/components/Icon/Icon.tsx with variant, familyName, iconName props
- [x] T007 [P] Verify CircularProgress component exists at src/common/components/CircularProgress/CircularProgress.tsx with progress and color props
- [x] T008 [P] Verify theme metrics exports spacing.p12, spacing.p24, spacingV.p12, spacingV.p24 from src/theme/metrics.ts
- [x] T009 [P] Verify theme colors export semantic tokens (brand._, text._, state._, icon._, overlay.\*) from src/theme/config.ts

**Checkpoint**: All design system dependencies confirmed - component redesign can begin

---

## Phase 3: User Story 1 - Improved Azkar Progress Visibility (Priority: P1) 🎯 MVP

**Goal**: Redesign AzkarProgress component with hybrid card-with-chips layout, improved spacing, and clear visual hierarchy

**Independent Test**: View home screen and verify Azkar section shows: (1) clear progress indicator at top, (2) individual chips with 12pt gaps, (3) completed vs uncompleted distinction via color/icons, (4) touch targets ≥44pt, (5) proper theme support in light/dark mode

**Duration**: 30-45 minutes

### Implementation for User Story 1

- [x] T010 [US1] Read current AzkarProgress component at src/features/home/components/AzkarProgress/AzkarProgress.tsx to understand existing structure
- [x] T011 [US1] Update AzkarProgress.tsx header layout keeping Card as outer container (FR-001)
- [x] T012 [US1] Implement progress indicator at top with percentage + CircularProgress on right side (FR-002)
- [x] T013 [US1] Update chips row to use View with gap: theme.metrics.spacing.p12 between chips (FR-003, FR-019, research decision #2)
- [x] T014 [US1] Ensure each chip maintains status-based icons (check-circle for completed, radio-button-unchecked for uncompleted) per FR-004
- [x] T015 [US1] Update AzkarProgress.styles.ts to remove old chip spacing and add gap-based layout with theme.metrics.spacing.p12
- [x] T016 [US1] Ensure all chip colors use semantic tokens (theme.colors.state.success for completed, theme.colors.icon.muted for uncompleted) per FR-014
- [x] T017 [US1] Verify each chip has minimum 44pt height via paddingVertical calculation in AzkarProgress.styles.ts (FR-005)
- [x] T018 [US1] Test Azkar component in Expo Go on iOS with all completion states (0%, 33%, 67%, 100%)
- [x] T019 [US1] Test Azkar component in Expo Go on Android with all completion states
- [x] T020 [US1] Test Azkar component theme switching (light → dark mode) and verify semantic color tokens update correctly

**Checkpoint**: User Story 1 complete - Azkar section redesigned and fully functional. This is the MVP that can be shipped independently.

---

## Phase 4: User Story 2 - Enhanced Random Acts Discovery (Priority: P1)

**Goal**: Redesign RandomActsGrid component from asymmetric grid to vertical list of equal-sized cards with completed-first ordering

**Independent Test**: View home screen and verify Random Acts section shows: (1) vertical list of equal-sized cards, (2) completed acts appear first, (3) all acts equally discoverable, (4) status-based visual distinction (success/tertiary/muted colors), (5) proper touch targets and theme support

**Duration**: 45-60 minutes

### Implementation for User Story 2

- [x] T021 [US2] Read current RandomActsGrid component at src/features/home/components/RandomActsGrid/RandomActsGrid.tsx to understand existing grid structure
- [x] T022 [US2] Read current RandomActsGrid.styles.ts to identify asymmetric grid styles (leftColumn, rightColumn) to be removed
- [x] T023 [US2] Update RandomActsGrid.tsx to implement card ordering logic: filter by status → concatenate [completed, unlocked, locked] per research decision #6
- [x] T024 [US2] Replace grid layout with vertical list using View + .map() iteration over orderedActs array (research decision #3)
- [x] T025 [US2] Implement equal-sized Card components for each act (completed, unlocked, locked) per FR-007
- [x] T026 [US2] Update completed act cards with success color (theme.colors.state.success) and check-circle badge icon per FR-010
- [x] T027 [US2] Update unlocked act cards with tertiary brand color (theme.colors.brand.tertiary) and add icon badge per current pattern
- [x] T028 [US2] Update locked act cards with muted color (theme.colors.icon.muted) and lock indicator per FR-011
- [x] T029 [US2] Implement platform-specific press feedback using existing Pressable pattern (android_ripple + iOS pressed state) per research decision #4
- [x] T030 [US2] Update RandomActsGrid.styles.ts to remove leftColumn and rightColumn grid styles
- [x] T031 [US2] Add vertical list container styles with gap: theme.metrics.spacingV.p12 between cards in RandomActsGrid.styles.ts
- [x] T032 [US2] Add equal-sized card base styles using consistent padding and ensuring minimum 44pt touch targets in RandomActsGrid.styles.ts
- [x] T033 [US2] Ensure all colors use semantic tokens (state.success, brand.tertiary, icon.muted, overlay.pressed) per FR-014
- [x] T034 [US2] Test Random Acts component in Expo Go on iOS with various states (1 completed + 2 unlocked, all unlocked, mixed statuses)
- [x] T035 [US2] Test Random Acts component in Expo Go on Android with all status combinations
- [x] T036 [US2] Test Random Acts component theme switching (light → dark mode) and verify status-based colors update correctly
- [x] T037 [US2] Test Random Acts card ordering: verify completed acts appear first in vertical list

**Checkpoint**: User Story 2 complete - Random Acts section redesigned with vertical list and completed-first ordering

---

## Phase 5: User Story 3 - Consistent Visual Design Language (Priority: P2)

**Goal**: Ensure visual consistency between Azkar and Random Acts sections using cohesive design patterns from the design system

**Independent Test**: View both sections side-by-side and verify: (1) consistent Card component usage, (2) consistent spacing patterns (12pt gaps, 24pt card padding), (3) consistent progress header layout, (4) consistent semantic color usage, (5) proper light/dark theme adaptation

**Duration**: 15-30 minutes

### Implementation for User Story 3

- [x] T038 [P] [US3] Review AzkarProgress header layout and compare with RandomActsGrid header layout for consistency
- [x] T039 [US3] Align progress header styles between both components: title (Typography size/weight), percentage display, CircularProgress sizing
- [x] T040 [US3] Verify both components use Card variant="elevated" and padding="lg" consistently per FR-013
- [x] T041 [US3] Verify both components use same gap values (spacing.p12 for horizontal, spacingV.p12 for vertical) per FR-015
- [x] T042 [US3] Ensure Typography components use same semantic size/weight combinations across both components per FR-016
- [x] T043 [US3] Verify Icon components use consistent variant patterns (success for completed, muted for uncompleted/locked) per FR-017
- [x] T044 [US3] Test both components side-by-side in light mode and verify visual consistency (spacing, colors, hierarchy)
- [x] T045 [US3] Test both components side-by-side in dark mode and verify consistent theme adaptation per FR-018

**Checkpoint**: User Story 3 complete - Visual consistency achieved across both sections

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, edge cases, responsive testing, and quality gates

**Duration**: 30 minutes

### Responsive & Edge Case Testing

- [x] T046 [P] Test Azkar section on iPhone SE (320px width) and verify chips remain accessible with minimum 44pt touch targets
- [x] T047 [P] Test Random Acts section on iPhone SE and verify equal-sized cards don't overflow or have excessive whitespace
- [x] T048 [P] Test both sections on iPad (768px+ width) and verify responsive scaling without excessive whitespace
- [x] T049 Test Azkar section with all completed state (100% progress) and verify celebratory visual state
- [x] T050 Test Random Acts with all completed state and verify appropriate completion messaging
- [x] T051 Test Random Acts with no unlocked acts (only locked) and verify locked state guidance display
- [x] T052 [P] Test RTL layout (Arabic locale) and verify both components maintain proper layout direction
- [x] T053 [P] Test touch response time: tap Azkar chip and Random Act card, verify visual feedback appears within 100ms (SC-004)

### Code Quality Gates

- [x] T054 Run `npm run type-check` and ensure no TypeScript errors in AzkarProgress or RandomActsGrid components
- [x] T055 Run `npm run lint` and ensure no ESLint violations (no hardcoded strings, no inline styles, no `any` types)
- [x] T056 Run `npm run format` to apply Prettier formatting to all modified files
- [x] T057 Verify no hardcoded color values: grep for #[0-9a-fA-F]{6} in _.styles.ts files (should use theme.colors._)
- [x] T058 Verify no hardcoded spacing values: grep for paddingHorizontal|marginTop|gap._: [0-9] in _.styles.ts files (should use theme.metrics.\*)

### Final Validation

- [x] T059 Run `npm run validate` (combines type-check + lint + format check) and ensure all gates pass
- [x] T060 Review quickstart.md visual QA checklist and confirm all scenarios tested (light/dark mode, completion states, responsive sizes)
- [x] T061 Verify success criteria SC-001: Users can identify Azkar progress within 2 seconds (visually obvious percentage + progress indicator)
- [x] T062 Verify success criteria SC-002: Users can distinguish completed/uncompleted Azkar without reading text (color + icon differentiation)
- [x] T063 Verify success criteria SC-003: Users can scan all Random Acts within 3 seconds (vertical list, equal sizing, clear ordering)
- [x] T064 Verify success criteria SC-005: 100% design system components used (no custom one-off styles created)
- [x] T065 Verify success criteria SC-006: Sections render correctly on screens from 320px to 1024px width

**Checkpoint**: All quality gates passed - feature ready for commit and PR

---

## Final Phase: Commit & PR

**Purpose**: Create conventional commit and prepare pull request

**Duration**: 10 minutes

- [x] T066 Stage modified files: AzkarProgress.tsx, AzkarProgress.styles.ts, RandomActsGrid.tsx, RandomActsGrid.styles.ts
- [x] T067 Create conventional commit with format: `feat: redesign azkar and random acts UI on home screen` (include multi-line body with changes list and Co-Authored-By line)
- [ ] T068 Push feature branch to remote: `git push -u origin 001-home-ui-enhancement`
- [ ] T069 Create pull request with title matching commit message and body including: (1) Summary of changes, (2) Screenshots in light/dark mode, (3) Testing checklist from quickstart.md, (4) Link to spec.md
- [ ] T070 Verify GitHub Actions CI pipeline passes (type-check, lint, format, build verification)

**Feature Complete**: Home Screen UI Enhancement ready for code review and merge

---

## Dependencies & Execution Strategy

### User Story Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational)
                     ↓
       ┌─────────────┴──────────────┐
       ↓                            ↓
  Phase 3 (US1)                Phase 4 (US2)
  Azkar Redesign              Random Acts Redesign
       ↓                            ↓
       └─────────────┬──────────────┘
                     ↓
              Phase 5 (US3)
           Visual Consistency
                     ↓
              Phase 6 (Polish)
                     ↓
              Final (Commit/PR)
```

**Key Insight**: User Stories 1 and 2 (Phases 3 and 4) can be implemented in parallel since they modify different component files with no shared dependencies. User Story 3 (Phase 5) requires both US1 and US2 complete to verify visual consistency.

### Parallel Execution Opportunities

**Phase 2 (Foundational)**: Tasks T004-T009 can all run in parallel (independent verification checks)

**Phase 3 (US1 - Azkar)**:

- Parallel: T010 (read current), T015 (styles), independent of each other
- Sequential: T011→T012→T013→T014 (component logic changes must be sequential)
- Parallel: T018, T019 (iOS/Android testing can run simultaneously on different devices)

**Phase 4 (US2 - Random Acts)**:

- Parallel: T021, T022 (read current component and styles)
- Sequential: T023→T024→T025→T026→T027→T028→T029 (component changes must be sequential)
- Parallel: T030, T031, T032, T033 (style updates can be done together in one pass)
- Parallel: T034, T035 (iOS/Android testing simultaneously)

**Phase 5 (US3 - Consistency)**:

- Parallel: T038, T040, T041, T042, T043 (style comparisons and verifications)
- Parallel: T044, T045 (light/dark mode testing)

**Phase 6 (Polish)**:

- Parallel: T046, T047, T048 (responsive testing on different screen sizes)
- Parallel: T052, T053 (RTL testing and touch response testing)
- Parallel: T054, T055, T056, T057, T058 (all quality gate checks)

**Total Parallelization**: ~40% of tasks can run in parallel, reducing total execution time from ~3 hours sequential to ~2 hours with parallel execution.

### Implementation Strategy

**MVP Scope (Recommended First Iteration)**:

- Phase 1: Setup (required)
- Phase 2: Foundational (required)
- **Phase 3: User Story 1 - Azkar Redesign** (delivers immediate value, independently testable)
- Phase 6: Polish (quality gates)
- Final: Commit & PR

This MVP can be shipped alone, delivering improved Azkar UX while Random Acts work continues in parallel.

**Full Feature (Complete Implementation)**:

- All phases 1-6 + Final
- US1 (Azkar) and US2 (Random Acts) can be developed in parallel by different developers
- US3 (Consistency) acts as integration phase after US1+US2 complete

---

## Summary

**Total Tasks**: 70

- Setup: 3 tasks (5-10 min)
- Foundational: 6 tasks (10-15 min)
- User Story 1 (P1 - Azkar): 11 tasks (30-45 min)
- User Story 2 (P1 - Random Acts): 17 tasks (45-60 min)
- User Story 3 (P2 - Consistency): 8 tasks (15-30 min)
- Polish & Quality: 20 tasks (30 min)
- Commit & PR: 5 tasks (10 min)

**Estimated Duration**:

- Sequential execution: ~3 hours
- With parallel execution: ~2 hours
- MVP only (US1): ~1 hour

**Parallel Opportunities**: 28 tasks marked [P], representing ~40% parallelization potential

**Independent Testing**:

- ✅ US1 can be tested independently (Azkar only)
- ✅ US2 can be tested independently (Random Acts only)
- ✅ US3 requires US1+US2 (integration verification)

**MVP Recommendation**: Phase 1 + 2 + 3 (US1) + 6 (partial) delivers testable value (~1 hour)

**Files Modified**: 4 files total

- src/features/home/components/AzkarProgress/AzkarProgress.tsx
- src/features/home/components/AzkarProgress/AzkarProgress.styles.ts
- src/features/home/components/RandomActsGrid/RandomActsGrid.tsx
- src/features/home/components/RandomActsGrid/RandomActsGrid.styles.ts

**Risk Level**: Low (UI-only, backwards-compatible props, leveraging existing components)
