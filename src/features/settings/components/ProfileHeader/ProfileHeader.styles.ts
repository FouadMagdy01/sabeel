import { StyleSheet } from 'react-native-unistyles';
import { spacing, spacingV, hs } from '@/theme/metrics';

const AVATAR_SIZE = hs(56);

export const AVATAR_DIMENSIONS = { size: AVATAR_SIZE } as const;

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.p16,
    paddingVertical: spacingV.p20,
    marginHorizontal: spacing.p16,
    marginBottom: spacingV.p24,
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
    marginRight: spacing.p12,
  },
  info: {
    flex: 1,
  },
  nameText: {
    marginBottom: spacingV.p4,
  },
}));
