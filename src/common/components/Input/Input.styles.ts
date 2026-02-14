import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.metrics.spacingV.p4,
  },
  label: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.secondary,
    marginBottom: theme.metrics.spacingV.p4,
    variants: {
      error: {
        true: {
          color: theme.colors.state.error,
        },
        false: {},
      },
      disabled: {
        true: {
          color: theme.colors.text.muted,
        },
        false: {},
      },
    },
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    variants: {
      variant: {
        outlined: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        },
        filled: {
          backgroundColor: theme.colors.background.input,
          borderWidth: 1,
          borderColor: 'transparent',
        },
        underlined: {
          backgroundColor: 'transparent',
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.default,
          borderRadius: 0,
        },
      },
      size: {
        small: {
          paddingHorizontal: theme.metrics.spacing.p8,
          minHeight: 36,
          borderRadius: 6,
        },
        medium: {
          paddingHorizontal: theme.metrics.spacing.p12,
          minHeight: 44,
          borderRadius: 8,
        },
        large: {
          paddingHorizontal: theme.metrics.spacing.p16,
          minHeight: 52,
          borderRadius: 10,
        },
      },
      focused: {
        true: {},
        false: {},
      },
      error: {
        true: {},
        false: {},
      },
      success: {
        true: {},
        false: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
        false: {},
      },
    },
    compoundVariants: [
      // Focused states
      {
        variant: 'outlined',
        focused: true,
        styles: {
          borderColor: theme.colors.border.focus,
        },
      },
      {
        variant: 'filled',
        focused: true,
        styles: {
          borderColor: theme.colors.border.focus,
        },
      },
      {
        variant: 'underlined',
        focused: true,
        styles: {
          borderBottomColor: theme.colors.border.focus,
        },
      },
      // Error states
      {
        variant: 'outlined',
        error: true,
        styles: {
          borderColor: theme.colors.state.error,
        },
      },
      {
        variant: 'filled',
        error: true,
        styles: {
          borderColor: theme.colors.state.error,
        },
      },
      {
        variant: 'underlined',
        error: true,
        styles: {
          borderBottomColor: theme.colors.state.error,
        },
      },
      // Success states
      {
        variant: 'outlined',
        success: true,
        styles: {
          borderColor: theme.colors.state.success,
        },
      },
      {
        variant: 'filled',
        success: true,
        styles: {
          borderColor: theme.colors.state.success,
        },
      },
      {
        variant: 'underlined',
        success: true,
        styles: {
          borderBottomColor: theme.colors.state.success,
        },
      },
      // Underlined size adjustments (no horizontal padding, no border radius)
      {
        variant: 'underlined',
        size: 'small',
        styles: {
          paddingHorizontal: 0,
          borderRadius: 0,
        },
      },
      {
        variant: 'underlined',
        size: 'medium',
        styles: {
          paddingHorizontal: 0,
          borderRadius: 0,
        },
      },
      {
        variant: 'underlined',
        size: 'large',
        styles: {
          paddingHorizontal: 0,
          borderRadius: 0,
        },
      },
    ],
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    padding: 0,
    variants: {
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
    },
  },
  leftElement: {
    marginRight: theme.metrics.spacing.p8,
    justifyContent: 'center',
  },
  rightElement: {
    marginLeft: theme.metrics.spacing.p8,
    justifyContent: 'center',
  },
  helperText: {
    fontSize: 11,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.muted,
    variants: {
      error: {
        true: {
          color: theme.colors.state.error,
        },
        false: {},
      },
      success: {
        true: {
          color: theme.colors.state.success,
        },
        false: {},
      },
    },
  },
}));
