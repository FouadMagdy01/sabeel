import { StyleSheet } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: theme.metrics.spacingV.p24,
  },
  title: {
    paddingHorizontal: theme.metrics.spacing.p16,
    marginBottom: theme.metrics.spacingV.p8,
  },
  card: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: hs(12),
    marginHorizontal: theme.metrics.spacing.p16,
    overflow: 'hidden',
  },
}));
