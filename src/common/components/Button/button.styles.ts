import { StyleSheet } from 'react-native-unistyles';
// Import to ensure theme types are augmented

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
          opacity: 0.5,
        },
        false: {},
      },
    },
    compoundVariants: [
      // Contained + Primary
      {
        variant: 'contained',
        color: 'primary',
        styles: {
          backgroundColor: theme.colors.brand.primary,
        },
      },
      // Contained + Secondary
      {
        variant: 'contained',
        color: 'secondary',
        styles: {
          backgroundColor: theme.colors.brand.secondary,
        },
      },
      // Outlined + Primary
      {
        variant: 'outlined',
        color: 'primary',
        styles: {
          borderColor: theme.colors.brand.primary,
        },
      },
      // Outlined + Secondary
      {
        variant: 'outlined',
        color: 'secondary',
        styles: {
          borderColor: theme.colors.brand.secondary,
        },
      },
      // Elevated uses neutral colors, text color depends on color prop
      {
        variant: 'elevated',
        color: 'primary',
        styles: {},
      },
      {
        variant: 'elevated',
        color: 'secondary',
        styles: {},
      },
      // Disabled states
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
      // Outlined + Primary text color
      {
        variant: 'outlined',
        color: 'primary',
        styles: {
          color: theme.colors.brand.primary,
        },
      },
      // Outlined + Secondary text color
      {
        variant: 'outlined',
        color: 'secondary',
        styles: {
          color: theme.colors.brand.secondary,
        },
      },
      // Text + Primary text color
      {
        variant: 'text',
        color: 'primary',
        styles: {
          color: theme.colors.brand.primary,
        },
      },
      // Text + Secondary text color
      {
        variant: 'text',
        color: 'secondary',
        styles: {
          color: theme.colors.brand.secondary,
        },
      },
      // Elevated + Primary text color
      {
        variant: 'elevated',
        color: 'primary',
        styles: {
          color: theme.colors.brand.primary,
        },
      },
      // Elevated + Secondary text color
      {
        variant: 'elevated',
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
