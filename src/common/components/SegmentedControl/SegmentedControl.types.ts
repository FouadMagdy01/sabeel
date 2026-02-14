/**
 * Props for the SegmentedControl component.
 *
 * @param segments - Array of segment labels to display
 * @param selectedIndex - Index of the currently active segment
 * @param onSegmentChange - Callback fired when a segment is pressed
 */
export interface SegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onSegmentChange: (index: number) => void;
}
