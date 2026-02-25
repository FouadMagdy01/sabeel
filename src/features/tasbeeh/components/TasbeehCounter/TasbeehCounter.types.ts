export interface TasbeehCounterProps {
  count: number;
  target: number;
  onPress: () => void;
  isTargetReached: boolean;
}
