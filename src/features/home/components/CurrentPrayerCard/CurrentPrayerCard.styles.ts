import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  topSection: {
    marginBottom: theme.metrics.spacingV.p32,
  },
  currentLabel: {
    fontSize: 10,
    letterSpacing: 3,
    opacity: 0.6,
  },
  prayerName: {
    marginTop: 4,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  timerText: {
    letterSpacing: 1,
  },
  timelineContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  timelineLine: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.border.default,
    opacity: 0.5,
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
    backgroundColor: theme.colors.state.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.state.success,
  },
  dotCurrent: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.brand.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  dotCurrentInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.background.elevated,
  },
  dotUpcoming: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotUpcomingInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.icon.muted,
  },
  prayerLabel: {
    fontSize: 9,
    letterSpacing: -0.5,
  },
  labelCompleted: {
    color: theme.colors.brand.secondary,
    opacity: 0.4,
  },
  labelCurrent: {
    color: theme.colors.brand.primary,
  },
  labelUpcoming: {
    color: theme.colors.icon.muted,
  },
}));
