import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    paddingVertical: theme.metrics.spacingV.p8,
  },
  listContent: {
    paddingHorizontal: theme.metrics.spacing.p16,
    gap: theme.metrics.spacing.p8,
  },
  dayItem: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    width: theme.metrics.spacing.p48,
    paddingVertical: theme.metrics.spacingV.p12,
    borderRadius: 16,
  },
  dayNumber: {
    fontFamily: 'Cairo-Bold',
    fontSize: theme.metrics.fontSize.lg,
  },
  weekday: {
    fontFamily: 'Cairo-Medium',
    fontSize: theme.metrics.fontSize.xxs,
    marginTop: theme.metrics.spacingV.p4,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: theme.metrics.spacingV.p4,
  },
  datePickerRow: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingTop: theme.metrics.spacingV.p8,
  },
}));
