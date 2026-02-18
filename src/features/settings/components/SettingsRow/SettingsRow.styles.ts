import { StyleSheet } from 'react-native-unistyles';
import { spacing, spacingV, hs, vs } from '@/theme/metrics';

export const ICON_BG_SIZE = hs(36);

/**
 * Layout-only styles. Theme colors applied inline via useUnistyles()
 * to avoid flicker during theme switching.
 */
export const styles = StyleSheet.create(() => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.p16,
    paddingVertical: spacingV.p12,
  },
  separator: {
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: ICON_BG_SIZE,
    height: ICON_BG_SIZE,
    borderRadius: hs(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: spacing.p12,
  },
  content: {
    flex: 1,
  },
  valueText: {
    marginTop: vs(2),
  },
  rightContainer: {
    marginStart: spacing.p8,
  },
}));
