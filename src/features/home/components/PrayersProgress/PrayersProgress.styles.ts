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
  title: {
    letterSpacing: -0.3,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  prayerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCompleted: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.brand.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  circleCurrent: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.brand.primary,
    backgroundColor: theme.colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
