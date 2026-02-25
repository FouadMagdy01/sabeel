import { StyleSheet } from 'react-native-unistyles';

const COUNTER_SIZE = 200;
const STROKE_WIDTH = 6;
const INNER_SIZE = COUNTER_SIZE - STROKE_WIDTH * 2 - 16;

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.metrics.spacingV.p16,
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countInner: {
    width: INNER_SIZE,
    maxWidth: INNER_SIZE,
  },
  doneButton: {
    width: COUNTER_SIZE,
    height: COUNTER_SIZE,
    borderRadius: COUNTER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: STROKE_WIDTH,
  },
}));
