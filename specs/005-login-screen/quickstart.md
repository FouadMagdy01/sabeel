# Quickstart: Login Screen Implementation

## Prerequisites

All dependencies are already installed:

- `zod` (4.3.6) — schema validation
- `react-hook-form` (7.71.1) — form state management
- `@hookform/resolvers` (5.2.2) — Zod ↔ react-hook-form bridge
- `@supabase/supabase-js` (2.91.1) — authentication backend
- `expo-linear-gradient` (15.0.8) — gradient backgrounds
- `react-native-svg` — SVG pattern rendering

**No `npm install` needed.**

## Files to Create/Modify

### New Files

```
src/features/auth/schemas/login.schema.ts     — Zod login form schema (factory with i18n)
src/features/auth/hooks/useLoginForm.ts        — Custom hook: form state + submission logic
```

### Modified Files

```
app/(auth)/index.tsx                           — Replace placeholder with full login screen
src/i18n/locales/en.json                       — Add missing auth keys
src/i18n/locales/ar.json                       — Add missing auth keys
```

## Architecture Overview

```
app/(auth)/index.tsx (LoginScreen)
├── KeyboardAvoidingView + ScrollView
├── Background Layer (absolute positioned)
│   ├── Islamic Pattern SVG (tiled, low opacity)
│   └── Gradient Glow Blobs (expo-linear-gradient)
├── Header Section
│   ├── Logo Container (gradient card with mosque icon)
│   ├── Typography: App Name "Sabeel"
│   └── Typography: Tagline
├── Form Section
│   ├── Input: Email (leftElement=mail icon)
│   ├── Input: Password (leftElement=lock, rightElement=eye toggle)
│   ├── Forgot Password Link (Typography, right-aligned)
│   ├── Login Button (fullWidth, loading state)
│   └── Server Error Text (conditional)
├── Footer Section
│   ├── Divider: "Or"
│   ├── Button: Continue as Guest (outlined variant)
│   └── Sign Up Link (Typography inline)
└── Hooks
    ├── useLoginForm() → { control, errors, isSubmitting, handleLogin, serverError }
    └── useTranslation() → { t }
```

## Key Patterns

### Zod Schema with i18n (login.schema.ts)

```typescript
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, t('auth.validation.emailRequired'))
      .email(t('auth.validation.emailInvalid')),
    password: z
      .string()
      .min(1, t('auth.validation.passwordRequired'))
      .min(8, t('auth.validation.passwordMinLength')),
  });

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
```

### Custom Hook (useLoginForm.ts)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { createLoginSchema } from '../schemas/login.schema';

export function useLoginForm() {
  const { t } = useTranslation();
  const schema = createLoginSchema(t);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur', // Validate on blur per spec
    defaultValues: { email: '', password: '' },
  });

  // ... submission logic with supabase.auth.signInWithPassword
}
```

### Existing Component Usage

```tsx
// Email input
<Input
  label={t('auth.labels.email')}
  placeholder={t('auth.login.emailPlaceholder')}
  variant="filled"
  size="large"
  leftElement={<Icon familyName="Feather" iconName="mail" variant="muted" size={20} />}
  error={!!errors.email}
  errorText={errors.email?.message}
  keyboardType="email-address"
  autoCapitalize="none"
/>

// Password toggle
<IconButton
  familyName="Feather"
  iconName={showPassword ? 'eye-off' : 'eye'}
  variant="ghost"
  iconVariant="muted"
  size="small"
  onPress={togglePassword}
/>

// Login button
<Button
  variant="contained"
  color="primary"
  size="large"
  fullWidth
  loading={isSubmitting}
  onPress={handleSubmit}
>
  {t('auth.login.loginButton')}
</Button>

// Guest button
<Button
  variant="outlined"
  size="large"
  fullWidth
  onPress={handleGuestAccess}
>
  {t('auth.login.continueAsGuest')}
</Button>

// Divider
<Divider>{t('auth.login.or')}</Divider>
```

## Validation Checks

After implementation, run:

```bash
npm run validate    # TypeScript + ESLint + Prettier
npm test            # If tests are added
```

Ensure:

- [ ] No hardcoded strings (all via `t()`)
- [ ] No inline styles (all via `createStyleSheet`)
- [ ] No `any` types
- [ ] Theme tokens used for all colors
- [ ] Both light and dark mode visually correct
