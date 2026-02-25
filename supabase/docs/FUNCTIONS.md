# Database Functions & Triggers Reference

> ✅ **Fully Verified** — Signatures from `pg_proc`, bodies from `information_schema.routines`, triggers from `information_schema.triggers`.

---

## All Functions

| Function                        | Arguments                                                                | Returns       | Purpose                                           |
| ------------------------------- | ------------------------------------------------------------------------ | ------------- | ------------------------------------------------- |
| `has_role`                      | `_user_id uuid, _role app_role`                                          | boolean       | RLS helper — check system role                    |
| `is_group_member`               | `_user_id uuid, _group_id uuid`                                          | boolean       | RLS helper — check group membership               |
| `is_group_admin`                | `_user_id uuid, _group_id uuid`                                          | boolean       | RLS helper — check group admin                    |
| `adjust_user_points`            | `p_user_id uuid, p_delta integer`                                        | void          | Update user global points                         |
| `adjust_user_points`            | `p_user_id uuid, p_delta integer, p_update_groups boolean DEFAULT false` | void          | Update user global points + optionally all groups |
| `adjust_user_group_points`      | `p_user_id uuid, p_delta integer`                                        | void          | Update user points across ALL their groups        |
| `adjust_user_group_points`      | `p_user_id uuid, p_group_id uuid, p_delta integer`                       | void          | Update user points in ONE specific group          |
| `cleanup_expired_otps`          | —                                                                        | void          | Delete expired OTP codes                          |
| `update_updated_at_column`      | —                                                                        | trigger       | Auto-update updated_at on row change              |
| `create_user_streak_on_profile` | —                                                                        | trigger       | Auto-create user_streaks on profile insert        |
| `create_group_streak_on_join`   | —                                                                        | trigger       | Auto-create group_streaks on group join           |
| `rls_auto_enable`               | —                                                                        | event_trigger | Auto-enable RLS on new tables in public schema    |

---

## RLS Helper Functions

Used inside RLS policies. All use `SECURITY DEFINER` so they bypass RLS to read the tables they need.

---

### `has_role(_user_id uuid, _role app_role) → boolean`

```sql
SELECT EXISTS (
  SELECT 1
  FROM public.user_roles
  WHERE user_id = _user_id
    AND role = _role
)
```

**Usage in policies:**

```sql
USING (has_role(auth.uid(), 'admin'::app_role))
USING (has_role(auth.uid(), 'moderator'::app_role))
```

---

### `is_group_member(_user_id uuid, _group_id uuid) → boolean`

```sql
SELECT EXISTS (
  SELECT 1
  FROM public.group_members
  WHERE user_id = _user_id
    AND group_id = _group_id
)
```

**Usage in policies:**

```sql
USING (is_group_member(auth.uid(), group_id))
```

---

### `is_group_admin(_user_id uuid, _group_id uuid) → boolean`

```sql
SELECT EXISTS (
  SELECT 1
  FROM public.group_members
  WHERE user_id = _user_id
    AND group_id = _group_id
    AND role = 'admin'
)
```

⚠️ Checks `role = 'admin'`, NOT the legacy `is_admin` column.

**Usage in policies:**

```sql
USING (is_group_admin(auth.uid(), group_id))
USING (is_group_admin(auth.uid(), id))  -- when id is groups.id
```

---

## Business Logic Functions

Call these from Edge Functions or application code to award/deduct points.

---

### `adjust_user_points` — 2 overloads

#### Overload 1: User points only

```sql
adjust_user_points(p_user_id uuid, p_delta integer) → void
```

```sql
UPDATE public.user_streaks
SET
  total_points = GREATEST(0, total_points + p_delta),
  last_completion_date = CASE WHEN p_delta > 0 THEN CURRENT_DATE ELSE last_completion_date END,
  updated_at = now()
WHERE user_id = p_user_id;
```

#### Overload 2: User points + optionally all groups

```sql
adjust_user_points(p_user_id uuid, p_delta integer, p_update_groups boolean DEFAULT false) → void
```

```sql
-- Always updates user_streaks
UPDATE public.user_streaks SET ... WHERE user_id = p_user_id;

-- If p_update_groups = true, ALSO updates ALL group_streaks for this user
UPDATE public.group_streaks SET ... WHERE user_id = p_user_id;
```

⚠️ `p_update_groups` **defaults to false** — you must explicitly pass `true` to sync groups.

**Usage:**

