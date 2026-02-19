import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  cardLayout: {
    padding: theme.metrics.spacing.p20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.metrics.spacingV.p20,
  },
  title: {
    letterSpacing: -0.3,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
  verticalList: {
    gap: theme.metrics.spacingV.p8,
  },
  cardContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardCompleted: {
    backgroundColor: theme.colors.state.successBg,
  },
  cardPending: {
    backgroundColor: theme.colors.background.surfaceAlt,
  },
  actCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
    minHeight: 56,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p12,
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  statusIcon: {
    marginStart: theme.metrics.spacing.p8,
  },
  pressed: {
    opacity: 0.85,
  },
}));
