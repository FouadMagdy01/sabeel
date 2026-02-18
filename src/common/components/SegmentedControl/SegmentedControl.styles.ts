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

/**
 * Module-level stylesheet - layout and metrics only.
 * Theme COLORS are applied inline via useUnistyles() to avoid
 * flicker during theme switching (race between JSI style update and React re-render).
 */
export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
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
  segmentActive: {
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
  },
  segmentTextActive: {
    fontFamily: theme.fonts.bold,
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

/**
 * @deprecated Use styles + getSizeStyles() instead.
 * Kept for backward compatibility only.
 */
export const createStyles = ({
  size,
  fullWidth,
  disabled,
}: {
  size: ComponentSize;
  fullWidth: boolean;
  disabled: boolean;
}) => {
  const config = SIZE_CONFIG[size];

  return StyleSheet.create((theme) => ({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.surface,
      borderRadius: config.borderRadius,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      padding: config.containerPadding,
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
      opacity: disabled ? 0.5 : 1,
    },
    segment: {
      flex: fullWidth ? 1 : 0,
      paddingVertical: config.segmentPaddingVertical,
      paddingHorizontal: config.segmentPaddingHorizontal,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: config.segmentBorderRadius,
      flexDirection: 'row',
      minWidth: fullWidth ? undefined : 80,
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
      marginRight: config.iconSpacing,
      width: config.iconSize,
      height: config.iconSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentText: {
      fontSize: theme.fonts.size[config.fontSize],
      fontFamily: theme.fonts.semiBold,
      color: theme.colors.text.muted,
      textAlign: 'center',
    },
    segmentTextActive: {
      fontSize: theme.fonts.size[config.fontSize],
      fontFamily: theme.fonts.bold,
      color: theme.colors.text.inverse,
    },
    segmentTextDisabled: {
      color: theme.colors.state.disabled,
    },
  }));
};
