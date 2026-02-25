import { StyleSheet } from 'react-native-unistyles';
import { hs, vs } from '@/theme/metrics';

export const ICON_BG_SIZE = hs(36);

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  iconContainer: {
    width: ICON_BG_SIZE,
    height: ICON_BG_SIZE,
    borderRadius: hs(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: theme.metrics.spacing.p12,
    backgroundColor: `${theme.colors.brand.primary}15`,
  },
  content: {
    flex: 1,
  },
  valueText: {
    marginTop: vs(2),
  },
  rightContainer: {
    marginStart: theme.metrics.spacing.p8,
  },
}));
