import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  card: {
    marginHorizontal: theme.metrics.spacing.p16,
    borderRadius: 20,
    padding: theme.metrics.spacing.p20,
    overflow: 'hidden' as const,
    position: 'relative' as const,
  },
  decorCircle1: {
    position: 'absolute' as const,
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.15,
  },
  decorCircle2: {
    position: 'absolute' as const,
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.1,
  },
  locationRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.metrics.spacing.p4,
    marginBottom: theme.metrics.spacingV.p4,
  },
  dateText: {
    fontFamily: 'Cairo-Regular',
    fontSize: theme.metrics.fontSize.xs,
    marginBottom: theme.metrics.spacingV.p16,
    opacity: 0.9,
  },
  nextPrayerLabel: {
    fontFamily: 'Cairo-Regular',
    fontSize: theme.metrics.fontSize.xs,
    opacity: 0.8,
    marginBottom: theme.metrics.spacingV.p4,
  },
  nextPrayerRow: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
    justifyContent: 'space-between' as const,
  },
  prayerName: {
    fontFamily: 'Cairo-Bold',
    fontSize: theme.metrics.fontSize['2xl'],
  },
  countdown: {
    fontFamily: 'Cairo-SemiBold',
    fontSize: theme.metrics.fontSize.lg,
  },
  upcomingText: {
    opacity: 0.8,
  },
}));
