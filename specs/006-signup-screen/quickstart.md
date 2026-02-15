# Quickstart: Signup Screen

**Branch**: `006-signup-screen` | **Date**: 2026-02-15

## Prerequisites

All dependencies are already installed:

- `react-hook-form@7.71.1` + `@hookform/resolvers@5.2.2` + `zod@4.3.6` — form handling & validation
- `@gorhom/bottom-sheet@5.2.8` — used by Select component for country picker
- `@supabase/supabase-js` — authentication backend
- Existing components: `Input`, `Button`, `IconButton`, `Icon`, `Select`, `DatePicker`, `Typography`, `Divider`

## File Structure

```
app/(auth)/
  Signup.tsx                           # Screen route (new)

src/features/auth/
  components/
    SignupForm/
      SignupForm.tsx                    # Main form component (new)
      SignupForm.styles.ts             # Styles (new)
      index.ts                         # Export (new)
  hooks/
    useSignupForm.ts                   # Form logic hook (new)
  schemas/
    signup.schema.ts                   # Zod validation schema (new)
  data/
    countries.ts                       # Country list (existing)

src/i18n/locales/
  en.json                              # Add auth.signup.* keys (modify)
  ar.json                              # Add auth.signup.* keys (modify)
```

## Implementation Order

### 1. Validation Schema (`signup.schema.ts`)

Follow `login.schema.ts` pattern — factory function accepting `TFunction`:

```typescript
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createSignupSchema = (t: TFunction) =>
  z
    .object({
      firstName: z
        .string()
        .min(1, t('auth.validation.firstNameRequired'))
        .min(2, t('auth.validation.nameMinLength')),
      lastName: z
        .string()
        .min(1, t('auth.validation.lastNameRequired'))
        .min(2, t('auth.validation.nameMinLength')),
      email: z
        .string()
        .min(1, t('auth.validation.emailRequired'))
        .email(t('auth.validation.emailInvalid')),
      password: z
        .string()
        .min(1, t('auth.validation.passwordRequired'))
        .min(8, t('auth.validation.passwordMinLength')),
      confirmPassword: z.string().min(1, t('auth.validation.confirmPasswordRequired')),
      country: z.string().min(1, t('auth.validation.countryRequired')),
      dateOfBirth: z.date({
        required_error: t('auth.validation.dateOfBirthRequired'),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.validation.passwordsDoNotMatch'),
      path: ['confirmPassword'],
    })
    .refine(
      (data) => {
        const today = new Date();
        const age = today.getFullYear() - data.dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - data.dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < data.dateOfBirth.getDate())) {
          return age - 1 >= 13;
        }
        return age >= 13;
      },
      {
        message: t('auth.validation.ageRequirement'),
        path: ['dateOfBirth'],
      }
    );

export type SignupFormData = z.infer<ReturnType<typeof createSignupSchema>>;
```

### 2. Form Hook (`useSignupForm.ts`)

Follow `useLoginForm.ts` pattern:

```typescript
export function useSignupForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const schema = createSignupSchema(t);

  const { control, handleSubmit, formState: { errors, isSubmitting }, trigger } = useForm<SignupFormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      firstName: '', lastName: '', email: '', password: '',
      confirmPassword: '', country: '',
      dateOfBirth: undefined,
    },
  });

  // Password visibility toggles (separate for each field)
  // Server error state
  // handleSignup async function using supabase.auth.signUp()
  // Manual onBlur triggers for email, password, confirmPassword

  return { control, errors, isSubmitting, serverError, ... };
}
```

### 3. Form Component (`SignupForm.tsx`)

Follow `LoginForm.tsx` structure exactly:

```
Header: logoContainer + appName + tagline
Form: 7 Controller-wrapped inputs in spec order
  1. firstName — Input with user icon
  2. lastName — Input with user icon
  3. email — Input with mail icon
  4. password — Input with lock icon + visibility toggle
  5. confirmPassword — Input with lock icon + visibility toggle
  6. country — Select (searchable, with COUNTRIES data)
  7. dateOfBirth — DatePicker (maxDate=today, default 18yrs ago)
Submit: Button (contained, primary, large, fullWidth, loading)
Server error: Typography (caption, error)
Footer: "Already have an account?" + "Log In" link
```

### 4. Screen Route (`app/(auth)/Signup.tsx`)

Copy `app/(auth)/index.tsx` exactly, replace `LoginForm` with `SignupForm`.

### 5. i18n Keys

Add to both `en.json` and `ar.json`:

- `auth.signup.*` — screen text (already partially present)
- `auth.validation.*` — new validation messages (ageRequirement, emailExists, etc.)
- `auth.labels.*` — new labels (already partially present)

## Key Patterns to Follow

1. **All text via i18n**: `t('auth.signup.signupButton')`, never hardcoded strings
2. **All styling via theme**: `StyleSheet.create((theme) => ...)`, never inline styles
3. **Input variant**: `"filled"` + `size="large"` — consistent with login screen
4. **Icons**: Feather family for form icons (mail, lock, user, eye), MaterialIcons for logo (mosque)
5. **Icon variant**: `"muted"` for input left elements
6. **Accessibility**: `accessibilityLabel` on all interactive elements
7. **Controller pattern**: Wrap each form field in `<Controller>` from react-hook-form
