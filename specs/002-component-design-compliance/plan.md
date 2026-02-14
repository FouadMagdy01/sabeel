# Implementation Plan: Component Design System Compliance & Enhancement

**Branch**: `002-component-design-compliance` | **Date**: 2026-02-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-component-design-compliance/spec.md`

## Summary

Audit, enhance, and standardize all 13 common components against the Sabeel design system, then migrate feature code to use them comprehensively. The work spans three phases: compliance fixes (structural gaps, hardcoded values, JSDoc), enhancement with industry-standard variants (MUI/Ant Design intersection), and codebase migration of 8 feature files from React Native primitives to common components.

## Technical Context

**Language/Version**: TypeScript 5.x with React Native (Expo SDK 54)
**Primary Dependencies**: react-native-unistyles, expo-vector-icons, expo-linear-gradient, react-native-svg, react-native-reanimated, @gorhom/bottom-sheet, expo-blur
**Storage**: N/A (UI-only feature)
**Testing**: Manual visual testing via test matrix checklist (130 combinations: 13 components × 5 themes × 2 modes)
**Target Platform**: iOS + Android via Expo
**Project Type**: Mobile (React Native)
**Performance Goals**: 60fps rendering, no jank on theme switching
**Constraints**: Must pass `npm run validate` (type-check + ESLint + Prettier), zero visual regressions
**Scale/Scope**: 13 common components, ~20 feature files, 5 theme presets × 2 modes

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Research Check (Phase 0 Gate)

| Principle                      | Status     | Notes                                                                                                                                                           |
| ------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Theme-Driven Styling        | ✅ PASS    | Feature enforces theme compliance; all changes use `StyleSheet.create((theme) => ({...}))`                                                                      |
| II. Internationalization First | ✅ PASS    | No new user-facing strings (component prop labels are developer-facing). Migration preserves existing i18n usage                                                |
| III. Component Architecture    | ✅ PASS    | Fixes structure gaps (CircularProgress missing .styles.ts, CustomTabBar missing .types.ts). All changes follow folder convention                                |
| IV. Code Quality Enforcement   | ✅ PASS    | All changes must pass `npm run validate`. JSDoc additions improve quality. No `any` types                                                                       |
| V. Simplicity and YAGNI        | ⚠️ MONITOR | Adding MUI/Ant Design variants is justified by user decision (D: industry-standard), but each new prop should be genuinely useful. Monitor for over-engineering |

### Post-Design Re-Check (Phase 1 Gate)

| Principle                      | Status  | Notes                                                                                                     |
| ------------------------------ | ------- | --------------------------------------------------------------------------------------------------------- |
| I. Theme-Driven Styling        | ✅ PASS | All enhanced props use semantic theme tokens. New color variants map to `theme.colors.*`                  |
| II. Internationalization First | ✅ PASS | No new translatable strings introduced                                                                    |
| III. Component Architecture    | ✅ PASS | Enhanced components maintain folder structure. No new business logic in components                        |
| IV. Code Quality Enforcement   | ✅ PASS | JSDoc additions improve IntelliSense. TypeScript types are strict (no `any`)                              |
| V. Simplicity and YAGNI        | ✅ PASS | Each enhancement maps to MUI/Ant Design intersection (documented in research.md). No speculative features |

## Project Structure

### Documentation (this feature)

```text
specs/002-component-design-compliance/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Component audit findings + variant research
├── data-model.md        # Enhanced component API contracts
├── quickstart.md        # Developer onboarding guide
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── common/
│   └── components/
│       ├── Button/           # Enhanced: +fullWidth, +color variants
│       │   ├── button.tsx
│       │   ├── Button.styles.ts
│       │   ├── Button.types.ts
│       │   └── index.ts
│       ├── Card/             # Enhanced: +onPress, +loading
│       │   ├── Card.tsx
│       │   ├── Card.styles.ts
│       │   ├── Card.types.ts
│       │   └── index.ts
│       ├── CircularProgress/  # Fixed: +styles.ts, Enhanced: +indeterminate, +showLabel
│       │   ├── CircularProgress.tsx
│       │   ├── CircularProgress.styles.ts  # NEW
│       │   ├── CircularProgress.types.ts
│       │   └── index.ts
│       ├── CustomTabBar/      # Fixed: +types.ts
│       │   ├── CustomTabBar.tsx
│       │   ├── CustomTabBar.styles.ts
│       │   ├── CustomTabBar.types.ts  # NEW
│       │   └── index.ts
│       ├── DatePicker/        # Enhanced: +clearable, +format
│       ├── Divider/           # Enhanced: +text label, +dashed
│       ├── Icon/              # Compliance: JSDoc only
│       ├── IconButton/        # Enhanced: +loading
│       ├── Input/             # Enhanced: +clearable, +required, +showCount
│       ├── SearchInput/       # Enhanced: +onSearch, +loading, +size, +disabled
│       ├── SegmentedControl/  # Major: rewrite API (structured options, sizes, disabled)
│       ├── Select/            # Enhanced: +searchable, +allowClear, +loading
│       └── Typography/        # Enhanced: +strikethrough, +underline, +disabled color
├── features/
│   ├── home/
│   │   └── components/
│   │       ├── AzkarProgress/         # Migration: Pressable → Button
│   │       ├── PrayersProgress/       # Migration: Pressable → IconButton
│   │       ├── RandomActsGrid/        # Migration: View-as-card → Card
│   │       └── VerseOfTheDay/         # Migration: Pressable → IconButton
│   └── library/
│       └── components/
│           ├── FeaturedReciterCard/    # Migration: Pressable → Card onPress
│           └── LibraryTabBar/         # Migration: Text → Typography
└── theme/                             # Source of truth (no changes)

app/(main)/(tabs)/
├── prayers/index.tsx                  # Migration: Text → Typography, Pressable → Button
└── settings/index.tsx                 # Migration: Text → Typography
```

**Structure Decision**: Existing React Native mobile project structure. All changes are modifications to existing files in `src/common/components/` (enhancements) and `src/features/` + `app/` (migration). No new directories needed except `CircularProgress.styles.ts` and `CustomTabBar.types.ts` files.

## Complexity Tracking

| Concern                                | Justification                                                                                                             | Mitigation                                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| SegmentedControl API rewrite           | Current API is too minimal (string[] only); industry standard requires structured options with per-segment disable, icons | Maintain backward-compatible `selectedIndex`/`onSegmentChange` alongside new `value`/`onChange` API during transition |
| Adding MUI/Ant Design variant coverage | User explicitly chose Option D (industry-standard). Adds props to 11 of 13 components                                     | Only add intersection of MUI + Ant Design (not union). Each prop documented in research.md with rationale             |
| Card `onPress` pattern                 | Adding interactivity to a presentational component                                                                        | Wraps with Pressable internally only when `onPress` is provided. No behavior change for existing usage                |
