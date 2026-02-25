# Auth Service API Contract

**Feature**: 008-supabase-auth-refactor
**Date**: 2026-02-15

## Service Module: `authService.ts`

Located at `src/features/auth/services/authService.ts`.

All functions are plain async functions. They throw on failure and return typed results on success. They are consumed by React Query mutations/queries in the hook layer.

---

### `register(params: RegisterParams): Promise<void>`

Registers a new user via the `register-user` edge function, then auto-logs in.

**Input**:

```typescript
{
  email: string; // Valid email
  password: string; // Min 8 chars, 1 letter, 1 number
  firstName: string; // Min 2 chars
  lastName: string; // Min 2 chars
  country: string; // Country code (e.g., "sa", "eg")
  dateOfBirth: string; // ISO date: "YYYY-MM-DD"
}
```

**Behavior**:

1. Compute `displayName` = `${firstName} ${lastName}`.
2. Detect `timezone` via `Intl.DateTimeFormat().resolvedOptions().timeZone`.
3. Call `supabase.functions.invoke('register-user', { body: { email, password, displayName, firstName, lastName, country, timezone } })`.
4. If edge function returns error, throw with error message.
5. On success, call `supabase.auth.signInWithPassword({ email, password })` to create local session.
6. If sign-in fails, throw with error message.
7. Return void (session is now stored in MMKV, `onAuthStateChange` fires).

**Errors thrown**:

- `"Email, password, and display name are required"` — missing fields
- `"Password must be at least 8 characters long"` — weak password
- `"Password must contain at least one letter and one number"` — missing complexity
- `"This password is too common..."` — weak password list
- `"User already registered"` — email exists (from Supabase auth)
- Network errors from fetch

---

### `login(params: LoginParams): Promise<LoginResponse>`

Logs in a user with email and password.

**Input**:

```typescript
{
  email: string;
  password: string;
}
```

**Behavior**:

1. Call `supabase.auth.signInWithPassword({ email, password })`.
2. If error, throw with error message.
3. Return `{ user, session }` from Supabase response.

**Errors thrown**:

- `"Invalid login credentials"` — wrong email or password (Supabase standard error)
- Network errors

---

### `logout(): Promise<void>`

Signs out the current user.

**Behavior**:

1. Call `supabase.auth.signOut()`.
2. If error and not `session_not_found`, throw.
3. Return void. (MMKV cleared, `onAuthStateChange` fires `SIGNED_OUT`.)

**Errors thrown**:

- Network errors (non-critical — local session is still cleared by Supabase client)

---

### `getSession(): Promise<{ session: Session | null; user: User | null }>`

Retrieves the current session from Supabase (reads from MMKV).

**Behavior**:

1. Call `supabase.auth.getSession()`.
2. Return `{ session: data.session, user: data.session?.user ?? null }`.

**Used by**: `AuthProvider` on mount for session restoration.

---

### `getProfile(userId: string): Promise<UserProfile>`

Fetches the user profile from the `profiles` table.

**Input**: `userId` — the Supabase auth user ID.

**Behavior**:

1. Call `supabase.from('profiles').select('*').eq('user_id', userId).single()`.
2. If error, throw.
3. Return profile data typed as `UserProfile`.

**Errors thrown**:

- `"No profile found"` — profile doesn't exist (edge case)
- Network errors

---

## Hook Layer Contracts

### `useAuth(): AuthState`

Re-exports the auth context from `AuthProvider`. Returns:

```typescript
{
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
```

---

### `useLoginMutation()`

```typescript
const {
  mutateAsync: login,
  isPending,
  error,
} = useMutation({
  mutationFn: (params: LoginParams) => authService.login(params),
});
```

Returns standard React Query mutation result.

---

### `useRegisterMutation()`

```typescript
const {
  mutateAsync: register,
  isPending,
  error,
} = useMutation({
  mutationFn: (params: RegisterParams) => authService.register(params),
});
```

Returns standard React Query mutation result.

---

### `useLogoutMutation()`

```typescript
const { mutateAsync: logout, isPending } = useMutation({
  mutationFn: () => authService.logout(),
  onSuccess: () => queryClient.clear(),
});
```

Clears all React Query cache on logout.

---

### `useProfile(userId: string | undefined)`

```typescript
const {
  data: profile,
  isLoading,
  error,
} = useQuery({
  queryKey: ['profile', userId],
  queryFn: () => authService.getProfile(userId!),
  enabled: !!userId,
  staleTime: 1000 * 60 * 10, // 10 minutes
});
```

Returns the user profile. Only fetches when userId is available.

---

## AuthProvider Contract

### Props

```typescript
interface AuthProviderProps {
  children: React.ReactNode;
}
```

### Context Value

```typescript
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
```

### Behavior

1. On mount: call `authService.getSession()` to restore session. Set `isLoading: false` after.
2. Subscribe to `supabase.auth.onAuthStateChange()`:
   - `SIGNED_IN` / `TOKEN_REFRESHED`: update `user` + `session`
   - `SIGNED_OUT`: clear `user` + `session`
3. On unmount: unsubscribe from auth state changes.
4. `isAuthenticated` is computed: `!!session && !!user`.
