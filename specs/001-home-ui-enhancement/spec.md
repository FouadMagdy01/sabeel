# Feature Specification: Home Screen UI Enhancement

**Feature Branch**: `001-home-ui-enhancement`
**Created**: 2026-02-14
**Status**: Clarified - Ready for Planning
**Input**: User description: "Enhance the home screen UI by redesigning Azkar todos and Random Acts todos sections using the existing design system"

## Clarifications

### Session 2026-02-14

- Q: Should the Random Acts section use a vertical list of equal-sized cards instead of the current grid layout, or would you prefer a different layout pattern? → A: Vertical list of equal-sized cards
- Q: For the Azkar section, should we replace the chip-based design with individual cards similar to Random Acts, or keep a more compact representation with improved visual hierarchy? → A: Hybrid approach - card container with chip items inside (progress at top, chips below)
- Q: Should completed Random Acts remain visible in the UI (just marked as completed), or should they be moved to a separate "Completed" section/collapsed area to keep focus on available actions? → A: Keep completed acts visible with equal-sized cards alongside unlocked acts

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Improved Azkar Progress Visibility (Priority: P1)

Users want to quickly see their daily Azkar completion status and easily interact with each Azkar type without feeling overwhelmed by the current chip-based interface. The redesigned Azkar section should provide a clearer visual hierarchy and more engaging interaction patterns.

**Why this priority**: Azkar (daily remembrances) are a core spiritual practice for users. Poor UX in this section directly impacts user engagement with daily spiritual habits, making this the highest priority for improvement.

**Independent Test**: Can be fully tested by viewing the home screen and interacting with Azkar items. Delivers immediate value by making Azkar tracking more accessible and visually appealing.

**Acceptance Scenarios**:

1. **Given** user opens the home screen, **When** they view the Azkar section, **Then** they should see a visually clear progress indicator and individual Azkar items with better visual hierarchy
2. **Given** user has completed 1 of 3 Azkar, **When** they view the section, **Then** the progress should be prominently displayed with clear distinction between completed and pending items
3. **Given** user taps on an Azkar item, **When** the interaction occurs, **Then** they should receive clear visual feedback that respects the existing design system

---

### User Story 2 - Enhanced Random Acts Discovery (Priority: P1)

Users want to discover and complete random acts of kindness more easily. The current grid layout with asymmetric columns (one large completed card on left, smaller unlocked cards on right) creates visual imbalance and makes it harder to scan available actions.

**Why this priority**: Random acts are a key engagement feature for daily spiritual growth. The current UI confuses users about which actions are available and how to interact with them, directly impacting feature usage.

**Independent Test**: Can be fully tested by viewing the Random Acts section and tapping on different act cards. Delivers value by improving discoverability and reducing cognitive load.

**Acceptance Scenarios**:

1. **Given** user views the Random Acts section, **When** they scan the available options, **Then** they should see a balanced layout where all items are equally discoverable
2. **Given** user has completed one random act, **When** they view the section, **Then** the completed act should be clearly marked without dominating the visual space
3. **Given** user wants to complete a new random act, **When** they scan unlocked acts, **Then** each act should have clear iconography, readable text, and obvious tap targets
4. **Given** user taps on a random act card, **When** the interaction occurs, **Then** they should receive appropriate visual feedback using design system states

---

### User Story 3 - Consistent Visual Design Language (Priority: P2)

Users experience visual inconsistency between the Azkar section (chips with circular icons) and Random Acts section (card-based grid). The redesigned sections should use cohesive design patterns from the existing design system.

**Why this priority**: While less critical than core functionality, visual consistency improves overall app quality perception and reduces learning curve as users navigate different features.

**Independent Test**: Can be tested by reviewing the visual design of both sections side-by-side. Delivers value through improved aesthetic quality and professional appearance.

**Acceptance Scenarios**:

1. **Given** user views both Azkar and Random Acts sections, **When** they compare the design patterns, **Then** both should use consistent spacing, card styles, and interactive elements from the design system
2. **Given** user switches between light and dark mode, **When** viewing these sections, **Then** all colors should properly adapt using semantic color tokens

---

### Edge Cases

