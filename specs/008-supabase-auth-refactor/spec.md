# Feature Specification: Supabase Authentication Refactor

**Feature Branch**: `008-supabase-auth-refactor`
**Created**: 2026-02-15
**Status**: Draft
**Input**: User description: "Implement Supabase authentication logic with login and register functionality. The current implementation is poorly structured with spaghetti code. This feature will refactor the authentication system to use React Query instead of direct async/await calls, create a proper authentication service layer with hooks, support email/password authentication, include proper error handling and validation, and integrate with existing Supabase database schema (profiles, user_roles, user_streaks tables). Reference: The existing web implementation shows the desired authentication flows but needs to be adapted for React Native mobile app without web-specific features (no window.location, no email confirmation links)."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Email/Password Registration (Priority: P1)

A new user downloads the Sabeel app and wants to create an account using their email and password to access personalized features like prayer tracking, groups, and challenges.

**Why this priority**: This is the foundation of the authentication system. Without user registration, no personalized features can function. This represents the minimum viable authentication feature.

**Independent Test**: Can be fully tested by entering valid user details (first name, last name, email, password, country, date of birth) and verifying account creation with automatic profile, user_streaks, and user_roles record creation. Success is confirmed when user can immediately log in with their new credentials.

**Acceptance Scenarios**:

1. **Given** user is on the registration screen, **When** user enters valid email, password (min 8 chars, at least one letter and one number), first name, last name, country, and date of birth and submits, **Then** account is created successfully via the `register-user` edge function which atomically creates auth user, profile, user_streaks (via trigger), and user_roles records
2. **Given** user enters an email that already exists, **When** user attempts to register, **Then** user receives clear error message "Email already registered" without exposing sensitive information
3. **Given** user enters a password that does not meet requirements (min 8 chars, at least one letter and one number), **When** user attempts to register, **Then** user receives appropriate validation error before submission
4. **Given** user successfully registers, **When** account is created, **Then** user is automatically logged in and directed to the main app screen without requiring additional login
5. **Given** user registration fails due to network error, **When** user retries, **Then** user receives helpful error message and can retry without data loss

---

### User Story 2 - Email/Password Login (Priority: P1)

A returning user wants to log into their account using their registered email and password to access their data, streaks, and groups.

**Why this priority**: This is equally critical as registration. Without login, returning users cannot access their accounts. Together with registration, this forms the complete authentication MVP.

**Independent Test**: Can be fully tested by entering valid credentials for an existing account and verifying successful login with user session creation and profile data retrieval. Success is confirmed when user lands on the main app screen with their personalized data loaded.

**Acceptance Scenarios**:

1. **Given** user has a registered account, **When** user enters correct email and password and submits, **Then** user is logged in successfully and redirected to main app screen with user data loaded
2. **Given** user enters incorrect password, **When** user attempts to login, **Then** user receives error message "Invalid email or password" without specifying which credential is wrong
3. **Given** user enters unregistered email, **When** user attempts to login, **Then** user receives same error message "Invalid email or password" to prevent email enumeration
4. **Given** user successfully logs in, **When** session is created, **Then** user remains logged in across app restarts until explicit logout
5. **Given** user login fails due to network error, **When** error occurs, **Then** user receives clear error message and can retry without re-entering credentials

---

### User Story 3 - Persistent Authentication Session (Priority: P2)

A user who has logged in previously wants the app to remember their session so they don't have to log in every time they open the app.

**Why this priority**: This significantly improves user experience by reducing friction. While not strictly necessary for MVP, it's highly valuable for user retention and expected behavior in modern apps.

**Independent Test**: Can be fully tested by logging in once, closing the app, reopening it, and verifying user is still logged in without re-authentication. Session should persist until explicit logout or token expiration.

**Acceptance Scenarios**:

1. **Given** user has logged in successfully, **When** user closes and reopens the app, **Then** user remains logged in and sees main app screen immediately
2. **Given** user has an active session, **When** user's session token approaches expiration, **Then** the system automatically refreshes the token in the background; if refresh fails (e.g., revoked token), user is logged out and redirected to login screen
3. **Given** user explicitly logs out, **When** user reopens the app, **Then** user sees the login screen and must authenticate again
4. **Given** user has active session on one device, **When** user logs in on another device, **Then** both sessions remain active (multiple concurrent sessions allowed)

---

### User Story 4 - Logout Functionality (Priority: P2)

A logged-in user wants to sign out of their account to ensure their data is not accessible if device is shared or lost.

**Why this priority**: Security and privacy feature that, while important, is not required for basic authentication functionality. Users can still use the app without logout if needed.

**Independent Test**: Can be fully tested by logging in, triggering logout, and verifying session is cleared and user is redirected to authentication screen. Attempting to access protected features should fail.

**Acceptance Scenarios**:

