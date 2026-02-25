import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: theme.metrics.spacingV.p16,
  },
  sectionHeader: {
    paddingHorizontal: theme.metrics.spacing.p16,
    marginBottom: theme.metrics.spacingV.p12,
  },
}));
