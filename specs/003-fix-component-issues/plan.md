# Implementation Plan: Fix Component Design Compliance Issues

**Branch**: `003-fix-component-issues` | **Date**: 2026-02-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-fix-component-issues/spec.md`

## Summary

Fix three component compliance issues to improve code quality, accessibility, and internationalization:

1. **CircularProgress**: Migrate deprecated `rotation` prop to `transform` rotate (React Native SVG deprecation)
2. **Card**: Add opacity-based pressable feedback (0.7-0.8 on press) matching Button component patterns
3. **DatePicker**: Replace hardcoded weekday/month strings with i18n translations and use design system components

This is a refactoring task with zero new features - all changes maintain existing functionality while improving code compliance.

## Technical Context

**Language/Version**: TypeScript 5.9.2, React Native 0.81.5, Expo SDK 54
**Primary Dependencies**: `react-native-unistyles` 3.0.20, `react-i18next` 16.5.3, `react-native-reanimated` 4.1.1, `react-native-svg`
**Storage**: N/A (UI refactoring only)
**Testing**: Manual testing + visual regression (baseline screenshots)
**Target Platform**: iOS 15+, Android 6+ (React Native cross-platform)
**Project Type**: Mobile (React Native + Expo)
**Performance Goals**: 50ms pressable feedback response, 0 deprecation warnings
**Constraints**: <50ms feedback latency, maintain visual parity, preserve i18n support
**Scale/Scope**: 3 component files, ~50 LOC changes total

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I: Theme-Driven Styling ✅ COMPLIANT

- **Status**: Fully aligned
- **Verification**:
  - CircularProgress: Uses `useUnistyles` and theme colors (line 64, 95-96 in CircularProgress.tsx)
  - Card: Uses `createStyleSheet` with theme variants (Card.styles.ts)
  - DatePicker: Uses `createStyleSheet` with theme (DatePicker.styles.ts)
- **Changes**: No theme system violations introduced. Card pressable will use opacity (no hardcoded colors).

### Principle II: Internationalization First ✅ COMPLIANT

- **Status**: Improves i18n compliance
- **Verification**: DatePicker already uses `useTranslation()` hook (line 70) and i18n keys exist in `src/i18n/locales/{en,ar}.json`
- **Changes**: Remove hardcoded MONTHS/WEEKDAYS arrays, use existing translation keys
- **Translation keys confirmed**:
  - `auth.calendar.months.{january...december}` ✓
  - `auth.calendar.weekdays.{sun...sat}` ✓

### Principle III: Component Architecture ✅ COMPLIANT

- **Status**: Fully aligned
- **Verification**: All three components follow established structure:
  - `Component.tsx`, `Component.styles.ts`, `Component.types.ts`, `index.ts`
  - Located in `src/common/components/{CircularProgress,Card,DatePicker}/`
- **Changes**: No structural modifications, only implementation updates

### Principle IV: Code Quality Enforcement ✅ COMPLIANT

- **Status**: Fixes existing violations
- **Verification**:
  - ESLint: Will remove deprecation warnings, hardcoded strings
  - TypeScript: All types preserved
  - Husky hooks: Pre-commit checks will pass
- **Changes**: Improves lint compliance (removes 2 warnings, ~10 hardcoded strings)

### Principle V: Simplicity and YAGNI ✅ COMPLIANT

- **Status**: Minimal complexity
- **Verification**:
  - No new abstractions added
  - No new dependencies required
  - Reuses existing Button pressable patterns
  - Reuses existing i18n infrastructure
- **Changes**: Simplifies code by removing hardcoded arrays

### Constitution Verdict: ✅ ALL GATES PASS

No violations. No complexity justification needed. Proceed with Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/003-fix-component-issues/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── spec.md              # Feature specification (already exists)
```

**Note**: `data-model.md` and `contracts/` omitted - not applicable for UI refactoring without data model or API changes.

### Source Code (repository root)

```text
src/common/components/
├── CircularProgress/
│   ├── CircularProgress.tsx          # MODIFY: Lines 83-84, 135-137 (rotation → transform)
│   ├── CircularProgress.styles.ts    # NO CHANGE
│   ├── CircularProgress.types.ts     # NO CHANGE
│   └── index.ts                      # NO CHANGE
│
├── Card/
│   ├── Card.tsx                      # MODIFY: Lines 91-98 (add opacity pressable style)
│   ├── Card.styles.ts                # ADD: pressedState variant for opacity
│   ├── Card.types.ts                 # NO CHANGE
│   └── index.ts                      # NO CHANGE
│
├── DatePicker/
│   ├── DatePicker.tsx                # MODIFY: Lines 11-26, 207, 214, 266-270, 293-301
│   │                                 # - Remove MONTHS/WEEKDAYS constants
│   │                                 # - Replace primitive Text → design system Text (if exists)
│   │                                 # - Replace primitive Pressable → design system Pressable (check)
│   ├── DatePicker.styles.ts          # NO CHANGE
│   ├── DatePicker.types.ts           # NO CHANGE
│   └── index.ts                      # NO CHANGE
│
└── Button/
    └── button.tsx                    # REFERENCE: Lines 100-119 (pressable feedback pattern)

src/i18n/locales/
├── en.json                           # VERIFY: calendar.months.*, calendar.weekdays.* exist ✓
└── ar.json                           # VERIFY: calendar.months.*, calendar.weekdays.* exist ✓
```

