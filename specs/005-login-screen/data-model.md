# Data Model: Login Screen

## Entities

### LoginFormData

Form state managed by react-hook-form.

| Field    | Type   | Validation Rules                        | Error Key                                                               |
| -------- | ------ | --------------------------------------- | ----------------------------------------------------------------------- |
| email    | string | Required, valid email format (RFC 5322) | `auth.validation.emailRequired`, `auth.validation.emailInvalid`         |
| password | string | Required, minimum 8 characters          | `auth.validation.passwordRequired`, `auth.validation.passwordMinLength` |

### LoginUIState

Screen-level UI state (React `useState`).

| Field             | Type    | Default | Description                                  |
| ----------------- | ------- | ------- | -------------------------------------------- |
| isPasswordVisible | boolean | false   | Toggles password masking                     |
| isSubmitting      | boolean | false   | Tracks auth request in progress              |
| serverError       | string  | null    | Network or auth error displayed below button |

### Zod Schema: `loginSchema`

```
loginSchema = z.object({
  email: z.string()
    .min(1, t('auth.validation.emailRequired'))
    .email(t('auth.validation.emailInvalid')),
  password: z.string()
    .min(1, t('auth.validation.passwordRequired'))
    .min(8, t('auth.validation.passwordMinLength')),
})
```

Created via factory function `createLoginSchema(t: TFunction)` to support i18n.

## State Transitions

```
IDLE → (user types in fields) → EDITING
EDITING → (user taps Login, form valid) → SUBMITTING
SUBMITTING → (auth success) → AUTHENTICATED → navigate to /(main)/(tabs)
SUBMITTING → (auth error) → ERROR → display serverError, return to EDITING
SUBMITTING → (network error) → ERROR → display serverError, return to EDITING
```

## Validation Flow

1. Email field: validated on blur (field loses focus)
2. Password field: validated on submit
3. Login button: disabled when form has errors or fields are empty
4. Server errors: displayed inline below login button, cleared on next submission attempt
