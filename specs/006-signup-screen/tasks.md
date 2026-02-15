# Tasks: Signup Screen

**Input**: Design documents from `/specs/006-signup-screen/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not requested in feature specification — test tasks omitted.

**Organization**: Tasks grouped by user story. US1–US4 are all P1 and share the same form component, but each is independently verifiable. US2 (Country) and US3 (DOB) depend on the base form from US1. US4 (Password validation) is built into the schema from US1. US5 and US6 are independent.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: i18n keys and validation schema — required by all user stories

- [x] T001 [P] Add signup i18n translation keys to `src/i18n/locales/en.json` — add keys under `auth.signup` (title, subtitle, firstNamePlaceholder, lastNamePlaceholder, emailPlaceholder, passwordPlaceholder, confirmPasswordPlaceholder, countryPlaceholder, dateOfBirthPlaceholder, signupButton, alreadyHaveAccount, loginLink, serviceUnavailable), `auth.validation` (ageRequirement, emailExists), and `auth.labels` (firstName, lastName, confirmPassword, country, dateOfBirth). Verify existing keys are correct; add any missing ones. Follow the `auth.login.*` pattern for key naming.
- [x] T002 [P] Add signup i18n translation keys to `src/i18n/locales/ar.json` — mirror all keys added in T001 with Arabic translations. Follow existing Arabic translation patterns in the file.
- [x] T003 Create Zod validation schema in `src/features/auth/schemas/signup.schema.ts` — factory function `createSignupSchema(t: TFunction)` following `login.schema.ts` pattern. Fields: firstName (required, min 2 chars), lastName (required, min 2 chars), email (required, valid email), password (required, min 8 chars), confirmPassword (required), country (required), dateOfBirth (required, Date type). Add `.refine()` for password match (path: confirmPassword) and `.refine()` for age >= 13 (path: dateOfBirth). Export `SignupFormData` type via `z.infer`. Use i18n keys from T001 for all error messages.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Form hook and screen route — required before form UI can be built

**⚠️ CRITICAL**: Depends on Phase 1 completion (schema + i18n keys)

- [x] T004 Implement `useSignupForm` hook in `src/features/auth/hooks/useSignupForm.ts` — follow `useLoginForm.ts` pattern. Use `react-hook-form` with `zodResolver`, `mode: 'onSubmit'`. Default values: empty strings for text fields, `undefined` for dateOfBirth. State: `isPasswordVisible`, `isConfirmVisible` (separate toggles), `serverError`. Expose `trigger` from useForm for manual blur validation on email/password/confirmPassword fields. Implement `handleSignup` async function: dismiss keyboard, clear server error, call `supabase.auth.signUp({ email, password, options: { data: { first_name, last_name, country, date_of_birth (ISO string) } } })`. Map Supabase errors to localized messages (emailExists, network, serviceUnavailable). On success, `router.replace('/(main)/(tabs)')`. Return: control, errors, isSubmitting, serverError, isPasswordVisible, isConfirmVisible, togglePasswordVisibility, toggleConfirmVisibility, handleSignup, handleSubmit, trigger.
- [x] T005 Create screen route `app/(auth)/Signup.tsx` — copy exact structure from `app/(auth)/index.tsx` (login screen). Use `KeyboardAvoidingView` (behavior: padding on iOS), `ScrollView` (flexGrow: 1, keyboardShouldPersistTaps: handled), `SafeAreaView`. Import and render `SignupForm` component. Style: container (flex: 1, backgroundColor: theme.colors.background.app), safeAreaContainer (flex: 1), scrollContent (flexGrow: 1, paddingHorizontal: theme.metrics.spacing.p24). Use `StyleSheet.create((theme) => ...)` from react-native-unistyles.

**Checkpoint**: Screen route and form logic ready — UI implementation can begin

---

## Phase 3: User Story 1 - Account Registration with Personal Information (Priority: P1) 🎯 MVP

**Goal**: New user can fill in first name, last name, email, password, confirm password and submit the form to create an account. Form displays validation errors on submit and server errors after API call.

**Independent Test**: Enter all 7 fields with valid data, tap "Sign Up", verify loading spinner appears, account is created, and user navigates to main app home screen. Enter invalid data, tap "Sign Up", verify field-level error messages appear.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create SignupForm styles in `src/features/auth/components/SignupForm/SignupForm.styles.ts` — use `StyleSheet.create((theme) => ...)`. Define styles matching LoginForm.styles.ts: container (flex: 1), headerSection (alignItems center, paddingTop spacingV.p48, marginBottom spacingV.p32, gap spacingV.p16), logoContainer (80x80, borderRadius 16, backgroundColor background.elevated, center content), formSection (gap spacingV.p16), buttonContainer (marginTop spacingV.p16, gap spacingV.p8), serverError (marginTop spacingV.p8), footerSection (marginTop spacingV.p32, paddingBottom spacingV.p24), loginContainer (flex: 1, justifyContent flex-end), loginWrapper (flexDirection row, alignItems center, justifyContent center, gap spacing.p4). All spacing via theme.metrics, all colors via theme.colors.
- [x] T007 [P] [US1] Create SignupForm barrel export in `src/features/auth/components/SignupForm/index.ts` — `export { SignupForm } from './SignupForm';`
- [x] T008 [US1] Implement SignupForm component in `src/features/auth/components/SignupForm/SignupForm.tsx` — follow LoginForm.tsx structure. Import: Button, Icon, IconButton, Input, Typography from common components; Controller from react-hook-form; useTranslation, useRouter; useSignupForm hook; styles. Sections: (1) Header — logoContainer with mosque Icon (MaterialIcons, accent, size 40), app name Typography (heading, 3xl, bold), tagline Typography (body, sm, secondary, uppercase). (2) Form — 5 Controller-wrapped Inputs in order: firstName (Feather "user" icon, muted, size 20), lastName (Feather "user" icon), email (Feather "mail" icon, keyboardType email-address, autoCapitalize none, autoComplete email, onBlur calls trigger('email')), password (Feather "lock" icon + IconButton eye/eye-off toggle, secureTextEntry, onBlur calls trigger('password')), confirmPassword (Feather "lock" icon + IconButton eye/eye-off toggle, secureTextEntry, onBlur calls trigger('confirmPassword')). All inputs: variant="filled", size="large", error={!!errors.fieldName}, errorText={errors.fieldName?.message}, accessibilityLabel from i18n. (3) Placeholder Views for country and dateOfBirth (to be implemented in US2/US3). (4) Submit — Button (contained, primary, large, fullWidth, loading=isSubmitting, disabled=isSubmitting, onPress=handleSubmit(handleSignup)). (5) Server error — conditional Typography (caption, error). (6) Footer — "Already have an account?" Typography + "Log In" text Button (to be wired in US5).

**Checkpoint**: Core form renders with 5 text inputs, validates on submit, calls Supabase signup API, shows loading/error states, navigates on success.

---

## Phase 4: User Story 2 - Country Selection (Priority: P1)

**Goal**: User can select their country from a searchable bottom sheet using the existing Select component with COUNTRIES data.

**Independent Test**: Tap country field, verify bottom sheet opens with searchable list. Type partial country name, verify filtering works. Select a country, verify it appears in the field and bottom sheet closes.

**Depends on**: US1 (T008 — base form component must exist)

### Implementation for User Story 2

- [x] T009 [US2] Add country Select field to SignupForm in `src/features/auth/components/SignupForm/SignupForm.tsx` — replace the country placeholder from T008. Import Select from `@/common/components/Select` and COUNTRIES from `../../data/countries`. Add a Controller wrapping Select component: name="country", render with Select props (label from i18n auth.labels.country, options=COUNTRIES, value=field.value, onValueChange=field.onChange, placeholder from i18n auth.signup.countryPlaceholder, variant="filled", size="large", searchable=true, error=!!errors.country, errorText=errors.country?.message). Position after confirmPassword field per spec field order.

**Checkpoint**: Country selection works end-to-end — bottom sheet opens, search filters, selection persists, validation shows error if empty on submit.

---

## Phase 5: User Story 3 - Date of Birth Selection (Priority: P1)

**Goal**: User can select their date of birth using the existing DatePicker component. Default date is 18 years ago. Age validation (13+) is enforced.

**Independent Test**: Tap date of birth field, verify date picker opens with default date 18 years ago. Select a date, verify it appears in localized format. Select a date making user under 13, submit form, verify age requirement error appears.

**Depends on**: US1 (T008 — base form component must exist)

### Implementation for User Story 3

- [x] T010 [US3] Add DatePicker field to SignupForm in `src/features/auth/components/SignupForm/SignupForm.tsx` — replace the dateOfBirth placeholder from T008. Import DatePicker from `@/common/components/DatePicker`. Add a Controller wrapping DatePicker: name="dateOfBirth", render with DatePicker props (label from i18n auth.labels.dateOfBirth, value=field.value, onValueChange=field.onChange, placeholder from i18n auth.signup.dateOfBirthPlaceholder, variant="filled", size="large", maxDate=new Date(), error=!!errors.dateOfBirth, errorText=errors.dateOfBirth?.message). Position after country field per spec field order. Note: The default 18-years-ago date is handled by the DatePicker's initial viewDate when no value is selected — if the DatePicker doesn't support this natively, set the initial viewDate via a useMemo that computes 18 years ago from today.

**Checkpoint**: Date of birth selection works — picker opens, user can select date, date appears formatted, age validation (13+) works via the Zod schema refine from T003.

---

## Phase 6: User Story 4 - Password Validation and Confirmation (Priority: P1)

**Goal**: Password fields validate on blur (min 8 chars for password, match check for confirm password). Error messages appear below respective fields.

**Independent Test**: Enter password < 8 chars, blur field, verify error message appears. Enter mismatched confirm password, blur field, verify "Passwords do not match" error. Enter valid matching passwords, verify no errors.

**Depends on**: US1 (T008 — password fields must exist with onBlur triggers)

### Implementation for User Story 4

- [x] T011 [US4] Verify and refine password blur validation in `src/features/auth/hooks/useSignupForm.ts` and `src/features/auth/components/SignupForm/SignupForm.tsx` — ensure the password Controller's onBlur calls `trigger('password')` and the confirmPassword Controller's onBlur calls `trigger('confirmPassword')`. Verify that the Zod schema refine for password match (from T003) correctly displays the error on the confirmPassword field. Test edge cases: (1) password field shows error if < 8 chars on blur, (2) confirmPassword shows "Passwords do not match" if values differ on blur, (3) both errors clear when corrected and field loses focus again. Ensure the `mode: 'onSubmit'` with manual `trigger()` calls produces the expected per-field blur behavior for password fields only (name fields should NOT show errors on blur).

**Checkpoint**: Password validation works on blur — min length check and password match check both display errors correctly, clear on correction.

---

## Phase 7: User Story 5 - Existing Account Navigation (Priority: P2)

**Goal**: User can navigate to login screen via "Already have an account? Log in" link at the bottom of the signup form.

**Independent Test**: View signup screen, verify "Already have an account? Log In" text is visible. Tap "Log In", verify navigation to login screen.

### Implementation for User Story 5

- [x] T012 [US5] Wire login navigation in SignupForm footer in `src/features/auth/components/SignupForm/SignupForm.tsx` — update the footer section from T008. Implement: View with loginWrapper style containing Typography (body, sm, secondary) showing i18n `auth.signup.alreadyHaveAccount` text, followed by Button (variant="text", size="small") showing i18n `auth.signup.loginLink` text with onPress calling `router.push('/(auth)')` to navigate to login screen. Add accessibilityRole="link" and accessibilityLabel from i18n.

**Checkpoint**: Navigation link is visible, tapping "Log In" navigates to login screen.

---

## Phase 8: User Story 6 - Visual Experience and Brand Identity (Priority: P3)

**Goal**: Signup screen maintains visual consistency with login screen — logo, tagline, Islamic pattern overlay (when implemented), gradient effects, light/dark mode support.

**Independent Test**: View signup screen, verify logo (mosque icon in rounded container), app name "Sabeel", and tagline are present matching login screen styling. Switch between light/dark mode, verify all elements update. Compare visual spacing and component styling with login screen.

### Implementation for User Story 6

- [x] T013 [US6] Visual consistency review and refinement of SignupForm in `src/features/auth/components/SignupForm/SignupForm.tsx` and `src/features/auth/components/SignupForm/SignupForm.styles.ts` — compare the signup screen side-by-side with login screen. Verify: (1) Header section matches login — same logoContainer dimensions (80x80, borderRadius 16), same mosque icon (MaterialIcons, accent, 40), same Typography styles for app name and tagline. (2) Form inputs use identical variant/size (filled/large) as login. (3) Button styling matches login (contained/primary/large/fullWidth). (4) Footer styling matches login's signup link section. (5) All colors respond to light/dark mode via semantic tokens. (6) Spacing values match login screen exactly. Fix any discrepancies found.

**Checkpoint**: Signup screen is visually consistent with login screen in both light and dark modes.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, code quality, and validation

- [x] T014 Add accessibilityLabel props to all interactive elements in `src/features/auth/components/SignupForm/SignupForm.tsx` — ensure every Input, Button, IconButton, Select, and DatePicker has an accessibilityLabel from i18n. Password visibility toggles must have dynamic labels (e.g., "Show password" / "Hide password"). Verify accessibilityRole is set on buttons ("button") and links ("link").
- [x] T015 Run `npm run validate` (type-check + lint + format:check) and fix any issues across all new/modified files — `src/features/auth/schemas/signup.schema.ts`, `src/features/auth/hooks/useSignupForm.ts`, `src/features/auth/components/SignupForm/SignupForm.tsx`, `src/features/auth/components/SignupForm/SignupForm.styles.ts`, `src/features/auth/components/SignupForm/index.ts`, `app/(auth)/Signup.tsx`, `src/i18n/locales/en.json`, `src/i18n/locales/ar.json`. Ensure no ESLint errors (no inline styles, no hardcoded strings, no `any` types, no unused imports). Run Prettier formatting.
- [ ] T016 Manual smoke test — open app, navigate to signup screen from login screen's "Create Account" link. Fill all 7 fields with valid data, submit, verify account creation and navigation. Test with invalid data (empty fields, bad email, short password, mismatched passwords, underage DOB). Test country search. Test light/dark mode. Test keyboard behavior (scroll to focused field, dismiss on submit).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — T001 and T002 run in parallel
- **Setup T003**: Depends on T001 (needs i18n keys for error messages)
- **Foundational (Phase 2)**: T004 depends on T003 (needs schema). T005 has no dependencies.
- **User Stories (Phase 3+)**: All depend on T004 (hook) and T005 (screen route)
  - US1 (Phase 3): T006/T007 in parallel, T008 depends on T006/T007/T004/T005
  - US2 (Phase 4): T009 depends on T008
  - US3 (Phase 5): T010 depends on T008
  - US4 (Phase 6): T011 depends on T008
  - US5 (Phase 7): T012 depends on T008
  - US6 (Phase 8): T013 depends on T008
  - US2–US6 can all run in parallel after T008 completes
- **Polish (Phase 9)**: T014/T015/T016 depend on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational (Phase 2) — no story dependencies
- **US2 (P1)**: Depends on US1 (T008 — base form must exist)
- **US3 (P1)**: Depends on US1 (T008 — base form must exist)
- **US4 (P1)**: Depends on US1 (T008 — password fields must exist)
- **US5 (P2)**: Depends on US1 (T008 — footer must exist)
- **US6 (P3)**: Depends on US1 (T008 — full form must exist for visual review)

### Within Each User Story

- Schema (T003) before hook (T004)
- Hook (T004) before component (T008)
- Styles (T006) before component (T008)
- Base component (T008) before field additions (T009, T010, T011, T012, T013)

### Parallel Opportunities

- T001 ∥ T002 (i18n en + ar)
- T006 ∥ T007 (styles + barrel export)
- T004 ∥ T005 (hook + screen route — different files, T005 doesn't need hook yet)
- T009 ∥ T010 ∥ T011 ∥ T012 ∥ T013 (all modify SignupForm.tsx but in different sections — best done sequentially in practice to avoid merge conflicts)

---

## Parallel Example: Setup Phase

```bash
# Launch i18n tasks in parallel (different files):
Task T001: "Add signup i18n keys to src/i18n/locales/en.json"
Task T002: "Add signup i18n keys to src/i18n/locales/ar.json"

