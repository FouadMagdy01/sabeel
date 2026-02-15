# Research: Login Screen

## R1: Form Validation Library

**Decision**: Zod (v4.3.6) with react-hook-form (v7.71.1) and @hookform/resolvers (v5.2.2)
**Rationale**: Already installed in the project. Zod provides type-safe schema validation; react-hook-form handles form state and error propagation; @hookform/resolvers bridges them. User explicitly requested Zod with localized error messages via `t()` from i18n.
**Alternatives considered**: Manual validation (rejected — less type-safe, duplicates Zod's work), Yup (not installed, Zod already available)

## R2: Localized Error Messages Pattern

**Decision**: Define Zod schemas as factory functions that accept `t` from `useTranslation()`. Schema file lives outside the component at `src/features/auth/schemas/login.schema.ts` and exports a `createLoginSchema(t)` function.
**Rationale**: Zod error messages are set at schema creation time. Since i18n `t()` is a hook-level function, the schema must be created inside a hook/component context. A factory pattern keeps schema logic separated from the component while allowing localized messages. User explicitly requested schemas outside component with localized error messages.
**Alternatives considered**: Static schema with custom error map (rejected — harder to maintain per-field messages), schema inside component (rejected — user wants separation)

## R3: Authentication Backend

**Decision**: Supabase `signInWithPassword({ email, password })` via the existing `supabase` client from `src/integrations/supabase.ts`
**Rationale**: Supabase is the established backend per constitution. Client is already configured with MMKV-based persistent auth storage and auto token refresh.
**Alternatives considered**: None — Supabase is mandated by the constitution's Technology Constraints.

## R4: Background Decorative Effects

**Decision**: Use `expo-linear-gradient` (already installed) for gradient glow blobs positioned absolutely behind content. Islamic pattern achieved via a tiled SVG pattern rendered with `react-native-svg` (already installed).
**Rationale**: The HTML design uses CSS blur gradients and SVG background patterns. `expo-linear-gradient` is already used in the Card component. `react-native-svg` is already available for the tiled pattern.
**Alternatives considered**: Static image assets for gradients (rejected — not theme-aware, larger bundle size), omitting pattern (rejected — spec requires FR-017)

## R5: Keyboard Handling

**Decision**: Wrap the login form in `KeyboardAvoidingView` with `ScrollView` to handle keyboard coverage on small screens. Dismiss keyboard on login button tap via `Keyboard.dismiss()`.
**Rationale**: React Native standard pattern for forms. Ensures inputs remain visible when keyboard opens (spec edge case). Login button dismisses keyboard per clarification.
**Alternatives considered**: `KeyboardAwareScrollView` from third-party (rejected — adds unnecessary dependency per Principle V)

## R6: Navigation Targets

**Decision**: Forgot Password navigates to a placeholder screen (not implemented yet per spec out-of-scope). Sign Up navigates to `/(auth)/Signup` (screen already exists). Continue as Guest navigates to `/(main)/(tabs)` (skip auth). All use `expo-router` `router.push()` / `router.replace()`.
**Rationale**: Routing infrastructure already exists. Auth layout has both `index` and `Signup` screens registered.
**Alternatives considered**: None — expo-router is mandated.

## R7: Existing i18n Keys

**Decision**: Reuse existing keys from `auth.login.*`, `auth.validation.*`, `auth.labels.*`. Add missing keys for: tagline (`auth.login.tagline`), app name display (`auth.login.appName`), and network error messages (`auth.login.invalidCredentials`, `auth.login.serviceUnavailable`).
**Rationale**: en.json and ar.json already have comprehensive auth translation keys. Only a few additions needed.
**Alternatives considered**: None — full rewrite would break existing references.

## R8: Component Reuse Assessment

**Decision**: All needed components already exist in the design system:

- `Button` — supports `loading`, `fullWidth`, `contained`/`outlined` variants
- `Input` — supports `leftElement`, `rightElement`, `error`, `errorText`, `label`, `filled` variant
- `IconButton` — for password visibility toggle (`ghost` variant, Feather `eye`/`eye-off`)
- `Icon` — for input icons (Feather `mail`, `lock`)
- `Typography` — for headings, tagline, links
- `Divider` — for "Or" separator (labeled divider with `children`)

No new shared components needed. The login screen itself is a feature screen.
**Alternatives considered**: Creating a custom `TextLink` component (rejected — Typography with `onPress` and text color styling suffices)
