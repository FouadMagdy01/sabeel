# Database Context for Claude Code

> ✅ **All files fully verified against the live database.**
> Read the relevant file before making any database changes.

---

## File Index

| File           | What's Inside                                                                       | Read When...                                                |
| -------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `SCHEMA.md`    | All 26 tables: exact columns, types, nullability, defaults, unique constraints, FKs | Modifying tables, adding columns, creating tables           |
| `RLS.md`       | All 65 policies with exact USING/WITH CHECK expressions                             | Adding policies, debugging permissions, checking access     |
| `FUNCTIONS.md` | All 12 functions (exact signatures + bodies) + 15 triggers                          | Calling functions, adding functions, understanding triggers |
| `STORAGE.md`   | 2 buckets + 8 storage policies (exact SQL)                                          | Working with file uploads or avatars                        |
| `INDEXES.md`   | All 88 indexes with exact definitions                                               | Adding indexes, understanding query performance             |

---

## Quick Reference

### Tech Stack

- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth — `auth.uid()` = logged-in user UUID
- **RLS:** Enabled on ALL 26 tables (auto-enabled by `rls_auto_enable` event trigger on CREATE TABLE)

### Custom Types

```sql
app_role:      'admin' | 'moderator' | 'user'
report_status: 'pending' | 'in_review' | 'resolved' | 'closed'
todo_type:     'consistent' | 'admin' | 'personal' | 'group'
```

### RLS Helper Functions

```sql
has_role(auth.uid(), 'admin'::app_role)     -- Is user a system admin?
has_role(auth.uid(), 'moderator'::app_role) -- Is user a moderator?
is_group_member(auth.uid(), group_id)        -- Is user in this group?
is_group_admin(auth.uid(), group_id)         -- Is user admin of this group?
```

### Points Functions (4 overloads)

```sql
-- Update user's global points only
adjust_user_points(p_user_id, p_delta)

-- Update user's global points + optionally ALL group points (default false)
adjust_user_points(p_user_id, p_delta, p_update_groups DEFAULT false)

-- Update user's points across ALL groups they're a member of
adjust_user_group_points(p_user_id, p_delta)

-- Update user's points in ONE specific group
adjust_user_group_points(p_user_id, p_group_id, p_delta)
```

---

## Domain Overview

```
👤 USERS & AUTH
   profiles                      ← User profile (trigger auto-creates user_streaks)
   user_roles                    ← System role assignments (admin/moderator/user)
   user_streaks                  ← Global streak + points (auto-created, never insert manually)
   otp_codes                     ← Email verification (no direct access — Edge Functions only)
   fcm_tokens                    ← Push notification tokens

📋 TODOS
   todos                         ← Global todos by admins ⚠️ HAS DATA, default type='personal'
   user_todo_completions         ← UNIQUE(user_id, todo_id, completion_date) — one per day
   user_personal_todos           ← User's own private todos
   user_personal_todo_completions← UNIQUE(user_id, personal_todo_id, completion_date) — one per day

👥 GROUPS
   groups                        ← Group definitions (invite_code auto-generated)
   group_members                 ← Membership (trigger auto-creates group_streaks)
   group_streaks                 ← Per-group streak + points for leaderboards (auto-created)
   group_todos                   ← Group-specific todos (group admin only)
   group_todo_completions        ← UNIQUE(group_id, user_id, todo_id, completion_date) — one per day
   group_points_config           ← Custom points per group

🏆 CHALLENGES
   challenges                    ← Time-limited challenges by admins
   user_challenges               ← User joins challenge (no DELETE = can't un-join)

📣 REPORTS (Support Tickets)
   reports                       ← Support tickets
   report_attachments            ← File attachments (no DELETE = permanent)
   report_messages               ← Chat thread between user ↔ admin/moderator

⚙️ CONFIG
   points_config                 ← Global points rules ⚠️ HAS DATA, default category='prayer'
   milestone_config              ← Streak milestone bonuses
   countries                     ← Country reference data ⚠️ HAS DATA

📖 QURAN
   favorite_suras                ← Bookmarked suras, sura_number 1-114 only
```

---

## Critical Rules

### 🔴 NEVER Do This

```sql
-- Never DROP these (production data exists)
DROP TABLE countries;
DROP TABLE todos;
DROP TABLE points_config;

-- Never set updated_at manually (triggers handle it)
UPDATE profiles SET updated_at = now();  -- ❌

-- Never insert these directly (triggers handle it)
INSERT INTO user_streaks ...;   -- ❌ auto-created when profile is inserted
INSERT INTO group_streaks ...;  -- ❌ auto-created when user joins group

-- Never use is_admin in new code
WHERE is_admin = true;   -- ❌ legacy column
WHERE role = 'admin';    -- ✅ correct
```

### 🟢 Always Do This