# Then schema (depends on i18n keys):
Task T003: "Create Zod schema in src/features/auth/schemas/signup.schema.ts"
```

## Parallel Example: Foundational Phase

```bash
# Hook and screen route can be done in parallel:
Task T004: "Implement useSignupForm hook in src/features/auth/hooks/useSignupForm.ts"
Task T005: "Create screen route in app/(auth)/Signup.tsx"
```

## Parallel Example: User Story 1

```bash
# Styles and barrel export in parallel:
Task T006: "Create SignupForm.styles.ts"
Task T007: "Create index.ts"

# Then main component (depends on styles + hook):
Task T008: "Implement SignupForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T005)
3. Complete Phase 3: User Story 1 (T006–T008)
4. **STOP and VALIDATE**: Form renders, 5 text inputs work, validation shows errors on submit, API call works
5. This is a functional signup form with text inputs only (no country picker or date picker yet)

### Incremental Delivery

1. Setup + Foundational → Schema, hook, and screen route ready
2. Add US1 → Basic form with text inputs → **MVP ready**
3. Add US2 → Country selection via searchable Select → Enhanced form
4. Add US3 → Date of birth via DatePicker → Full form
5. Add US4 → Password blur validation refinement → Better UX
6. Add US5 → Login navigation link → Complete flow
7. Add US6 → Visual polish → Production-ready
8. Polish → Accessibility, lint, smoke test → Ship it

### Single Developer Strategy (Recommended)

Since all tasks modify closely related files (mostly SignupForm.tsx), the recommended approach is sequential execution in phase order:

1. Phase 1: i18n + schema (3 tasks)
2. Phase 2: hook + route (2 tasks)
3. Phase 3: base form (3 tasks) — **MVP checkpoint**
4. Phases 4–8: add fields + navigation + polish (5 tasks) — one at a time
5. Phase 9: accessibility + validation + smoke test (3 tasks)

Total: 16 tasks, ~8 files created/modified

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No test tasks generated (tests not requested in spec)
- US2–US6 all modify SignupForm.tsx — do sequentially to avoid conflicts
- Background decorative components (FR-025, FR-026) skipped per research.md R9 — not implemented in login screen either
- Country data (COUNTRIES) already exists at `src/features/auth/data/countries.ts` — no need to create
- Commit after each phase completion for clean git history
