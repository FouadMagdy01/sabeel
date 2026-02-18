import { StyleSheet } from 'react-native-unistyles';
import { spacing, spacingV, hs, vs } from '@/theme/metrics';

export const ICON_BG_SIZE = hs(36);

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.p16,
    paddingVertical: spacingV.p12,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  iconContainer: {
    width: ICON_BG_SIZE,
    height: ICON_BG_SIZE,
    borderRadius: hs(10),
    backgroundColor: `${theme.colors.brand.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.p12,
  },
  content: {
    flex: 1,
  },
  valueText: {
    marginTop: vs(2),
  },
  rightContainer: {
    marginLeft: spacing.p8,
  },
}));
