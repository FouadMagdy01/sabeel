import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingBottom: theme.metrics.spacingV.p12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center' as const,
  },
  headerSpacer: {
    width: 24,
  },
  scrollContent: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingTop: theme.metrics.spacingV.p8,
  },
  heroCard: {
    alignItems: 'center' as const,
    paddingVertical: theme.metrics.spacingV.p24,
    paddingHorizontal: theme.metrics.spacing.p16,
    borderRadius: 16,
    marginBottom: theme.metrics.spacingV.p20,
  },
  heroIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: theme.metrics.spacingV.p12,
  },
  heroTitle: {
    marginBottom: theme.metrics.spacingV.p4,
  },
  sectionCard: {
    borderRadius: 12,
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p16,
    marginBottom: theme.metrics.spacingV.p12,
  },
  sectionHeading: {
    marginBottom: theme.metrics.spacingV.p8,
  },
  sectionBody: {
    lineHeight: 22,
  },
}));
