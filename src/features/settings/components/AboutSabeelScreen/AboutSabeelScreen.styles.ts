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
    paddingVertical: theme.metrics.spacingV.p32,
    paddingHorizontal: theme.metrics.spacing.p24,
    borderRadius: 20,
    marginBottom: theme.metrics.spacingV.p20,
    overflow: 'hidden' as const,
  },
  heroIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: theme.metrics.spacingV.p16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroAppName: {
    color: '#FFFFFF',
  },
  heroTagline: {
    color: 'rgba(255,255,255,0.85)',
  },
  versionBadge: {
    paddingHorizontal: theme.metrics.spacing.p12,
    paddingVertical: theme.metrics.spacingV.p4,
    borderRadius: 12,
    marginTop: theme.metrics.spacingV.p12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  versionText: {
    color: '#FFFFFF',
  },
  descriptionCard: {
    borderRadius: 12,
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p16,
    marginBottom: theme.metrics.spacingV.p16,
  },
  bodyText: {
    lineHeight: 22,
  },
  featuresCard: {
    borderRadius: 12,
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p16,
    marginBottom: theme.metrics.spacingV.p16,
  },
  sectionTitle: {
    marginBottom: theme.metrics.spacingV.p8,
  },
  featureRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.metrics.spacingV.p8,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginEnd: theme.metrics.spacing.p12,
  },
  connectCard: {
    borderRadius: 12,
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p16,
    marginBottom: theme.metrics.spacingV.p16,
  },
}));