1. **Given** user is logged in, **When** user taps logout button, **Then** user session is cleared and user is redirected to login screen
2. **Given** user has logged out, **When** user attempts to access any protected feature, **Then** user is prompted to log in again
3. **Given** logout action fails due to network error, **When** error occurs, **Then** local session is still cleared and user is logged out locally
4. **Given** user logs out, **When** user returns to login screen, **Then** previous email is not pre-filled for security

---

### User Story 5 - Profile Creation and Integration (Priority: P3)

When a user registers or logs in for the first time, the system should automatically create or retrieve their profile data including user_streaks and user_roles to enable all app features.

**Why this priority**: This is backend integration functionality that happens automatically. While critical for data integrity, it's transparent to users and can be implemented after core authentication flows are working.

**Independent Test**: Can be fully tested by registering a new account and verifying that profiles, user_streaks, and user_roles tables all receive correct entries with proper relationships and defaults.

**Acceptance Scenarios**:

1. **Given** user successfully registers, **When** account is created, **Then** profile record is created with first_name, last_name, display_name, email, country, date_of_birth, timezone, and is_guest=false
2. **Given** profile is created, **When** profile record is inserted, **Then** user_streaks record is automatically created via database trigger with current_streak=0, longest_streak=0, total_points=0
3. **Given** profile is created, **When** user account is created, **Then** user_roles record is created with role='user' to establish default permissions
4. **Given** user logs in for first time after registration, **When** login succeeds, **Then** user profile data is retrieved and cached for app use
5. **Given** profile data is incomplete or missing, **When** user logs in, **Then** system attempts to recreate missing data or prompts user to complete profile

---

### Edge Cases

- What happens when user attempts registration with invalid email format (e.g., "notanemail")?
  - **Answer**: Client-side validation catches this before submission and shows "Invalid email address" error
- What happens when user's session token expires while using the app?
  - **Answer**: Supabase client auto-refreshes tokens in the background (autoRefreshToken: true). User only sees "Session expired" if the refresh token itself is revoked or expired, at which point they are redirected to login screen
- What happens when registration fails after Supabase auth account is created but before profile record is created?
  - **Answer**: The `register-user` edge function handles auth user + profile + role creation atomically on the server. If it fails, no partial state is left. After successful edge function call, the client auto-logs in via signInWithPassword
- What happens when user tries to register with email that exists but has no confirmed email (unconfirmed account)?
  - **Answer**: System treats this as duplicate email and shows "Email already registered" error to maintain security
- What happens when multiple rapid login attempts occur (potential rate limiting)?
  - **Answer**: Supabase handles rate limiting automatically; user receives appropriate error message if rate limit exceeded
- What happens when user loses internet connection during registration/login?
  - **Answer**: User receives "Network error" message with retry option; no partial accounts are created
- What happens when profile creation succeeds but user_streaks or user_roles creation fails?
  - **Answer**: Database trigger ensures atomicity; entire transaction rolls back if any part fails
