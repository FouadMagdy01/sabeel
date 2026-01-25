import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.brand.primary,
        },
        secondary: {
          backgroundColor: theme.colors.brand.secondary,
        },
      },
      size: {
        small: {
          paddingVertical: 8,
          paddingHorizontal: 12,
        },
        large: {
          paddingVertical: 16,
          paddingHorizontal: 24,
        },
      },
    },
  },
}));
