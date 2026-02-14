import { StyleSheet } from 'react-native-unistyles';

import type { ComponentSize } from '../shared.types';

interface StyleProps {
  size: ComponentSize;
  fullWidth: boolean;
  disabled: boolean;
}

/**
 * Size-based configuration for SegmentedControl variants.
 * Maps each size to specific metrics for consistent sizing.
 */
const SIZE_CONFIG = {
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
 * Creates dynamic styles for SegmentedControl based on props.
 * Supports size variants, fullWidth layout, and disabled states.
 */
export const createStyles = ({ size, fullWidth, disabled }: StyleProps) => {
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

/**
 * Legacy static styles export for backward compatibility.
 * New code should use createStyles() with props instead.
 * @deprecated
 */
export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: theme.metrics.spacingV.p8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  segmentActive: {
    backgroundColor: theme.colors.brand.primary,
    shadowColor: theme.colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: theme.colors.shadow.elevationMedium,
  },
  segmentText: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.muted,
  },
  segmentTextActive: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.inverse,
  },
}));