- What happens when user credentials are valid but profile data fetch fails?
  - **Answer**: User is logged in but receives warning "Unable to load profile data"; retry mechanism attempts to fetch again

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow users to create accounts using email and password (minimum 8 characters, at least one letter and one number) via the `register-user` edge function which atomically creates auth user + profile + user_roles
- **FR-002**: System MUST validate email format before submission to prevent invalid registrations
- **FR-003**: System MUST collect required profile information during registration (first name, last name, email, password, country, date of birth)
- **FR-004**: System MUST ensure profile record is created in profiles table upon successful registration (handled atomically by `register-user` edge function) with user_id, first_name, last_name, display_name (computed from names), email, country, date_of_birth, timezone (auto-detected), and is_guest=false
- **FR-005**: System MUST automatically trigger user_streaks record creation via database trigger when profile is created (never manually insert user_streaks)
- **FR-006**: System MUST automatically create user_roles record with role='user' upon successful registration
- **FR-007**: System MUST authenticate users via email and password credentials
- **FR-008**: System MUST create persistent session upon successful login that survives app restarts
- **FR-009**: System MUST retrieve user profile data (from profiles table) upon successful login
- **FR-010**: System MUST allow users to explicitly log out, clearing all local session data
- **FR-011**: System MUST redirect logged-out users to login screen when attempting to access protected features
- **FR-012**: System MUST handle session token refresh automatically in the background; if refresh fails (e.g., revoked token), gracefully redirect to login screen
- **FR-013**: System MUST prevent duplicate email registrations by checking for existing accounts
- **FR-014**: System MUST display appropriate error messages for authentication failures without exposing sensitive information (e.g., don't reveal if email exists)
- **FR-015**: System MUST use React Query for all Supabase authentication and profile data calls to enable caching, retry logic, and optimistic updates
- **FR-016**: System MUST implement authentication service layer with custom React hooks (useLogin, useRegister, useLogout, useSession, useProfile) to encapsulate authentication logic
- **FR-017**: System MUST NOT use web-specific features (window.location, email confirmation links) for React Native compatibility
- **FR-018**: System MUST validate password requirements (minimum 8 characters, at least one letter and one number) before submission, aligned with server-side validation in the `register-user` edge function
- **FR-019**: System MUST validate required fields (first name, last name, email, password, country, date of birth) before submission
- **FR-020**: System MUST handle network errors gracefully with user-friendly error messages and retry capabilities

### Key Entities _(include if feature involves data)_

- **User Authentication**: Supabase auth.users table (managed by Supabase Auth) containing email and password hash
- **Profile**: profiles table containing user_id (FK to auth.users), first_name, last_name, display_name, email, country, date_of_birth, timezone, avatar_url, is_guest (false for registered users), created_at, updated_at
- **User Streaks**: user_streaks table containing user_id (FK to profiles.user_id), current_streak, longest_streak, last_completion_date, total_points, streak_requirements (JSONB), auto-created via trigger
- **User Roles**: user_roles table containing user_id (FK to auth.users), role (enum: 'admin', 'moderator', 'user'), created_at
- **Session**: Supabase session object containing access_token, refresh_token, user object, and expiration time

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can complete account registration in under 90 seconds (from opening registration screen to being logged in)
- **SC-002**: Users can log in to existing account in under 30 seconds
- **SC-003**: 95% of registration attempts succeed without errors (excluding invalid input cases)
- **SC-004**: 98% of login attempts for valid credentials succeed without errors
- **SC-005**: User sessions persist across app restarts 100% of the time until explicit logout or token expiration
- **SC-006**: Profile data is retrieved and available within 2 seconds of successful login
- **SC-007**: All authentication-related Supabase calls use React Query, eliminating direct async/await patterns
- **SC-008**: Zero authentication logic exists in UI components (all logic encapsulated in custom hooks and service layer)
- **SC-009**: System handles network errors gracefully with user-friendly messages in 100% of cases
- **SC-010**: No web-specific code (window.location, document, localStorage) exists in authentication flow for React Native compatibility

## Clarifications

### Session 2026-02-15

- Q: Password validation: spec said 6 chars, edge function requires 8 chars with letter+number? → A: Aligned to server: min 8 chars, at least one letter and one number (per R8 in research.md)
- Q: Registration approach: client-side signUp vs edge function? → A: Use `register-user` edge function for atomic server-side creation (per R1 in research.md)
- Q: Session token expiration behavior? → A: Supabase auto-refreshes tokens (autoRefreshToken: true); user only sees expiration if refresh token is revoked (per R4 in research.md)
- Q: Login approach: direct auth vs login-user edge function? → A: Use direct `supabase.auth.signInWithPassword` for automatic session management (per R2 in research.md)
- Q: Auth state management: React Query vs context? → A: AuthProvider context with `onAuthStateChange` for session state; React Query for mutations (login/register/logout) and queries (profile) (per R3 in research.md)

## Assumptions

- React Query is already configured in the project with appropriate query client setup
- Supabase client is already configured and accessible via `@supabase/supabase-js`
- Database schema (profiles, user_roles, user_streaks) already exists with proper triggers and constraints as documented in supabase/docs/SCHEMA.md
- React Native app does not require email confirmation (the `register-user` edge function uses `auth.admin.createUser` with `email_confirm: true`, meaning users are immediately confirmed and can log in right after registration)
- Timezone detection is available via standard JavaScript `Intl.DateTimeFormat().resolvedOptions().timeZone`
- Country selection component already exists in the project
- Date picker component already exists in the project
- Form validation library (react-hook-form + zod) is already available in the project
- i18n (react-i18next) is already configured for error messages and UI text
- No OAuth providers (Google, Apple) are in scope for this refactor (email/password only)
- Guest/anonymous authentication is out of scope for this refactor
- Password reset/forgot password functionality is out of scope for this refactor
- Email change functionality is out of scope for this refactor
- Multi-factor authentication (MFA) is out of scope for this refactor

## Dependencies

- @tanstack/react-query (already configured in project)
- @supabase/supabase-js (Supabase client)
- react-hook-form (form management)
- zod (validation schemas)
- react-i18next (internationalization)
- Existing database schema: profiles, user_roles, user_streaks tables with proper triggers
- Existing database trigger: on_profile_created (auto-creates user_streaks)
- Date picker component (already exists in project)
- Country selection component (already exists in project)

## Out of Scope

The following features are explicitly NOT included in this specification:

- OAuth authentication (Google, Apple, Facebook, etc.)
- Guest/anonymous user authentication
- Password reset and forgot password flows
- Email change functionality
- Multi-factor authentication (MFA/2FA)
- Email verification via confirmation link
- Social authentication providers
- Phone number authentication
- Biometric authentication (Face ID, Touch ID)
- Password strength requirements beyond minimum 8 characters with letter+number (weak password list check is handled server-side by the edge function)
- Account deletion functionality
- Profile editing functionality (separate feature)
- User role management (admin assignment, etc.)
