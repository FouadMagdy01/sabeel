# Implementation Plan: Supabase Authentication Refactor

**Branch**: `008-supabase-auth-refactor` | **Date**: 2026-02-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-supabase-auth-refactor/spec.md`

## Summary

Refactor the Sabeel app's authentication system to replace direct Supabase calls in form hooks with a clean service layer using React Query mutations and queries. The existing login/signup screens and form components remain; the change is in how auth operations are invoked (via `useMutation`/`useQuery` hooks backed by a dedicated auth service module) and how session state is managed (via an `AuthProvider` context that listens to Supabase auth state changes). The `register-user` edge function handles server-side account creation (auth user + profile + role), while the client calls `supabase.auth.signInWithPassword` for login directly. Profile data is fetched via a React Query `useQuery` hook.

## Technical Context

**Language/Version**: TypeScript 5.9.2, React Native 0.81.5, Expo SDK 54
**Primary Dependencies**: @supabase/supabase-js 2.x, @tanstack/react-query 5.90.20, react-hook-form 7.71.1, zod 4.3.6, @hookform/resolvers 5.2.2, react-i18next 16.5.3, react-native-mmkv 4.1.0
**Storage**: Supabase PostgreSQL (remote), MMKV (local session persistence via custom storage adapter in `src/integrations/supabase.ts`)
**Testing**: Jest + jest-expo + @testing-library/react-native (optional per constitution)
**Target Platform**: iOS 15+ and Android (React Native + Expo)
**Project Type**: Mobile (React Native with Expo)
**Performance Goals**: Login < 2s, registration < 3s, session restore < 500ms, profile fetch < 2s
**Constraints**: No web-specific APIs (window.location, localStorage, document), must work offline for session restore, i18n required for all user-facing text (Arabic + English)
**Scale/Scope**: 2 auth screens (login, signup), 1 auth service module, 1 auth provider, 5 custom hooks, ~8 files modified, ~6 files created

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate

| Principle                      | Status | Notes                                                                                                                                                                                    |
| ------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Theme-Driven Styling        | PASS   | All existing auth screens already use `StyleSheet.create((theme) => ...)`. No new screens needed; refactor is logic-only.                                                                |
| II. Internationalization First | PASS   | All auth i18n keys already exist in `en.json` and `ar.json`. New error messages will be added to existing auth namespace.                                                                |
| III. Component Architecture    | PASS   | Auth hooks live in `src/features/auth/hooks/`. New service module goes in `src/features/auth/services/`. New provider goes in `src/providers/auth/`. All follow established conventions. |
| IV. Code Quality Enforcement   | PASS   | No `any` types. All new code will be properly typed. Conventional commits enforced.                                                                                                      |
| V. Simplicity and YAGNI        | PASS   | React Query is already a project dependency. AuthProvider is justified because multiple components need session state. No new third-party packages required.                             |

**Result**: All gates PASS. Proceeding to Phase 0.

### Post-Phase 1 Gate (re-check)

| Principle                      | Status | Notes                                                                                                              |
| ------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------ |
| I. Theme-Driven Styling        | PASS   | No styling changes in this refactor.                                                                               |
| II. Internationalization First | PASS   | New i18n keys added for auth error messages.                                                                       |
| III. Component Architecture    | PASS   | Service layer (`authService.ts`) is separate from hooks. Provider follows existing `QueryProvider` pattern.        |
| IV. Code Quality Enforcement   | PASS   | Full TypeScript typing. No `any`.                                                                                  |
| V. Simplicity and YAGNI        | PASS   | Minimal abstractions: 1 service file, 1 provider, 5 hooks. No repository pattern, no state machine, no middleware. |

**Result**: All gates PASS.

## Project Structure

### Documentation (this feature)

```text
specs/008-supabase-auth-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── auth-api.md      # Auth service API contract
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── features/auth/
│   ├── components/
│   │   ├── LoginForm/        # EXISTING — modify to use new hooks
│   │   └── SignupForm/       # EXISTING — modify to use new hooks
│   ├── hooks/
│   │   ├── useLoginForm.ts   # EXISTING — refactor to use useLogin mutation
│   │   ├── useSignupForm.ts  # EXISTING — refactor to use useRegister mutation
│   │   ├── useAuth.ts        # NEW — re-export AuthProvider context hook
│   │   ├── useProfile.ts     # NEW — React Query useQuery for profile data
│   │   └── index.ts          # NEW — barrel export
│   ├── services/
│   │   ├── authService.ts    # NEW — Supabase auth API calls
│   │   ├── authService.types.ts # NEW — TypeScript types for auth service
│   │   └── index.ts          # NEW — barrel export
│   ├── schemas/
│   │   ├── login.schema.ts   # EXISTING — no changes
│   │   └── signup.schema.ts  # EXISTING — no changes
│   └── data/
│       └── countries.ts      # EXISTING — no changes
├── providers/
│   ├── auth/
│   │   ├── AuthProvider.tsx   # NEW — Supabase onAuthStateChange listener + context
│   │   ├── AuthProvider.types.ts # NEW — AuthContext types
│   │   └── index.ts          # NEW — barrel export
│   ├── query/                # EXISTING — no changes
│   └── index.ts              # EXISTING — add auth provider export
├── integrations/
│   └── supabase.ts           # EXISTING — no changes (already has MMKV adapter)
└── i18n/locales/
    ├── en.json               # EXISTING — add new auth error keys
    └── ar.json               # EXISTING — add new auth error keys

app/
├── _layout.tsx               # EXISTING — wrap with AuthProvider
├── (auth)/
│   ├── _layout.tsx           # EXISTING — no changes
│   ├── index.tsx             # EXISTING — no changes
│   └── Signup.tsx            # EXISTING — no changes
└── (main)/
    └── ...                   # EXISTING — no changes
```

**Structure Decision**: Mobile app structure following existing conventions. New code is organized into the existing `src/features/auth/` module with a new `services/` subdirectory for the auth API layer, and a new `src/providers/auth/` directory for the auth context provider (matching the existing `src/providers/query/` pattern).

## Complexity Tracking

No constitution violations. No complexity justifications needed.
