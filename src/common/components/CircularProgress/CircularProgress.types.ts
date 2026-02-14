import type { ReactNode } from 'react';

/**
 * Status-based color variants for CircularProgress.
 */
export type CircularProgressStatus = 'normal' | 'success' | 'error' | 'warning';

/**
 * Props for the CircularProgress component.
 *
 * @param progress - Progress value from 0 to 1
 * @param size - Diameter of the circle in pixels
 * @default 24
 * @param strokeWidth - Width of the stroke
 * @default 3
 * @param color - Color of the progress arc (overrides theme default and status)
 * @param trackColor - Color of the track background (overrides theme default)
 * @param indeterminate - Enable spinning animation mode (no progress value)
 * @default false
 * @param showLabel - Show percentage text in center
 * @default false
 * @param status - Status-based color (success, error, warning, normal)
 * @default 'normal'
 * @param children - Custom center content (overrides showLabel)
 */
export interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  indeterminate?: boolean;
  showLabel?: boolean;
  status?: CircularProgressStatus;
  children?: ReactNode;
}
