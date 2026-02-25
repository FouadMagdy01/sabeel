# Database Schema Reference

> ✅ **Fully Verified** — Columns from `information_schema.columns`, constraints from `pg_indexes`, foreign keys from `information_schema.referential_constraints`.

---

## Custom Types (Enums)

```sql
app_role:      'admin' | 'moderator' | 'user'
report_status: 'pending' | 'in_review' | 'resolved' | 'closed'
todo_type:     'consistent' | 'admin' | 'personal' | 'group'
```

---

## Tables

### 👤 USER & AUTH DOMAIN

---

#### `profiles`

| Column           | Type        | Nullable | Default           |
| ---------------- | ----------- | -------- | ----------------- |
| id               | uuid        | NO       | gen_random_uuid() |
| user_id          | uuid        | NO       | —                 |
| first_name       | text        | YES      | —                 |
| last_name        | text        | YES      | —                 |
| display_name     | text        | NO       | —                 |
| email            | text        | YES      | —                 |
| country          | text        | YES      | —                 |
| age              | integer     | YES      | —                 |
| date_of_birth    | date        | YES      | —                 |
| timezone         | text        | YES      | 'UTC'             |
| avatar_url       | text        | YES      | —                 |
| is_guest         | boolean     | YES      | false             |
| guest_created_at | timestamptz | YES      | —                 |
| created_at       | timestamptz | NO       | now()             |
| updated_at       | timestamptz | NO       | now()             |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(user_id) — `profiles_user_id_key`
- UNIQUE(email) — `profiles_email_unique` ⚠️ email must be unique across all profiles

**Trigger:** `on_profile_created` → auto-creates `user_streaks` row on INSERT. Never insert user_streaks manually.

---

#### `user_roles`

| Column     | Type        | Nullable | Default           |
| ---------- | ----------- | -------- | ----------------- |
| id         | uuid        | NO       | gen_random_uuid() |
| user_id    | uuid        | NO       | —                 |
| role       | app_role    | NO       | —                 |
| created_at | timestamptz | NO       | now()             |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(user_id, role) — `user_roles_user_id_role_key`

---

#### `user_streaks`

| Column               | Type        | Nullable | Default                            |
| -------------------- | ----------- | -------- | ---------------------------------- |
| id                   | uuid        | NO       | gen_random_uuid()                  |
| user_id              | uuid        | NO       | —                                  |
| current_streak       | integer     | NO       | 0                                  |
| longest_streak       | integer     | NO       | 0                                  |
| last_completion_date | date        | YES      | —                                  |
| total_points         | integer     | NO       | 0                                  |
| streak_requirements  | jsonb       | YES      | `{"azkar": true, "prayers": true}` |
| created_at           | timestamptz | NO       | now()                              |
| updated_at           | timestamptz | NO       | now()                              |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(user_id) — `user_streaks_user_id_key`

**⚠️ Auto-created by trigger** when profile is inserted. Never insert manually.

---

#### `otp_codes`

| Column          | Type        | Nullable | Default           |
| --------------- | ----------- | -------- | ----------------- |
| id              | uuid        | NO       | gen_random_uuid() |
| email           | text        | NO       | —                 |
| code            | text        | NO       | —                 |
| type            | text        | NO       | —                 |
| expires_at      | timestamptz | NO       | —                 |
| verified        | boolean     | NO       | false             |
| created_at      | timestamptz | NO       | now()             |
| new_email       | text        | YES      | —                 |
| failed_attempts | integer     | NO       | 0                 |

**Indexes:** `(email, type)`, `(expires_at)` — for lookup and cleanup

**RLS:** `USING (false)` — zero direct access. Edge Functions only.

---

#### `fcm_tokens`

