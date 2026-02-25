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
  },
  labelError: {
    color: theme.colors.state.error,
  },
  labelDisabled: {
    color: theme.colors.text.muted,
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
      // Error state borders
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
      // Success state borders
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
      // Focused state borders (only when not error/success)
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
    fontSize: theme.fonts.size.xxs,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.muted,
  },
  helperTextError: {
    color: theme.colors.state.error,
  },
  helperTextSuccess: {
    color: theme.colors.state.success,
  },
  requiredIndicator: {
    color: theme.colors.state.error,
    marginLeft: 2,
  },
  charCount: {
    fontSize: theme.fonts.size.xxs,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.muted,
    marginTop: theme.metrics.spacingV.p4,
  },
  helperTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.metrics.spacing.p8,
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
