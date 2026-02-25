# Tasks: Supabase Authentication Refactor

**Input**: Design documents from `/specs/008-supabase-auth-refactor/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/auth-api.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create new directory structure and type definitions needed by all stories

- [x] T001 [P] Create auth service types file `src/features/auth/services/authService.types.ts` with RegisterParams, LoginParams, LoginResponse, UserProfile, and AuthState interfaces per data-model.md TypeScript Type Definitions section
- [x] T002 [P] Create auth service barrel export `src/features/auth/services/index.ts` re-exporting from authService and authService.types
- [x] T003 [P] Create auth provider types file `src/providers/auth/AuthProvider.types.ts` with AuthContextValue interface (user, session, isLoading, isAuthenticated) per contracts/auth-api.md AuthProvider Contract section
- [x] T004 [P] Create auth provider barrel export `src/providers/auth/index.ts` re-exporting AuthProvider and useAuth context hook

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Auth service layer and AuthProvider — MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create auth service `src/features/auth/services/authService.ts` implementing all 5 functions per contracts/auth-api.md: `register(params)` (calls `supabase.functions.invoke('register-user', ...)` then `supabase.auth.signInWithPassword`), `login(params)` (calls `supabase.auth.signInWithPassword`), `logout()` (calls `supabase.auth.signOut`, ignores session_not_found), `getSession()` (calls `supabase.auth.getSession`), `getProfile(userId)` (queries profiles table by user_id). Import supabase client from `src/integrations/supabase.ts`. All functions throw on error.
- [x] T006 Create AuthProvider `src/providers/auth/AuthProvider.tsx` per contracts/auth-api.md AuthProvider Contract: on mount call `authService.getSession()` to restore session then set isLoading=false; subscribe to `supabase.auth.onAuthStateChange()` handling SIGNED_IN/TOKEN_REFRESHED (update user+session) and SIGNED_OUT (clear user+session); compute isAuthenticated = !!session && !!user; export AuthContext and useAuth hook. Unsubscribe on unmount.
- [x] T007 Update providers barrel export `src/providers/index.ts` to add auth provider export (add `export { AuthProvider, useAuth } from './auth'` or similar)
- [x] T008 Add auth error i18n keys to `src/i18n/locales/en.json` under auth namespace: authError.invalidCredentials, authError.emailAlreadyRegistered, authError.networkError, authError.sessionExpired, authError.registrationFailed, authError.logoutFailed, authError.profileLoadFailed, authError.passwordTooShort, authError.passwordNeedsLetterAndNumber, authError.unknownError
- [x] T009 [P] Add auth error i18n keys to `src/i18n/locales/ar.json` matching the same keys added in T008 with Arabic translations

**Checkpoint**: Foundation ready — auth service, AuthProvider, and i18n keys are in place. User story implementation can now begin.

---

## Phase 3: User Story 1 — Email/Password Registration (Priority: P1) 🎯 MVP

**Goal**: Users can create accounts with email/password via the register-user edge function, automatically get profile+streaks+roles created, and are auto-logged in after registration.

**Independent Test**: On the Signup screen, enter valid details (first name, last name, email, password with 8+ chars including letter+number, country, date of birth), submit. Verify: (1) no errors, (2) user is auto-logged in and redirected to main screen, (3) profile exists in Supabase profiles table with correct data.

### Implementation for User Story 1

- [x] T010 [US1] Update signup schema `src/features/auth/schemas/signup.schema.ts` to align password validation with edge function: change minimum from current value to 8 characters, add regex validation requiring at least one letter and one number. Add i18n error messages for the new password rules.
- [x] T011 [US1] Create useRegisterMutation hook in `src/features/auth/hooks/useSignupForm.ts` (refactor existing file): replace direct `supabase.auth.signUp` call with `useMutation` from @tanstack/react-query calling `authService.register(params)`. Remove manual isLoading/setServerError state — use mutation's isPending and error instead. Map the form's SignupFormData (which has confirmPassword, Date for dateOfBirth) to RegisterParams (which has string dateOfBirth in YYYY-MM-DD format). Pass mutation error to form for display.
- [x] T012 [US1] Update SignupForm component `src/features/auth/components/SignupForm/SignupForm.tsx` if needed: ensure it consumes the refactored useSignupForm hook correctly. The hook should expose { form, onSubmit, isPending, serverError } where isPending comes from the mutation and serverError is the mutation error mapped to an i18n string. Remove any direct Supabase imports from the component.

**Checkpoint**: Registration flow works end-to-end. New users can create accounts and are auto-logged in.

---

## Phase 4: User Story 2 — Email/Password Login (Priority: P1) 🎯 MVP

**Goal**: Returning users can log in with email/password, session is created and persisted via MMKV, and profile data is fetched.

**Independent Test**: With an existing account, enter email and password on the Login screen, submit. Verify: (1) no errors, (2) user is redirected to main screen, (3) session exists in MMKV.

### Implementation for User Story 2

- [x] T013 [US2] Refactor useLoginForm hook `src/features/auth/hooks/useLoginForm.ts`: replace direct `supabase.auth.signInWithPassword` call with `useMutation` from @tanstack/react-query calling `authService.login(params)`. Remove manual isLoading/setServerError state — use mutation's isPending and error. Map mutation error to i18n error message string. Hook should expose { form, onSubmit, isPending, serverError }.
- [x] T014 [US2] Update LoginForm component `src/features/auth/components/LoginForm/LoginForm.tsx` if needed: ensure it consumes the refactored useLoginForm hook correctly. Remove any direct Supabase imports from the component. Verify error display uses i18n keys.

**Checkpoint**: Login flow works end-to-end. Returning users can log in with valid credentials and see appropriate errors for invalid ones.

---

## Phase 5: User Story 3 — Persistent Authentication Session (Priority: P2)

**Goal**: App restores session on launch without re-authentication. Auth-gated navigation redirects unauthenticated users to login.

**Independent Test**: Log in, fully close the app (kill process), reopen. Verify: (1) user sees main screen immediately (not login), (2) user data is loaded. Then: log out, reopen app, verify login screen is shown.

### Implementation for User Story 3

- [x] T015 [US3] Wrap root layout with AuthProvider in `app/_layout.tsx`: import AuthProvider from `src/providers/auth`, wrap it around the existing provider stack (inside GestureHandlerRootView, wrapping or alongside QueryProvider). AuthProvider must be inside QueryProvider so hooks inside it can use React Query.
- [x] T016 [US3] Add auth-gated navigation in `app/_layout.tsx`: use `useAuth()` hook to get { isLoading, isAuthenticated }. While isLoading, show a loading/splash indicator. When !isAuthenticated, use expo-router `Redirect` to `/(auth)`. When isAuthenticated, render the normal Stack (which includes `(main)` routes).

**Checkpoint**: Session persists across app restarts. Unauthenticated users are redirected to login. Auth state drives navigation.

---

## Phase 6: User Story 4 — Logout Functionality (Priority: P2)

**Goal**: Logged-in users can sign out, clearing session and React Query cache, and are redirected to login.

**Independent Test**: Log in, trigger logout (from wherever logout button exists). Verify: (1) redirected to login screen, (2) reopening app shows login screen (session cleared), (3) all cached data cleared.

### Implementation for User Story 4

- [x] T017 [US4] Create useLogoutMutation hook: add a `useLogoutMutation` function either in a new file `src/features/auth/hooks/useLogout.ts` or within an existing hooks file. Use `useMutation` calling `authService.logout()`. In `onSuccess`, call `queryClient.clear()` to wipe all React Query cache. Export from hooks barrel.
- [x] T018 [US4] Create auth hooks barrel export `src/features/auth/hooks/index.ts` re-exporting useLoginForm, useSignupForm, useLogoutMutation, useAuth (from providers), and useProfile.

**Checkpoint**: Full logout works. Session is cleared, cache is wiped, user is redirected to login.

---

## Phase 7: User Story 5 — Profile Fetching and Caching (Priority: P3)

**Goal**: After login/registration, user profile data is fetched from profiles table via React Query and cached for app use.

**Independent Test**: Log in, verify profile data (display_name, email, country, etc.) is available in the app. Check React Query devtools or console: profile query key `['profile', userId]` should have data. Verify profile is re-fetched if stale (after 10 minutes).

### Implementation for User Story 5

- [x] T019 [US5] Create useProfile hook `src/features/auth/hooks/useProfile.ts`: use `useQuery` from @tanstack/react-query with queryKey `['profile', userId]`, queryFn calling `authService.getProfile(userId!)`, enabled only when `!!userId`, staleTime of 10 minutes (1000 _ 60 _ 10). Return { profile, isLoading, error }.

**Checkpoint**: Profile data is fetched and cached after login. Available to any component via useProfile hook.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validation, cleanup, and cross-cutting quality checks

- [x] T020 Run `npm run validate` (type-check + lint + format:check) and fix any errors in new/modified files
- [x] T021 Verify no `any` types exist in new code (grep for `: any` in src/features/auth/services/, src/providers/auth/, src/features/auth/hooks/)
- [x] T022 Verify no direct Supabase imports remain in form hooks or UI components (only authService should import supabase client)
- [x] T023 Verify all user-facing strings in new/modified files use i18n keys (no hardcoded English/Arabic strings)
- [ ] T024 Run quickstart.md validation checklist: verify registration creates profile+streaks+roles, login persists session in MMKV, app restart restores session, logout clears session and cache, auth-gated navigation works

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. All T001-T004 are parallel.
- **Foundational (Phase 2)**: T005 depends on T001 (types). T006 depends on T003+T005 (provider types + authService). T007 depends on T006. T008/T009 are parallel with each other and with T005-T007.
- **User Story 1 (Phase 3)**: Depends on T005 (authService) and T008/T009 (i18n keys)
- **User Story 2 (Phase 4)**: Depends on T005 (authService) and T008/T009 (i18n keys). Can run in parallel with US1.
- **User Story 3 (Phase 5)**: Depends on T006 (AuthProvider). Can start after Phase 2.
- **User Story 4 (Phase 6)**: Depends on T005 (authService). Can start after Phase 2.
- **User Story 5 (Phase 7)**: Depends on T005 (authService). Can start after Phase 2.
- **Polish (Phase 8)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 (Registration)**: Independent after Phase 2
- **US2 (Login)**: Independent after Phase 2 (can run parallel with US1)
- **US3 (Session Persistence)**: Depends on AuthProvider (T006) — independent of US1/US2 for implementation, but needs login/register to work for manual testing
- **US4 (Logout)**: Independent after Phase 2 (needs login working for manual testing)
- **US5 (Profile)**: Independent after Phase 2 (needs login working for manual testing)

### Parallel Opportunities

**Phase 1** (all parallel):

```
T001 (types) | T002 (barrel) | T003 (provider types) | T004 (provider barrel)
```

**Phase 2** (partial parallel):

```
T005 (authService) → T006 (AuthProvider) → T007 (providers barrel)
T008 (en.json) | T009 (ar.json)  ← parallel with each other and T005-T007
```

**Phases 3-7** (US1 and US2 parallel, US3-5 parallel after Phase 2):

```
US1: T010 → T011 → T012
US2: T013 → T014
US3: T015 → T016
US4: T017 → T018
US5: T019
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (types + barrels)
2. Complete Phase 2: Foundational (authService + AuthProvider + i18n)
3. Complete Phase 3: User Story 1 — Registration
4. Complete Phase 4: User Story 2 — Login
5. **STOP and VALIDATE**: Test registration + login end-to-end
6. This is the MVP: users can create accounts and log in

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Registration) + US2 (Login) → Test → **MVP!**
3. Add US3 (Session Persistence) → Test → App remembers users
4. Add US4 (Logout) + US5 (Profile) → Test → Full feature complete
5. Polish phase → Ship

### Single Developer Strategy (Recommended)

Execute in sequential priority order:

1. Phase 1 (Setup) — 4 files, all parallel
2. Phase 2 (Foundation) — 5 tasks, partial parallel
3. Phase 3 (US1 Registration) — 3 tasks, sequential
4. Phase 4 (US2 Login) — 2 tasks, sequential
5. Phase 5 (US3 Session) — 2 tasks, sequential
6. Phase 6 (US4 Logout) — 2 tasks, sequential
7. Phase 7 (US5 Profile) — 1 task
8. Phase 8 (Polish) — 5 tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No new npm packages required — all dependencies already installed
- No database changes required — existing schema and triggers are sufficient
- The register-user edge function is already deployed and handles atomic creation
- Supabase client with MMKV adapter is already configured in src/integrations/supabase.ts
- Commit after each completed phase or logical task group
- Stop at any checkpoint to validate the story independently
