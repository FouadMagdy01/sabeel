import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.metrics.spacingV.p12,
  },
  header: {
    fontSize: theme.metrics.fontSize.xxs,
  },
  gridContainer: {
    gap: theme.metrics.spacingV.p12,
  },
  grid: {
    flexDirection: 'row',
    gap: theme.metrics.spacing.p12,
  },
  gridBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.metrics.spacing.p12,
  },
  gridBottomRowItem: {
    width: '30%',
  },
  itemCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  itemPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.metrics.spacingV.p12,
  },
  itemLabel: {
    fontSize: theme.metrics.fontSize.xxs,
    marginTop: theme.metrics.spacingV.p4,
  },
}));
