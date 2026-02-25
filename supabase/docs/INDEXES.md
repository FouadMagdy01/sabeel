# Indexes Reference

> ✅ **Verified** — All indexes taken directly from `pg_indexes` on the live database.
> Total: 88 indexes (includes PKs, unique constraints, and performance indexes)

---

## Index Types

- **UNIQUE** — Enforces uniqueness constraint (also used for PKs)
- **btree** — Standard B-tree index (all indexes use btree)
- **Partial** — Has a `WHERE` clause, only indexes matching rows (faster and smaller)

---

## Indexes by Table

### `challenges`

| Index                 | Type    | Columns                     | Notes                         |
| --------------------- | ------- | --------------------------- | ----------------------------- |
| challenges_pkey       | UNIQUE  | (id)                        | PK                            |
| idx_challenges_active | Partial | (id) WHERE is_active = true | Fast active challenge queries |
| idx_challenges_dates  | btree   | (start_date, end_date)      | Fast date range queries       |

---

### `countries`

| Index              | Type   | Columns | Notes               |
| ------------------ | ------ | ------- | ------------------- |
| countries_pkey     | UNIQUE | (id)    | PK                  |
| countries_code_key | UNIQUE | (code)  | Unique country code |

---

### `favorite_suras`

| Index                                  | Type   | Columns                | Notes             |
| -------------------------------------- | ------ | ---------------------- | ----------------- |
| favorite_suras_pkey                    | UNIQUE | (id)                   | PK                |
| favorite_suras_user_id_sura_number_key | UNIQUE | (user_id, sura_number) | One sura per user |
| idx_favorite_suras_user_id             | btree  | (user_id)              | Fast user lookup  |
| idx_favorite_suras_sura_number         | btree  | (sura_number)          | Fast sura lookup  |

---

### `fcm_tokens`

| Index                  | Type   | Columns   | Notes                     |
| ---------------------- | ------ | --------- | ------------------------- |
| fcm_tokens_pkey        | UNIQUE | (id)      | PK                        |
| fcm_tokens_token_key   | UNIQUE | (token)   | Token is globally unique  |
| idx_fcm_tokens_user_id | btree  | (user_id) | Fast user's tokens lookup |

---

### `group_members`

| Index                              | Type    | Columns                                  | Notes                             |
| ---------------------------------- | ------- | ---------------------------------------- | --------------------------------- |
| group_members_pkey                 | UNIQUE  | (id)                                     | PK                                |
| group_members_group_id_user_id_key | UNIQUE  | (group_id, user_id)                      | One membership per user per group |
| idx_group_members_group_id         | btree   | (group_id)                               | Fast group members list           |
| idx_group_members_user_id          | btree   | (user_id)                                | Fast user's groups list           |
| idx_group_members_admin            | Partial | (group_id, user_id) WHERE role = 'admin' | Fast admin check                  |

---

### `group_points_config`

| Index                                | Type   | Columns         | Notes                        |
| ------------------------------------ | ------ | --------------- | ---------------------------- |
| group_points_config_pkey             | UNIQUE | (id)            | PK                           |
| group_points_config_group_id_key_key | UNIQUE | (group_id, key) | One config per key per group |

---

### `group_streaks`

| Index                              | Type   | Columns                       | Notes                               |
| ---------------------------------- | ------ | ----------------------------- | ----------------------------------- |
| group_streaks_pkey                 | UNIQUE | (id)                          | PK                                  |
| group_streaks_group_id_user_id_key | UNIQUE | (group_id, user_id)           | One streak per user per group       |
| idx_group_streaks_group_id         | btree  | (group_id)                    | Fast group streaks lookup           |
| idx_group_streaks_user_id          | btree  | (user_id)                     | Fast user's group streaks           |
| idx_group_streaks_leaderboard      | btree  | (group_id, total_points DESC) | **Leaderboard queries — very fast** |

---

### `group_todo_completions`

| Index                                                             | Type   | Columns                                       | Notes                  |
| ----------------------------------------------------------------- | ------ | --------------------------------------------- | ---------------------- |
| group_todo_completions_pkey                                       | UNIQUE | (id)                                          | PK                     |
| group_todo_completions_group_id_user_id_todo_id_completion\_\_key | UNIQUE | (group_id, user_id, todo_id, completion_date) | One completion per day |
| idx_group_todo_completions_group_id                               | btree  | (group_id)                                    | Fast group completions |
| idx_group_todo_completions_user_id                                | btree  | (user_id)                                     | Fast user completions  |
| idx_group_todo_completions_completion_date                        | btree  | (completion_date DESC)                        | Fast date queries      |

