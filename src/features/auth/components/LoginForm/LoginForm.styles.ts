import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: theme.metrics.spacingV.p48,
    marginBottom: theme.metrics.spacingV.p32,
    gap: theme.metrics.spacingV.p16,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: theme.colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  formSection: {
    gap: theme.metrics.spacingV.p16,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
  },
  buttonContainer: {
    marginTop: theme.metrics.spacingV.p16,
    gap: theme.metrics.spacingV.p8,
  },
  serverError: {
    marginTop: theme.metrics.spacingV.p8,
  },
  footerSection: {
    marginTop: theme.metrics.spacingV.p32,
    paddingBottom: theme.metrics.spacingV.p24,
    gap: theme.metrics.spacingV.p16,
  },
  signupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  signupWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.metrics.spacing.p4,
  },
}));