```sql
-- Always DROP before CREATE POLICY
DROP POLICY IF EXISTS "name" ON public.table;
CREATE POLICY "name" ...;

-- Always use auth.uid() for identity
USING (auth.uid() = user_id)  -- ✅

-- Be explicit with todo_type (default is 'personal')
INSERT INTO todos (todo_type, ...) VALUES ('consistent', ...);  -- ✅

-- Handle one-per-day unique constraint on completion tables
INSERT INTO user_todo_completions (...)
VALUES (...)
ON CONFLICT (user_id, todo_id, completion_date) DO NOTHING;  -- ✅
```

---

## Known Limitations

| Limitation                                              | Details                                        |
| ------------------------------------------------------- | ---------------------------------------------- |
| No DELETE on `user_challenges`                          | Users cannot un-join a challenge once joined   |
| No DELETE/UPDATE on `report_attachments`                | Attachments are permanent once uploaded        |
| No DELETE/UPDATE storage policy on `report-attachments` | Storage files also permanent                   |
| `cleanup_expired_otps()` not scheduled                  | Must be called manually or via pg_cron         |
| `is_admin` column in `group_members`                    | Legacy, DEFAULT false, ignore in new code      |
| `user_personal_todos` has no user_id index              | Consider adding if querying by user_id heavily |

---

## Common Tasks

### Add a new column

```sql
ALTER TABLE public.table_name
ADD COLUMN IF NOT EXISTS column_name TEXT;
```

### Add a new RLS policy

```sql
DROP POLICY IF EXISTS "policy_name" ON public.table_name;
CREATE POLICY "policy_name"
  ON public.table_name FOR SELECT
  USING (auth.uid() = user_id);
```

### Create a new table

```sql
-- Note: RLS is AUTO-ENABLED by rls_auto_enable event trigger
CREATE TABLE IF NOT EXISTS public.new_table (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT new_table_pkey PRIMARY KEY (id)
);

-- Add updated_at trigger
DROP TRIGGER IF EXISTS update_new_table_updated_at ON public.new_table;
CREATE TRIGGER update_new_table_updated_at
  BEFORE UPDATE ON public.new_table
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add policy
DROP POLICY IF EXISTS "new_table_users_manage_own" ON public.new_table;
CREATE POLICY "new_table_users_manage_own"
  ON public.new_table FOR ALL
  USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_new_table_user_id ON public.new_table(user_id);
```

### Award points

```sql
SELECT adjust_user_points('user-uuid'::uuid, 10);              -- user only
SELECT adjust_user_points('user-uuid'::uuid, 10, true);        -- user + all groups
SELECT adjust_user_group_points('user-uuid'::uuid, 'group-uuid'::uuid, 10); -- one group
SELECT adjust_user_group_points('user-uuid'::uuid, 10);        -- all groups
```

### Insert a completion (handle duplicate gracefully)

```sql
INSERT INTO user_todo_completions (user_id, todo_id, points_earned)
VALUES (auth.uid(), 'todo-uuid', 10)
ON CONFLICT (user_id, todo_id, completion_date) DO NOTHING;
```

### Check policies on a table

```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'your_table';
```

### Check columns on a table

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'your_table'
ORDER BY ordinal_position;
```

---

## Storage Summary

| Bucket               | Public | Path pattern                     | Notes                   |
| -------------------- | ------ | -------------------------------- | ----------------------- |
| `avatars`            | ✅ Yes | `{user_id}/filename`             | Use `getPublicUrl()`    |
| `report-attachments` | ❌ No  | `{user_id}/{report_id}/filename` | Use `createSignedUrl()` |

---

## Naming Conventions

| Object    | Pattern                           | Example                      |
| --------- | --------------------------------- | ---------------------------- |
| Tables    | snake_case plural                 | `group_members`              |
| Columns   | snake_case                        | `created_at`, `user_id`      |
| Policies  | `{table}_{role}_{action}_{scope}` | `reports_users_view_own`     |
| Indexes   | `idx_{table}_{column(s)}`         | `idx_reports_user_id`        |
| Triggers  | `{action}_{table}_{event}`        | `update_profiles_updated_at` |
| Functions | snake_case descriptive            | `adjust_user_points`         |

---

## Verified Database Stats

| Metric           | Count                         | Source                                     |
| ---------------- | ----------------------------- | ------------------------------------------ |
| Tables           | 26                            | information_schema.columns                 |
| Views            | 2                             | information_schema.views                   |
| Policies         | 65                            | pg_policies                                |
| Indexes          | 88                            | pg_indexes                                 |
| Triggers         | 15                            | information_schema.triggers                |
| Functions        | 12 (incl. 2 overloaded pairs) | pg_proc                                    |
| Custom Types     | 3                             | pg_type                                    |
| Storage Buckets  | 2                             | storage.buckets                            |
| Storage Policies | 8                             | storage.objects policies                   |
| Foreign Keys     | 12                            | information_schema.referential_constraints |