| Column      | Type        | Nullable | Default           |
| ----------- | ----------- | -------- | ----------------- |
| id          | uuid        | NO       | gen_random_uuid() |
| user_id     | uuid        | NO       | —                 |
| token       | text        | NO       | —                 |
| device_info | jsonb       | YES      | —                 |
| created_at  | timestamptz | NO       | now()             |
| updated_at  | timestamptz | NO       | now()             |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(token) — `fcm_tokens_token_key` ⚠️ unique on token alone, NOT (user_id, token)

---

### 📋 TODOS DOMAIN

---

#### `todos`

⚠️ **Has production data — never DROP**

| Column            | Type        | Nullable | Default           |
| ----------------- | ----------- | -------- | ----------------- |
| id                | uuid        | NO       | gen_random_uuid() |
| title             | text        | NO       | —                 |
| description       | text        | YES      | —                 |
| todo_type         | todo_type   | NO       | **'personal'**    |
| points_config_key | text        | YES      | —                 |
| custom_points     | integer     | YES      | —                 |
| is_active         | boolean     | YES      | true              |
| created_by        | uuid        | YES      | —                 |
| created_at        | timestamptz | NO       | now()             |
| updated_at        | timestamptz | NO       | now()             |
| title_ar          | text        | YES      | —                 |
| description_ar    | text        | YES      | —                 |

**FK:** `points_config_key` → `points_config.key` NO ACTION

⚠️ Default `todo_type` is `'personal'` — be explicit when inserting `consistent` or `admin` todos.

---

#### `user_todo_completions`

| Column          | Type        | Nullable | Default           |
| --------------- | ----------- | -------- | ----------------- |
| id              | uuid        | NO       | gen_random_uuid() |
| user_id         | uuid        | NO       | —                 |
| todo_id         | uuid        | NO       | —                 |
| completion_date | date        | NO       | CURRENT_DATE      |
| points_earned   | integer     | NO       | 0                 |
| completed_at    | timestamptz | NO       | now()             |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(user_id, todo_id, completion_date) — `user_todo_completions_user_id_todo_id_completion_date_key`
  ⚠️ A user can only complete the same todo once per day

**FK:** `todo_id` → `todos.id` CASCADE

---

#### `user_personal_todos`

| Column      | Type        | Nullable | Default           |
| ----------- | ----------- | -------- | ----------------- |
| id          | uuid        | NO       | gen_random_uuid() |
| user_id     | uuid        | NO       | —                 |
| title       | text        | NO       | —                 |
| description | text        | YES      | —                 |
| is_active   | boolean     | YES      | true              |
| created_at  | timestamptz | NO       | now()             |
| updated_at  | timestamptz | NO       | now()             |

---

#### `user_personal_todo_completions`

| Column           | Type        | Nullable | Default           |
| ---------------- | ----------- | -------- | ----------------- |
| id               | uuid        | NO       | gen_random_uuid() |
| user_id          | uuid        | NO       | —                 |
| personal_todo_id | uuid        | NO       | —                 |
| completion_date  | date        | NO       | CURRENT_DATE      |
| completed_at     | timestamptz | NO       | now()             |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(user_id, personal_todo_id, completion_date) — `user_personal_todo_completion_user_id_personal_todo_id_comp_key`
  ⚠️ A user can only complete the same personal todo once per day

**FK:** `personal_todo_id` → `user_personal_todos.id` CASCADE

---

### 👥 GROUPS DOMAIN

---

#### `groups`

| Column      | Type        | Nullable | Default                            |
| ----------- | ----------- | -------- | ---------------------------------- |
| id          | uuid        | NO       | gen_random_uuid()                  |
| name        | text        | NO       | —                                  |
| description | text        | YES      | —                                  |
| invite_code | text        | YES      | encode(gen_random_bytes(6), 'hex') |
| is_public   | boolean     | YES      | false                              |
| created_by  | uuid        | NO       | —                                  |
| created_at  | timestamptz | NO       | now()                              |
| updated_at  | timestamptz | NO       | now()                              |
| country     | text        | YES      | —                                  |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(invite_code) — `groups_invite_code_key`

