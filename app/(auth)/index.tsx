import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/common/components/Button';
import Icon from '@/common/components/Icon/icon';
import { LoginForm, type LoginFormData } from '@/features/auth';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogin = (_: LoginFormData) => {
    // TODO: Implement actual login logic
    router.replace('/(main)/(tabs)');
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password navigation
  };

  const handleContinueAsGuest = () => {
    router.replace('/(main)/(tabs)');
  };

  const handleCreateAccount = () => {
    router.push('/Signup');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo/Illustration Section */}
        <View style={styles.illustrationContainer}>
          <View style={styles.logoCircle}>
            <Icon
              familyName="MaterialCommunityIcons"
              iconName="mosque"
              size={48}
              variant="inverse"
            />
          </View>
          <Text style={styles.appName}>Sabeel</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('auth.login.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.login.subtitle')}</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <LoginForm onSubmit={handleLogin} onForgotPassword={handleForgotPassword} />
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('auth.login.or')}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Guest Button */}
        <Button
          variant="outlined"
          onPress={handleContinueAsGuest}
          style={styles.guestButton}
          icon={<Icon familyName="Feather" iconName="user" size={18} variant="primary" />}
        >
          {t('auth.login.continueAsGuest')}
        </Button>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.login.noAccount')}</Text>
          <Button variant="text" onPress={handleCreateAccount} style={styles.createAccountButton}>
            {t('auth.login.createAccount')}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create((theme) => ({
  keyboardView: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.metrics.spacing.p24,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: theme.metrics.spacingV.p32,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.metrics.spacingV.p12,
    shadowColor: theme.colors.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: theme.colors.shadow.elevationMedium,
  },
  appName: {
    fontSize: theme.fonts.size['2xl'],
    fontFamily: theme.fonts.bold,
    color: theme.colors.brand.primary,
    letterSpacing: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.metrics.spacingV.p32,
  },
  title: {
    fontSize: theme.fonts.size.xl,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.metrics.spacingV.p4,
  },
  subtitle: {
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: theme.metrics.spacingV.p24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.metrics.spacingV.p20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.subtle,
  },
  dividerText: {
    marginHorizontal: theme.metrics.spacing.p16,
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.muted,
  },
  guestButton: {
    marginBottom: theme.metrics.spacingV.p24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingVertical: theme.metrics.spacingV.p16,
  },
  footerText: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
  createAccountButton: {
    marginLeft: theme.metrics.spacing.p4,
  },
}));
