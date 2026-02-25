# Feature Specification: Signup Screen

**Feature Branch**: `006-signup-screen`
**Created**: 2026-02-15
**Status**: Draft
**Input**: User description: "Create signup screen with form fields: first name, last name, email, password, confirm password, country (bottom sheet with search), date of birth (date picker component). Follow login screen structure and use app design system components."

## Clarifications

### Session 2026-02-15

- Q: When should first name and last name fields validate and show error messages? → A: On submit only - validates all fields together when user taps "Sign Up"
- Q: Where should the country list data come from for the bottom sheet? → A: Static JSON file bundled with app (COUNTRIES data already exists)
- Q: After successful account creation, where should the user be navigated? → A: Main app home screen - immediate access to core features
- Q: When the date picker opens for date of birth, what date should be pre-selected by default? → A: 18 years ago from today - reasonable adult default
- Q: What is the exact top-to-bottom order of form fields on the signup screen? → A: First name → Last name → Email → Password → Confirm password → Country → Date of birth

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Account Registration with Personal Information (Priority: P1)

A new user wants to create an account to access personalized features, save their spiritual progress, and have a complete profile within the Sabeel app.

**Why this priority**: This is the core account creation flow that enables new users to join the platform. Without this, users cannot create accounts and access personalized features.

**Independent Test**: Can be fully tested by entering all required information (first name, last name, email, password, confirm password, country, date of birth), submitting the form, and verifying successful account creation and navigation to the main app.

**Acceptance Scenarios**:

1. **Given** a new user on the signup screen, **When** they enter all required information correctly and tap "Sign Up", **Then** the keyboard dismisses, the signup button shows a loading spinner, the account is created, and they are authenticated and navigated to the main app home screen (primary features screen, not onboarding or profile completion)
2. **Given** a user on the signup screen, **When** they tap any input field, **Then** the keyboard appears and the field is focused with appropriate styling
3. **Given** a user typing in the password or confirm password field, **When** they enter characters, **Then** the characters are masked (shown as dots) for security
4. **Given** a user typing in the password fields, **When** they tap the visibility toggle icon, **Then** the password characters become visible/hidden accordingly
5. **Given** a user with form validation errors, **When** they submit the form, **Then** appropriate error messages are displayed below the relevant input fields

---

### User Story 2 - Country Selection (Priority: P1)

A user needs to select their country from a comprehensive list to complete their profile and enable region-specific features (prayer times, Islamic calendar).

**Why this priority**: Country selection is essential for core app features like accurate prayer times. This is part of the primary registration flow.

**Independent Test**: Can be tested by tapping the country field, opening the bottom sheet with searchable country list, selecting a country, and verifying it appears in the form field.

**Acceptance Scenarios**:

1. **Given** a user on the signup screen, **When** they tap the country field, **Then** a bottom sheet appears with a searchable list of all countries
2. **Given** a user viewing the country bottom sheet, **When** they type in the search field, **Then** the country list filters to show only matching countries
3. **Given** a user viewing the country bottom sheet, **When** they select a country, **Then** the bottom sheet closes and the selected country appears in the country field
4. **Given** a user with the country bottom sheet open, **When** they swipe down or tap outside the sheet, **Then** the bottom sheet closes without changing the selection

---

### User Story 3 - Date of Birth Selection (Priority: P1)

A user needs to enter their date of birth to complete their profile and verify they meet age requirements for using the app.

**Why this priority**: Date of birth is essential for age verification and is part of the primary registration flow. Some features may require age confirmation.

**Independent Test**: Can be tested by tapping the date of birth field, opening the date picker, selecting a date, and verifying it appears in the form field in a readable format.

**Acceptance Scenarios**:

1. **Given** a user on the signup screen, **When** they tap the date of birth field, **Then** the date picker component opens with a default date set to 18 years ago from today
2. **Given** a user viewing the date picker, **When** they select a date and confirm, **Then** the date picker closes and the selected date appears in the date of birth field in a localized format (e.g., "January 15, 1990" or "15 يناير 1990")
3. **Given** a user with the date picker open, **When** they cancel without selecting, **Then** the date picker closes without changing the field value

---

### User Story 4 - Password Validation and Confirmation (Priority: P1)

A user needs to create a secure password and confirm it to ensure they can access their account in the future and prevent typos during registration.

**Why this priority**: Password validation and confirmation prevent account access issues and are critical for security. This is part of the core registration flow.

**Independent Test**: Can be tested by entering a password in both fields and verifying that validation errors appear for weak passwords or mismatched confirmation.

**Acceptance Scenarios**:

