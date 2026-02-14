# Component Color Guide

Quick reference for which colors to use when building common UI components.

## Buttons

### Primary Button (Main actions like "Pray Now", "Save", "Submit")

```tsx
{
  backgroundColor: colors.brand.primary,
  text: colors.text.inverse,
  icon: colors.icon.inverse,

  // On Press/Hover
  backgroundColor: colors.brand.primaryVariant,
}
```

### Secondary Button (Less important actions like "Cancel", "Skip")

```tsx
{
  backgroundColor: colors.brand.secondary,
  text: colors.text.inverse,
  icon: colors.icon.inverse,

  // On Press/Hover
  backgroundColor: colors.brand.secondaryVariant,
}
```

### Outline Button (Alternative actions)

```tsx
{
  backgroundColor: 'transparent',
  borderColor: colors.border.default,
  text: colors.text.primary,
  icon: colors.icon.primary,

  // On Press/Hover
  backgroundColor: colors.overlay.hover,
}
```

### Text Button (Low priority actions like "Learn More")

```tsx
{
  backgroundColor: 'transparent',
  text: colors.text.link,
  icon: colors.icon.primary,

  // On Press/Hover
  text: colors.text.linkHover,
}
```

### Disabled Button

```tsx
{
  backgroundColor: colors.background.disabled,
  text: colors.state.disabled,
  icon: colors.icon.muted,
}
```

### Destructive Button (Delete, Remove)

```tsx
{
  backgroundColor: colors.state.error,
  text: colors.text.inverse,
  icon: colors.icon.inverse,
}
```

## Text Inputs

### Standard Input Field

```tsx
{
  // Container
  backgroundColor: colors.background.input,
  borderColor: colors.border.default,

  // Label/Title above input
  labelText: colors.text.secondary,

  // Input text (what user types)
  inputText: colors.text.primary,

  // Placeholder text
  placeholder: colors.text.muted,

  // Helper text below input
  helperText: colors.text.tertiary,
}
```

### Focused Input (When user clicks/taps)

```tsx
{
  borderColor: colors.border.focus,
  backgroundColor: colors.background.input,
}
```

### Error Input (Validation failed)

```tsx
{
  borderColor: colors.border.error,
  backgroundColor: colors.state.errorBg,
  errorText: colors.state.error,
}
```

### Disabled Input

```tsx
{
  backgroundColor: colors.background.disabled,
  borderColor: colors.border.disabled,
  text: colors.state.disabled,
}
```

### Search Input

```tsx
{
  backgroundColor: colors.background.input,
  borderColor: colors.border.subtle,
  placeholder: colors.text.muted,
  icon: colors.icon.tertiary, // Search icon
}
```

## Cards

### Standard Card

```tsx
{
  backgroundColor: colors.background.surface,
  borderColor: colors.border.subtle, // Optional border

  // Card title
  titleText: colors.text.primary,

  // Card description
  descriptionText: colors.text.secondary,

  // Metadata (date, time, etc)
  metadataText: colors.text.tertiary,

  // Icons in card
  icon: colors.icon.secondary,
}
```

### Prayer Time Card (Active Prayer)

```tsx
{
  backgroundColor: colors.brand.primary,
  titleText: colors.text.inverse,
  timeText: colors.text.inverse,
  icon: colors.icon.inverse,
}
```

### Prayer Time Card (Upcoming Prayer)

```tsx
{
  backgroundColor: colors.background.surface,
  accentColor: colors.text.muted, // Border or highlight
  titleText: colors.text.primary,
  timeText: colors.text.muted,
  icon: colors.icon.muted,
}
```

### Prayer Time Card (Passed Prayer)

```tsx
{
  backgroundColor: colors.background.section,
  titleText: colors.text.muted,
  timeText: colors.state.disabled,
  icon: colors.icon.muted,
}
```

### Elevated Card (Modal, Dialog)

