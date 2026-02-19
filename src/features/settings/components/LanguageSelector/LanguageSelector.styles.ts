import { StyleSheet } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    borderRadius: hs(8),
    backgroundColor: theme.colors.background.input,
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p8,
    borderRadius: hs(8),
  },
  buttonActive: {
    backgroundColor: theme.colors.brand.primary,
  },
}));
