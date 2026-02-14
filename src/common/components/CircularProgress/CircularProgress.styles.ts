import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((_theme) => ({
  container: (size: number) => ({
    width: size,
    height: size,
  }),
  svg: {
    // SVG-specific styles can be added here if needed
  },
  trackCircle: {
    fill: 'none',
  },
  progressCircle: {
    fill: 'none',
    strokeLinecap: 'round' as const,
  },
}));
