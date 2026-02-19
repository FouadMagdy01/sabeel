import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  topSection: {
    marginBottom: theme.metrics.spacingV.p32,
  },
  currentLabel: {
    fontSize: theme.fonts.size.xxs,
    letterSpacing: 3,
    opacity: 0.6,
  },
  prayerName: {
    marginTop: theme.metrics.spacingV.p4,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
    marginTop: theme.metrics.spacingV.p8,
  },
  timerText: {
    letterSpacing: 1,
  },
  timelineContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p4,
  },
  timelineLine: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.5,
    backgroundColor: theme.colors.border.default,
  },
  timelineItem: {
    alignItems: 'center',
    gap: 12,
    zIndex: 1,
  },
  dotCompleted: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: theme.colors.state.successBg,
    borderColor: theme.colors.state.success,
  },
  dotCurrent: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    backgroundColor: theme.colors.brand.primary,
    shadowColor: theme.colors.brand.primary,
  },
  dotCurrentInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.text.inverse,
  },
  dotUpcoming: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.default,
  },
  dotUpcomingInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.icon.muted,
  },
  prayerLabel: {
    fontSize: theme.fonts.size.xxs,
    letterSpacing: -0.3,
  },
  labelCompleted: {
    opacity: 0.4,
    color: theme.colors.brand.secondary,
  },
  labelCurrent: {
    color: theme.colors.brand.primary,
  },
  labelUpcoming: {
    color: theme.colors.brand.secondary,
    opacity: 0.5,
  },
}));
