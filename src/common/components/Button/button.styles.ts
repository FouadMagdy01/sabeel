import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    variants: {
      variant: {
        contained: {
          backgroundColor: theme.colors.brand.primary,
        },
        outlined: {
          backgroundColor: 'transparent',
          borderWidth: 1,
        },
        elevated: {
          backgroundColor: theme.colors.background.surfaceAlt,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 3,
          shadowColor: theme.colors.shadow.color,
          elevation: theme.colors.shadow.elevationSmall,
        },
        text: {
          backgroundColor: 'transparent',
        },
        transparent: {
          backgroundColor: 'transparent',
          paddingVertical: 0,
          paddingHorizontal: 0,
        },
      },
      color: {
        primary: {},
        secondary: {},
        success: {},
        error: {},
        warning: {},
        info: {},
      },
      fullWidth: {
        true: {
          width: '100%',
          alignSelf: 'stretch',
        },
        false: {},
      },
      size: {
        small: {
          paddingVertical: theme.metrics.spacingV.p4,
          paddingHorizontal: theme.metrics.spacing.p8,
          borderRadius: 6,
          gap: theme.metrics.spacing.p4,
        },
        medium: {
          paddingVertical: theme.metrics.spacingV.p4 + 2,
          paddingHorizontal: theme.metrics.spacing.p12,
          borderRadius: 8,
          gap: theme.metrics.spacing.p4,
        },
        large: {
          paddingVertical: theme.metrics.spacingV.p12,
          paddingHorizontal: theme.metrics.spacing.p16,
          borderRadius: 10,
          gap: theme.metrics.spacing.p8,
        },
      },
      disabled: {
        true: {
          opacity: 0.6, // Standard disabled opacity - no theme token available
        },
        false: {},
      },
    },
    compoundVariants: [
      {
        variant: 'contained',
        color: 'primary',
        styles: {
          backgroundColor: theme.colors.brand.primary,
        },
      },
      {
        variant: 'contained',
        color: 'secondary',
        styles: {
          backgroundColor: theme.colors.brand.secondary,
        },
      },
      {
        variant: 'outlined',
        color: 'primary',
        styles: {
          borderColor: theme.colors.brand.primary,
        },
      },
      {
        variant: 'outlined',
        color: 'secondary',
        styles: {
          borderColor: theme.colors.brand.secondary,
        },
      },
      {
        variant: 'contained',
        disabled: true,
        styles: {
          backgroundColor: theme.colors.background.disabled,
        },
      },
      {
        variant: 'elevated',
        disabled: true,
        styles: {
          backgroundColor: theme.colors.background.disabled,
          shadowOpacity: 0,
          elevation: 0,
        },
      },
      {
        variant: 'outlined',
        disabled: true,
        styles: {
          borderColor: theme.colors.border.disabled,
        },
      },
      // Success color variants
      {
        variant: 'contained',
        color: 'success',
        styles: {
          backgroundColor: theme.colors.state.success,
        },
      },
      {
        variant: 'outlined',
        color: 'success',
        styles: {
          borderColor: theme.colors.state.success,
        },
      },
      // Error color variants
      {
        variant: 'contained',
        color: 'error',
        styles: {
          backgroundColor: theme.colors.state.error,
        },
      },
      {
        variant: 'outlined',
        color: 'error',
        styles: {
          borderColor: theme.colors.state.error,
        },
      },
      // Warning color variants
      {
        variant: 'contained',
        color: 'warning',
        styles: {
          backgroundColor: theme.colors.state.warning,
        },
      },
      {
        variant: 'outlined',
        color: 'warning',
        styles: {
          borderColor: theme.colors.state.warning,
        },
      },
      // Info color variants
      {
        variant: 'contained',
        color: 'info',
        styles: {
          backgroundColor: theme.colors.state.info,
        },
      },
      {
        variant: 'outlined',
        color: 'info',
        styles: {
          borderColor: theme.colors.state.info,
        },
      },
    ],
  },
  text: {
    fontFamily: theme.fonts.semiBold,
    variants: {
      variant: {
        contained: {
          color: theme.colors.text.inverse,
        },
        outlined: {},
        elevated: {},
        text: {},
        transparent: {},
      },
      color: {
        primary: {},
        secondary: {},
        success: {},
        error: {},
        warning: {},
        info: {},
      },
      size: {
        small: {
          fontSize: theme.fonts.size.xs,
        },
        medium: {
          fontSize: theme.fonts.size.sm,
        },
        large: {
          fontSize: theme.fonts.size.md,
        },
      },
      disabled: {
        true: {
          color: theme.colors.text.muted,
        },
        false: {},
      },
    },
    compoundVariants: [
      {
        variant: 'outlined',
        color: 'primary',
        styles: {
          color: theme.colors.brand.primary,
        },
      },
      {
        variant: 'outlined',
        color: 'secondary',
        styles: {
          color: theme.colors.brand.secondary,
        },
      },
      {
        variant: 'text',
        color: 'primary',
        styles: {
          color: theme.colors.brand.primary,
        },
      },
      {
        variant: 'text',
        color: 'secondary',
        styles: {
          color: theme.colors.brand.secondary,
        },
      },
      {
        variant: 'elevated',
        color: 'primary',
        styles: {
          color: theme.colors.brand.primary,
        },
      },
      {
        variant: 'elevated',
        color: 'secondary',
        styles: {
          color: theme.colors.brand.secondary,
        },
      },
      {
        variant: 'transparent',
        color: 'primary',
        styles: {
          color: theme.colors.brand.primary,
        },
      },
      {
        variant: 'transparent',
        color: 'secondary',
        styles: {
          color: theme.colors.brand.secondary,
        },
      },
      // Success text color variants
      {
        variant: 'outlined',
        color: 'success',
        styles: {
          color: theme.colors.state.success,
        },
      },
      {
        variant: 'text',
        color: 'success',
        styles: {
          color: theme.colors.state.success,
        },
      },
      {
        variant: 'elevated',
        color: 'success',
        styles: {
          color: theme.colors.state.success,
        },
      },
      {
        variant: 'transparent',
        color: 'success',
        styles: {
          color: theme.colors.state.success,
        },
      },
      // Error text color variants
      {
        variant: 'outlined',
        color: 'error',
        styles: {
          color: theme.colors.state.error,
        },
      },
      {
        variant: 'text',
        color: 'error',
        styles: {
          color: theme.colors.state.error,
        },
      },
      {
        variant: 'elevated',
        color: 'error',
        styles: {
          color: theme.colors.state.error,
        },
      },
      {
        variant: 'transparent',
        color: 'error',
        styles: {
          color: theme.colors.state.error,
        },
      },
      // Warning text color variants
      {
        variant: 'outlined',
        color: 'warning',
        styles: {
          color: theme.colors.state.warning,
        },
      },
      {
        variant: 'text',
        color: 'warning',
        styles: {
          color: theme.colors.state.warning,
        },
      },
      {
        variant: 'elevated',
        color: 'warning',
        styles: {
          color: theme.colors.state.warning,
        },
      },
      {
        variant: 'transparent',
        color: 'warning',
        styles: {
          color: theme.colors.state.warning,
        },
      },
      // Info text color variants
      {
        variant: 'outlined',
        color: 'info',
        styles: {
          color: theme.colors.state.info,
        },
      },
      {
        variant: 'text',
        color: 'info',
        styles: {
          color: theme.colors.state.info,
        },
      },
      {
        variant: 'elevated',
        color: 'info',
        styles: {
          color: theme.colors.state.info,
        },
      },
      {
        variant: 'transparent',
        color: 'info',
        styles: {
          color: theme.colors.state.info,
        },
      },
    ],
  },
  pressedOverlay: {
    backgroundColor: theme.colors.overlay.pressed,
  },
  androidWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    variants: {
      size: {
        small: {
          borderRadius: 6,
        },
        medium: {
          borderRadius: 8,
        },
        large: {
          borderRadius: 10,
        },
      },
    },
  },
}));
