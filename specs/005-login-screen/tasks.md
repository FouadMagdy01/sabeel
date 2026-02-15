# Tasks: Login Screen

**Input**: Design documents from `/specs/005-login-screen/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/auth-api.md

**Tests**: Not explicitly requested in feature specification. Test tasks are omitted per constitution (testing optional per feature).

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: i18n key additions and validation schema — shared across all user stories

- [x] T001 [P] Add missing i18n keys (appName, tagline, invalidCredentials, serviceUnavailable) to `src/i18n/locales/en.json` under `auth.login` namespace
- [x] T002 [P] Add corresponding Arabic i18n keys (appName, tagline, invalidCredentials, serviceUnavailable) to `src/i18n/locales/ar.json` under `auth.login` namespace
- [x] T003 Create Zod login schema factory with localized error messages in `src/features/auth/schemas/login.schema.ts` — export `createLoginSchema(t: TFunction)` returning `z.object({ email: z.string().min(1, t('auth.validation.emailRequired')).email(t('auth.validation.emailInvalid')), password: z.string().min(1, t('auth.validation.passwordRequired')).min(8, t('auth.validation.passwordMinLength')) })` and export `LoginFormData` type

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Custom hook that encapsulates form logic — MUST be complete before the login screen can be built

**⚠️ CRITICAL**: Login screen (Phase 3) depends on this hook

- [x] T004 Create `useLoginForm` custom hook in `src/features/auth/hooks/useLoginForm.ts` — use `useTranslation()` to get `t`, call `createLoginSchema(t)` from `src/features/auth/schemas/login.schema.ts`, configure `useForm<LoginFormData>({ resolver: zodResolver(schema), mode: 'onBlur', defaultValues: { email: '', password: '' } })`. Manage `isPasswordVisible` (boolean toggle), `serverError` (string|null, cleared on new submission). Implement `handleLogin` that: calls `Keyboard.dismiss()`, sets submitting state, calls `supabase.auth.signInWithPassword({ email, password })`, on success calls `router.replace('/(main)/(tabs)')`, on error maps Supabase error to localized `serverError` using `t('auth.login.invalidCredentials')` for auth errors and `t('errors.network')` for network errors. Export `{ control, errors, isSubmitting, serverError, isPasswordVisible, togglePasswordVisibility, handleLogin, handleSubmit }`

**Checkpoint**: Schema and hook ready — login screen can now be implemented

---

## Phase 3: User Story 1 — Email and Password Login (Priority: P1) 🎯 MVP

**Goal**: Users can enter email/password, see validation errors on blur, submit login, see loading state, and navigate to the main app on success

**Independent Test**: Enter valid email/password → tap Login → spinner shows → navigate to main app. Enter invalid email → blur → error message appears. Submit with wrong password → inline error below button.

### Implementation for User Story 1

- [x] T005 [US1] Create the login screen layout in `app/(auth)/index.tsx` — replace the existing placeholder. Structure: `KeyboardAvoidingView` (behavior=padding on iOS) wrapping a `ScrollView` (contentContainerStyle flexGrow 1, justify space-between). Three sections inside a main `View` (flex 1, padding horizontal using `spacing.p24`): Header section (centered, top padding), Form section (gap between inputs), Footer section (bottom padding). Use `createStyleSheet((theme) => ({...}))` for all styles. Import `useLoginForm` from `@/features/auth/hooks/useLoginForm`, `useTranslation` from react-i18next, `Controller` from react-hook-form
- [x] T006 [US1] Implement the form section in `app/(auth)/index.tsx` — Email `Input` with `variant="filled"` `size="large"` `label={t('auth.labels.email')}` `placeholder={t('auth.login.emailPlaceholder')}` `leftElement={<Icon familyName="Feather" iconName="mail" variant="muted" size={20} />}` `keyboardType="email-address"` `autoCapitalize="none"` `autoComplete="email"`. Wire with `Controller` from react-hook-form using `control` from `useLoginForm`. Show `error={!!errors.email}` `errorText={errors.email?.message}`. Password `Input` with `variant="filled"` `size="large"` `label={t('auth.labels.password')}` `placeholder={t('auth.login.passwordPlaceholder')}` `leftElement={<Icon familyName="Feather" iconName="lock" variant="muted" size={20} />}` `rightElement={<IconButton familyName="Feather" iconName={isPasswordVisible ? 'eye-off' : 'eye'} variant="ghost" iconVariant="muted" size="small" onPress={togglePasswordVisibility} accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'} />}` `secureTextEntry={!isPasswordVisible}`. Wire with `Controller`. Show `error={!!errors.password}` `errorText={errors.password?.message}`
- [x] T007 [US1] Implement the login button and server error display in `app/(auth)/index.tsx` — `Button` with `variant="contained"` `color="primary"` `size="large"` `fullWidth` `loading={isSubmitting}` `onPress={handleSubmit(handleLogin)}` `disabled={isSubmitting}` children=`{t('auth.login.loginButton')}`. Below the button, conditionally render a `Typography` with `type="caption"` `color="error"` `align="center"` showing `serverError` when non-null. Add top margin between password field and button using `spacingV.p16`

**Checkpoint**: At this point, the core login flow is fully functional — email/password input with validation, submission with loading state, Supabase auth integration, error handling, and navigation on success

---

## Phase 4: User Story 2 — Password Recovery (Priority: P2)

**Goal**: Users can tap "Forgot Password?" to initiate password recovery

**Independent Test**: Tap "Forgot Password?" link → visual feedback on press → navigation initiated (or placeholder action)

### Implementation for User Story 2

- [x] T008 [US2] Add "Forgot Password?" link in `app/(auth)/index.tsx` — below the password input field, add a `View` with `alignItems: 'flex-end'` containing a `Pressable` wrapping a `Typography` with `type="caption"` `size="sm"` `color="accent"` text=`{t('auth.login.forgotPassword')}`. On press, navigate using `router.push` to a placeholder route or `console.log('Forgot password - not yet implemented')`. Style with `marginTop: spacingV.p8`

**Checkpoint**: Forgot password link visible and interactive

---

## Phase 5: User Story 3 — Guest Access (Priority: P2)

**Goal**: Users can skip authentication and browse the app as a guest

**Independent Test**: Tap "Continue as Guest" → navigate to main app without authentication

### Implementation for User Story 3

- [x] T009 [US3] Add "Or" divider and "Continue as Guest" button in `app/(auth)/index.tsx` — in the footer section, add `Divider` component with children=`{t('auth.login.or')}`. Below it add `Button` with `variant="outlined"` `size="large"` `fullWidth` `onPress={() => router.replace('/(main)/(tabs)')}` children=`{t('auth.login.continueAsGuest')}`. Add appropriate spacing with `spacingV.p24` gap between divider and button

**Checkpoint**: Guest access flow works independently

---

## Phase 6: User Story 4 — New Account Creation (Priority: P2)

**Goal**: Users can navigate to the sign up screen from the login screen

**Independent Test**: Tap "Sign up" link → navigate to `/(auth)/Signup`

### Implementation for User Story 4

- [x] T010 [US4] Add "Don't have an account? Sign up" text in `app/(auth)/index.tsx` — in the footer section below the guest button, add a `View` with `flexDirection: 'row'` `justifyContent: 'center'` `gap: spacing.p4`. Inside: `Typography` with `type="body"` `size="sm"` `color="secondary"` text=`{t('auth.login.noAccount')}`, and a `Pressable` wrapping `Typography` with `type="body"` `size="sm"` `color="brandPrimary"` `weight="semiBold"` text=`{t('auth.login.createAccount')}` onPress=`{() => router.push('/(auth)/Signup')}`

**Checkpoint**: Sign up navigation works

---

## Phase 7: User Story 5 — Visual Experience and Brand Identity (Priority: P3)

**Goal**: Login screen has the full branded visual experience with logo, tagline, Islamic pattern, and gradient glows

**Independent Test**: View the login screen — logo with mosque icon visible at top, "Sabeel" heading and tagline displayed, Islamic pattern overlay and gradient glow effects visible in background, light/dark mode both look correct

### Implementation for User Story 5

- [x] T011 [P] [US5] Implement the header section in `app/(auth)/index.tsx` — centered `View` with: Logo container (`View` with `width: hs(80)` `height: vs(80)` `borderRadius: 16` `backgroundColor: theme.colors.background.elevated` `alignItems: 'center'` `justifyContent: 'center'` `overflow: 'hidden'`) containing `Icon` with `familyName="MaterialIcons"` `iconName="mosque"` `variant="accent"` `size={rf(40)}`. Below logo: `Typography` with `type="heading"` `size="3xl"` `weight="bold"` `color="primary"` `align="center"` text=`{t('auth.login.appName')}`. Below name: `Typography` with `type="body"` `size="sm"` `color="muted"` `align="center"` `uppercase` text=`{t('auth.login.tagline')}`. Use `spacingV.p16` gap between elements
- [x] T012 [P] [US5] Implement background decorative elements in `app/(auth)/index.tsx` — add absolute-positioned elements behind content (zIndex -1). Two `LinearGradient` components from `expo-linear-gradient`: top-left gradient blob (position absolute, top: -hs(60), left: -hs(60), width: hs(250), height: vs(250), borderRadius: hs(125), opacity: 0.15, colors from `theme.colors.gradient.primary`), bottom-right gradient blob (position absolute, bottom: -hs(60), right: -hs(60), width: hs(250), height: vs(250), borderRadius: hs(125), opacity: 0.1, colors using `[theme.colors.brand.tertiary, 'transparent']`). Add an Islamic geometric pattern overlay using an `Svg` from `react-native-svg` with absolute positioning, full width/height, opacity 0.03-0.05. Pattern: repeating cross/star motif using `Path` elements with `fill={theme.colors.text.primary}`. Use `viewBox="0 0 60 60"` and `patternUnits="userSpaceOnUse"` via `Defs` + `Pattern` + `Rect` fill

**Checkpoint**: Full visual design matches the HTML inspiration — logo, tagline, gradient glows, Islamic pattern overlay, themed colors

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements that affect multiple user stories

- [x] T013 Add `accessibilityLabel` and `accessibilityRole` props to all interactive elements in `app/(auth)/index.tsx` — buttons get `accessibilityRole="button"`, inputs get `accessibilityLabel` with label text, password toggle gets dynamic label (show/hide), links get `accessibilityRole="link"`
- [x] T014 Verify light and dark mode visual correctness in `app/(auth)/index.tsx` — ensure all colors use theme tokens, gradient glows look correct in both modes, text contrast meets WCAG AA (4.5:1), pattern overlay is subtle in both modes
- [x] T015 Run `npm run validate` (type-check + lint + format) and fix any violations — ensure no hardcoded strings, no inline styles, no `any` types, all imports resolved, Prettier formatting applied

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. T001 and T002 can run in parallel.
- **Foundational (Phase 2)**: Depends on T003 (schema). T004 depends on T003.
- **User Story 1 (Phase 3)**: Depends on T004 (hook). T005→T006→T007 are sequential (same file).
- **User Stories 2-4 (Phases 4-6)**: Depend on T005 (screen layout exists). T008, T009, T010 are sequential additions to the same file.
- **User Story 5 (Phase 7)**: T011 and T012 can run in parallel (different sections of same file, but independent additions). Both depend on T005 (screen layout).
- **Polish (Phase 8)**: Depends on all user story phases being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on Setup + Foundational. **MVP — can be delivered alone.**
- **User Story 2 (P2)**: Depends on US1 screen layout (T005). Adds to existing screen.
- **User Story 3 (P2)**: Depends on US1 screen layout (T005). Adds to existing screen.
- **User Story 4 (P2)**: Depends on US1 screen layout (T005). Adds to existing screen.
- **User Story 5 (P3)**: Depends on US1 screen layout (T005). Can be added last as visual polish.

### Within Each User Story

- Schema before hook (T003 → T004)
- Hook before screen (T004 → T005)
- Screen layout before form (T005 → T006)
- Form before button/error (T006 → T007)
- Core screen before footer/background additions

### Parallel Opportunities

- T001 and T002 can run in parallel (different locale files)
- T011 and T012 can run in parallel (independent screen sections)
- All user stories 2-4 (T008, T009, T010) are independent features but operate on the same file — execute sequentially

---

## Parallel Example: Phase 1 Setup

```bash
# Launch both locale updates together:
Task: "Add English i18n keys in src/i18n/locales/en.json"
Task: "Add Arabic i18n keys in src/i18n/locales/ar.json"
```

## Parallel Example: User Story 5

```bash
# Launch header and background together:
Task: "Implement header section (logo, name, tagline) in app/(auth)/index.tsx"
Task: "Implement background decorative elements in app/(auth)/index.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004)
3. Complete Phase 3: User Story 1 (T005-T007)
4. **STOP and VALIDATE**: Login with email/password works, validation on blur, loading state, error handling
5. Deploy/demo if ready — core login is functional

### Incremental Delivery

1. Setup + Foundational → Schema and hook ready
2. User Story 1 → Core login works → **MVP!**
3. User Story 2 → Forgot password link added
4. User Stories 3+4 → Guest access and sign up link added
5. User Story 5 → Full visual polish (logo, pattern, gradients)
6. Polish → Accessibility, mode verification, lint pass

### Single Developer Strategy (Recommended)

Execute sequentially: T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015

Each task builds on the previous. Commit after each logical group (setup, hook, screen layout, form, footer, visuals, polish).

---

## Notes

- All tasks operate on only 5 files total: 2 new (`login.schema.ts`, `useLoginForm.ts`) + 3 modified (`en.json`, `ar.json`, `index.tsx`)
- No new dependencies need to be installed — zod, react-hook-form, @hookform/resolvers, expo-linear-gradient, react-native-svg are all already in package.json
- The existing `Input`, `Button`, `Icon`, `IconButton`, `Typography`, and `Divider` components are used as-is — no modifications to shared components
- Zod schema lives outside the component per user request — factory pattern with `t()` for localized messages
- All error messages are localized — both field validation (Zod) and server errors (mapped in hook)
