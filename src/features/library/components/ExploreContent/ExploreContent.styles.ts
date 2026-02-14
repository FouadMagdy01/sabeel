import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    paddingTop: theme.metrics.spacingV.p16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p16,
  },
  recommendedHeader: {
    paddingHorizontal: theme.metrics.spacing.p16,
    marginTop: theme.metrics.spacingV.p32,
    marginBottom: theme.metrics.spacingV.p12,
  },
  featuredList: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p8,
    gap: theme.metrics.spacing.p16,
  },
  recommendedSection: {
    paddingHorizontal: theme.metrics.spacing.p16,
    gap: theme.metrics.spacingV.p12,
  },
}));
