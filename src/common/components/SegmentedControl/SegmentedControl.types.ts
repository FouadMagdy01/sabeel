import type { ReactNode } from 'react';

import type { ComponentSize } from '../shared.types';

/**
 * Option configuration for a single segment in the segmented control.
 * Used with the new structured API.
 */
export interface SegmentOption {
  /**
   * Display label for the segment
   */
  label: string;

  /**
   * Unique value identifier for the segment
   */
  value: string;

  /**
   * Optional icon to display alongside the label
   */
  icon?: ReactNode;

  /**
   * Whether this specific segment is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Props for the SegmentedControl component.
 *
 * **Migration Guide:**
 * ```tsx
 * // OLD API (deprecated but still supported):
 * <SegmentedControl
 *   segments={['Tab 1', 'Tab 2']}
 *   selectedIndex={0}
 *   onSegmentChange={(index) => setIndex(index)}
 * />
 *
 * // NEW API (recommended):
 * <SegmentedControl
 *   options={[
 *     { label: 'Tab 1', value: 'tab1' },
 *     { label: 'Tab 2', value: 'tab2', icon: <Icon.../> }
 *   ]}
 *   value="tab1"
 *   onChange={(value) => setValue(value)}
 *   size="medium"
 *   fullWidth
 * />
 * ```
 *
 * @example
 * // With icons and disabled state
 * <SegmentedControl
 *   options={[
 *     { label: 'Daily', value: 'daily', icon: <Icon name="calendar" /> },
 *     { label: 'Weekly', value: 'weekly', icon: <Icon name="calendar-week" /> },
 *     { label: 'Monthly', value: 'monthly', icon: <Icon name="calendar-month" />, disabled: true }
 *   ]}
 *   value="daily"
 *   onChange={setValue}
 *   size="large"
 * />
 */
export interface SegmentedControlProps {
  // ============================================
  // NEW API (Preferred)
  // ============================================

  /**
   * Array of segment options with structured data.
   * Use this instead of `segments` for the new API.
   *
   * @example
   * options={[
   *   { label: 'Tab 1', value: 'tab1' },
   *   { label: 'Tab 2', value: 'tab2', icon: <Icon.../>, disabled: true }
   * ]}
   */
  options?: SegmentOption[];

  /**
   * Currently selected segment value.
   * Use with `onChange` for controlled component behavior.
   *
   * @example value="tab1"
   */
  value?: string;

  /**
   * Default selected value for uncontrolled usage.
   *
   * @example defaultValue="tab1"
   */
  defaultValue?: string;

  /**
   * Callback fired when the selected segment changes.
   * Receives the selected segment's value.
   *
   * @param value - The value of the newly selected segment
   * @example onChange={(value) => console.log('Selected:', value)}
   */
  onChange?: (value: string) => void;

  /**
   * Size variant for the segmented control.
   * Affects padding, font size, and overall height.
   *
   * @default 'medium'
   * @example size="large"
   */
  size?: ComponentSize;

  /**
   * Whether the entire segmented control is disabled.
   * Disables all segments regardless of individual disabled states.
   *
   * @default false
   * @example disabled={true}
   */
  disabled?: boolean;

  /**
   * Whether the control should take full width of its container.
   * When false, width is determined by content.
   *
   * @default false
   * @example fullWidth={true}
   */
  fullWidth?: boolean;

  // ============================================
  // LEGACY API (Deprecated)
  // ============================================

  /**
   * @deprecated Use `options` instead for the new structured API.
   * Array of segment labels to display.
   * This prop is maintained for backward compatibility.
   *
   * @example segments={['Daily', 'Weekly', 'Monthly']}
   */
  segments?: string[];

  /**
   * @deprecated Use `value` instead for the new structured API.
   * Index of the currently active segment.
   * This prop is maintained for backward compatibility.
   *
   * @example selectedIndex={0}
   */
  selectedIndex?: number;

  /**
   * @deprecated Use `onChange` instead for the new structured API.
   * Callback fired when a segment is pressed.
   * This prop is maintained for backward compatibility.
   *
   * @param index - The index of the newly selected segment
   * @example onSegmentChange={(index) => setView(index)}
   */
  onSegmentChange?: (index: number) => void;
}
