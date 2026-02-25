# Implementation Plan: Signup Screen

**Branch**: `006-signup-screen` | **Date**: 2026-02-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-signup-screen/spec.md`

## Summary

Implement a signup screen for new user registration, following the login screen's established structure and patterns. The screen includes 7 form fields (first name, last name, email, password, confirm password, country via searchable Select component, date of birth via DatePicker), Zod-based validation with react-hook-form, and Supabase auth signup integration. All existing design system components (Input, Button, Select, DatePicker, Icon, Typography) are reused — no new common components needed.

## Technical Context

**Language/Version**: TypeScript 5.9.2, React Native 0.81.5, Expo SDK 54
**Primary Dependencies**: react-hook-form 7.71.1, zod 4.3.6, @hookform/resolvers 5.2.2, @gorhom/bottom-sheet 5.2.8, react-native-unistyles 3.0.20, react-i18next 16.5.3
**Storage**: Supabase (auth + user metadata)
**Testing**: Jest + jest-expo + @testing-library/react-native (optional per constitution)
**Target Platform**: iOS + Android (React Native via Expo)
**Project Type**: Mobile
**Performance Goals**: 60fps animations, <500ms screen render, <100ms input focus response
**Constraints**: Must follow login screen patterns, all text via i18n, all styles via theme tokens, no inline styles, no hardcoded strings
**Scale/Scope**: Single screen with 7 form fields, 1 hook, 1 schema, i18n updates for 2 locales

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Research Check

| Principle                      | Status  | Notes                                                                                                                                                |
| ------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Theme-Driven Styling        | ✅ PASS | All styles via `StyleSheet.create((theme) => ...)`, semantic color tokens, responsive metrics                                                        |
| II. Internationalization First | ✅ PASS | All user-facing text via `t()` from react-i18next, translations in en.json + ar.json                                                                 |
| III. Component Architecture    | ✅ PASS | SignupForm in `src/features/auth/components/SignupForm/` with Component.tsx, styles.ts, index.ts; hook in hooks/; schema in schemas/                 |
| IV. Code Quality Enforcement   | ✅ PASS | TypeScript strict (no `any`), ESLint enforced, Prettier formatting, conventional commits                                                             |
| V. Simplicity and YAGNI        | ✅ PASS | Reuses 6 existing components (Input, Button, IconButton, Select, DatePicker, Typography), no new abstractions, follows login screen patterns exactly |

### Post-Design Re-Check

| Principle                      | Status  | Notes                                                                                                                                                            |
| ------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Theme-Driven Styling        | ✅ PASS | Styles file uses `theme.colors.*`, `theme.metrics.*`, `theme.fonts.*` exclusively                                                                                |
| II. Internationalization First | ✅ PASS | Schema factory accepts TFunction for localized errors; all labels/placeholders use i18n keys                                                                     |
| III. Component Architecture    | ✅ PASS | 4 new files follow convention: SignupForm.tsx + styles + index, useSignupForm.ts, signup.schema.ts, Signup.tsx route                                             |
| IV. Code Quality Enforcement   | ✅ PASS | Zod schema provides full TypeScript inference, no `any` types needed                                                                                             |
| V. Simplicity and YAGNI        | ✅ PASS | No new dependencies, no premature abstractions. Select component replaces need for custom country bottom sheet. DatePicker replaces need for custom date picker. |

**Gate Result**: ✅ ALL PASS — no violations, no complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/006-signup-screen/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: research decisions
├── data-model.md        # Phase 1: entity definitions
├── quickstart.md        # Phase 1: implementation guide
├── contracts/           # Phase 1: API & component contracts
│   └── signup-api.md    # Supabase auth + component interfaces
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
app/(auth)/
  Signup.tsx                                # Screen route — KAV + ScrollView + SafeAreaView wrapper

src/features/auth/
  components/
    SignupForm/
      SignupForm.tsx                         # Main form component with Controller-wrapped fields
      SignupForm.styles.ts                   # Styles using createStyleSheet with theme
      index.ts                              # Named export
  hooks/
    useSignupForm.ts                        # Form state, validation, API call, password toggles
  schemas/
    signup.schema.ts                        # Zod schema factory with i18n error messages
  data/
    countries.ts                            # Existing — COUNTRIES: SelectOption[]

src/i18n/locales/
  en.json                                   # Add/verify auth.signup.*, auth.validation.* keys
  ar.json                                   # Add/verify auth.signup.*, auth.validation.* keys
```

**Structure Decision**: Follows the established React Native + Expo mobile project structure. Feature code in `src/features/auth/`, route in `app/(auth)/`, shared components remain in `src/common/components/`. No new directories needed beyond `SignupForm/` component folder.

## Complexity Tracking

> No constitution violations — this section is empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | —          | —                                    |
