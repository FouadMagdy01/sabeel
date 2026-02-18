import { StyleSheet } from 'react-native-unistyles';
import { spacing, spacingV, hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    borderRadius: hs(8),
    backgroundColor: theme.colors.background.input,
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: spacing.p16,
    paddingVertical: spacingV.p8,
    borderRadius: hs(8),
  },
  buttonActive: {
    backgroundColor: theme.colors.brand.primary,
  },
}));