1. **Given** a user entering a password, **When** the password is less than 8 characters, **Then** an error message appears below the password field stating minimum length requirement
2. **Given** a user entering a confirm password, **When** the value doesn't match the password field, **Then** an error message appears below the confirm password field stating "Passwords do not match"
3. **Given** a user with matching passwords that meet requirements, **When** both fields lose focus, **Then** no error messages are displayed for the password fields

---

### User Story 5 - Existing Account Navigation (Priority: P2)

A user who already has an account can easily navigate to the login screen instead of creating a duplicate account.

**Why this priority**: This prevents duplicate accounts and improves user experience, but it's secondary to the actual registration flow.

**Independent Test**: Can be tested by tapping the "Log in" link and verifying navigation to the login screen.

**Acceptance Scenarios**:

1. **Given** a user on the signup screen, **When** they tap "Log in" in the "Already have an account? Log in" text, **Then** they are navigated to the login screen
2. **Given** a user reading the login prompt, **When** they see "Already have an account? Log in", **Then** the "Log in" text is clearly distinguishable as a clickable link

---

### User Story 6 - Visual Experience and Brand Identity (Priority: P3)

All users accessing the signup screen should experience a spiritually-aligned, visually appealing interface that reflects Sabeel's Islamic identity and maintains consistency with the login screen.

**Why this priority**: Visual design enhances user experience and brand perception but doesn't block core functionality. A basic signup screen can work without decorative elements.

**Independent Test**: Can be tested by viewing the signup screen and verifying the presence of logo, tagline, Islamic pattern overlay, and gradient effects consistent with the login screen design.

**Acceptance Scenarios**:

1. **Given** a user viewing the signup screen, **When** the screen loads, **Then** they see the Sabeel logo with a mosque icon centered at the top
2. **Given** a user viewing the signup screen, **When** the screen loads, **Then** they see a tagline below the logo
3. **Given** a user viewing the signup screen background, **When** the screen is displayed, **Then** they see a subtle Islamic geometric pattern overlay and gradient glow effects matching the login screen style
4. **Given** a user interacting with form inputs, **When** an input is focused, **Then** visual feedback (border color change, icon color change) is provided

---

### Edge Cases