---

#### `group_members`

| Column    | Type        | Nullable | Default           |
| --------- | ----------- | -------- | ----------------- |
| id        | uuid        | NO       | gen_random_uuid() |
| group_id  | uuid        | NO       | —                 |
| user_id   | uuid        | NO       | —                 |
| is_admin  | boolean     | YES      | false             |
| joined_at | timestamptz | NO       | now()             |
| role      | text        | NO       | 'member'          |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(group_id, user_id) — `group_members_group_id_user_id_key`

**FK:** `group_id` → `groups.id` CASCADE

**Trigger:** `on_group_member_joined` → auto-creates `group_streaks` row on INSERT.

⚠️ `is_admin` is legacy (DEFAULT false). Use `role = 'admin'` in all new code.

---

#### `group_streaks`

| Column               | Type        | Nullable | Default                 |
| -------------------- | ----------- | -------- | ----------------------- |
| id                   | uuid        | NO       | gen_random_uuid()       |
| group_id             | uuid        | NO       | —                       |
| user_id              | uuid        | NO       | —                       |
| current_streak       | integer     | NO       | 0                       |
| longest_streak       | integer     | NO       | 0                       |
| last_completion_date | date        | YES      | —                       |
| total_points         | integer     | NO       | 0                       |
| streak_requirements  | jsonb       | YES      | `{"group_todos": true}` |
| created_at           | timestamptz | NO       | now()                   |
| updated_at           | timestamptz | NO       | now()                   |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(group_id, user_id) — `group_streaks_group_id_user_id_key`

**FK:** `group_id` → `groups.id` CASCADE

⚠️ Auto-created by trigger when user joins a group. Never insert manually.

---

#### `group_todos`

| Column         | Type        | Nullable | Default           |
| -------------- | ----------- | -------- | ----------------- |
| id             | uuid        | NO       | gen_random_uuid() |
| group_id       | uuid        | NO       | —                 |
| title          | text        | NO       | —                 |
| description    | text        | YES      | —                 |
| custom_points  | integer     | NO       | 0                 |
| is_active      | boolean     | YES      | true              |
| created_by     | uuid        | YES      | —                 |
| created_at     | timestamptz | NO       | now()             |
| updated_at     | timestamptz | NO       | now()             |
| title_ar       | text        | YES      | —                 |
| description_ar | text        | YES      | —                 |

**FK:** `group_id` → `groups.id` CASCADE

---

#### `group_todo_completions`

| Column          | Type        | Nullable | Default           |
| --------------- | ----------- | -------- | ----------------- |
| id              | uuid        | NO       | gen_random_uuid() |
| group_id        | uuid        | NO       | —                 |
| user_id         | uuid        | NO       | —                 |
| todo_id         | uuid        | NO       | —                 |
| completion_date | date        | NO       | CURRENT_DATE      |
| points_earned   | integer     | NO       | 0                 |
| completed_at    | timestamptz | NO       | now()             |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(group_id, user_id, todo_id, completion_date) — `group_todo_completions_group_id_user_id_todo_id_completion__key`
  ⚠️ One completion per user per todo per day per group

**FK:** `group_id` → `groups.id` CASCADE, `todo_id` → `group_todos.id` CASCADE

---

#### `group_points_config`

| Column     | Type        | Nullable | Default           |
| ---------- | ----------- | -------- | ----------------- |
| id         | uuid        | NO       | gen_random_uuid() |
| group_id   | uuid        | NO       | —                 |
| key        | text        | NO       | —                 |
| points     | integer     | NO       | 0                 |
| created_at | timestamptz | NO       | now()             |
| updated_at | timestamptz | NO       | now()             |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(group_id, key) — `group_points_config_group_id_key_key`

**FK:** `group_id` → `groups.id` CASCADE

---

### 🏆 CHALLENGES DOMAIN

---

#### `challenges`

