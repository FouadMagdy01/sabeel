# Implementation Plan: Home Screen UI Enhancement

**Branch**: `001-home-ui-enhancement` | **Date**: 2026-02-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-home-ui-enhancement/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Redesign the Azkar and Random Acts sections on the home screen to improve visual hierarchy, discoverability, and user engagement. The Azkar section will use a hybrid Card-with-chips approach (progress indicator at top, improved chip spacing below). The Random Acts section will transition from an asymmetric grid to a vertical list of equal-sized cards. Both sections will use 100% design system components with semantic color tokens and responsive metrics.

## Technical Context

**Language/Version**: TypeScript 5.x with React Native (Expo SDK 54)
**Primary Dependencies**:

- `react-native-unistyles` for styling
- `react-native-svg` for CircularProgress component
- `expo-vector-icons` for icons
- `react-i18next` for internationalization

**Storage**: N/A (UI-only feature, uses existing in-memory data structures)
**Testing**: Jest with React Native Testing Library (optional per constitution)
**Target Platform**: iOS 15+ and Android 10+ (React Native mobile app)
**Project Type**: Mobile (React Native with Expo)
**Performance Goals**: 60 fps scrolling, <100ms touch response, instant theme switching
**Constraints**:

- Must work on screens from 320px to 1024px width
- Must support RTL (Arabic) and LTR (English) layouts
- Must respect safe area insets
- Minimum touch target: 44x44 points

**Scale/Scope**: 2 component files (AzkarProgress, RandomActsGrid) + 2 style files + existing type files

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I: Theme-Driven Styling ✅ PASS

- All styling will use `StyleSheet.create((theme) => ({...}))` pattern
- Semantic color tokens from `theme.colors.*` will be used exclusively
- Responsive metrics (`rf()`, `hs()`, `vs()`, `spacing`, `spacingV`) will be used
- Theme mode detection via `theme.colors.mode`
- **Status**: No violations - design is fully theme-driven

### Principle II: Internationalization First ✅ PASS

- Existing i18n keys will be reused (no new strings needed per spec)
- RTL layout will be preserved
- **Status**: No violations - i18n already in place

### Principle III: Component Architecture ✅ PASS

- Components follow `Component.tsx`, `Component.styles.ts`, `Component.types.ts`, `index.ts` structure
- Feature components in `src/features/home/components/`
- Shared components from `src/common/components/` (Card, Typography, Icon, CircularProgress)
- **Status**: No violations - existing architecture respected

### Principle IV: Code Quality Enforcement ✅ PASS

- TypeScript without `any` types
- ESLint rules followed (no hardcoded strings, no inline styles)
- Prettier formatting
- Conventional commits
- **Status**: No violations - quality gates respected

### Principle V: Simplicity and YAGNI ✅ PASS

- Minimal complexity: only redesigning 2 existing components
- No new dependencies
- No premature abstractions
- Using existing design system components
- **Status**: No violations - minimal scope, maximum leverage of existing code

**Overall Constitution Compliance**: ✅ **ALL GATES PASS** - No violations, no complexity justification needed

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── features/
│   └── home/
│       ├── components/
│       │   ├── AzkarProgress/          # [MODIFY] Hybrid card with chips
│       │   │   ├── AzkarProgress.tsx
│       │   │   ├── AzkarProgress.styles.ts
│       │   │   └── index.ts
│       │   ├── RandomActsGrid/         # [MODIFY] Vertical list of equal cards
│       │   │   ├── RandomActsGrid.tsx
│       │   │   ├── RandomActsGrid.styles.ts
│       │   │   └── index.ts
│       │   └── DailyTodos/             # [NO CHANGE] Parent container
│       │       ├── DailyTodos.tsx
│       │       └── DailyTodos.styles.ts
│       └── types/
│           └── home.types.ts           # [NO CHANGE] Existing data types
├── common/
│   └── components/
│       ├── Card/                       # [USE] Existing component
│       ├── Typography/                 # [USE] Existing component
│       ├── Icon/                       # [USE] Existing component
│       └── CircularProgress/           # [USE] Existing component
├── theme/
│   ├── config.ts                       # [USE] Theme configuration
│   ├── metrics.ts                      # [USE] Responsive metrics
│   ├── light-theme.ts                  # [USE] Light mode colors
│   └── dark-theme.ts                   # [USE] Dark mode colors
└── i18n/
    └── locales/
        ├── ar.json                     # [USE] Existing Arabic translations
        └── en.json                     # [USE] Existing English translations

app/
└── (main)/
    └── (tabs)/
        └── index.tsx                   # [NO CHANGE] Home screen entry point
```

**Structure Decision**: Mobile React Native application with Expo. Feature follows the established pattern of feature-specific components in `src/features/<feature>/components/` with shared reusable components in `src/common/components/`. All existing infrastructure (theme system, i18n, design components) is leveraged. Only 2 component files + 2 style files will be modified.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: N/A - No constitution violations detected. All gates passed.

---

## Phase 0: Research (Complete ✅)

**Artifacts Generated**:

- ✅ [research.md](./research.md) - Technical decisions and design patterns documented

**Key Findings**:

1. All required design system components exist (Card, Typography, Icon, CircularProgress)
2. Chip spacing: 12pt gap with 44pt minimum height
3. Random Acts layout: View + .map() (simple iteration, no virtualization needed)
4. Press feedback: Existing Pressable pattern with platform-specific handling
5. Progress positioning: Header row (title left, progress right)
6. Card ordering: Completed acts first in vertical list

**Status**: All unknowns resolved. No blockers identified.

---

## Phase 1: Design & Contracts (Complete ✅)

**Artifacts Generated**:

- ✅ [data-model.md](./data-model.md) - Existing entities documented (no modifications)
- ✅ [contracts/component-contracts.md](./contracts/component-contracts.md) - Component prop interfaces
- ✅ [quickstart.md](./quickstart.md) - Implementation guide for developers
- ✅ Agent context updated (CLAUDE.md)

**Data Model**:

- No schema changes (UI-only feature)
- Uses existing: AzkarData, RandomActData, Theme types
- Components remain stateless

**Contracts**:

- AzkarProgressProps: `{ azkar, onAzkarPress }`
- RandomActsGridProps: `{ acts, onActPress }`
- No breaking changes (backwards compatible)

**Constitution Re-check**: ✅ **ALL GATES STILL PASS**

- No new violations introduced during planning
- Design artifacts respect all 5 constitution principles
- Complexity remains minimal (2 component modifications)

---

## Phase 2: Task Generation (Next Step)

**Status**: Ready for `/speckit.tasks` command

**Prerequisites Met**:

- ✅ Spec clarified
- ✅ Research complete
- ✅ Design documented
- ✅ Contracts defined
- ✅ Constitution compliance verified

**Expected Outputs** (from `/speckit.tasks`):

- tasks.md with dependency-ordered implementation tasks
- Estimated effort per task
- Clear acceptance criteria

---

## Summary

**Planning Complete**: All Phase 0 and Phase 1 artifacts generated successfully.

**Implementation Readiness**:

- Clear technical direction
- No architectural blockers
- All design decisions documented
- Constitution-compliant approach
- Backwards-compatible changes

**Next Command**: `/speckit.tasks` to generate implementation tasks

**Estimated Implementation Time**: 2-3 hours (per quickstart.md)

**Files Modified**: 2 component files + 2 style files

**Risk Level**: Low (UI-only, no data/backend changes, leveraging existing components)
