# Quickstart: Supabase Authentication Refactor

**Feature**: 008-supabase-auth-refactor
**Date**: 2026-02-15

## What This Feature Does

Refactors the existing login and signup flows to use:

1. A dedicated **auth service** (`authService.ts`) for all Supabase calls
2. **React Query mutations** for login, register, and logout operations
3. An **AuthProvider** context for session state management
4. A **useProfile** query hook for profile data fetching

## Prerequisites

All already satisfied in the project:

- Supabase client configured with MMKV storage adapter (`src/integrations/supabase.ts`)
- React Query configured with `PersistQueryClientProvider` (`src/providers/query/`)
- Auth screens exist (`app/(auth)/index.tsx`, `app/(auth)/Signup.tsx`)
- Form components exist (`LoginForm`, `SignupForm` with react-hook-form + zod)
- i18n configured with auth translation keys
- Supabase edge functions deployed (`register-user`, `login-user`)

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   UI Layer       │     │   Hook Layer      │     │  Service Layer   │
│                  │     │                   │     │                  │
│  LoginForm ──────┼────▶│  useLoginForm ────┼────▶│  authService     │
│  SignupForm ─────┼────▶│  useSignupForm ───┼────▶│    .login()      │
│                  │     │  useAuth ─────────┼──┐  │    .register()   │
│  Root Layout ────┼────▶│  useProfile ──────┼──┤  │    .logout()     │
│                  │     │                   │  │  │    .getProfile() │
└─────────────────┘     └──────────────────┘  │  └────────┬─────────┘
                                               │           │
                         ┌─────────────────┐   │           ▼
                         │  AuthProvider    │◀──┘  ┌──────────────────┐
                         │  (Context)       │      │  Supabase Client │
                         │  - user          │      │  (MMKV storage)  │
                         │  - session       │      │  + Edge Functions │
                         │  - isLoading     │      └──────────────────┘
                         │  - isAuthenticated│
                         └─────────────────┘
```

## File Changes Summary

### New Files (6)

| File                                              | Purpose                             |
| ------------------------------------------------- | ----------------------------------- |
| `src/features/auth/services/authService.ts`       | Supabase auth API wrapper           |
| `src/features/auth/services/authService.types.ts` | TypeScript types for auth service   |
| `src/features/auth/services/index.ts`             | Barrel export                       |
| `src/providers/auth/AuthProvider.tsx`             | Auth context with onAuthStateChange |
| `src/providers/auth/AuthProvider.types.ts`        | Auth context types                  |
| `src/providers/auth/index.ts`                     | Barrel export                       |

### Modified Files (~8)

| File                                         | Change                                                  |
| -------------------------------------------- | ------------------------------------------------------- |
| `src/features/auth/hooks/useLoginForm.ts`    | Replace direct Supabase call with `useLoginMutation`    |
| `src/features/auth/hooks/useSignupForm.ts`   | Replace direct Supabase call with `useRegisterMutation` |
| `src/features/auth/schemas/signup.schema.ts` | Update password validation (8 chars, letter + number)   |
| `app/_layout.tsx`                            | Wrap with `AuthProvider`, add auth-gated navigation     |
| `src/providers/index.ts`                     | Add auth provider export                                |
| `src/i18n/locales/en.json`                   | Add auth error i18n keys                                |
| `src/i18n/locales/ar.json`                   | Add auth error i18n keys                                |

## Key Design Decisions

1. **Registration uses `register-user` edge function** — not `supabase.auth.signUp`. The edge function creates auth user + profile + role atomically with server-side password validation.

2. **Login uses `supabase.auth.signInWithPassword` directly** — not the `login-user` edge function. Direct auth preserves automatic session management.

3. **AuthProvider manages session state** via `onAuthStateChange`. React Query handles data fetching (profile). This separation keeps auth state reactive to external events (token refresh, expiration).

4. **Navigation gating** uses `isAuthenticated` from AuthProvider + expo-router `Redirect` in root layout.

5. **Password validation aligned** to edge function: min 8 chars, at least 1 letter + 1 number.

## Validation Checklist

After implementation, verify:

- [ ] Registration creates auth user + profile + user_role + user_streaks (via trigger)
- [ ] Login creates session persisted in MMKV
- [ ] App restarts restore session without re-authentication
- [ ] Logout clears session and React Query cache
- [ ] Auth-gated navigation redirects unauthenticated users to login
- [ ] Form validation shows localized error messages
- [ ] Server errors (invalid credentials, email exists) show localized messages
- [ ] Network errors show user-friendly messages
- [ ] No `any` types in new code
- [ ] No inline styles
- [ ] All user-facing strings in i18n locale files
- [ ] `npm run validate` passes (type-check + lint + format)