- When a user enters an email that already exists in the system, an error message appears below the email field stating "This email is already registered. Please log in or use a different email"
- When a user enters an email without the "@" symbol or invalid format, validation error appears when the field loses focus (on blur), displaying "Please enter a valid email address" below the email input field
- When a user enters a password shorter than 8 characters, an error message appears stating "Password must be at least 8 characters"
- When a user enters different values in password and confirm password fields, an error message appears below confirm password stating "Passwords do not match"
- When a user tries to submit the form with empty required fields, error messages appear below each empty field indicating "This field is required"
- When network connectivity is lost during signup attempt, the loading spinner stops, the button returns to enabled state, and an error message appears below the signup button stating "No internet connection. Please check your network and try again"
- When the registration service is unavailable or returns an error, the loading spinner stops and an error message appears below the signup button (e.g., "Service temporarily unavailable. Please try again later")
- When a user rapidly taps the signup button multiple times, only the first tap initiates registration; the button becomes disabled with a loading spinner, preventing duplicate submissions
- When keyboard covers input fields on small screen devices, the screen scrolls to keep the focused input visible; keyboard automatically dismisses when the signup button is tapped
- When a user searches for a country in the bottom sheet, the search is case-insensitive and matches partial country names
- When a user selects a date of birth that indicates they are under 13 years old, an error message appears below the date field stating age requirement
- When a user enters a very long name (50+ characters) in first name or last name fields, the input is truncated or scrollable within the field
- When a user switches between light and dark mode while on the signup screen, all visual elements update appropriately
- When a user pastes formatted text (with spaces, special characters) into name fields, the text is sanitized to prevent special characters

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a signup screen with input fields in this exact top-to-bottom order: first name, last name, email, password, confirm password, country, date of birth
- **FR-002**: System MUST display the Sabeel logo (mosque icon) in a rounded container at the top of the screen
- **FR-003**: System MUST display the app name "Sabeel" and a registration-related tagline below the logo
- **FR-004**: First name and last name input fields MUST display a user/person icon on the left side
- **FR-005**: Email input field MUST display a mail icon on the left side
- **FR-006**: Password and confirm password input fields MUST display a lock icon on the left side
- **FR-007**: Password and confirm password fields MUST display a visibility toggle button on the right side
- **FR-008**: Password and confirm password fields MUST mask characters by default (show as dots/bullets)
- **FR-009**: System MUST provide visual feedback when user taps the password visibility toggle (show/hide password characters)
- **FR-010**: Country input field MUST display a globe or location icon on the left side
- **FR-011**: Country input field MUST be tappable and open a bottom sheet with a searchable country list when tapped
- **FR-012**: Country bottom sheet MUST display a search input field at the top for filtering countries
- **FR-013**: Country bottom sheet MUST display all available countries in a scrollable list
- **FR-014**: Country bottom sheet search MUST filter countries in real-time as the user types
- **FR-015**: Country bottom sheet MUST close when a country is selected, and display the selected country in the country input field
- **FR-016**: Date of birth input field MUST display a calendar icon on the left side
- **FR-017**: Date of birth input field MUST be tappable and open the date picker component when tapped
- **FR-018**: Date picker MUST allow users to select day, month, and year; the date picker MUST default to 18 years ago from the current date when opened (e.g., if opened in 2026, default to 2008)
- **FR-019**: Date picker MUST close when a date is confirmed, and display the selected date in localized format in the date of birth field
- **FR-020**: System MUST display a full-width "Sign Up" button below the form inputs that dismisses the keyboard when tapped and shows a loading spinner (replacing button text) when registration is in progress
- **FR-021**: System MUST display "Already have an account? Log in" text with a clickable "Log in" link at the bottom
- **FR-022**: All input fields MUST display appropriate labels above them
- **FR-023**: All interactive elements (inputs, buttons, links) MUST provide visual feedback on press/focus
- **FR-024**: Input field icons MUST change color when the field is focused
- **FR-025**: System MUST display a decorative Islamic geometric pattern overlay on the background matching the login screen style
- **FR-026**: System MUST display gradient glow effects (green and gold) on the background matching the login screen style
- **FR-027**: All text and UI elements MUST support both light and dark mode color schemes
- **FR-028**: System MUST validate email format when the email field loses focus (on blur) and display validation errors immediately if format is invalid
- **FR-029**: System MUST validate that password is at least 8 characters when the password field loses focus
- **FR-030**: System MUST validate that confirm password matches password when the confirm password field loses focus
- **FR-031**: System MUST validate that all required fields are filled before enabling the signup button
- **FR-032**: System MUST validate that the selected date of birth indicates the user is at least 13 years old
- **FR-033**: System MUST display error messages for invalid inputs below the respective input fields
- **FR-034**: System MUST display network/registration errors below the signup button
- **FR-035**: The "Log in" link MUST navigate to the login screen when tapped
- **FR-036**: All user-facing text MUST support internationalization (i18n)
- **FR-037**: System MUST follow existing Sabeel design system patterns for spacing, typography, and colors
- **FR-038**: System MUST use existing custom components (Button, Input, DatePicker) from the design system
- **FR-039**: First name and last name fields MUST sanitize input to prevent special characters that are not typical in names; validation errors for name fields MUST only be displayed when the user taps "Sign Up" (on submit only, not on blur or real-time)
- **FR-040**: Country bottom sheet MUST have a handle at the top for swipe-to-dismiss functionality

### Key Entities _(include if feature involves data)_

- **User Profile**: First name, last name, email, date of birth, and country information for new account creation
- **User Credentials**: Email address (RFC 5322 format) and password (minimum 8 characters) combination for authentication
- **Registration Session**: Authenticated state created upon successful account registration
- **Form State**: Current values and validation status of all input fields (first name, last name, email, password, confirm password, country, date of birth)
- **UI State**: Visual feedback states (focused, pressed, error, disabled, loading) for all interactive elements. Loading state applies to signup button during registration and displays a spinner
- **Country List**: Comprehensive list of countries available for selection, with searchable/filterable functionality
- **Selected Date**: Date of birth value selected from the date picker, formatted according to user's locale

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can complete the signup process in under 2 minutes from screen load to successful account creation
- **SC-002**: 95% of users can successfully find and select their country using the searchable bottom sheet on first attempt
- **SC-003**: Users can identify the purpose of each input field within 2 seconds through labels and icons
- **SC-004**: Form validation provides feedback within 500ms of user input or submission
- **SC-005**: All interactive elements (buttons, links, inputs, bottom sheet, date picker) provide visual feedback within 100ms of user interaction
- **SC-006**: The signup screen layout remains visually consistent and usable across screen sizes from 320px to 428px width
- **SC-007**: Background decorative elements (pattern, gradients) do not interfere with text readability - text contrast ratio meets WCAG AA standards (4.5:1 for normal text)
- **SC-008**: Users can navigate between all interactive elements using keyboard/tab navigation in logical order (first name → last name → email → password → confirm password → country → date of birth → sign up button)
- **SC-009**: Error messages clearly communicate what went wrong and how to fix it, reducing repeated submission errors by 70%
- **SC-010**: The screen loads and displays all visual elements within 1 second on standard mobile connections
- **SC-011**: Country selection via bottom sheet completes in under 10 seconds for 90% of users (open, search, select, close)
- **SC-012**: Date of birth selection via date picker completes in under 15 seconds for 90% of users
- **SC-013**: Password mismatch errors are detected and displayed within 500ms of the confirm password field losing focus
- **SC-014**: The signup screen maintains visual consistency with the login screen (same decorative elements, spacing, and component styling)