```tsx
{
  backgroundColor: colors.background.elevated,
  titleText: colors.text.primary,
}
```

## Text Elements

### Page Title / Heading

```tsx
{
  color: colors.text.primary,
}
```

### Section Title / Subheading

```tsx
{
  color: colors.text.secondary,
}
```

### Body Text / Paragraph

```tsx
{
  color: colors.text.primary,
}
```

### Supporting Text / Description

```tsx
{
  color: colors.text.secondary,
}
```

### Metadata (Time, Date, Author)

```tsx
{
  color: colors.text.tertiary,
}
```

### Disabled / Muted Text

```tsx
{
  color: colors.text.muted,
}
```

### Links

```tsx
{
  color: colors.text.link,

  // On Press/Hover
  color: colors.text.linkHover,
}
```

### Sacred Text (Allah, Muhammad ﷺ)

```tsx
{
  color: colors.text.accent,
}
```

## Icons

### Primary Icons (Main navigation, important actions)

```tsx
{
  color: colors.icon.primary,
}
```

### Secondary Icons (Supporting actions, utility icons)

```tsx
{
  color: colors.icon.secondary,
}
```

### Inactive/Disabled Icons

```tsx
{
  color: colors.icon.muted,
}
```

### Icons on Dark/Colored Backgrounds

```tsx
{
  color: colors.icon.inverse,
}
```

### Featured/Special Icons (Prayer reminder, featured content)

```tsx
{
  color: colors.icon.accent,
}
```

## Backgrounds

### Main Screen Background

```tsx
{
  backgroundColor: colors.background.app,
}
```

### Card/Surface Background

```tsx
{
  backgroundColor: colors.background.surface,
}
```

### Nested Card Background

```tsx
{
  backgroundColor: colors.background.surfaceAlt,
}
```

### List Section Background

```tsx
{
  backgroundColor: colors.background.section,
}
```

### Modal/Bottom Sheet Background

```tsx
{
  backgroundColor: colors.background.elevated,
}
```

## Switches & Toggles

### Switch/Toggle OFF

```tsx
{
  trackColor: colors.state.disabled,
  thumbColor: colors.background.elevated,
}
```

### Switch/Toggle ON

```tsx
{
  trackColor: colors.brand.primary,
  thumbColor: colors.background.elevated,
}
```

## Checkboxes

### Unchecked

```tsx
{
  borderColor: colors.border.default,
  backgroundColor: 'transparent',
}
```

### Checked

```tsx
{
  backgroundColor: colors.brand.primary,
  checkmarkColor: colors.text.inverse,
}
```

## Dividers & Borders

### Section Divider

```tsx
{
  backgroundColor: colors.border.default,
  // or
  borderBottomColor: colors.border.subtle,
}
```

### Card Border

```tsx
{
  borderColor: colors.border.default,
}
```

### Strong Separator

```tsx
{
  borderColor: colors.border.strong,
}
```

## Badges & Chips

### Notification Badge (Unread count)

```tsx
{
  backgroundColor: colors.state.error,
  text: colors.background.elevated,
}
```

### Category Chip/Tag

```tsx
{
  backgroundColor: colors.background.input,
  text: colors.text.secondary,
}
```

### Success Badge ("Completed")

```tsx
{
  backgroundColor: colors.state.successBg,
  text: colors.state.success,
  borderColor: colors.state.success, // Optional
}
```

## Alerts & Messages

### Success Message

```tsx
{
  backgroundColor: colors.state.successBg,
  text: colors.state.success,
  icon: colors.state.success,
}
```

### Warning Message

```tsx
{
  backgroundColor: colors.state.warningBg,
  text: colors.state.warning,
  icon: colors.state.warning,
}
```

### Error Message

```tsx
{
  backgroundColor: colors.state.errorBg,
  text: colors.state.error,
  icon: colors.state.error,
}
```

### Info Message

