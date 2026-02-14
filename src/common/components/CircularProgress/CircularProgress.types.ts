/**
 * Props for the CircularProgress component.
 *
 * @param progress - Progress value from 0 to 1
 * @param size - Diameter of the circle in pixels
 * @default 24
 * @param strokeWidth - Width of the stroke
 * @default 3
 * @param color - Color of the progress arc (overrides theme default)
 * @param trackColor - Color of the track background (overrides theme default)
 */
export interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
}
