import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    width: '100%',
    gap: theme.metrics.spacingV.p4,
  },
  label: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fonts.size.xs,
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
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
      open: {
        true: {},
        false: {},
      },
    },
    compoundVariants: [
      {
        variant: 'outlined',
        error: true,
        styles: {
          borderColor: theme.colors.state.error,
        },
      },
      {
        variant: 'outlined',
        open: true,
        styles: {
          borderColor: theme.colors.border.strong,
          borderWidth: 2,
        },
      },
      {
        variant: 'filled',
        error: true,
        styles: {
          borderWidth: 1,
          borderColor: theme.colors.state.error,
        },
      },
      {
        variant: 'filled',
        open: true,
        styles: {
          borderWidth: 2,
          borderColor: theme.colors.border.strong,
        },
      },
    ],
  },
  leftElement: {
    marginRight: theme.metrics.spacing.p8,
    justifyContent: 'center',
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.metrics.spacing.p8,
  },
  selectIcon: {
    fontSize: theme.fonts.size.lg,
  },
  selectText: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
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
      placeholder: {
        true: {
          color: theme.colors.text.muted,
        },
        false: {},
      },
    },
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
    },
  },
  bottomSheetBackground: {
    backgroundColor: theme.colors.background.modal,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetIndicator: {
    backgroundColor: theme.colors.border.default,
    width: 40,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.background.modal,
    marginBottom: theme.metrics.spacingV.p8,
  },
  modalTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fonts.size.lg,
    color: theme.colors.text.primary,
  },
  optionsList: {
    paddingHorizontal: theme.metrics.spacing.p16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
    borderRadius: 8,
    gap: theme.metrics.spacing.p12,
  },
  optionItemSelected: {
    backgroundColor: theme.colors.overlay.pressed,
  },
  optionIcon: {
    fontSize: theme.fonts.size.xl,
  },
  optionText: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: theme.fonts.size.md,
    color: theme.colors.text.primary,
  },
  optionTextSelected: {
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.brand.primary,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  searchContainer: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.background.modal,
  },
  loadingContainer: {
    paddingVertical: theme.metrics.spacingV.p32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    padding: theme.metrics.spacing.p4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
}));
