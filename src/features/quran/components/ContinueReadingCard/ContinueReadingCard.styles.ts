import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.metrics.spacingV.p12,
    paddingHorizontal: theme.metrics.spacing.p16,
    borderRadius: 12,
    gap: theme.metrics.spacing.p12,
  },
  badge: {
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
    gap: theme.metrics.spacing.p4,
  },
}));
