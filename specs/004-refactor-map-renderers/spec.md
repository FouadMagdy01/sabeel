# Feature Specification: Refactor Map Renderers in Home Components

**Feature Branch**: `004-refactor-map-renderers`
**Created**: 2026-02-14
**Status**: Draft
**Input**: User description: "Move map function return JSX to separate components or helper functions in AzkarProgress, PrayersProgress, and RandomActsGrid components"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Code Maintainability Improvement (Priority: P1)

Developers working on the home screen components need to understand and modify the rendering logic for list items. Currently, inline map functions with complex JSX make it harder to read, test, and maintain the code.

**Why this priority**: This refactor directly impacts developer productivity and code quality. Each of the three components has inline map functions that mix business logic with presentation, making the codebase harder to maintain and extend.

**Independent Test**: Can be fully tested by reviewing the component code structure and verifying that render logic is extracted into separate, named functions or components that are easier to understand and maintain.

**Acceptance Scenarios**:

1. **Given** a developer opens AzkarProgress.tsx, **When** they review the component, **Then** the azkar item rendering logic is in a separate, clearly-named function or component
2. **Given** a developer needs to modify prayer circle rendering, **When** they open PrayersProgress.tsx, **Then** the prayer item rendering logic is extracted and easily identifiable
3. **Given** a developer wants to update random acts card styling, **When** they review RandomActsGrid.tsx, **Then** the card rendering logic is in a separate function or component with clear purpose

---

### User Story 2 - Consistent Component Architecture (Priority: P2)

Development teams need consistent patterns across the codebase to reduce cognitive load when switching between components.

**Why this priority**: Establishing a consistent renderItem pattern across these three similar components creates a reusable pattern for future list-based components and makes onboarding new developers easier.

**Independent Test**: Can be tested by comparing the three component files and verifying they follow the same architectural pattern for rendering list items.

**Acceptance Scenarios**:

1. **Given** all three components are refactored, **When** a developer reviews them, **Then** they use the same renderItem pattern
2. **Given** a new developer joins the team, **When** they learn one component's structure, **Then** they can immediately understand the other two components

---

### User Story 3 - Improved Testability (Priority: P3)

QA engineers and developers need to write unit tests for individual rendering logic without testing the entire component.

**Why this priority**: Extracting render logic enables isolated testing of rendering behavior, making tests more focused and easier to maintain.

**Independent Test**: Can be tested by attempting to write unit tests for the extracted render functions in isolation from the parent component.

**Acceptance Scenarios**:

1. **Given** render logic is extracted, **When** a developer writes tests, **Then** they can test the renderItem function independently of the parent component
2. **Given** a bug occurs in item rendering, **When** writing a regression test, **Then** the test can target the specific render function rather than the entire component

---

### Edge Cases

- What happens when the render function receives invalid or unexpected data (null, undefined, missing required fields)?
- How does the refactored code handle empty arrays (no items to render)?
- Does the extraction maintain existing behavior for event handlers and ripple effects?
- Are theme values and translations still properly passed to extracted components?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST extract inline map function JSX in AzkarProgress.tsx into a separate renderItem function or component
- **FR-002**: System MUST extract inline map function JSX in PrayersProgress.tsx into a separate renderItem function or component
- **FR-003**: System MUST extract inline map function JSX in RandomActsGrid.tsx into a separate renderItem function or component
- **FR-004**: Extracted render logic MUST maintain all existing functionality (press handlers, ripple effects, styling, icons, animations)
- **FR-005**: Extracted render functions MUST receive all necessary props (item data, theme, translations, event handlers)
- **FR-006**: Refactored code MUST not change the visual appearance or behavior of any component
- **FR-007**: Component file structure MUST remain consistent with existing project conventions (component folder with .tsx, .styles.ts, .types.ts files)
- **FR-008**: Extracted logic MUST follow the same naming convention across all three components (e.g., renderAzkarItem, renderPrayerItem, renderActItem)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Developers can locate and modify item rendering logic in under 30 seconds (reduced from current ~2 minutes of scanning inline JSX)
- **SC-002**: Each component's main render function is under 50 lines of code (excluding extracted render functions)
- **SC-003**: Code review feedback time for changes to these components reduces by 40% due to clearer separation of concerns
- **SC-004**: New developers can understand the component structure within 5 minutes of review
- **SC-005**: The refactored code passes all existing tests without modification, confirming behavior is preserved

## Assumptions _(include if applicable)_

- The current components already have test coverage that will validate behavior is unchanged
- The project uses functional components and hooks (not class components)
- The renderItem pattern (function or component) will be decided during implementation based on complexity and reusability needs
- No changes to component public APIs (props interfaces) are required
- The refactor will not introduce new dependencies or change import statements beyond component-internal organization

## Dependencies _(include if applicable)_

- No external dependencies required
- No dependencies on other features or components
- Changes are isolated to the three specified component files

## Out of Scope _(include if applicable)_

- Refactoring other components in the home feature beyond the three specified
- Changing component functionality, styling, or visual appearance
- Adding new features or modifying existing feature behavior
- Performance optimization beyond what naturally comes from code organization
- Adding TypeScript types beyond what's needed for the extracted functions
- Writing new tests (existing tests should continue to pass)
