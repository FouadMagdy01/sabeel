# Implementation Plan: Refactor Map Renderers in Home Components

**Branch**: `004-refactor-map-renderers` | **Date**: 2026-02-14 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-refactor-map-renderers/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Extract inline map function JSX into separate render functions/components in three home screen components (AzkarProgress, PrayersProgress, RandomActsGrid) to improve code maintainability, consistency, and testability. The refactoring will follow the renderItem pattern common in React Native, maintaining all existing functionality while separating rendering concerns.

## Technical Context

**Language/Version**: TypeScript 5.9.2, React Native 0.81.5, Expo SDK 54
**Primary Dependencies**: react-native-unistyles 3.0.20, react-i18next 16.5.3, react-native-reanimated 4.1.1
**Storage**: N/A (UI refactoring only)
**Testing**: Jest with jest-expo, @testing-library/react-native
**Target Platform**: iOS 15+ and Android (mobile platforms)
**Project Type**: Mobile (React Native + Expo)
**Performance Goals**: No performance changes expected (maintain 60 fps rendering)
**Constraints**: Must maintain all existing behavior (press handlers, ripple effects, animations, styling); no visual changes allowed
**Scale/Scope**: 3 component files, ~150 total lines of code affected

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I: Theme-Driven Styling

✅ **PASS** - Refactoring maintains existing `react-native-unistyles` usage. No new styles added, existing theme-based styling preserved.

### Principle II: Internationalization First

✅ **PASS** - No user-facing text changes. Existing i18n usage (`useTranslation()`) is preserved in extracted render functions.

### Principle III: Component Architecture

✅ **PASS** - Maintains existing component folder structure (Component.tsx, Component.styles.ts, Component.types.ts, index.ts). Extracted render logic stays within component files.

### Principle IV: Code Quality Enforcement

✅ **PASS** - TypeScript types will be added for extracted functions, no `any` types. Existing ESLint rules will be satisfied. Code will be auto-formatted with Prettier.

### Principle V: Simplicity and YAGNI

✅ **PASS** - This is a simplification refactor, not adding complexity. Extracting render functions improves readability without introducing new abstractions or dependencies.

**Overall Status**: ✅ ALL GATES PASSED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/004-refactor-map-renderers/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── checklists/
│   └── requirements.md  # Spec validation checklist (completed)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

**Note**: `data-model.md` and `contracts/` are not applicable for this refactoring task (no data model or API changes).

### Source Code (repository root)

```text
src/features/home/components/
├── AzkarProgress/
│   ├── AzkarProgress.tsx         # TO BE MODIFIED: Extract renderAzkarChip
│   ├── AzkarProgress.styles.ts   # NO CHANGES: Styles remain in separate file
│   ├── AzkarProgress.types.ts    # POTENTIAL ADDITION: Types for render function props
│   └── index.ts                  # NO CHANGES: Public exports
├── PrayersProgress/
│   ├── PrayersProgress.tsx       # TO BE MODIFIED: Extract renderPrayerCircle
│   ├── PrayersProgress.styles.ts # NO CHANGES: Styles remain in separate file
│   ├── PrayersProgress.types.ts  # POTENTIAL ADDITION: Types for render function props
│   └── index.ts                  # NO CHANGES: Public exports
└── RandomActsGrid/
    ├── RandomActsGrid.tsx        # TO BE MODIFIED: Extract renderActCard
    ├── RandomActsGrid.styles.ts  # NO CHANGES: Styles remain in separate file
    ├── RandomActsGrid.types.ts   # POTENTIAL ADDITION: Types for render function props
    └── index.ts                  # NO CHANGES: Public exports

src/features/home/types/
└── home.types.ts                 # NO CHANGES: Existing type definitions remain
```

**Structure Decision**: This is a mobile React Native project with feature-based organization. Components follow the established pattern of separated concerns (`.tsx`, `.styles.ts`, `.types.ts`). The refactoring will only modify the component `.tsx` files and potentially add type definitions to `.types.ts` files. No new files or directories will be created.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected** - All constitution principles are satisfied by this refactoring task.

---

## Post-Phase 1 Constitution Re-Check

_Required after research and design are complete_

### Research Findings Review

**Phase 0 Research Complete**: ✅ All technical decisions documented in `research.md`

**Key Decisions**:

1. Use inline render functions (not separate components) - **Aligns with Principle V (Simplicity)**
2. Follow `render<ItemName>` naming convention - **Consistent pattern**
3. Maintain closure access to parent scope - **No prop drilling needed**
4. Preserve all existing behavior - **No breaking changes**

### Constitution Re-Validation

#### Principle I: Theme-Driven Styling

✅ **PASS** - Research confirms no style changes. All theme tokens remain in `.styles.ts` files. Render functions reference existing styles.

#### Principle II: Internationalization First

✅ **PASS** - Research confirms render functions maintain closure access to `useTranslation()` hook. No hardcoded strings.

#### Principle III: Component Architecture

✅ **PASS** - Research confirms maintaining existing file structure. Render functions defined inline within component `.tsx` files. No new component files needed.

#### Principle IV: Code Quality Enforcement

✅ **PASS** - Research specifies TypeScript type annotations for render functions. No `any` types. ESLint compliance maintained.

#### Principle V: Simplicity and YAGNI

✅ **PASS** - Research rejects separate component files, React.memo, and HOC patterns as over-engineering. Inline render functions are the simplest approach.

**Post-Design Status**: ✅ **ALL GATES STILL PASSED** - Proceed to Phase 2 (Task Generation)

---

## Phase Summary

### Phase 0: Research ✅ COMPLETE

- **Output**: `research.md` with 8 technical decisions documented
- **Status**: All clarifications resolved, approach defined

### Phase 1: Design ⏭️ SKIPPED

- **Data Model**: N/A (no data changes)
- **Contracts**: N/A (no API changes)
- **Quickstart**: ✅ Created with before/after examples

### Phase 2: Task Generation 🔜 READY

- **Next Command**: `/speckit.tasks` to generate implementation tasks
- **Expected Output**: Detailed, dependency-ordered task list in `tasks.md`

---

## Implementation Readiness

✅ **Specification validated** (requirements checklist passed)
✅ **Constitution gates passed** (pre and post design)
✅ **Technical approach defined** (research complete)
✅ **No blockers identified**

**Status**: Ready for `/speckit.tasks` command to generate implementation plan.
