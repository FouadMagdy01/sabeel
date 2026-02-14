import { StyleSheet } from 'react-native-unistyles';

export const SEARCH_INPUT_ICON_SIZES = {
  small: 16,
  medium: 18,
  large: 20,
} as const;

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.input,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    gap: theme.metrics.spacing.p8,
    variants: {
      size: {
        small: {
          paddingHorizontal: theme.metrics.spacing.p8,
          minHeight: 36,
          borderRadius: 8,
        },
        medium: {
          paddingHorizontal: theme.metrics.spacing.p12,
          minHeight: 44,
          borderRadius: 12,
        },
        large: {
          paddingHorizontal: theme.metrics.spacing.p16,
          minHeight: 52,
          borderRadius: 14,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
          backgroundColor: theme.colors.background.disabled,
        },
        false: {},
      },
    },
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
  clearButton: {
    padding: 2,
  },
  loadingSpinner: {
    // ActivityIndicator will use size prop directly
  },
}));
