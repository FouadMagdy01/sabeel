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
        tinted: {
          backgroundColor: theme.colors.state.successBg,
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
      color: {
        primary: {},
        success: {},
        error: {},
        warning: {},
        info: {},
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
      {
        variant: 'tinted',
        color: 'primary',
        styles: {
          backgroundColor: theme.colors.state.infoBg,
        },
      },
      {
        variant: 'tinted',
        color: 'success',
        styles: {
          backgroundColor: theme.colors.state.successBg,
        },
      },
      {
        variant: 'tinted',
        color: 'error',
        styles: {
          backgroundColor: theme.colors.state.errorBg,
        },
      },
      {
        variant: 'tinted',
        color: 'warning',
        styles: {
          backgroundColor: theme.colors.state.warningBg,
        },
      },
      {
        variant: 'tinted',
        color: 'info',
        styles: {
          backgroundColor: theme.colors.state.infoBg,
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
  small: 18,
  medium: 22,
  large: 28,
};
