import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.metrics.spacingV.p4,
  },
  label: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.semiBold,
    marginBottom: theme.metrics.spacingV.p4,
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
        },
        filled: {
          borderWidth: 1,
          borderColor: 'transparent',
        },
        underlined: {
          backgroundColor: 'transparent',
          borderBottomWidth: 1,
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
    ],
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    // color applied inline to avoid flicker
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
  },
  requiredIndicator: {
    marginLeft: 2,
  },
  charCount: {
    fontSize: 11,
    fontFamily: theme.fonts.regular,
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
