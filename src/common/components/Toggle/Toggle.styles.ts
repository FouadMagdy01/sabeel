import { StyleSheet } from 'react-native-unistyles';
import { hs, vs } from '@/theme/metrics';

const TRACK_WIDTH_MD = hs(48);
const TRACK_HEIGHT_MD = vs(28);
const THUMB_SIZE_MD = hs(22);
const TRACK_WIDTH_SM = hs(40);
const TRACK_HEIGHT_SM = vs(24);
const THUMB_SIZE_SM = hs(18);
const THUMB_MARGIN = hs(3);

export const TOGGLE_CONSTANTS = {
  medium: {
    trackWidth: TRACK_WIDTH_MD,
    trackHeight: TRACK_HEIGHT_MD,
    thumbSize: THUMB_SIZE_MD,
    thumbMargin: THUMB_MARGIN,
    translateX: TRACK_WIDTH_MD - THUMB_SIZE_MD - THUMB_MARGIN * 2,
  },
  small: {
    trackWidth: TRACK_WIDTH_SM,
    trackHeight: TRACK_HEIGHT_SM,
    thumbSize: THUMB_SIZE_SM,
    thumbMargin: THUMB_MARGIN,
    translateX: TRACK_WIDTH_SM - THUMB_SIZE_SM - THUMB_MARGIN * 2,
  },
} as const;

export const styles = StyleSheet.create((theme) => ({
  track: {
    borderRadius: 999,
    justifyContent: 'center',
    paddingHorizontal: THUMB_MARGIN,
  },
  trackActive: {
    backgroundColor: theme.colors.brand.primary,
  },
  trackInactive: {
    backgroundColor: theme.colors.border.default,
  },
  trackDisabled: {
    opacity: 0.5,
  },
  thumb: {
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    variants: {},
  },
}));
