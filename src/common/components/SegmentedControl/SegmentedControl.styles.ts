import { StyleSheet } from 'react-native-unistyles';

import type { ComponentSize } from '../shared.types';

/**
 * Size-based configuration for SegmentedControl variants.
 * Maps each size to specific metrics for consistent sizing.
 */
export const SIZE_CONFIG = {
  small: {
    containerPadding: 3,
    segmentPaddingVertical: 6,
    segmentPaddingHorizontal: 12,
    borderRadius: 10,
    segmentBorderRadius: 7,
    fontSize: 'xs' as const,
    iconSize: 14,
    iconSpacing: 4,
  },
  medium: {
    containerPadding: 4,
    segmentPaddingVertical: 8,
    segmentPaddingHorizontal: 16,
    borderRadius: 16,
    segmentBorderRadius: 12,
    fontSize: 'xs' as const,
    iconSize: 16,
    iconSpacing: 6,
  },
  large: {
    containerPadding: 5,
    segmentPaddingVertical: 12,
    segmentPaddingHorizontal: 20,
    borderRadius: 20,
    segmentBorderRadius: 15,
    fontSize: 'sm' as const,
    iconSize: 18,
    iconSpacing: 8,
  },
} as const;

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.default,
  },
  containerFullWidth: {
    alignSelf: 'stretch',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  segment: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  segmentFullWidth: {
    flex: 1,
  },
  test: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.brand.primary,
  },
  segmentActive: {
    backgroundColor: theme.colors.brand.primary,
    shadowColor: theme.colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: theme.colors.shadow.elevationMedium,
  },
  segmentDisabled: {
    opacity: 0.4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
  segmentTextActive: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.inverse,
  },
  segmentTextDisabled: {
    color: theme.colors.state.disabled,
  },
}));

/**
 * Get size-dependent numeric styles (no theme colors, safe for inline use).
 */
export function getSizeStyles(size: ComponentSize) {
  const config = SIZE_CONFIG[size];
  return {
    container: {
      borderRadius: config.borderRadius,
      padding: config.containerPadding,
    },
    segment: {
      paddingVertical: config.segmentPaddingVertical,
      paddingHorizontal: config.segmentPaddingHorizontal,
      borderRadius: config.segmentBorderRadius,
      minWidth: 80,
    },
    iconContainer: {
      marginRight: config.iconSpacing,
      width: config.iconSize,
      height: config.iconSize,
    },
    fontSize: config.fontSize,
  };
}
