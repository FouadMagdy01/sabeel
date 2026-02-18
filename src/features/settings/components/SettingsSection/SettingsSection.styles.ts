import { StyleSheet } from 'react-native-unistyles';
import { spacing, spacingV, hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: spacingV.p24,
  },
  title: {
    paddingHorizontal: spacing.p16,
    marginBottom: spacingV.p8,
  },
  card: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: hs(12),
    marginHorizontal: spacing.p16,
    overflow: 'hidden',
  },
}));