## Assumptions _(optional)_

- The authentication backend API endpoints for user registration already exist and are functional
- Email validation uses standard RFC 5322 email format rules
- Password masking uses the platform's native secure text entry mechanism
- The app already has routing infrastructure to navigate between screens
- Translation files (i18n) for signup screen text already exist or will be added
- The Islamic geometric pattern and gradient effects match the login screen implementation
- The Sabeel design system already includes all necessary color tokens, spacing units, and typography styles
- The mosque icon is available through the existing Icon component library
- Form validation errors display below the respective input fields (not in a modal or toast)
- The DatePicker component already exists and follows the design system
- The @gorhom/bottom-sheet package is already installed and configured
- Country data (list of countries) is available as a static JSON file bundled with the app (COUNTRIES constant from auth/data/countries.ts)
- Minimum age requirement is 13 years (COPPA compliance)
- Name fields accept Unicode characters to support international names
- The signup screen follows the same structural layout as the login screen (KeyboardAvoidingView, ScrollView, SafeAreaView)

## Dependencies _(optional)_

- Existing Input component must support left and right element props (verified from login screen)
- Existing Button component must support full-width and color variants (verified from login screen)
- Existing Icon component must be available for user, mail, lock, globe/location, calendar, and visibility icons
- Existing DatePicker component must be available and functional
- @gorhom/bottom-sheet package must be installed and configured
- Theme system must provide semantic color tokens for backgrounds, text, borders, and state colors
- Responsive metrics utilities (rf, hs, vs, spacing) must be available
- i18n system must be configured and ready for translation keys
- Routing system must support navigation to login screen
- Authentication service/API must be available for registration validation and account creation
- Country data source (COUNTRIES constant from auth/data/countries.ts) must be available as static JSON bundled with the app

## Out of Scope _(optional)_

- Actual registration logic and API integration (backend implementation)
- Email verification flow (confirmation email, verification link)
- Social media signup options (Google, Apple, Facebook)
- Profile picture upload during registration
- Additional profile fields beyond those specified (phone number, gender, address, etc.)
- Terms of service and privacy policy acceptance checkboxes
- CAPTCHA or bot prevention during signup
- Password strength indicator/meter
- Real-time password strength feedback
- Username creation (using email as identifier)
- Account activation workflow
- Referral code input field
- Newsletter subscription options
- Custom password requirements beyond minimum length (special characters, uppercase, numbers)
- Autofill/password manager integration
- Session management and token handling after registration
- Welcome email or onboarding flow after signup
- Phone number verification via SMS
- Address autocomplete for location fields

## Security Considerations _(optional)_

- Password fields must use secure text entry to prevent shoulder surfing
- Password visibility toggle should only affect the current session (not persist across app launches)
- Input fields should not store sensitive data in plain text in app state
- Passwords should be transmitted securely to the backend (HTTPS)
- Error messages should not reveal whether an email already exists in detailed ways (generic "registration failed" or "email already in use")
- The signup button should be disabled during registration request to prevent multiple submissions
- Sensitive form data should be cleared from memory after successful registration or navigation away
- Date of birth validation should prevent submission of ages under 13 (COPPA compliance)
- Input sanitization should prevent injection attacks in name fields

## Accessibility _(optional)_

- All form inputs must have associated labels for screen readers
- Interactive elements must have sufficient touch target size (minimum 44x44 points)
- Color should not be the only means of conveying information (use icons + text + color)
- Focus indicators must be clearly visible for keyboard navigation
- Text contrast ratios must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Error messages must be announced by screen readers when they appear
- The password visibility toggle must have an accessible label describing its current state
- The country bottom sheet must be accessible via screen readers with proper labels
- The date picker must be accessible and provide clear feedback for screen reader users
- Form field labels must be programmatically associated with their inputs

## Performance _(optional)_

- Initial screen render should complete within 500ms
- Input field focus response should be under 100ms
- Form validation feedback should appear within 500ms of user action
- Background decorative elements should not impact frame rate (maintain 60fps)
- Images and assets should be optimized (SVG for patterns, optimized PNG for gradients if needed)
- The screen should remain responsive during registration network requests
- Country list filtering should update in real-time with no noticeable lag (under 100ms)
- Bottom sheet animation should be smooth at 60fps
- Date picker should open and close with smooth animations
- Scrolling through the country list should be smooth even with 200+ countries
