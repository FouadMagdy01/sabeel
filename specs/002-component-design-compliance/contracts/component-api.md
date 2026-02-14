# Component API Contracts

**Date**: 2026-02-14 | **Branch**: `002-component-design-compliance`

## Overview

This feature has no backend API endpoints. The "contracts" are the enhanced TypeScript prop interfaces for all 13 common components. These serve as the API surface between common components and consumer code.

Refer to [data-model.md](../data-model.md) for the detailed prop interface definitions.

## Contract Summary

| Component        | Breaking Changes       | New Props                                                                    | Deprecated Props                                    |
| ---------------- | ---------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| Button           | None                   | `fullWidth`, colors: success/error/warning/info                              | None                                                |
| Card             | None                   | `onPress`, `loading`                                                         | None                                                |
| CircularProgress | None                   | `indeterminate`, `showLabel`, `status`, `children`                           | None                                                |
| CustomTabBar     | None (types extracted) | None (structural fix only)                                                   | None                                                |
| DatePicker       | None                   | `clearable`, `format`                                                        | None                                                |
| Divider          | None                   | `children` (label text), `dashed`, `textAlign`                               | None                                                |
| Icon             | None                   | None (JSDoc only)                                                            | None                                                |
| IconButton       | None                   | `loading`                                                                    | None                                                |
| Input            | None                   | `clearable`, `required`, `showCount`                                         | None                                                |
| SearchInput      | None                   | `onSearch`, `loading`, `size`, `disabled`                                    | None                                                |
| SegmentedControl | ⚠️ Soft breaking       | `options` (structured), `value`, `onChange`, `size`, `disabled`, `fullWidth` | `segments` (string[]) → `options` (SegmentOption[]) |
| Select           | None                   | `searchable`, `allowClear`, `loading`                                        | None                                                |
| Typography       | None                   | `strikethrough`, `underline`, color: `disabled`                              | None                                                |

## SegmentedControl Migration Guide

The SegmentedControl has the most significant API change. To maintain backward compatibility:

```typescript
// OLD API (still supported during transition)
<SegmentedControl
  segments={['Tab 1', 'Tab 2']}
  selectedIndex={0}
  onSegmentChange={(index) => setIndex(index)}
/>

// NEW API (preferred)
<SegmentedControl
  options={[
    { label: 'Tab 1', value: 'tab1' },
    { label: 'Tab 2', value: 'tab2', icon: <Icon.../> },
    { label: 'Tab 3', value: 'tab3', disabled: true },
  ]}
  value="tab1"
  onChange={(value) => setValue(value)}
  size="medium"
/>
```

Both APIs will work simultaneously. The old `segments` prop will be internally converted to `options` format.
