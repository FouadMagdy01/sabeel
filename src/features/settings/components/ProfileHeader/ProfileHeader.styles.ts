import { StyleSheet } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

const AVATAR_SIZE = hs(56);

export const AVATAR_DIMENSIONS = { size: AVATAR_SIZE } as const;

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p20,
    marginHorizontal: theme.metrics.spacing.p16,
    marginBottom: theme.metrics.spacingV.p24,
    backgroundColor: theme.colors.background.surface,
    borderRadius: hs(12),
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: `${theme.colors.brand.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.metrics.spacing.p12,
  },
  info: {
    flex: 1,
  },
  nameText: {
    marginBottom: theme.metrics.spacingV.p4,
  },
}));
