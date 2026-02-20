import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    gap: theme.metrics.spacingV.p12,
    paddingVertical: theme.metrics.spacingV.p16,
  },
  message: {
    paddingHorizontal: theme.metrics.spacing.p16,
  },
}));
