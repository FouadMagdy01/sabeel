# Row Level Security (RLS) Reference

> ✅ **Verified** — All policies taken directly from `pg_policies` on the live database.

---

## How RLS Works

Every query is automatically filtered by PostgreSQL based on `auth.uid()` (the logged-in user's UUID). Users cannot bypass this — it's enforced at the database level regardless of what the frontend does.

- **`USING`** — filters which existing rows a user can see or modify (SELECT, UPDATE, DELETE)
- **`WITH CHECK`** — validates the new/modified row values (INSERT, UPDATE)
- **Multiple policies are OR'd** — if any policy allows, access is granted
- **Default is DENY** — if no policy matches, access is denied

---

## Helper Functions (Used Inside Policies)

```sql
has_role(auth.uid(), 'admin'::app_role)       -- Is user a system admin/moderator?
is_group_member(auth.uid(), group_id)          -- Is user a member of this group?
is_group_admin(auth.uid(), group_id)           -- Is user an admin of this group?
```

See `FUNCTIONS.md` for full source code.

---

## All Policies (Exact from Live DB)

### `profiles`

| Policy                            | CMD    | USING                                    | WITH CHECK             |
| --------------------------------- | ------ | ---------------------------------------- | ---------------------- |
| profiles_users_view_own           | SELECT | `auth.uid() = user_id`                   | —                      |
| profiles_users_update_own         | UPDATE | `auth.uid() = user_id`                   | —                      |
| profiles_users_insert_own         | INSERT | —                                        | `auth.uid() = user_id` |
| profiles_users_view_group_members | SELECT | User shares a group with profile owner\* | —                      |

\*Exact qual for `profiles_users_view_group_members`:

```sql
EXISTS (
  SELECT 1
  FROM group_members gm1
  JOIN group_members gm2 ON gm1.group_id = gm2.group_id
  WHERE gm1.user_id = auth.uid()
    AND gm2.user_id = profiles.user_id
)
```

**What users can do:**

- ✅ View and edit their own profile
- ✅ View profiles of users in their shared groups
- ❌ View or edit any other profile

---

### `user_roles`

| Policy                       | CMD    | USING                           | WITH CHECK |
| ---------------------------- | ------ | ------------------------------- | ---------- |
| user_roles_users_view_own    | SELECT | `auth.uid() = user_id`          | —          |
| user_roles_admins_manage_all | ALL    | `has_role(auth.uid(), 'admin')` | —          |

**What users can do:**

- ✅ View their own roles
- ❌ Assign or change any roles (admin only)

---

### `user_streaks`

| Policy                        | CMD | USING                  | WITH CHECK |
| ----------------------------- | --- | ---------------------- | ---------- |
| user_streaks_users_manage_own | ALL | `auth.uid() = user_id` | —          |

---

### `user_todo_completions`

| Policy                                 | CMD | USING                  | WITH CHECK |
| -------------------------------------- | --- | ---------------------- | ---------- |
| user_todo_completions_users_manage_own | ALL | `auth.uid() = user_id` | —          |

---

### `user_personal_todos`

| Policy                               | CMD | USING                  | WITH CHECK |
| ------------------------------------ | --- | ---------------------- | ---------- |
| user_personal_todos_users_manage_own | ALL | `auth.uid() = user_id` | —          |

---

### `user_personal_todo_completions`

| Policy                                          | CMD | USING                  | WITH CHECK |
| ----------------------------------------------- | --- | ---------------------- | ---------- |
| user_personal_todo_completions_users_manage_own | ALL | `auth.uid() = user_id` | —          |

---

### `user_challenges`

| Policy                           | CMD    | USING                  | WITH CHECK             |
| -------------------------------- | ------ | ---------------------- | ---------------------- |
| user_challenges_users_view_own   | SELECT | `auth.uid() = user_id` | —                      |
| user_challenges_users_join       | INSERT | —                      | `auth.uid() = user_id` |
| user_challenges_users_update_own | UPDATE | `auth.uid() = user_id` | —                      |

**⚠️ No DELETE policy** — users cannot un-join a challenge once joined.

---

### `todos`

| Policy                             | CMD    | USING                                            | WITH CHECK |
| ---------------------------------- | ------ | ------------------------------------------------ | ---------- |
| todos_anyone_view_consistent_admin | SELECT | `todo_type = ANY (ARRAY['consistent', 'admin'])` | —          |
| todos_admins_manage_all            | ALL    | `has_role(auth.uid(), 'admin')`                  | —          |

**What users can do:**

- ✅ View todos with type `consistent` or `admin`
- ❌ View `personal` or `group` type todos via this table
- ❌ Create, edit, or delete todos (admin only)

---

### `countries`

| Policy                  | CMD    | USING                           | WITH CHECK |
| ----------------------- | ------ | ------------------------------- | ---------- |
| countries_anyone_view   | SELECT | `true`                          | —          |
| countries_admins_manage | ALL    | `has_role(auth.uid(), 'admin')` | —          |

---

### `points_config`

| Policy                      | CMD    | USING                           | WITH CHECK |
| --------------------------- | ------ | ------------------------------- | ---------- |
| points_config_anyone_view   | SELECT | `true`                          | —          |
| points_config_admins_manage | ALL    | `has_role(auth.uid(), 'admin')` | —          |

---

### `milestone_config`

| Policy                         | CMD    | USING                           | WITH CHECK |
| ------------------------------ | ------ | ------------------------------- | ---------- |
| milestone_config_anyone_view   | SELECT | `true`                          | —          |
| milestone_config_admins_manage | ALL    | `has_role(auth.uid(), 'admin')` | —          |

---

### `groups`

| Policy                          | CMD    | USING                             | WITH CHECK                |
| ------------------------------- | ------ | --------------------------------- | ------------------------- |
| groups_anyone_view_public       | SELECT | `is_public = true`                | —                         |
| groups_members_view_own         | SELECT | `is_group_member(auth.uid(), id)` | —                         |
| groups_users_create             | INSERT | —                                 | `auth.uid() = created_by` |
| groups_admins_update            | UPDATE | `is_group_admin(auth.uid(), id)`  | —                         |
| groups_admins_delete            | DELETE | `is_group_admin(auth.uid(), id)`  | —                         |
| groups_system_admins_manage_all | ALL    | `has_role(auth.uid(), 'admin')`   | —                         |

---

### `group_members`

| Policy                      | CMD    | USING                                   | WITH CHECK             |
| --------------------------- | ------ | --------------------------------------- | ---------------------- |
| group_members_members_view  | SELECT | `is_group_member(auth.uid(), group_id)` | —                      |
| group_members_users_join    | INSERT | —                                       | `auth.uid() = user_id` |
| group_members_users_leave   | DELETE | `auth.uid() = user_id`                  | —                      |
| group_members_admins_manage | ALL    | `is_group_admin(auth.uid(), group_id)`  | —                      |

---

### `group_streaks`

| Policy                         | CMD    | USING                                   | WITH CHECK |
| ------------------------------ | ------ | --------------------------------------- | ---------- |
| group_streaks_members_view     | SELECT | `is_group_member(auth.uid(), group_id)` | —          |
| group_streaks_users_manage_own | ALL    | `auth.uid() = user_id`                  | —          |

---

### `group_todos`

| Policy                    | CMD    | USING                                   | WITH CHECK |
| ------------------------- | ------ | --------------------------------------- | ---------- |
| group_todos_members_view  | SELECT | `is_group_member(auth.uid(), group_id)` | —          |
| group_todos_admins_manage | ALL    | `is_group_admin(auth.uid(), group_id)`  | —          |

---

### `group_todo_completions`

| Policy                                  | CMD    | USING                                   | WITH CHECK |
| --------------------------------------- | ------ | --------------------------------------- | ---------- |
| group_todo_completions_members_view     | SELECT | `is_group_member(auth.uid(), group_id)` | —          |
| group_todo_completions_users_manage_own | ALL    | `auth.uid() = user_id`                  | —          |

---

### `group_points_config`

| Policy                            | CMD    | USING                                   | WITH CHECK |
| --------------------------------- | ------ | --------------------------------------- | ---------- |
| group_points_config_members_view  | SELECT | `is_group_member(auth.uid(), group_id)` | —          |
| group_points_config_admins_manage | ALL    | `is_group_admin(auth.uid(), group_id)`  | —          |

---

### `challenges`

| Policy                        | CMD    | USING                           | WITH CHECK |
| ----------------------------- | ------ | ------------------------------- | ---------- |
| challenges_anyone_view_active | SELECT | `is_active = true`              | —          |
| challenges_admins_view_all    | SELECT | `has_role(auth.uid(), 'admin')` | —          |
| challenges_admins_manage      | ALL    | `has_role(auth.uid(), 'admin')` | —          |

---

### `reports`

| Policy                         | CMD    | USING                               | WITH CHECK             |
| ------------------------------ | ------ | ----------------------------------- | ---------------------- |
| reports_users_view_own         | SELECT | `auth.uid() = user_id`              | —                      |
| reports_users_create_own       | INSERT | —                                   | `auth.uid() = user_id` |
| reports_users_update_own_flags | UPDATE | `auth.uid() = user_id`              | `auth.uid() = user_id` |
| reports_admins_view_all        | SELECT | `has_role(auth.uid(), 'admin')`     | —                      |
| reports_admins_update          | UPDATE | `has_role(auth.uid(), 'admin')`     | —                      |
| reports_moderators_view_all    | SELECT | `has_role(auth.uid(), 'moderator')` | —                      |
| reports_moderators_update      | UPDATE | `has_role(auth.uid(), 'moderator')` | —                      |

---

### `report_attachments`

| Policy                                 | CMD    | USING                               | WITH CHECK                   |
| -------------------------------------- | ------ | ----------------------------------- | ---------------------------- |
| report_attachments_users_view_own      | SELECT | Report owned by auth.uid()\*        | —                            |
| report_attachments_users_create_own    | INSERT | —                                   | Report owned by auth.uid()\* |
| report_attachments_admins_view_all     | SELECT | `has_role(auth.uid(), 'admin')`     | —                            |
| report_attachments_moderators_view_all | SELECT | `has_role(auth.uid(), 'moderator')` | —                            |

\*Exact subquery:

```sql
EXISTS (
  SELECT 1 FROM reports
  WHERE reports.id = report_attachments.report_id
    AND reports.user_id = auth.uid()
)
```

**⚠️ No DELETE/UPDATE policy** — attachments cannot be deleted or edited by users.

---

### `report_messages`

| Policy                                   | CMD    | USING                               | WITH CHECK                                                                                     |
| ---------------------------------------- | ------ | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| report_messages_users_view_own           | SELECT | Report owned by auth.uid()          | —                                                                                              |
| report_messages_users_create_own         | INSERT | —                                   | Report owned by auth.uid() AND `is_admin_message = false` AND `sender_id = auth.uid()`         |
| report_messages_users_update_read_status | UPDATE | Report owned by auth.uid()          | —                                                                                              |
| report_messages_admins_view_all          | SELECT | `has_role(auth.uid(), 'admin')`     | —                                                                                              |
| report_messages_admins_create            | INSERT | —                                   | `has_role(auth.uid(), 'admin')` AND `sender_id = auth.uid()` AND `is_admin_message = true`     |
| report_messages_admins_update            | UPDATE | `has_role(auth.uid(), 'admin')`     | —                                                                                              |
| report_messages_moderators_view_all      | SELECT | `has_role(auth.uid(), 'moderator')` | —                                                                                              |
| report_messages_moderators_create        | INSERT | —                                   | `has_role(auth.uid(), 'moderator')` AND `sender_id = auth.uid()` AND `is_admin_message = true` |
| report_messages_moderators_update        | UPDATE | `has_role(auth.uid(), 'moderator')` | —                                                                                              |

**Critical rules enforced by DB:**

- Users can only send messages with `is_admin_message = false`
- Admins/moderators can only send with `is_admin_message = true`
- `sender_id` must always equal `auth.uid()` — cannot impersonate anyone

---

### `fcm_tokens`

| Policy                      | CMD | USING                  | WITH CHECK |
| --------------------------- | --- | ---------------------- | ---------- |
| fcm_tokens_users_manage_own | ALL | `auth.uid() = user_id` | —          |

---

### `favorite_suras`

| Policy                          | CMD | USING                  | WITH CHECK |
| ------------------------------- | --- | ---------------------- | ---------- |
| favorite_suras_users_manage_own | ALL | `auth.uid() = user_id` | —          |

---

### `otp_codes`

| Policy                     | CMD | USING   | WITH CHECK |
| -------------------------- | --- | ------- | ---------- |
| otp_codes_no_direct_access | ALL | `false` | —          |

Zero direct access. All OTP operations must go through Edge Functions.

---

## Authorization Matrix

| Action                           | User     | Group Member | Group Admin | Moderator | Admin |
| -------------------------------- | -------- | ------------ | ----------- | --------- | ----- |
| View own profile                 | ✅       | ✅           | ✅          | ✅        | ✅    |
| Edit own profile                 | ✅       | ✅           | ✅          | ✅        | ✅    |
| View group member profiles       | ❌       | ✅           | ✅          | ❌        | ✅    |
| Complete own todo                | ✅       | ✅           | ✅          | ✅        | ✅    |
| Complete another user's todo     | ❌       | ❌           | ❌          | ❌        | ❌    |
| View public groups               | ✅       | ✅           | ✅          | ✅        | ✅    |
| View private group               | ❌       | ✅           | ✅          | ❌        | ✅    |
| Create group                     | ✅       | ✅           | ✅          | ✅        | ✅    |
| Edit/delete group                | ❌       | ❌           | ✅          | ❌        | ✅    |
| Create/edit group todos          | ❌       | ❌           | ✅          | ❌        | ✅    |
| View group streaks (leaderboard) | ❌       | ✅           | ✅          | ❌        | ✅    |
| View own reports                 | ✅       | ✅           | ✅          | ✅        | ✅    |
| View all reports                 | ❌       | ❌           | ❌          | ✅        | ✅    |
| Update report status             | ❌       | ❌           | ❌          | ✅        | ✅    |
| Send user message on report      | ✅ (own) | ✅ (own)     | ✅ (own)    | ❌        | ❌    |
| Send admin message on report     | ❌       | ❌           | ❌          | ✅        | ✅    |
| Un-join a challenge              | ❌       | ❌           | ❌          | ❌        | ❌    |
| Manage points/milestones config  | ❌       | ❌           | ❌          | ❌        | ✅    |
| Assign system roles              | ❌       | ❌           | ❌          | ❌        | ✅    |

---

## Adding New Policies

```sql
-- Always drop first
DROP POLICY IF EXISTS "policy_name" ON public.table_name;

CREATE POLICY "policy_name"
  ON public.table_name FOR SELECT | INSERT | UPDATE | DELETE | ALL
  USING (...)        -- existing rows filter
  WITH CHECK (...);  -- new row validation
```

**Naming convention:** `{table}_{role}_{action}_{scope}`

Examples: `reports_users_view_own`, `groups_admins_delete`, `todos_admins_manage_all`