```sql
SELECT adjust_user_points('user-uuid'::uuid, 10);           -- user only
SELECT adjust_user_points('user-uuid'::uuid, 10, true);     -- user + all groups
SELECT adjust_user_points('user-uuid'::uuid, 10, false);    -- user only (explicit)
SELECT adjust_user_points('user-uuid'::uuid, -5);           -- deduct (won't go below 0)
```

---

### `adjust_user_group_points` — 2 overloads

#### Overload 1: All groups the user is a member of

```sql
adjust_user_group_points(p_user_id uuid, p_delta integer) → void
```

```sql
UPDATE public.group_streaks gs
SET
  total_points = GREATEST(0, gs.total_points + p_delta),
  last_completion_date = CASE WHEN p_delta > 0 THEN CURRENT_DATE ELSE gs.last_completion_date END,
  updated_at = now()
WHERE gs.user_id = p_user_id
  AND EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = gs.group_id AND gm.user_id = p_user_id
  );
```

#### Overload 2: One specific group

```sql
adjust_user_group_points(p_user_id uuid, p_group_id uuid, p_delta integer) → void
```

```sql
UPDATE public.group_streaks
SET
  total_points = GREATEST(0, total_points + p_delta),
  last_completion_date = CASE WHEN p_delta > 0 THEN CURRENT_DATE ELSE last_completion_date END,
  updated_at = now()
WHERE user_id = p_user_id AND group_id = p_group_id;
```

**Usage:**

```sql
SELECT adjust_user_group_points('user-uuid'::uuid, 10);                          -- all groups
SELECT adjust_user_group_points('user-uuid'::uuid, 'group-uuid'::uuid, 10);     -- one group
```

---

### Points Function Decision Guide

| Goal                                                 | Function to call                                 |
| ---------------------------------------------------- | ------------------------------------------------ |
| Award points for global activity (user only)         | `adjust_user_points(uid, delta)`                 |
| Award points for global activity (user + all groups) | `adjust_user_points(uid, delta, true)`           |
| Award points for a group-specific activity           | `adjust_user_group_points(uid, group_id, delta)` |
| Sync points to all groups (e.g. after bulk action)   | `adjust_user_group_points(uid, delta)`           |

**Rules that always apply:**

- Points never go below 0 — `GREATEST(0, ...)` is used everywhere
- `last_completion_date` only updates when `p_delta > 0` — deductions don't change it

---

### `cleanup_expired_otps() → void`

```sql
DELETE FROM public.otp_codes WHERE expires_at < now();
```

⚠️ Not scheduled automatically — set up a pg_cron job or call from a scheduled Edge Function.

```sql
SELECT cleanup_expired_otps();
```

---

## Trigger Functions

### `update_updated_at_column() → trigger`

Sets `NEW.updated_at = now()` on every UPDATE. Never set `updated_at` manually.

### `create_user_streak_on_profile() → trigger`

Inserts into `user_streaks` with `ON CONFLICT DO NOTHING` when a profile is created.

### `create_group_streak_on_join() → trigger`

Inserts into `group_streaks` with `ON CONFLICT DO NOTHING` when a user joins a group.

### `rls_auto_enable() → event_trigger`

Fires on `CREATE TABLE` in the `public` schema and automatically runs `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`. You **don't need** to manually enable RLS on new tables.

---

## All 15 Triggers

| Trigger                               | Table               | Timing | Event  |
| ------------------------------------- | ------------------- | ------ | ------ |
| on_profile_created                    | profiles            | AFTER  | INSERT |
| update_profiles_updated_at            | profiles            | BEFORE | UPDATE |
| on_group_member_joined                | group_members       | AFTER  | INSERT |
| update_challenges_updated_at          | challenges          | BEFORE | UPDATE |
| update_fcm_tokens_updated_at          | fcm_tokens          | BEFORE | UPDATE |
| update_group_points_config_updated_at | group_points_config | BEFORE | UPDATE |
| update_group_streaks_updated_at       | group_streaks       | BEFORE | UPDATE |
| update_group_todos_updated_at         | group_todos         | BEFORE | UPDATE |
| update_groups_updated_at              | groups              | BEFORE | UPDATE |
| update_milestone_config_updated_at    | milestone_config    | BEFORE | UPDATE |
| update_points_config_updated_at       | points_config       | BEFORE | UPDATE |
| update_reports_updated_at             | reports             | BEFORE | UPDATE |
| update_todos_updated_at               | todos               | BEFORE | UPDATE |
| update_user_personal_todos_updated_at | user_personal_todos | BEFORE | UPDATE |
| update_user_streaks_updated_at        | user_streaks        | BEFORE | UPDATE |