```tsx
{
  backgroundColor: colors.state.infoBg,
  text: colors.state.info,
  icon: colors.state.info,
}
```

## Tab Bar / Bottom Navigation

### Tab Bar Container

```tsx
{
  backgroundColor: colors.background.elevated,
  borderTopColor: colors.border.default,
}
```

### Active Tab

```tsx
{
  iconColor: colors.brand.primary,
  labelColor: colors.brand.primary,
}
```

### Inactive Tab

```tsx
{
  iconColor: colors.icon.tertiary,
  labelColor: colors.text.tertiary,
}
```

## Progress Indicators

### Progress Bar

```tsx
{
  // Background track
  trackColor: colors.border.default,

  // Filled portion
  fillColor: colors.brand.primary,
}
```

### Slider

```tsx
{
  // Inactive portion
  trackInactive: colors.state.disabled,

  // Active portion
  trackActive: colors.brand.primary,

  // Thumb/handle
  thumb: colors.background.elevated,
}
```

## Islamic-Specific Components

### Quran Reader

```tsx
{
  backgroundColor: colors.background.section,

  // Arabic text
  quranText: colors.text.primary,

  // Verse number badge
  verseNumberBg: colors.brand.tertiary,
  verseNumberText: colors.text.inverse,

  // Highlighted/selected verse
  highlightBg: colors.overlay.focus,
}
```

### Tasbih Counter

```tsx
{
  backgroundColor: colors.background.section,
  countText: colors.brand.secondary,
  labelText: colors.text.secondary,
}
```

### Hadith Card

```tsx
{
  backgroundColor: colors.background.surfaceAlt,
  arabicText: colors.text.primary,
  translationText: colors.text.secondary,
}
```

### Qibla Compass

```tsx
{
  directionIndicator: colors.brand.primary,
  compassRing: colors.border.default,
  labelText: colors.text.secondary,
}
```

### Hijri Date Display

```tsx
{
  dateText: colors.brand.secondary,
  labelText: colors.text.tertiary,
}
```

## Lists

### List Item

```tsx
{
  backgroundColor: colors.background.surface,
  titleText: colors.text.primary,
  subtitleText: colors.text.secondary,
  icon: colors.icon.secondary,
  divider: colors.border.default,
}
```

### List Item (Pressed)

```tsx
{
  backgroundColor: colors.overlay.pressed,
}
```

### List Section Header

```tsx
{
  backgroundColor: colors.background.section,
  text: colors.text.secondary,
}
```

## Quick Decision Tree

**"What should I use for...?"**

1. **Button background?**
   - Main action → `colors.brand.primary`
   - Secondary action → `colors.brand.secondary`
   - Cancel/Outline → `transparent` with `colors.border.default`

2. **Button text?**
   - On colored button → `colors.text.inverse`
   - On transparent button → `colors.text.primary`

3. **Input background?**
   - Always → `colors.background.input`

4. **Input text?**
   - User's input → `colors.text.primary`
   - Placeholder → `colors.text.muted`
   - Label → `colors.text.secondary`

5. **Card background?**
   - Standard card → `colors.background.surface`
   - Nested card → `colors.background.surfaceAlt`
   - Special card (prayer) → `colors.brand.primary` with `colors.text.inverse`

6. **Icon color?**
   - On colored background → `colors.icon.inverse`
   - On light background → `colors.icon.primary` or `colors.icon.secondary`
   - Disabled → `colors.icon.muted`

7. **Border color?**
   - Standard → `colors.border.default`
   - Subtle divider → `colors.border.subtle`
   - Focused input → `colors.border.focus`
   - Error → `colors.border.error`

8. **Screen background?**
   - Always → `colors.background.app`

9. **Text color?**
   - Main content → `colors.text.primary`
   - Supporting text → `colors.text.secondary`
   - Less important → `colors.text.tertiary`
   - Placeholder/disabled → `colors.text.muted`
