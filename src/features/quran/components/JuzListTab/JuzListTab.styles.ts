import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p8,
    gap: theme.metrics.spacingV.p8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.metrics.spacingV.p12,
    paddingHorizontal: theme.metrics.spacing.p12,
    gap: theme.metrics.spacing.p12,
    borderRadius: 12,
  },
  numberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
}));
