# Data Model: Signup Screen

**Branch**: `006-signup-screen` | **Date**: 2026-02-15

## Entities

### SignupFormData

Form state managed by `react-hook-form`. Represents the data collected during registration.

| Field           | Type     | Validation Rules                                                    |
| --------------- | -------- | ------------------------------------------------------------------- |
| firstName       | `string` | Required, min 2 chars, Unicode allowed, sanitize special characters |
| lastName        | `string` | Required, min 2 chars, Unicode allowed, sanitize special characters |
| email           | `string` | Required, valid email format (RFC 5322), validated on blur          |
| password        | `string` | Required, min 8 chars, validated on blur                            |
| confirmPassword | `string` | Required, must match `password`, validated on blur                  |
| country         | `string` | Required, must be a valid country value from COUNTRIES list         |
| dateOfBirth     | `Date`   | Required, user must be at least 13 years old, can't be future date  |

**Cross-field validation**:

- `confirmPassword` must equal `password` (Zod `.refine()` with `path: ['confirmPassword']`)

### SignupPayload

Data sent to authentication backend after form validation passes.

| Field       | Destination              | Notes                           |
| ----------- | ------------------------ | ------------------------------- |
| email       | `supabase.auth.signUp()` | Primary auth field              |
| password    | `supabase.auth.signUp()` | Primary auth field              |
| firstName   | `options.data`           | Stored as user metadata         |
| lastName    | `options.data`           | Stored as user metadata         |
| country     | `options.data`           | Country code (e.g., "eg", "sa") |
| dateOfBirth | `options.data`           | ISO date string                 |

### SelectOption (existing)

From `src/common/components/Select/Select.types.ts`. Used for country list.

| Field | Type     | Notes                        |
| ----- | -------- | ---------------------------- |
| value | `string` | Country code (e.g., "eg")    |
| label | `string` | Display name (e.g., "Egypt") |
| icon  | `string` | Emoji flag (e.g., "🇪🇬")      |

### UI State

Managed within `useSignupForm` hook.

| Field             | Type             | Notes                                  |
| ----------------- | ---------------- | -------------------------------------- |
| isPasswordVisible | `boolean`        | Toggle for password field visibility   |
| isConfirmVisible  | `boolean`        | Toggle for confirm password visibility |
| serverError       | `string \| null` | Error from registration API            |
| isSubmitting      | `boolean`        | From react-hook-form `formState`       |

## State Transitions

```
IDLE → FILLING (user types in any field)
FILLING → VALIDATING (user taps "Sign Up")
VALIDATING → ERROR (validation fails → show field errors)
VALIDATING → SUBMITTING (validation passes → API call)
SUBMITTING → SUCCESS (API returns ok → navigate to main app)
SUBMITTING → ERROR (API returns error → show server error)
ERROR → FILLING (user corrects fields)
```

## Relationships

```
SignupForm
  ├── uses → COUNTRIES (static SelectOption[])
  ├── uses → DatePicker (existing component)
  ├── uses → Select (existing component, searchable)
  ├── produces → SignupFormData (validated form)
  └── sends → SignupPayload (to supabase.auth.signUp)
```