---

### `group_todos`

| Index                    | Type    | Columns                           | Notes                  |
| ------------------------ | ------- | --------------------------------- | ---------------------- |
| group_todos_pkey         | UNIQUE  | (id)                              | PK                     |
| idx_group_todos_group_id | btree   | (group_id)                        | Fast group's todos     |
| idx_group_todos_active   | Partial | (group_id) WHERE is_active = true | Fast active todos only |

---

### `groups`

| Index                  | Type    | Columns                                     | Notes                   |
| ---------------------- | ------- | ------------------------------------------- | ----------------------- |
| groups_pkey            | UNIQUE  | (id)                                        | PK                      |
| groups_invite_code_key | UNIQUE  | (invite_code)                               | Unique invite codes     |
| idx_groups_created_by  | btree   | (created_by)                                | Fast creator lookup     |
| idx_groups_invite_code | Partial | (invite_code) WHERE invite_code IS NOT NULL | Fast join-by-code       |
| idx_groups_public      | Partial | (id) WHERE is_public = true                 | Fast public groups list |
| idx_groups_country     | btree   | (country)                                   | Fast country filter     |

---

### `milestone_config`

| Index                     | Type   | Columns | Notes                 |
| ------------------------- | ------ | ------- | --------------------- |
| milestone_config_pkey     | UNIQUE | (id)    | PK                    |
| milestone_config_days_key | UNIQUE | (days)  | Unique milestone days |

---

### `otp_codes`

| Index                    | Type   | Columns       | Notes                         |
| ------------------------ | ------ | ------------- | ----------------------------- |
| otp_codes_pkey           | UNIQUE | (id)          | PK                            |
| idx_otp_codes_email_type | btree  | (email, type) | Fast OTP lookup by email+type |
| idx_otp_codes_expires_at | btree  | (expires_at)  | Fast cleanup of expired codes |

---

### `points_config`

| Index                 | Type   | Columns | Notes             |
| --------------------- | ------ | ------- | ----------------- |
| points_config_pkey    | UNIQUE | (id)    | PK                |
| points_config_key_key | UNIQUE | (key)   | Unique config key |

---

### `profiles`

| Index                 | Type    | Columns                             | Notes                             |
| --------------------- | ------- | ----------------------------------- | --------------------------------- |
| profiles_pkey         | UNIQUE  | (id)                                | PK                                |
| profiles_user_id_key  | UNIQUE  | (user_id)                           | One profile per user              |
| profiles_email_unique | UNIQUE  | (email)                             | **Email must be globally unique** |
| idx_profiles_user_id  | btree   | (user_id)                           | Fast user lookup                  |
| idx_profiles_email    | Partial | (email) WHERE email IS NOT NULL     | Fast email lookup                 |
| idx_profiles_country  | Partial | (country) WHERE country IS NOT NULL | Fast country filter               |

---

### `report_attachments`

| Index                            | Type   | Columns     | Notes                   |
| -------------------------------- | ------ | ----------- | ----------------------- |
| report_attachments_pkey          | UNIQUE | (id)        | PK                      |
| idx_report_attachments_report_id | btree  | (report_id) | Fast report attachments |

---

### `report_messages`

| Index                          | Type    | Columns                                            | Notes                    |
| ------------------------------ | ------- | -------------------------------------------------- | ------------------------ |
| report_messages_pkey           | UNIQUE  | (id)                                               | PK                       |
| idx_report_messages_report_id  | btree   | (report_id)                                        | Fast report messages     |
| idx_report_messages_created_at | btree   | (created_at)                                       | Fast chronological sort  |
| idx_report_messages_unread     | Partial | (report_id, created_at DESC) WHERE is_read = false | Fast unread messages     |
| idx_report_messages_admin      | Partial | (report_id) WHERE is_admin_message = true          | Fast admin messages only |

---

### `reports`

| Index                    | Type    | Columns                                          | Notes                     |
| ------------------------ | ------- | ------------------------------------------------ | ------------------------- |
| reports_pkey             | UNIQUE  | (id)                                             | PK                        |
| idx_reports_user_id      | btree   | (user_id)                                        | Fast user's reports       |
| idx_reports_status       | btree   | (status)                                         | Fast status filter        |
| idx_reports_created_at   | btree   | (created_at DESC)                                | Fast chronological sort   |
| idx_reports_unread_admin | Partial | (user_id) WHERE has_unread_admin_messages = true | Fast unread notifications |
| idx_reports_unread_user  | Partial | (id) WHERE has_unread_user_messages = true       | Fast admin unread view    |

