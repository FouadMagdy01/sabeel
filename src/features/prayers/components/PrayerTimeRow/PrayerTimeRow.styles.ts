import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
    marginHorizontal: theme.metrics.spacing.p16,
    marginBottom: theme.metrics.spacingV.p8,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: theme.metrics.spacing.p12,
  },
  textContainer: {
    flex: 1,
  },
  prayerName: {
    fontFamily: 'Cairo-SemiBold',
    fontSize: theme.metrics.fontSize.md,
  },
  statusText: {
    fontFamily: 'Cairo-Regular',
    fontSize: theme.metrics.fontSize.xs,
    marginTop: 2,
  },
  timeText: {
    fontFamily: 'Cairo-SemiBold',
    fontSize: theme.metrics.fontSize.md,
  },
}));
