# Research: Supabase Authentication Refactor

**Feature**: 008-supabase-auth-refactor
**Date**: 2026-02-15

## Research Findings

### R1: Registration Flow — Client-Side vs Edge Function

**Decision**: Use the `register-user` edge function for registration (not `supabase.auth.signUp` directly).

**Rationale**:

- The existing `register-user` edge function (`supabase/functions/register-user/index.ts`) uses `auth.admin.createUser` with `email_confirm: true`, meaning the user is immediately confirmed and can log in without email verification.
- It handles server-side password validation (min 8 chars, letter + number, weak password check).
- It atomically creates the auth user + profile + user_streaks (upsert) + user_roles in a single request.
- The current `useSignupForm.ts` uses `supabase.auth.signUp` directly, which would require email confirmation flow or separate profile creation steps.
- Using the edge function avoids the need for the client to manage multi-step registration (create auth → create profile → create role) and ensures server-side validation.

**Alternatives considered**:

- `supabase.auth.signUp` directly: Would require disabling email confirmation in Supabase dashboard, or implementing OTP flow. Also requires separate profile/role creation from client, which is fragile.
- OTP-based flow (`send-otp` + `signup-with-otp`): More complex, requires email service integration. The `send-otp` function has a TODO for email service. Not needed for MVP.

**Impact on spec**: Spec says "minimum 6 characters" for password — the edge function enforces 8 characters with letter+number. We will align client-side validation to match (8 chars, letter + number).

---

### R2: Login Flow — Direct Auth vs Edge Function

**Decision**: Use `supabase.auth.signInWithPassword` directly from the client (not the `login-user` edge function).

**Rationale**:

- Direct `signInWithPassword` automatically creates and persists the session via the Supabase client's MMKV storage adapter.
- The `login-user` edge function returns raw tokens that would need manual session management — unnecessary complexity.
- The existing Supabase client in `src/integrations/supabase.ts` is already configured with `persistSession: true` and `autoRefreshToken: true`.
- Direct auth means the Supabase client handles token refresh, session persistence, and `onAuthStateChange` events automatically.

**Alternatives considered**:

- `login-user` edge function: Would require manually managing session tokens, storing them, and handling refresh. Adds complexity with no benefit.
- OTP-based login: Out of scope per spec.

---

### R3: React Query Pattern for Auth Mutations

**Decision**: Use `useMutation` from React Query for login and register operations. Use `useQuery` for profile fetching. Do NOT use React Query for session state — use Supabase's `onAuthStateChange` listener in a dedicated `AuthProvider`.

**Rationale**:

- Auth mutations (login, register, logout) are one-shot operations with side effects — `useMutation` is the natural fit. It provides `isPending`, `isError`, `error`, `mutateAsync` which replace manual `isLoading`/`setServerError` state.
- Profile data is a cacheable query that should be fetched when the user logs in and invalidated on logout — `useQuery` is ideal.
- Session state (current user, isAuthenticated) should NOT be managed by React Query because:
  - Supabase's `onAuthStateChange` is the authoritative source of truth for auth state
  - Session can change from external events (token refresh, expiration) that React Query wouldn't capture
  - A context provider with `onAuthStateChange` is simpler and more reliable

**Alternatives considered**:

- React Query for everything (including session): Would require polling or custom subscriptions, adds complexity.
- Zustand/Jotai for auth state: Adds a new dependency, violates Constitution Principle V (YAGNI).
- No provider, just hooks: Would result in multiple Supabase auth listeners and duplicated logic.

---

### R4: Session Persistence and Restoration

**Decision**: Rely on Supabase's built-in session persistence via the MMKV storage adapter already configured in `src/integrations/supabase.ts`.

**Rationale**:

- The existing Supabase client is configured with `persistSession: true` and a custom MMKV storage adapter (`supabaseStorage` with id `'supabase-auth'`).
- On app launch, `supabase.auth.getSession()` restores the session from MMKV.
- `autoRefreshToken: true` handles token refresh automatically.
- `onAuthStateChange` fires with `SIGNED_IN` or `TOKEN_REFRESHED` events on restore.

**Alternatives considered**:

- Manual session storage: Unnecessary — Supabase already handles this.
- AsyncStorage: MMKV is already configured and significantly faster.

---

