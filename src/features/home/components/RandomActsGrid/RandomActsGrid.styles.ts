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
    gap: 8,
  },
  // Vertical list container (replaces grid)
  verticalList: {
    gap: theme.metrics.spacingV.p12, // 12pt vertical spacing between cards
  },
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  actCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.metrics.spacing.p16,
    minHeight: 64, // Ensure minimum 44pt+ touch target with padding
  },
  cardCompleted: {
    backgroundColor: theme.colors.state.successBg,
    borderColor: theme.colors.state.success,
  },
  cardUnlocked: {
    backgroundColor: theme.colors.background.surfaceAlt,
    borderColor: theme.colors.brand.tertiary,
  },
  cardLocked: {
    backgroundColor: theme.colors.background.input,
    borderColor: theme.colors.border.default,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p16,
    flex: 1,
    paddingRight: 28, // Space for status badge
  },
  textContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 7,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  pressedScale: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
}));