**Structure Decision**: Single project (mobile app) - modifications isolated to `src/common/components/`. No test files exist for these components (per repository audit), so no test updates required.

## Complexity Tracking

> Constitution Check passed - no violations to justify.

N/A

## Phase 0: Research & Technical Decisions

### Research Topics

1. **React Native SVG `rotation` deprecation**
   - **Question**: What's the exact replacement pattern for deprecated `rotation` prop in `<Circle>` elements?
   - **Why**: Ensure migration doesn't break animation behavior
   - **Scope**: CircularProgress component (react-native-svg API changes)

2. **Button pressable feedback pattern**
   - **Question**: What exact opacity values and timing does Button use for iOS pressable feedback?
   - **Why**: Must match Button behavior exactly (FR-005 requirement)
   - **Scope**: Card component pressable styling

3. **Design system Text/Pressable availability**
   - **Question**: Does the codebase have design system wrappers for Text and Pressable, or should DatePicker use primitives with theme?
   - **Why**: FR-012/FR-013 require using "design system components" - need to verify if these exist
   - **Scope**: DatePicker component refactoring

### Research Execution

Research agents will be dispatched to resolve these questions. Results will be consolidated in `research.md`.

## Phase 1: Design Artifacts

### Data Model

Not applicable - UI refactoring only, no data schema changes.

### API Contracts

Not applicable - no backend integration, purely client-side component fixes.

### Quickstart Guide

Generated after Phase 0 research completion. Will include:

- Testing commands for each component fix
- Visual regression testing steps
- Manual QA checklist

## Implementation Strategy

### Task Breakdown (Phase 2)

Tasks will be generated via `/speckit.tasks` after Phase 1 completion. Expected high-level breakdown:

1. **CircularProgress Migration** (P1)
   - Remove deprecated `rotation` prop from SVG Circle
   - Update to `transform` attribute with rotate function
   - Verify animation behavior unchanged
   - Test: Render all CircularProgress instances, check console

2. **Card Pressable Feedback** (P1)
   - Add `pressedState` style variant in Card.styles.ts (opacity 0.7-0.8)
   - Apply pressed style in Pressable render (lines 91-98)
   - Match Button component feedback pattern
   - Handle disabled state (no feedback)
   - Test: Visual comparison with Button, check theme modes

3. **DatePicker i18n Migration** (P2)
   - Remove MONTHS and WEEKDAYS constant arrays
   - Replace with `t('auth.calendar.months.*')` and `t('auth.calendar.weekdays.*')`
   - Verify RTL layout preserved for Arabic
   - Test: Switch language, verify translations

4. **DatePicker Design System Components** (P3)
   - If design system Text exists: Replace primitive Text imports
   - If design system Pressable exists: Replace primitive Pressable imports
   - Verify theme consistency maintained
   - Test: Theme switching, visual regression

### Risk Mitigation

| Risk                                    | Likelihood | Impact | Mitigation                                                                                 |
| --------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------ |
| SVG rotation migration breaks animation | Low        | High   | Reference react-native-svg docs, test in dev mode first, visual regression baseline        |
| Card opacity conflicts with theme       | Low        | Medium | Use theme.colors for any color adjustments, test light/dark modes                          |
| Missing design system components        | Medium     | Low    | If Text/Pressable wrappers don't exist, use primitives with theme (constitution-compliant) |
| DatePicker language switching edge case | Low        | Medium | Test rapid language switching, verify no memory leaks                                      |

### Testing Strategy

**Manual Testing Checklist**:

1. CircularProgress: Render in multiple sizes, verify no console warnings
2. Card: Test pressable feedback on iOS/Android, compare with Button
3. DatePicker: Switch language en↔ar, verify all strings translated
4. Visual Regression: Screenshot before/after for all three components

**Automated Testing**:

- Type-check: `npm run type-check` (existing)
- Lint: `npm run lint` (should show 0 new warnings)
- Format: `npm run format:check` (existing)

**Acceptance Criteria Verification**:

- SC-001: ✓ CircularProgress renders without deprecation warnings
- SC-002: ✓ Card pressable feedback within 50ms (manual timing test)
- SC-003: ✓ DatePicker shows 100% translated strings (visual inspection)
- SC-004: ✓ Visual regression pass (screenshot comparison)
- SC-005: ✓ 0 hardcoded strings in DatePicker (grep verification)

## Rollout Plan

1. **Development**: Implement on `003-fix-component-issues` branch
2. **Testing**: Manual QA + visual regression
3. **Review**: PR with before/after screenshots
4. **Merge**: After validation passes and PR approval
5. **Monitoring**: Post-merge smoke test on dev environment

**Rollback Strategy**: Git revert (no data migrations, purely code changes)

## Next Steps

1. ✅ Phase 0: Run research agents → generate `research.md`
2. ⏳ Phase 1: Generate `quickstart.md` based on research
3. ⏳ Phase 2: Run `/speckit.tasks` to generate `tasks.md`
4. ⏳ Implementation: Execute tasks in priority order (P1 → P2 → P3)

---

**Plan Status**: Phase 0 Ready | **Last Updated**: 2026-02-14
