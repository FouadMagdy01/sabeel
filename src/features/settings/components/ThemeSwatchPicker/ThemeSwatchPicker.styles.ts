import { StyleSheet } from 'react-native-unistyles';
import { spacing, spacingV, hs } from '@/theme/metrics';

const SWATCH_SIZE = hs(40);
const SWATCH_BORDER_SIZE = hs(46);

export const SWATCH_DIMENSIONS = {
  size: SWATCH_SIZE,
  borderSize: SWATCH_BORDER_SIZE,
} as const;

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.p16,
    paddingVertical: spacingV.p16,
    paddingHorizontal: spacing.p16,
  },
  swatchOuter: {
    width: SWATCH_BORDER_SIZE,
    height: SWATCH_BORDER_SIZE,
    borderRadius: SWATCH_BORDER_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchOuterSelected: {
    borderColor: theme.colors.brand.primary,
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: SWATCH_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginTop: spacingV.p4,
    textAlign: 'center',
  },
  swatchWrapper: {
    alignItems: 'center',
  },
}));