- What happens when all Azkar are completed? The section should show 100% progress with appropriate celebratory state
- What happens when all Random Acts are completed? The section should show completion state and suggest checking back tomorrow
- What happens when no Random Acts are unlocked? The section should show locked state with guidance on how to unlock
- How does the layout adapt on smaller screens (e.g., iPhone SE)? All interactive elements must remain accessible with proper touch targets
- How does the layout adapt on larger screens (e.g., tablets)? Content should scale appropriately without excessive whitespace
- What happens when Azkar or Random Acts data is loading? Appropriate skeleton states should be shown
- What happens if there's an error loading data? Error states should be shown with retry options

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Azkar section MUST use a Card component as outer container
- **FR-002**: Azkar section MUST display overall progress percentage and visual progress indicator at the top of the card
- **FR-003**: Azkar section MUST show individual chip items for Morning, Evening, and Night Azkar below the progress indicator
- **FR-004**: Each Azkar chip MUST clearly indicate completed vs uncompleted status using design system colors and icons
- **FR-005**: Each Azkar chip MUST be tappable with proper touch target size (minimum 44x44 points)
- **FR-006**: Random Acts section MUST display overall progress percentage and visual progress indicator
- **FR-007**: Random Acts section MUST use a vertical list layout with equal-sized cards for all acts (completed, unlocked, and locked)
- **FR-008**: Each Random Act card MUST display an icon, title, and status indicator
- **FR-009**: Completed Random Acts MUST remain visible in the vertical list with equal-sized cards alongside unlocked acts
- **FR-010**: Completed Random Acts MUST be visually distinguished from unlocked acts using appropriate status colors and icons
- **FR-011**: Locked Random Acts MUST be visually indicated as unavailable if present in the data
- **FR-012**: All interactive elements MUST provide visual feedback on press using design system overlay states
- **FR-013**: Both sections MUST use the existing Card component with appropriate variants and padding
- **FR-014**: All colors MUST use semantic tokens from the design system (brand, text, background, border, state, overlay)
- **FR-015**: All spacing MUST use design system metrics (spacing, spacingV)
- **FR-016**: All typography MUST use the Typography component with semantic size/weight combinations
- **FR-017**: All icons MUST use the Icon wrapper component with appropriate variant support
- **FR-018**: Both sections MUST support light and dark mode using theme.colors.mode
- **FR-019**: Azkar chips MUST maintain improved spacing compared to current implementation to reduce visual clutter

### Key Entities

- **AzkarData**: Represents a daily Azkar item with type (Morning/Evening/Night) and completion status
- **RandomActData**: Represents a random act of kindness with id, title, icon details, and status (completed/unlocked/locked)
- **Theme**: Design system configuration providing semantic color tokens, metrics, and component styles

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can identify their Azkar progress within 2 seconds of viewing the home screen
- **SC-002**: Users can distinguish between completed and uncompleted Azkar items without reading text
- **SC-003**: Users can scan all available Random Acts within 3 seconds without missing any options
- **SC-004**: All interactive elements respond to touch within 100ms with visible feedback
- **SC-005**: The redesigned sections use 100% design system components (no custom one-off styles)
- **SC-006**: Both sections render correctly on screens from 320px to 1024px width
- **SC-007**: Visual hierarchy allows users to process information in order: progress → individual items → actions
- **SC-008**: The new design reduces visual noise by consolidating similar UI patterns between sections

## Assumptions _(mandatory)_

### Design Decisions

- The Card component from the design system is suitable for both sections
- CircularProgress component provides adequate visual feedback for completion status
- The Typography component has appropriate size variants for all text needs
- Icon component supports all required icon families and variants
- Semantic color tokens cover all necessary states (success, info, completed, unlocked, locked)

### Data Assumptions

- Azkar array always contains exactly 3 items (Morning, Evening, Night)
- Random Acts array contains a reasonable number of items (3-6) that fit on screen without scrolling
- At most one Random Act can be completed at a time
- Icon families and icon names in RandomActData are valid and available

### Interaction Patterns

- Users expect tap interactions (not long-press or swipe)
- Visual feedback on press is sufficient (no haptic feedback required)
- Progress indicators use percentage display (not fraction like "1/3")
- Completed items use success color, uncompleted use muted/secondary colors

### Technical Constraints

- Implementation will use react-native-unistyles for styling
- Components will use useTranslation for i18n strings
- Platform-specific interaction handling (android_ripple, iOS pressed states) is acceptable
- Safe area insets are handled by parent container, not these sections

## Scope _(mandatory)_

### In Scope

- Visual redesign of AzkarProgress component
- Visual redesign of RandomActsGrid component
- Updated styling files for both components
- Updated component props if needed to support new UI patterns
- Ensuring all design system tokens and components are properly used
- Responsive layout that works across different screen sizes
- Support for both light and dark themes

### Out of Scope

- Changes to DailyTodos parent component beyond prop updates
- Changes to data structures or backend logic
- New functionality beyond UI enhancement (e.g., new gestures, animations)
- Changes to other home screen sections (StatsCard, CurrentPrayerCard, VerseOfTheDay)
- Internationalization updates (existing i18n keys will be reused)
- Analytics tracking for user interactions
- Accessibility improvements beyond maintaining existing tap target sizes
- Performance optimizations beyond standard best practices

## Dependencies _(mandatory)_

### Internal Dependencies

- Design system components: Card, Typography, Icon, CircularProgress
- Design system theme configuration with semantic color tokens
- Design system metrics for spacing and responsive sizing
- Existing i18n translation keys for labels

### External Dependencies

- react-native-unistyles for theming and styling
- react-native-svg (used by CircularProgress)
- expo-vector-icons (used by Icon component)
