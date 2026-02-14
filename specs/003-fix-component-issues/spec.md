# Feature Specification: Fix Component Design Compliance Issues

**Feature Branch**: `003-fix-component-issues`
**Created**: 2026-02-14
**Status**: Draft
**Input**: User description: "inside this specs/002-component-design-compliance\
i have some issues\
circular progress has some deprecated stuff\
property) rotation?: NumberProp | undefined
@deprecated — Use rotate in transform prop instead.\
(property) rotation?: NumberProp | undefined
@deprecated — Use rotate in transform prop instead.\
\
also the card pressable does not have any style\
see the Button component for reference\
\
also date picker uses hardcoded and non translated strings for weekdays and months\
it also uses primitives like text and pressables, use the created components if possible"

## Clarifications

### Session 2026-02-14

- Q: What type of visual feedback should Card pressable provide (opacity, scale, or both)? → A: Opacity change (0.7-0.8 on press) - matches native platform standards

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Remove Deprecated CircularProgress Properties (Priority: P1)

Developers working with the CircularProgress component should be able to use it without encountering deprecation warnings in their development environment. The component should use current best practices for rotation transforms.

**Why this priority**: Deprecation warnings indicate code that will break in future library versions. This is critical for long-term maintainability and prevents technical debt from accumulating.

**Independent Test**: Can be fully tested by rendering a CircularProgress component and verifying no deprecation warnings appear in the console, and the visual rotation behavior remains unchanged.

**Acceptance Scenarios**:

1. **Given** CircularProgress component is rendered with rotation animation, **When** developer views the console, **Then** no deprecation warnings about "rotation" property appear
2. **Given** CircularProgress uses transform rotate instead of rotation prop, **When** component animates, **Then** visual behavior is identical to previous implementation
3. **Given** existing implementations of CircularProgress in the app, **When** the fix is applied, **Then** all instances continue to render correctly without visual regressions

---

### User Story 2 - Add Pressable Styling to Card Component (Priority: P1)

Users interacting with Card components that are pressable should receive clear visual feedback through opacity changes (reducing to 0.7-0.8 range on press) when they tap on the card, matching native platform standards and Button component patterns.

**Why this priority**: Interactive elements without visual feedback create poor user experience and accessibility issues. Users cannot tell if their tap was registered, leading to confusion and repeated taps.

**Independent Test**: Can be fully tested by rendering a pressable Card, tapping it, and verifying visual feedback (opacity/scale change) occurs similar to Button component behavior.

**Acceptance Scenarios**:

1. **Given** a Card component with pressable enabled, **When** user presses down on the card, **Then** opacity reduces to 0.7-0.8 range providing clear visual feedback
2. **Given** a Card component with pressable enabled, **When** user releases the press, **Then** card opacity returns to 1.0 (default visual state)
3. **Given** Button component as reference, **When** comparing Card pressable feedback, **Then** both components provide consistent interaction patterns
4. **Given** theme changes (light/dark mode), **When** Card is pressed, **Then** visual feedback respects theme colors and remains visible

---

### User Story 3 - Replace DatePicker Hardcoded Strings with Translations (Priority: P2)

Users viewing the DatePicker in their selected language should see weekday names and month names displayed in their language (Arabic or English), not hardcoded English strings.

**Why this priority**: While important for internationalization, this doesn't prevent the feature from functioning. However, it significantly impacts user experience for non-English speakers, especially in an Islamic app where Arabic is a primary language.

**Independent Test**: Can be fully tested by switching app language to Arabic and verifying DatePicker displays Arabic weekday/month names from translation files.

**Acceptance Scenarios**:

1. **Given** app language is set to English, **When** user opens DatePicker, **Then** weekday and month names display in English from translation files
2. **Given** app language is set to Arabic, **When** user opens DatePicker, **Then** weekday and month names display in Arabic from translation files
3. **Given** user switches language while DatePicker is open, **When** language changes, **Then** weekday and month names update to new language
4. **Given** translation files are missing a specific month or weekday, **When** DatePicker renders, **Then** fallback to English translation occurs gracefully

