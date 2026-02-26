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
  title: {},
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
  verticalList: {
    gap: theme.metrics.spacingV.p8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 56,
  },
  itemCompleted: {
    backgroundColor: theme.colors.state.successBg,
  },
  itemPending: {
    backgroundColor: theme.colors.background.surfaceAlt,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p12,
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
}));
