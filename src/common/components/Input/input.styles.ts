import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    width: '100%',
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fonts.size.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.metrics.spacingV.p4,
    variants: {
      disabled: {
        true: {
          color: theme.colors.text.muted,
        },
        false: {},
      },
      error: {
        true: {
          color: theme.colors.state.error,
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
          borderWidth: 0,
        },
        underlined: {
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.default,
          borderRadius: 0,
        },
      },
      size: {
        small: {
          paddingHorizontal: theme.metrics.spacing.p8,
          paddingVertical: theme.metrics.spacingV.p4,
          borderRadius: 6,
          gap: theme.metrics.spacing.p4,
        },
        medium: {
          paddingHorizontal: theme.metrics.spacing.p12,
          paddingVertical: theme.metrics.spacingV.p8,
          borderRadius: 8,
          gap: theme.metrics.spacing.p8,
        },
        large: {
          paddingHorizontal: theme.metrics.spacing.p16,
          paddingVertical: theme.metrics.spacingV.p12,
          borderRadius: 10,
          gap: theme.metrics.spacing.p8,
        },
      },
      focused: {
        true: {},
        false: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
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
    },
    compoundVariants: [
      // Outlined + Focused
      {
        variant: 'outlined',
        focused: true,
        styles: {
          borderColor: theme.colors.border.strong,
          borderWidth: 2,
        },
      },
      // Outlined + Error
      {
        variant: 'outlined',
        error: true,
        styles: {
          borderColor: theme.colors.state.error,
        },
      },
      // Outlined + Success
      {
        variant: 'outlined',
        success: true,
        styles: {
          borderColor: theme.colors.state.success,
        },
      },
      // Outlined + Disabled
      {
        variant: 'outlined',
        disabled: true,
        styles: {
          borderColor: theme.colors.border.disabled,
          backgroundColor: theme.colors.background.disabled,
        },
      },
      // Filled + Focused
      {
        variant: 'filled',
        focused: true,
        styles: {
          borderWidth: 2,
          borderColor: theme.colors.border.strong,
        },
      },
      // Filled + Error
      {
        variant: 'filled',
        error: true,
        styles: {
          borderWidth: 1,
          borderColor: theme.colors.state.error,
        },
      },
      // Filled + Success
      {
        variant: 'filled',
        success: true,
        styles: {
          borderWidth: 1,
          borderColor: theme.colors.state.success,
        },
      },
      // Filled + Disabled
      {
        variant: 'filled',
        disabled: true,
        styles: {
          backgroundColor: theme.colors.background.disabled,
        },
      },
      // Underlined + Focused
      {
        variant: 'underlined',
        focused: true,
        styles: {
          borderBottomWidth: 2,
          borderBottomColor: theme.colors.border.strong,
        },
      },
      // Underlined + Error
      {
        variant: 'underlined',
        error: true,
        styles: {
          borderBottomColor: theme.colors.state.error,
        },
      },
      // Underlined + Success
      {
        variant: 'underlined',
        success: true,
        styles: {
          borderBottomColor: theme.colors.state.success,
        },
      },
      // Underlined + Disabled
      {
        variant: 'underlined',
        disabled: true,
        styles: {
          borderBottomColor: theme.colors.border.disabled,
        },
      },
      // Size overrides for underlined (no border radius)
      {
        variant: 'underlined',
        size: 'small',
        styles: {
          borderRadius: 0,
          paddingHorizontal: 0,
        },
      },
      {
        variant: 'underlined',
        size: 'medium',
        styles: {
          borderRadius: 0,
          paddingHorizontal: 0,
        },
      },
      {
        variant: 'underlined',
        size: 'large',
        styles: {
          borderRadius: 0,
          paddingHorizontal: 0,
        },
      },
    ],
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    padding: 0,
    margin: 0,
    variants: {
      size: {
        small: {
          fontSize: theme.fonts.size.sm,
        },
        medium: {
          fontSize: theme.fonts.size.md,
        },
        large: {
          fontSize: theme.fonts.size.lg,
        },
      },
      disabled: {
        true: {
          color: theme.colors.text.muted,
        },
        false: {},
      },
    },
  },
  leftElement: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightElement: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fonts.size.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.metrics.spacingV.p4,
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
