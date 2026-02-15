# ⚠️ DEPRECATED - register-user Edge Function

**Status**: Deprecated as of 2026-02-15
**Reason**: Replaced by native Supabase auth with database triggers

## Migration

This edge function has been replaced by:

1. **Native Supabase Auth**: `supabase.auth.signUp()` with user metadata
2. **Database Trigger**: `handle_new_user()` trigger on `auth.users` table

### Before (Old Approach)

```typescript
// Called register-user edge function
const result = await supabase.functions.invoke('register-user', {
  body: {
    email,
    password,
    displayName,
    firstName,
    lastName,
    country,
    dateOfBirth,
    timezone,
  },
});
```

### After (New Approach)

```typescript
// Use native auth.signUp with metadata
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      first_name: firstName,
      last_name: lastName,
      display_name: displayName,
      country,
      date_of_birth: dateOfBirth,
      timezone,
    },
  },
});
```

## What Changed

1. **Profile Creation**: Now handled by database trigger `handle_new_user()`
2. **User Role**: Auto-created by same trigger with default 'user' role
3. **User Streak**: Still auto-created by existing `on_profile_created` trigger
4. **Password Validation**: Moved to client-side (signup schema with zod)

## Benefits

- ✅ Simpler architecture (no edge function overhead)
- ✅ Atomic operations (database triggers ensure consistency)
- ✅ Better error handling (native Supabase auth errors)
- ✅ Reduced latency (one less network call)
- ✅ Standard Supabase flow (easier to maintain)

## Database Triggers

See migration file: `supabase/migrations/20260215_auto_create_profile_and_role.sql`

### Trigger: `handle_new_user()`

- Fires on `auth.users` INSERT
- Creates profile from `raw_user_meta_data`
- Creates user_role with 'user' role
- Uses `ON CONFLICT DO NOTHING` for safety

### Existing Trigger: `on_profile_created`

- Fires on `profiles` INSERT
- Creates user_streaks record
- Already in production

## Cleanup

This directory can be deleted after confirming the new flow works in production.

**Migration Date**: 2026-02-15
**Related Files**:

- `src/features/auth/services/authService.ts`
- `src/features/auth/schemas/signup.schema.ts`
- `supabase/migrations/20260215_auto_create_profile_and_role.sql`