| Column         | Type        | Nullable | Default           |
| -------------- | ----------- | -------- | ----------------- |
| id             | uuid        | NO       | gen_random_uuid() |
| title          | text        | NO       | —                 |
| description    | text        | YES      | —                 |
| points         | integer     | NO       | 0                 |
| start_date     | date        | NO       | —                 |
| end_date       | date        | NO       | —                 |
| is_active      | boolean     | YES      | true              |
| created_by     | uuid        | YES      | —                 |
| created_at     | timestamptz | NO       | now()             |
| updated_at     | timestamptz | NO       | now()             |
| title_ar       | text        | YES      | —                 |
| description_ar | text        | YES      | —                 |

---

#### `user_challenges`

| Column       | Type        | Nullable | Default           |
| ------------ | ----------- | -------- | ----------------- |
| id           | uuid        | NO       | gen_random_uuid() |
| user_id      | uuid        | NO       | —                 |
| challenge_id | uuid        | NO       | —                 |
| completed    | boolean     | YES      | false             |
| completed_at | timestamptz | YES      | —                 |
| created_at   | timestamptz | NO       | now()             |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(user_id, challenge_id) — `user_challenges_user_id_challenge_id_key`

**FK:** `challenge_id` → `challenges.id` CASCADE

⚠️ No `joined_at` column — use `created_at` for join time.
⚠️ No DELETE policy — users cannot un-join a challenge.

---

### 📣 REPORTS DOMAIN

---

#### `reports`

| Column                    | Type          | Nullable | Default           |
| ------------------------- | ------------- | -------- | ----------------- |
| id                        | uuid          | NO       | gen_random_uuid() |
| user_id                   | uuid          | NO       | —                 |
| title                     | text          | NO       | —                 |
| description               | text          | NO       | —                 |
| status                    | report_status | NO       | 'pending'         |
| admin_response            | text          | YES      | —                 |
| responded_by              | uuid          | YES      | —                 |
| responded_at              | timestamptz   | YES      | —                 |
| created_at                | timestamptz   | NO       | now()             |
| updated_at                | timestamptz   | NO       | now()             |
| has_unread_admin_messages | boolean       | YES      | false             |
| has_unread_user_messages  | boolean       | YES      | false             |
| has_unread_status_update  | boolean       | YES      | false             |
| last_status_before_update | text          | YES      | —                 |

---

#### `report_attachments`

| Column     | Type        | Nullable | Default           |
| ---------- | ----------- | -------- | ----------------- |
| id         | uuid        | NO       | gen_random_uuid() |
| report_id  | uuid        | NO       | —                 |
| file_url   | text        | NO       | —                 |
| file_name  | text        | YES      | —                 |
| file_type  | text        | YES      | —                 |
| created_at | timestamptz | NO       | now()             |

**FK:** `report_id` → `reports.id` CASCADE

⚠️ No UPDATE/DELETE policy — attachments are permanent once uploaded.

---

#### `report_messages`

| Column           | Type        | Nullable | Default           |
| ---------------- | ----------- | -------- | ----------------- |
| id               | uuid        | NO       | gen_random_uuid() |
| report_id        | uuid        | NO       | —                 |
| sender_id        | uuid        | NO       | —                 |
| message          | text        | NO       | —                 |
| is_admin_message | boolean     | NO       | false             |
| is_read          | boolean     | NO       | false             |
| created_at       | timestamptz | NO       | now()             |

**FK:** `report_id` → `reports.id` CASCADE

---

### ⚙️ CONFIG DOMAIN

---

#### `points_config`

⚠️ **Has production data — never DROP**

| Column     | Type        | Nullable | Default           |
| ---------- | ----------- | -------- | ----------------- |
| id         | uuid        | NO       | gen_random_uuid() |
| key        | text        | NO       | —                 |
| label      | text        | NO       | —                 |
| points     | integer     | NO       | 0                 |
| category   | text        | NO       | **'prayer'**      |
| created_at | timestamptz | NO       | now()             |
| updated_at | timestamptz | NO       | now()             |
| label_ar   | text        | YES      | —                 |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(key) — `points_config_key_key`

