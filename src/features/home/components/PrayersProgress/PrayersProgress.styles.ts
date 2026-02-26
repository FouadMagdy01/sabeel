import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  cardLayout: {
    padding: theme.metrics.spacing.p20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.metrics.spacingV.p24,
  },
  title: {},
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p4,
  },
  prayerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCompleted: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: theme.colors.brand.primary,
    shadowColor: theme.colors.brand.primary,
  },
  circleCurrent: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.colors.brand.primary,
    backgroundColor: theme.colors.background.surface,
  },
  currentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.brand.primary,
  },
  circleUpcoming: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.surfaceAlt,
  },
  disabledCircle: {
    opacity: 0.5,
  },
  allCompletedText: {
    marginTop: theme.metrics.spacingV.p12,
  },
}));
