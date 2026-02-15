# Migration Guide: Native Auth with Database Triggers

**Date**: 2026-02-15
**Purpose**: Replace `register-user` edge function with native Supabase auth and database triggers

## Overview

This migration moves user registration from a custom edge function to native Supabase auth with automatic profile/role creation via database triggers.

## What Changed

### Before (Edge Function Approach)

```
User Registration Flow:
1. Client → Edge Function (register-user)
2. Edge Function → auth.admin.createUser()
3. Edge Function → Insert profiles
4. Edge Function → Insert user_roles
5. Edge Function → Insert user_streaks
6. Client → auth.signInWithPassword()
```

### After (Native Auth + Triggers)

```
User Registration Flow:
1. Client → auth.signUp() with metadata
2. Database Trigger → Insert profiles (from metadata)
3. Database Trigger → Insert user_roles (default: 'user')
4. Database Trigger (existing) → Insert user_streaks
```

## Benefits

- ✅ **Simpler**: One auth call instead of edge function + login
- ✅ **Faster**: Fewer network round trips
- ✅ **Atomic**: All inserts in single database transaction
- ✅ **Standard**: Uses Supabase's built-in auth flow
- ✅ **Maintainable**: Less custom code to manage

## Migration Steps

### Step 1: Apply Database Migration

Run the migration to create the `handle_new_user()` trigger:

```bash
# Using Supabase CLI
supabase db push

# Or apply manually in Supabase Dashboard
# Copy contents of: supabase/migrations/20260215_auto_create_profile_and_role.sql
```

### Step 2: Verify Trigger Installation

```sql
-- Check trigger exists
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check function exists
SELECT proname, prosrc
FROM pg_proc
WHERE proname = 'handle_new_user';
```

### Step 3: Test New Registration Flow

```typescript
// Test registration with new flow
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'Test1234', // Min 8 chars, letter + number
  options: {
    data: {
      first_name: 'Test',
      last_name: 'User',
      display_name: 'Test User',
      country: 'US',
      date_of_birth: '1990-01-01',
      timezone: 'America/New_York',
    },
  },
});

// Verify profile was created
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', data?.user?.id)
  .single();

// Verify role was created
const { data: role } = await supabase
  .from('user_roles')
  .select('*')
  .eq('user_id', data?.user?.id)
  .single();

// Verify streak was created (by existing trigger)
const { data: streak } = await supabase
  .from('user_streaks')
  .select('*')
  .eq('user_id', data?.user?.id)
  .single();
```

### Step 4: Remove Edge Function (Optional)

Once confirmed working in production:

```bash
# Delete the edge function
rm -rf supabase/functions/register-user
```

## Rollback Plan

If issues arise, you can rollback:

```sql
-- Remove trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remove function
DROP FUNCTION IF EXISTS public.handle_new_user();
```

Then revert `authService.ts` to use the edge function again.

## Password Validation

Password validation moved from edge function to client-side:

- **Minimum**: 8 characters
- **Complexity**: At least one letter AND one number
- **Implementation**: `src/features/auth/schemas/signup.schema.ts`

```typescript
password: z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/\d/, 'Password must contain at least one number');
```

## Metadata Fields

The trigger reads these fields from `auth.users.raw_user_meta_data`:

| Field           | Maps to Profile Column | Required | Default        |
| --------------- | ---------------------- | -------- | -------------- |
| `first_name`    | `first_name`           | No       | NULL           |
| `last_name`     | `last_name`            | No       | NULL           |
| `display_name`  | `display_name`         | No       | Computed       |
| `country`       | `country`              | No       | NULL           |
| `date_of_birth` | `date_of_birth`        | No       | NULL           |
| `timezone`      | `timezone`             | No       | 'UTC'          |
| `is_guest`      | `is_guest`             | No       | false          |
| email           | `email`                | Yes      | From auth.user |

**Display Name Fallback**:

```
1. raw_user_meta_data->>'display_name'
2. first_name + ' ' + last_name
3. email
```

## Error Handling

### Edge Function Errors (Old)

```typescript
if (data?.error) {
  throw new Error(data.error); // Custom error from edge function
}
```

### Native Auth Errors (New)

```typescript
if (error) {
  throw new Error(error.message); // Standard Supabase auth error
}

// Check for duplicate email
if (data?.user && data.user.identities?.length === 0) {
  throw new Error('Email already registered');
}
```

## Testing Checklist

- [ ] Trigger installed successfully
- [ ] New registration creates profile
- [ ] New registration creates user_role with 'user'
- [ ] New registration creates user_streaks (via existing trigger)
- [ ] Email confirmation flow works
- [ ] Duplicate email detection works
- [ ] Password validation enforced on client
- [ ] All metadata fields saved correctly
- [ ] Timezone auto-detection works
- [ ] Display name fallback works

## Related Files

- **Migration**: `supabase/migrations/20260215_auto_create_profile_and_role.sql`
- **Auth Service**: `src/features/auth/services/authService.ts`
- **Password Schema**: `src/features/auth/schemas/signup.schema.ts`
- **Deprecation Notice**: `supabase/functions/register-user/DEPRECATED.md`

## Support

If you encounter issues:

1. Check Supabase logs for trigger errors
2. Verify metadata is correctly formatted
3. Ensure user has email confirmation enabled/disabled as expected
4. Check RLS policies on profiles/user_roles tables

---

**Migration completed**: 2026-02-15
**Breaking changes**: None (backward compatible until edge function removed)
