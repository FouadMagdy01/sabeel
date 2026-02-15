# Implementation Plan: Login Screen

**Branch**: `005-login-screen` | **Date**: 2026-02-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-login-screen/spec.md`

## Summary

Implement the login screen at `app/(auth)/index.tsx` inspired by the provided HTML design, using the existing Sabeel design system components (Button, Input, Icon, IconButton, Typography, Divider). The screen includes email/password form with Zod validation (localized error messages via i18n `t()` factory pattern), password visibility toggle, forgot password link, login button with loading state, "Continue as Guest" option, sign up link, and decorative background with Islamic pattern overlay and gradient glow effects. Authentication is handled via Supabase `signInWithPassword`.

## Technical Context

**Language/Version**: TypeScript 5.9.2, React Native 0.81.5, Expo SDK 54
**Primary Dependencies**: react-native-unistyles 3.0.20, zod 4.3.6, react-hook-form 7.71.1, @hookform/resolvers 5.2.2, @supabase/supabase-js 2.91.1, expo-linear-gradient 15.0.8, react-native-svg, react-i18next 16.5.3
**Storage**: Supabase Auth with MMKV-backed session persistence (existing)
**Testing**: Jest + jest-expo (optional per constitution)
**Target Platform**: iOS + Android (React Native with Expo)
**Project Type**: Mobile
**Performance Goals**: Screen render <500ms, form validation feedback <500ms, 60fps animations, input focus response <100ms
**Constraints**: No new dependencies (all already installed), no inline styles, no hardcoded strings, no `any` types, Cairo font family only
**Scale/Scope**: Single screen with 2 new files, 3 modified files

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                      | Status  | Notes                                                                                                                                           |
| ------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Theme-Driven Styling        | ✅ PASS | All styles via `createStyleSheet((theme) => ...)`, semantic tokens, responsive metrics                                                          |
| II. Internationalization First | ✅ PASS | All text via `t()`, Zod errors localized via factory pattern, existing keys reused, new keys added to both en.json and ar.json                  |
| III. Component Architecture    | ✅ PASS | Screen in `app/(auth)/index.tsx`, schema in `src/features/auth/schemas/`, hook in `src/features/auth/hooks/`, reuses existing shared components |
| IV. Code Quality Enforcement   | ✅ PASS | TypeScript strict, ESLint compliant, Prettier formatted, conventional commits                                                                   |
| V. Simplicity and YAGNI        | ✅ PASS | No new shared components, no new dependencies, minimal file count (2 new, 3 modified), no premature abstractions                                |

**Post-Phase 1 Re-check**: All gates still pass. Design uses only existing components and established patterns. Zod factory pattern is the simplest approach for localized validation that keeps schemas separate from components.

## Project Structure

### Documentation (this feature)

```text
specs/005-login-screen/
├── plan.md              # This file
├── research.md          # Phase 0: technology decisions
├── data-model.md        # Phase 1: form data entities and state
├── quickstart.md        # Phase 1: implementation guide
├── contracts/
│   └── auth-api.md      # Phase 1: Supabase auth + navigation contracts
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/features/auth/
├── schemas/
│   └── login.schema.ts          # NEW: Zod schema factory with i18n
├── hooks/
│   └── useLoginForm.ts          # NEW: Form state + submission logic
└── data/
    ├── countries.ts              # EXISTING (unchanged)
    └── index.ts                  # EXISTING (unchanged)

app/(auth)/
├── _layout.tsx                   # EXISTING (unchanged)
├── index.tsx                     # MODIFY: Replace placeholder with login screen
└── Signup.tsx                    # EXISTING (unchanged)

src/i18n/locales/
├── en.json                       # MODIFY: Add missing auth keys
└── ar.json                       # MODIFY: Add missing auth keys
```

**Structure Decision**: Feature-module pattern per Principle III. Schema and hook live under `src/features/auth/` as they are auth-specific. The screen itself lives at `app/(auth)/index.tsx` per expo-router file-based routing. No new shared components are needed — all UI is composed from existing `Button`, `Input`, `Icon`, `IconButton`, `Typography`, and `Divider` components.

## Design Decisions

### D1: Zod Schema Factory Pattern

The login schema is defined as `createLoginSchema(t: TFunction)` in a separate file. This satisfies:

- User requirement: "schemas should be outside component"
- User requirement: "localize error messages using t import from i18n"
- Constitution Principle III: separated concerns

```typescript
// src/features/auth/schemas/login.schema.ts
export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, t('auth.validation.emailRequired'))
      .email(t('auth.validation.emailInvalid')),
    password: z
      .string()
      .min(1, t('auth.validation.passwordRequired'))
      .min(8, t('auth.validation.passwordMinLength')),
  });
```

### D2: Form Hook Pattern

`useLoginForm()` encapsulates all form logic: schema creation, react-hook-form setup, submission handler, server error state. The hook uses `mode: 'onBlur'` for email validation on blur per spec clarification.

### D3: Screen Layout Architecture

The login screen is a single-file screen component at `app/(auth)/index.tsx` that:

1. Uses `KeyboardAvoidingView` + `ScrollView` for keyboard handling
2. Has absolute-positioned background decorations (gradient blobs + pattern)
3. Uses `flex: 1` with `justifyContent: 'space-between'` for header/form/footer spacing (matching the HTML design's 3-section layout)

### D4: Background Decorative Elements

- **Gradient Glows**: Two `LinearGradient` components positioned absolutely with large blur-like border radii and low opacity, using theme gradient colors
- **Islamic Pattern**: Lightweight SVG tiled pattern at very low opacity (0.03-0.05) using `react-native-svg`, positioned absolutely behind content

### D5: Input Variant Selection

Inputs use `variant="filled"` with `size="large"` to match the HTML design's solid background inputs with generous padding. The `filled` variant provides `backgroundColor: theme.colors.background.input` with a transparent border that shows `theme.colors.border.focus` on focus.

### D6: Navigation Handling

- **Login Success**: `router.replace('/(main)/(tabs)')` — replace to prevent back navigation to login
- **Continue as Guest**: `router.replace('/(main)/(tabs)')` — same pattern
- **Sign Up**: `router.push('/(auth)/Signup')` — push to allow back navigation
- **Forgot Password**: For now, a no-op or console.log (screen not yet implemented per spec out-of-scope)

### D7: i18n Key Additions

New keys needed (not already in locale files):

| Key                             | English                                                 | Arabic                                         |
| ------------------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| `auth.login.appName`            | Sabeel                                                  | سبيل                                           |
| `auth.login.tagline`            | Begin your spiritual journey                            | ابدأ رحلتك الروحية                             |
| `auth.login.invalidCredentials` | Invalid email or password                               | البريد الإلكتروني أو كلمة المرور غير صحيحة     |
| `auth.login.serviceUnavailable` | Service temporarily unavailable. Please try again later | الخدمة غير متوفرة مؤقتاً. يرجى المحاولة لاحقاً |

## Complexity Tracking

> No constitution violations. All gates pass. No complexity justification needed.