### R5: Auth-Gated Navigation

**Decision**: The `AuthProvider` exposes `{ user, session, isLoading }`. The root layout uses this to conditionally render auth or main routes via expo-router's `Redirect` component.

**Rationale**:

- Expo Router's `Redirect` component is the idiomatic way to handle auth-gated navigation.
- The `AuthProvider` wraps the entire app (above `Stack`), so all routes can access auth state.
- During initial load (`isLoading: true`), show a splash/loading screen to prevent flash of wrong screen.

**Alternatives considered**:

- `useEffect` + `router.replace` in each screen: Scattered logic, easy to forget on new screens.
- Middleware/interceptor pattern: Over-engineered for a mobile app with 2 auth screens.

---

### R6: Profile Fetching Strategy

**Decision**: Fetch profile data via a `useProfile` hook that uses React Query `useQuery`. Query is enabled only when `user` is available from `AuthProvider`. Profile is fetched from `profiles` table using `user.id`.

**Rationale**:

- Profile data is a read-heavy, cacheable resource — perfect for `useQuery`.
- Query key: `['profile', userId]` — automatically invalidated when userId changes.
- `enabled: !!user?.id` prevents fetching when not authenticated.
- On logout, invalidate the profile query to clear cached data.

**Alternatives considered**:

- Fetch profile inside the auth flow: Couples profile fetching to login/register, makes it harder to refresh independently.
- Store profile in AuthProvider: Mixes concerns — auth state and user data are different concerns with different refresh cycles.

---

### R7: Error Handling Strategy

**Decision**: Auth service functions throw typed errors. React Query mutation `onError` callbacks map errors to i18n keys. Form hooks expose `error` from the mutation.

**Rationale**:

- React Query's `useMutation` already provides `error` state — no need for manual `useState` for server errors.
- Error mapping stays in the hook layer (close to the UI) where `useTranslation` is available.
- The service layer throws raw errors (from Supabase or edge functions) — no i18n coupling in the service.

**Alternatives considered**:

- Global error handler only: Too coarse — auth errors need specific messaging (invalid credentials vs network error vs email exists).
- Error codes enum: Over-engineering for 4-5 error cases.

---

### R8: Password Validation Alignment

**Decision**: Update client-side zod schema to match edge function requirements: min 8 characters, at least one letter and one number.

**Rationale**:

- The `register-user` edge function validates: min 8 chars, has letter, has number, not in weak password list.
- The current client schema requires min 8 chars only (no letter/number check).
- Client-side validation should be at least as strict as server-side to provide instant feedback.
- The spec said 6 chars but the actual server requires 8 — align to reality.

**Alternatives considered**:

- Keep client at 6, let server reject: Bad UX — user fills form only to get server error.
- Add weak password check to client: Over-engineering — the server already blocks weak passwords.

---

### R9: Countries Data Source

**Decision**: Keep using the hardcoded `COUNTRIES` array from `src/features/auth/data/countries.ts` for now.

**Rationale**:

- The `countries` table exists in Supabase but fetching it adds a network dependency to the registration form.
- The hardcoded list has 30 countries covering major Islamic + Western nations.
- A future enhancement can switch to fetching from Supabase, but this is out of scope for auth refactor.

**Alternatives considered**:

- Fetch from `countries` table via React Query: Adds network dependency and loading state to registration form. Out of scope.
- Use `get-countries` edge function: Same issue, adds complexity.

## Unknowns Resolved

All technical unknowns from the Technical Context have been resolved:

| Unknown                                  | Resolution                                                      |
| ---------------------------------------- | --------------------------------------------------------------- |
| Registration approach (client vs server) | Edge function `register-user` (R1)                              |
| Login approach (client vs edge function) | Direct `signInWithPassword` (R2)                                |
| React Query pattern for auth             | Mutations for actions, queries for data, context for state (R3) |
| Session persistence                      | Built-in Supabase MMKV adapter (R4)                             |
| Navigation gating                        | AuthProvider + Redirect (R5)                                    |
| Profile fetching                         | React Query useQuery with userId key (R6)                       |
| Error handling                           | Typed throws in service, i18n mapping in hooks (R7)             |
| Password validation                      | Align client to server: 8 chars, letter + number (R8)           |
| Countries data                           | Hardcoded array, no changes (R9)                                |
