# Data Model: Component Design System Compliance

**Date**: 2026-02-14 | **Branch**: `002-component-design-compliance`

## Overview

This feature does not introduce new database entities or API endpoints. The "data model" consists of the component API contracts (prop interfaces) that define how common components interact with the design system. These are TypeScript interfaces, not data storage entities.

## Component API Contracts

### Shared Prop Patterns

All interactive components should follow these shared conventions:

```typescript
// Shared size scale (consistent across components)
type ComponentSize = 'small' | 'medium' | 'large';

// Shared semantic color scale
type SemanticColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

// Shared disabled pattern
interface DisableableProps {
  disabled?: boolean;
}

// Shared loading pattern
interface LoadableProps {
  loading?: boolean;
}
```

### Entity: Button Props (Enhanced)

```typescript
interface ButtonProps extends DisableableProps, LoadableProps {
  variant: 'contained' | 'outlined' | 'text' | 'elevated' | 'transparent';
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'; // Enhanced from 2 → 6
  size: ComponentSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean; // NEW: block/fullWidth support
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}
```

### Entity: Card Props (Enhanced)

```typescript
interface CardProps {
  variant: 'elevated' | 'outlined' | 'filled' | 'gradient';
  radius: 'sm' | 'md' | 'lg' | 'xl';
  padding: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void; // NEW: pressable card support
  loading?: boolean; // NEW: skeleton loading state
  gradientColors?: [string, string];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}
```

### Entity: Typography Props (Enhanced)

```typescript
interface TypographyProps extends Omit<RNTextProps, 'style'> {
  type: 'heading' | 'body' | 'caption' | 'label' | 'overline';
  size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight: 'regular' | 'medium' | 'semiBold' | 'bold';
  color: TypographyColor | 'disabled'; // Enhanced: added 'disabled'
  align: 'left' | 'center' | 'right';
  uppercase?: boolean;
  italic?: boolean;
  strikethrough?: boolean; // NEW
  underline?: boolean; // NEW
  style?: StyleProp<TextStyle>;
}
```

### Entity: Input Props (Enhanced)

```typescript
interface InputProps extends DisableableProps {
  variant: 'outlined' | 'filled' | 'underlined';
  size: ComponentSize;
  error?: boolean;
  success?: boolean;
  required?: boolean; // NEW: required visual indicator
  clearable?: boolean; // NEW: allowClear behavior
  showCount?: boolean; // NEW: character count display
  label?: string;
  helperText?: string;
  errorText?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  // ...extends TextInputProps
}
```

### Entity: SegmentedControl Props (Enhanced)

```typescript
interface SegmentOption {
  label: string;
  value: string;
  icon?: ReactNode; // NEW
  disabled?: boolean; // NEW: per-segment disable
}

interface SegmentedControlProps extends DisableableProps {
  options: SegmentOption[]; // Enhanced from string[] to structured
  value?: string; // NEW: controlled value
  defaultValue?: string; // NEW: uncontrolled default
  onChange?: (value: string) => void; // NEW: value-based callback
  selectedIndex?: number; // KEPT: legacy index-based
  onSegmentChange?: (index: number) => void; // KEPT: legacy callback
  size?: ComponentSize; // NEW
  fullWidth?: boolean; // NEW
}
```

### Entity: SearchInput Props (Enhanced)

```typescript
interface SearchInputProps extends DisableableProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: (query: string) => void; // NEW: submit/enter callback
  onClear?: () => void;
  showClearButton?: boolean;
  loading?: boolean; // NEW
  size?: ComponentSize; // NEW
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}
```

### Entity: CircularProgress Props (Enhanced)

```typescript
interface CircularProgressProps {
  progress?: number; // 0-1, undefined = indeterminate
  indeterminate?: boolean; // NEW: spinning mode
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showLabel?: boolean; // NEW: show percentage text
  status?: 'normal' | 'success' | 'error' | 'warning'; // NEW
  children?: ReactNode; // NEW: custom center content
}
```

## Relationships

```
ThemeColors (source of truth)
├── brand.* → Button.color, Card gradient, IconButton.color
├── text.* → Typography.color, Input text, Select text
├── background.* → Card surface, Input bg, SegmentedControl bg
├── border.* → Card outlined, Input border, Divider line
├── icon.* → Icon.variant, IconButton icon
├── state.* → Input error/success, CircularProgress status
└── overlay.* → Button press, Card hover, focus states

Component (shared patterns)
├── size: ComponentSize → Button, Input, Select, IconButton, SearchInput, SegmentedControl
├── disabled: boolean → Button, Input, Select, IconButton, SearchInput, SegmentedControl, DatePicker
├── loading: boolean → Button, IconButton, SearchInput, Card
└── variant: string → Button(5), Card(4), Input(3), IconButton(4), Divider(2+), SegmentedControl
```

## State Transitions

### Interactive Components State Machine

```
Normal → Focused (tap/focus)
Normal → Disabled (disabled=true)
Normal → Loading (loading=true)
Focused → Normal (blur)
Focused → Error (validation fails)
Error → Normal (validation passes)
Loading → Normal (loading=false)
```

### Card Press State

```
Idle → Pressed (onPress defined + touch)
Pressed → Idle (touch release)
Idle → Loading (loading=true)
Loading → Idle (loading=false)
```