---

### User Story 4 - Replace DatePicker Primitives with Design System Components (Priority: P3)

Developers building or modifying the DatePicker should work with consistent, reusable components (Text, Pressable) from the design system rather than primitive React Native components, ensuring visual consistency across the app.

**Why this priority**: This is a code quality improvement that doesn't affect end users directly. It improves maintainability and ensures consistency but can be addressed after user-facing issues are resolved.

**Independent Test**: Can be fully tested by reviewing DatePicker code to verify it uses design system Text and Pressable components, and that visual rendering matches other app components.

**Acceptance Scenarios**:

1. **Given** DatePicker uses primitive Text components, **When** replaced with design system Text, **Then** all text styling remains consistent with theme (fonts, colors, sizes)
2. **Given** DatePicker uses primitive Pressable components, **When** replaced with design system Pressable, **Then** interaction feedback matches app-wide patterns
3. **Given** theme changes (light/dark mode switch), **When** DatePicker renders, **Then** all components respond correctly to theme changes
4. **Given** new design system component updates, **When** DatePicker is rendered, **Then** it automatically inherits new styling without additional work

---

### Edge Cases

- What happens when CircularProgress rotation transform value is 0 or undefined?
- How does Card pressable styling behave on iOS vs Android (different touch feedback patterns)?
- What happens when DatePicker translation keys are missing or empty?
- How does DatePicker handle RTL layout when using Arabic translations?
- What happens when user rapidly switches language while DatePicker is animating?
- How does Card pressable handle disabled state (should not show feedback)?
- What happens when CircularProgress is unmounted mid-animation?

## Requirements _(mandatory)_

### Functional Requirements

#### CircularProgress Component

- **FR-001**: CircularProgress component MUST use transform rotate property instead of deprecated rotation prop
- **FR-002**: CircularProgress MUST maintain identical visual rotation behavior after migration
- **FR-003**: CircularProgress MUST render without console warnings or deprecation notices

#### Card Component

- **FR-004**: Card component with pressable enabled MUST provide visual feedback on press using opacity change (reduce to 0.7-0.8 range)
- **FR-005**: Card pressable styling MUST follow the same interaction pattern as Button component (reference implementation)
- **FR-006**: Card pressable feedback MUST respect theme colors (light/dark mode)
- **FR-007**: Card pressable MUST NOT show feedback when disabled prop is true

#### DatePicker Component

- **FR-008**: DatePicker MUST display weekday names from i18n translation files instead of hardcoded strings
- **FR-009**: DatePicker MUST display month names from i18n translation files instead of hardcoded strings
- **FR-010**: DatePicker MUST support both English and Arabic translations for weekdays and months
- **FR-011**: DatePicker MUST update displayed text when user changes app language
- **FR-012**: DatePicker MUST use design system Text component instead of primitive React Native Text
- **FR-013**: DatePicker MUST use design system Pressable component instead of primitive React Native Pressable
- **FR-014**: DatePicker MUST maintain consistent styling with other app components when using design system components

### Key Entities _(include if feature involves data)_

- **Translation Keys**: Weekday names (Monday through Sunday) and month names (January through December) stored in i18n locale files (en.json, ar.json) with consistent key structure
- **Theme Tokens**: Pressable interaction styles (opacity values, scale factors, background colors) defined in theme configuration for reusable application across components
- **Transform Properties**: Rotation values for CircularProgress using modern transform syntax compatible with React Native's current animation APIs

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All CircularProgress instances render without deprecation warnings in development console (100% warning-free)
- **SC-002**: Card pressable provides visual feedback within 50ms of user touch, matching Button component timing
- **SC-003**: DatePicker displays correct translations in both English and Arabic with 100% accuracy for all weekdays and months
- **SC-004**: All three component fixes pass automated tests verifying visual appearance matches baseline screenshots
- **SC-005**: Code quality metrics improve with 0 hardcoded strings remaining in DatePicker and 0 primitive component usages
- **SC-006**: Developers can identify and fix similar issues in other components by following established patterns from these fixes
