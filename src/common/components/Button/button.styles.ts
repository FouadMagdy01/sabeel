import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    variants: {
      variant: {
        contained: {},
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
    ],
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
