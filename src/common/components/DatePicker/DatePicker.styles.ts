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
  pickerButton: {
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
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.metrics.spacing.p8,
  },
  pickerText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay.modal,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.p16,
  },
  modalContent: {
    backgroundColor: theme.colors.background.modal,
    borderRadius: 16,
    width: '100%',
    maxWidth: 360,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  modalTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fonts.size.lg,
    color: theme.colors.text.primary,
  },
  calendarContainer: {
    padding: theme.metrics.spacing.p16,
  },
  monthYearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.metrics.spacingV.p16,
  },
  monthYearText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fonts.size.md,
    color: theme.colors.text.primary,
  },
  monthYearNav: {
    flexDirection: 'row',
    gap: theme.metrics.spacing.p8,
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: theme.metrics.spacingV.p8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.metrics.spacingV.p4,
  },
  weekdayText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fonts.size.xs,
    color: theme.colors.text.muted,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: theme.colors.brand.primary,
  },
  dayButtonToday: {
    borderWidth: 1,
    borderColor: theme.colors.brand.primary,
  },
  dayText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fonts.size.sm,
    color: theme.colors.text.primary,
  },
  dayTextSelected: {
    color: theme.colors.text.inverse,
    fontFamily: theme.fonts.semiBold,
  },
  dayTextDisabled: {
    color: theme.colors.text.muted,
  },
  dayTextOtherMonth: {
    color: theme.colors.text.muted,
    opacity: 0.5,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.metrics.spacing.p12,
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  clearButton: {
    padding: theme.metrics.spacing.p4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
  // Year Selector styles
  yearSelectorContainer: {
    height: 300,
    paddingVertical: theme.metrics.spacingV.p8,
  },
  yearItem: {
    paddingVertical: theme.metrics.spacingV.p12,
    paddingHorizontal: theme.metrics.spacing.p16,
    alignItems: 'center',
    borderRadius: 8,
  },
  yearItemSelected: {
    backgroundColor: theme.colors.brand.primary,
  },
  yearItemDisabled: {
    opacity: 0.4,
  },
  yearInputContainer: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p8,
    marginBottom: theme.metrics.spacingV.p8,
  },
  yearInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: 8,
    paddingHorizontal: theme.metrics.spacing.p12,
    paddingVertical: theme.metrics.spacingV.p8,
    fontSize: theme.fonts.size.md,
    color: theme.colors.text.primary,
    textAlign: 'center',
    fontFamily: theme.fonts.medium,
  },
  // Month Grid styles
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.metrics.spacing.p8,
    paddingHorizontal: theme.metrics.spacing.p8,
  },
  monthItem: {
    width: '30%',
    paddingVertical: theme.metrics.spacingV.p12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  monthItemSelected: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.primary,
  },
  monthItemDisabled: {
    opacity: 0.4,
  },
  // Time Wheel Picker styles
  timePickerContainer: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  timeWheelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
  },
  timeWheelItem: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.metrics.spacing.p16,
  },
  timeWheelItemSelected: {
    backgroundColor: theme.colors.brand.primary,
    borderRadius: 8,
  },
  timeWheelItemDisabled: {
    opacity: 0.3,
  },
  timeWheelSeparator: {
    fontSize: theme.fonts.size.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginHorizontal: theme.metrics.spacing.p4,
  },
  // AM/PM Toggle styles
  amPmToggle: {
    marginLeft: theme.metrics.spacing.p12,
    gap: theme.metrics.spacingV.p4,
  },
  amPmButton: {
    paddingVertical: theme.metrics.spacingV.p8,
    paddingHorizontal: theme.metrics.spacing.p12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
  },
  amPmButtonActive: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.primary,
  },
  // Tappable month/year labels
  monthYearTappable: {
    paddingHorizontal: theme.metrics.spacing.p8,
    paddingVertical: theme.metrics.spacingV.p4,
    borderRadius: 6,
  },
  monthYearContainer: {
    flexDirection: 'row',
    gap: theme.metrics.spacing.p8,
  },
  subViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
    paddingBottom: theme.metrics.spacingV.p8,
  },
}));
