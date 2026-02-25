import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.metrics.spacingV.p4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
  dateSeparator: {
    fontSize: theme.fonts.size.sm,
    opacity: 0.4,
  },
}));
