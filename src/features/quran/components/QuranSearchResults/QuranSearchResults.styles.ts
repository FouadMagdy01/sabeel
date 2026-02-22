import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p8,
    gap: theme.metrics.spacingV.p8,
  },
  item: {
    paddingVertical: theme.metrics.spacingV.p12,
    paddingHorizontal: theme.metrics.spacing.p12,
    borderRadius: 12,
    gap: 4,
  },
  verseText: {
    writingDirection: 'rtl',
    lineHeight: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.metrics.spacing.p32,
    gap: theme.metrics.spacingV.p8,
  },
}));