---

#### `milestone_config`

| Column       | Type        | Nullable | Default           |
| ------------ | ----------- | -------- | ----------------- |
| id           | uuid        | NO       | gen_random_uuid() |
| days         | integer     | NO       | —                 |
| bonus_points | integer     | NO       | 0                 |
| label        | text        | YES      | —                 |
| created_at   | timestamptz | NO       | now()             |
| updated_at   | timestamptz | NO       | now()             |
| label_ar     | text        | YES      | —                 |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(days) — `milestone_config_days_key`

---

#### `countries`

⚠️ **Has production data — never DROP**

| Column     | Type        | Nullable | Default           |
| ---------- | ----------- | -------- | ----------------- |
| id         | uuid        | NO       | gen_random_uuid() |
| code       | text        | NO       | —                 |
| name_en    | text        | NO       | —                 |
| name_ar    | text        | NO       | —                 |
| flag       | text        | NO       | —                 |
| created_at | timestamptz | NO       | now()             |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(code) — `countries_code_key`

---

### 📖 QURAN DOMAIN

---

#### `favorite_suras`

| Column       | Type        | Nullable | Default           |
| ------------ | ----------- | -------- | ----------------- |
| id           | uuid        | NO       | gen_random_uuid() |
| user_id      | uuid        | NO       | —                 |
| sura_number  | integer     | NO       | —                 |
| api_url      | text        | YES      | —                 |
| arabic_name  | text        | YES      | —                 |
| english_name | text        | YES      | —                 |
| created_at   | timestamptz | NO       | now()             |

**Unique Constraints:**

- UNIQUE(id) — PK
- UNIQUE(user_id, sura_number) — `favorite_suras_user_id_sura_number_key`

**CHECK:** sura_number BETWEEN 1 AND 114

---

## Views

### `public_challenges`

```sql
SELECT id, title, title_ar, description, description_ar,
       start_date, end_date, points, is_active, created_at, updated_at
FROM challenges WHERE is_active = true;
```

### `public_profiles`

```sql
SELECT user_id, display_name, avatar_url, country
FROM profiles;
```

---

## Complete Foreign Key Map

```
group_members.group_id                           → groups.id                   CASCADE
group_points_config.group_id                     → groups.id                   CASCADE
group_streaks.group_id                           → groups.id                   CASCADE
group_todo_completions.group_id                  → groups.id                   CASCADE
group_todo_completions.todo_id                   → group_todos.id              CASCADE
group_todos.group_id                             → groups.id                   CASCADE
report_attachments.report_id                     → reports.id                  CASCADE
report_messages.report_id                        → reports.id                  CASCADE
todos.points_config_key                          → points_config.key           NO ACTION
user_challenges.challenge_id                     → challenges.id               CASCADE
user_personal_todo_completions.personal_todo_id  → user_personal_todos.id      CASCADE
user_todo_completions.todo_id                    → todos.id                    CASCADE
```

---

## "One Per Day" Unique Constraints

These three tables prevent duplicate completions on the same day:

```sql
user_todo_completions:          UNIQUE(user_id, todo_id, completion_date)
user_personal_todo_completions: UNIQUE(user_id, personal_todo_id, completion_date)
group_todo_completions:         UNIQUE(group_id, user_id, todo_id, completion_date)
```

If you try to insert a duplicate, PostgreSQL will throw a unique violation error.
Use `ON CONFLICT DO NOTHING` or `ON CONFLICT DO UPDATE` if needed.

---

## Auto-Created Records (Never Insert Manually)

| Record              | Created when     | Trigger                  |
| ------------------- | ---------------- | ------------------------ |
| `user_streaks` row  | Profile inserted | `on_profile_created`     |
| `group_streaks` row | User joins group | `on_group_member_joined` |
