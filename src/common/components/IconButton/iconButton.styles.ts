import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    variants: {
      variant: {
        filled: {
          backgroundColor: theme.colors.brand.primary,
        },
        outlined: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        },
        ghost: {
          backgroundColor: 'transparent',
        },
      },
      size: {
        small: {
          width: 32,
          height: 32,
        },
        medium: {
          width: 40,
          height: 40,
        },
        large: {
          width: 48,
          height: 48,
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
      {
        variant: 'filled',
        disabled: true,
        styles: {
          backgroundColor: theme.colors.background.disabled,
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
  androidWrapper: {
    borderRadius: 999,
    overflow: 'hidden',
  },
}));

export const ICON_SIZES: Record<'small' | 'medium' | 'large', number> = {
  small: 16,
  medium: 20,
  large: 24,
};
