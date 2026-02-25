# Research: Signup Screen

**Branch**: `006-signup-screen` | **Date**: 2026-02-15

## R1: Form Handling Approach

**Decision**: Use `react-hook-form` with `zod` validation and `@hookform/resolvers/zod`

**Rationale**: This is the exact pattern established in the login screen (`useLoginForm.ts` + `login.schema.ts`). All three packages are already installed (`react-hook-form@7.71.1`, `zod@4.3.6`, `@hookform/resolvers@5.2.2`). The pattern uses a schema factory function that accepts `TFunction` for localized error messages.

**Alternatives considered**:

- Custom validation: Rejected — less type-safe, more boilerplate, inconsistent with login screen
- Yup: Rejected — not installed, would add a new dependency for no benefit

## R2: Validation Mode

**Decision**: Use `mode: 'onSubmit'` for the signup form (with `reValidateMode: 'onBlur'` for email/password)

**Rationale**: Per clarification Q1, name fields should validate on submit only. However, email (FR-028) and password (FR-029, FR-030) should validate on blur as specified. The `mode: 'onSubmit'` setting covers the primary case; per-field blur triggers are handled by `trigger()` calls in `onBlur` handlers for email/password fields. This differs from login screen's `mode: 'onBlur'` because the signup form has more fields where on-blur validation would be disruptive.

**Alternatives considered**:

- `mode: 'onBlur'` globally: Rejected — violates clarification that name fields validate on submit only
- `mode: 'onChange'`: Rejected — too aggressive for a 7-field form, poor UX

## R3: Country Selection Component

**Decision**: Reuse existing `Select` component from `src/common/components/Select/` with `searchable` prop

**Rationale**: The Select component already implements the exact bottom sheet pattern needed (FR-011 through FR-015): uses `@gorhom/bottom-sheet` with `BottomSheetModal`, supports `searchable` prop with case-insensitive filtering via `SearchInput`, handles backdrop, close-on-select, and swipe-to-dismiss. Country data exists at `src/features/auth/data/countries.ts` as `SelectOption[]`.

**Alternatives considered**:

- Custom bottom sheet component: Rejected — Select already does everything needed, building custom would violate Principle V (YAGNI)
- Picker/dropdown: Rejected — bottom sheet with search is specified in requirements

## R4: Date of Birth Component

**Decision**: Reuse existing `DatePicker` component from `src/common/components/DatePicker/`

**Rationale**: DatePicker already supports `value`, `onValueChange`, `label`, `error`, `errorText`, `minDate`, `maxDate`, `variant`, `size`, `clearable`, and `placeholder` props. It uses a modal calendar with month/year navigation. Default date (18 years ago) can be set via the `value` prop's initial state or by configuring the component's internal viewDate.

**Alternatives considered**:

- react-native-date-picker: Rejected — adds new dependency, existing component follows design system
- expo-date-time-picker: Rejected — native picker doesn't match design system styling

## R5: Password Confirm Validation

**Decision**: Use Zod `.refine()` on the schema to validate password match

**Rationale**: Zod's `.refine()` method allows cross-field validation with `path` targeting. The error message is attached to `confirmPassword` field via `path: ['confirmPassword']`. This is the standard Zod pattern for password confirmation and keeps validation co-located with the schema.

**Alternatives considered**:

- Manual comparison in hook: Rejected — bypasses the schema validation flow, inconsistent with login pattern
- Custom `validate` on Controller: Rejected — moves validation logic out of the schema, harder to maintain

## R6: Age Validation (13+ years)

**Decision**: Use Zod `.refine()` on the `dateOfBirth` field to check age >= 13

**Rationale**: Calculate age from the selected date against current date. If under 13, display localized error message. The DatePicker's `maxDate` can be set to today (can't select future dates), and `minDate` can be set to a reasonable lower bound (e.g., 120 years ago). Age validation is done in the schema for consistency.

**Alternatives considered**:

- Restrict DatePicker `maxDate` to 13 years ago: Rejected — doesn't provide a clear error message explaining why dates are disabled
- Server-side only: Rejected — client-side validation needed for immediate UX feedback

## R7: Screen Layout & Navigation

**Decision**: Follow login screen pattern — `app/(auth)/Signup.tsx` with `KeyboardAvoidingView` + `ScrollView` + `SafeAreaView` wrapping a `SignupForm` feature component

**Rationale**: Login screen route at `app/(auth)/index.tsx` already uses this exact pattern. Navigation from login screen already points to `/(auth)/Signup` (line 172 of LoginForm.tsx). The signup screen needs ScrollView more than login because it has 7+ form fields.

**Alternatives considered**:

- FlatList-based form: Rejected — unnecessary complexity for a fixed number of fields
- KeyboardAwareScrollView: Rejected — adds new dependency, standard ScrollView + KeyboardAvoidingView works

## R8: Authentication API for Registration

**Decision**: Use `supabase.auth.signUp()` for account creation

**Rationale**: Login screen uses `supabase.auth.signInWithPassword()` from `@/integrations/supabase`. The signup equivalent is `supabase.auth.signUp()` which accepts `email`, `password`, and `options.data` for metadata (first name, last name, country, date of birth). Backend is Supabase per constitution's Technology Constraints.

**Alternatives considered**:

- Custom API endpoint: Rejected — Supabase auth is the established backend per constitution
- Firebase Auth: Rejected — project uses Supabase

## R9: Background Decorative Components

**Decision**: No decorative background components exist yet — the login screen does not have them implemented either. Skip for initial implementation; both login and signup screens can receive decorative backgrounds in a separate feature.

**Rationale**: Searching the codebase reveals no Islamic pattern overlay or gradient glow components. The login screen spec mentions them (FR-017, FR-018) but they are not implemented. Per Principle V (Simplicity/YAGNI), the signup screen should match the current login screen implementation, not its aspirational spec.

**Alternatives considered**:

- Implement decorative backgrounds now: Rejected — out of scope for signup screen, should be a shared auth feature
