import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  base: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    variants: {
      type: {
        heading: {
          fontSize: theme.fonts.size.xl,
          fontFamily: theme.fonts.bold,
        },
        body: {
          fontSize: theme.fonts.size.sm,
          fontFamily: theme.fonts.regular,
        },
        caption: {
          fontSize: theme.fonts.size.xs,
          fontFamily: theme.fonts.medium,
          color: theme.colors.text.tertiary,
        },
        label: {
          fontSize: theme.fonts.size.xs,
          fontFamily: theme.fonts.bold,
          color: theme.colors.text.secondary,
          textTransform: 'uppercase',
        },
        overline: {
          fontSize: theme.fonts.size.xxs,
          fontFamily: theme.fonts.bold,
          color: theme.colors.text.tertiary,
          textTransform: 'uppercase',
          letterSpacing: 3, // Typography-specific spacing for overline text
        },
      },
      size: {
        xxs: { fontSize: theme.fonts.size.xxs },
        xs: { fontSize: theme.fonts.size.xs },
        sm: { fontSize: theme.fonts.size.sm },
        md: { fontSize: theme.fonts.size.md },
        lg: { fontSize: theme.fonts.size.lg },
        xl: { fontSize: theme.fonts.size.xl },
        '2xl': { fontSize: theme.fonts.size['2xl'] },
        '3xl': { fontSize: theme.fonts.size['3xl'] },
        '4xl': { fontSize: theme.fonts.size['4xl'] },
      },
      weight: {
        regular: { fontFamily: theme.fonts.regular },
        medium: { fontFamily: theme.fonts.medium },
        semiBold: { fontFamily: theme.fonts.semiBold },
        bold: { fontFamily: theme.fonts.bold },
      },
      color: {
        primary: { color: theme.colors.text.primary },
        secondary: { color: theme.colors.text.secondary },
        tertiary: { color: theme.colors.text.tertiary },
        muted: { color: theme.colors.text.muted },
        inverse: { color: theme.colors.text.inverse },
        accent: { color: theme.colors.text.accent },
        error: { color: theme.colors.state.error },
        success: { color: theme.colors.state.success },
        disabled: { color: theme.colors.state.disabled },
        brandPrimary: { color: theme.colors.brand.primary },
        brandSecondary: { color: theme.colors.brand.secondary },
        brandTertiary: { color: theme.colors.brand.tertiary },
      },
      align: {
        left: { textAlign: 'left' },
        center: { textAlign: 'center' },
        right: { textAlign: 'right' },
      },
      uppercase: {
        true: { textTransform: 'uppercase' },
        false: {},
      },
      italic: {
        true: { fontStyle: 'italic' },
        false: {},
      },
      strikethrough: {
        true: { textDecorationLine: 'line-through' },
        false: {},
      },
      underline: {
        true: { textDecorationLine: 'underline' },
        false: {},
      },
    },
  },
}));