---

### `todos`

| Index            | Type    | Columns                            | Notes             |
| ---------------- | ------- | ---------------------------------- | ----------------- |
| todos_pkey       | UNIQUE  | (id)                               | PK                |
| idx_todos_type   | btree   | (todo_type)                        | Fast type filter  |
| idx_todos_active | Partial | (todo_type) WHERE is_active = true | Fast active todos |

---

### `user_challenges`

| Index                                    | Type    | Columns                          | Notes                            |
| ---------------------------------------- | ------- | -------------------------------- | -------------------------------- |
| user_challenges_pkey                     | UNIQUE  | (id)                             | PK                               |
| user_challenges_user_id_challenge_id_key | UNIQUE  | (user_id, challenge_id)          | One entry per user per challenge |
| idx_user_challenges_user_id              | btree   | (user_id)                        | Fast user's challenges           |
| idx_user_challenges_challenge_id         | btree   | (challenge_id)                   | Fast challenge participants      |
| idx_user_challenges_completed            | Partial | (user_id) WHERE completed = true | Fast completed challenges        |

---

### `user_personal_todo_completions`

| Index                                                           | Type   | Columns                                      | Notes                  |
| --------------------------------------------------------------- | ------ | -------------------------------------------- | ---------------------- |
| user_personal_todo_completions_pkey                             | UNIQUE | (id)                                         | PK                     |
| user_personal_todo_completion_user_id_personal_todo_id_comp_key | UNIQUE | (user_id, personal_todo_id, completion_date) | One completion per day |

---

### `user_personal_todos`

| Index                    | Type   | Columns | Notes |
| ------------------------ | ------ | ------- | ----- |
| user_personal_todos_pkey | UNIQUE | (id)    | PK    |

---

### `user_roles`

| Index                       | Type   | Columns         | Notes                      |
| --------------------------- | ------ | --------------- | -------------------------- |
| user_roles_pkey             | UNIQUE | (id)            | PK                         |
| user_roles_user_id_role_key | UNIQUE | (user_id, role) | One role per type per user |
| idx_user_roles_user_id      | btree  | (user_id)       | Fast user roles lookup     |
| idx_user_roles_role         | btree  | (role)          | Fast role filter           |

---

### `user_streaks`

| Index                            | Type    | Columns                                                            | Notes               |
| -------------------------------- | ------- | ------------------------------------------------------------------ | ------------------- |
| user_streaks_pkey                | UNIQUE  | (id)                                                               | PK                  |
| user_streaks_user_id_key         | UNIQUE  | (user_id)                                                          | One streak per user |
| idx_user_streaks_user_id         | btree   | (user_id)                                                          | Fast user lookup    |
| idx_user_streaks_last_completion | Partial | (last_completion_date DESC) WHERE last_completion_date IS NOT NULL | Fast streak queries |

---

### `user_todo_completions`

| Index                                                     | Type   | Columns                             | Notes                  |
| --------------------------------------------------------- | ------ | ----------------------------------- | ---------------------- |
| user_todo_completions_pkey                                | UNIQUE | (id)                                | PK                     |
| user_todo_completions_user_id_todo_id_completion_date_key | UNIQUE | (user_id, todo_id, completion_date) | One completion per day |
| idx_user_todo_completions_user_id                         | btree  | (user_id)                           | Fast user completions  |
| idx_user_todo_completions_todo_id                         | btree  | (todo_id)                           | Fast todo completions  |
| idx_user_todo_completions_completion_date                 | btree  | (completion_date DESC)              | Fast date queries      |

---

## ⚠️ Important Notes for Claude Code

1. **`profiles.email` is UNIQUE** — inserting a duplicate email will throw a constraint error
2. **Completion tables enforce one-per-day** via UNIQUE constraints — use `ON CONFLICT DO NOTHING` if needed
3. **Partial indexes** (with WHERE) are only used when queries match that WHERE condition exactly
4. **`idx_group_streaks_leaderboard`** is sorted DESC — leaderboard queries are already optimized
5. **When adding a new table**, add at minimum: an index on `user_id` (if applicable) and any FK columns
6. **`user_personal_todos` has no user_id index** — if querying by user_id frequently, consider adding one
