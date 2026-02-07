import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.metrics.spacing.p16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: theme.colors.brand.primary,
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.medium,
  },
  submitButton: {
    marginTop: theme.metrics.spacing.p8,
  },
}));
