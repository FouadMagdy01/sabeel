# API Contract: Signup

**Branch**: `006-signup-screen` | **Date**: 2026-02-15

## Registration Endpoint

Uses Supabase Auth SDK — no custom REST endpoint needed.

### `supabase.auth.signUp()`

**Request**:

```typescript
{
  email: string,
  password: string,
  options: {
    data: {
      first_name: string,
      last_name: string,
      country: string,       // country code from COUNTRIES list
      date_of_birth: string, // ISO 8601 date string
    }
  }
}
```

**Success Response** (Supabase `AuthResponse`):

```typescript
{
  data: {
    user: User,       // Supabase User object
    session: Session,  // Auth session with tokens
  },
  error: null
}
```

**Error Response**:

```typescript
{
  data: { user: null, session: null },
  error: {
    message: string,  // e.g., "User already registered"
    status: number,   // HTTP status code
  }
}
```

### Error Mapping

| Supabase Error Message    | User-Facing i18n Key             | Display Location    |
| ------------------------- | -------------------------------- | ------------------- |
| "User already registered" | `auth.validation.emailExists`    | Below email field   |
| "Invalid email"           | `auth.validation.emailInvalid`   | Below email field   |
| Network/timeout errors    | `errors.network`                 | Below signup button |
| Other server errors       | `auth.signup.serviceUnavailable` | Below signup button |

## Component Contracts

### SignupForm → useSignupForm Hook

```typescript
interface UseSignupFormReturn {
  control: Control<SignupFormData>;
  errors: FieldErrors<SignupFormData>;
  isSubmitting: boolean;
  serverError: string | null;
  isPasswordVisible: boolean;
  isConfirmVisible: boolean;
  togglePasswordVisibility: () => void;
  toggleConfirmVisibility: () => void;
  handleSignup: (data: SignupFormData) => Promise<void>;
  handleSubmit: UseFormHandleSubmit<SignupFormData>;
}
```

### SignupForm → Select Component

```typescript
// Country field usage contract
<Select
  label={t('auth.labels.country')}
  options={COUNTRIES}              // SelectOption[] from auth/data/countries.ts
  value={countryValue}             // string (country code)
  onValueChange={onCountryChange}  // (value: string) => void
  placeholder={t('auth.signup.countryPlaceholder')}
  variant="filled"
  size="large"
  searchable                       // enables search in bottom sheet
  error={!!errors.country}
  errorText={errors.country?.message}
/>
```

### SignupForm → DatePicker Component

```typescript
// Date of birth field usage contract
<DatePicker
  label={t('auth.labels.dateOfBirth')}
  value={dateOfBirthValue}                    // Date | null
  onValueChange={onDateOfBirthChange}         // (date: Date | null) => void
  placeholder={t('auth.signup.dateOfBirthPlaceholder')}
  variant="filled"
  size="large"
  maxDate={new Date()}                        // can't select future dates
  error={!!errors.dateOfBirth}
  errorText={errors.dateOfBirth?.message}
/>
```
