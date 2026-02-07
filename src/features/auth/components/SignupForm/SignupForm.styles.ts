import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.metrics.spacing.p16,
  },
  row: {
    flexDirection: 'row',
    gap: theme.metrics.spacing.p12,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    marginTop: theme.metrics.spacing.p8,
  },
}));
