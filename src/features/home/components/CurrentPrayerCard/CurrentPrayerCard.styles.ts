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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
  },
  dotCurrentInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotUpcoming: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotUpcomingInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  prayerLabel: {
    fontSize: theme.fonts.size.xxs,
    letterSpacing: -0.3,
  },
  labelCompleted: {
    opacity: 0.4,
  },
  labelCurrent: {},
  labelUpcoming: {},
}));
