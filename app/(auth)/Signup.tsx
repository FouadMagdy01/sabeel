import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/common/components/Button';
import Icon from '@/common/components/Icon/icon';
import { IconButton } from '@/common/components/IconButton';
import { SignupForm, type SignupFormData } from '@/features/auth';

export default function SignupScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSignup = (_: SignupFormData) => {
    // TODO: Implement actual signup logic
    router.replace('/(main)/(tabs)');
  };

  const handleBack = () => {
    router.back();
  };

  const handleLogin = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <IconButton
            familyName="Feather"
            iconName="arrow-left"
            onPress={handleBack}
            variant="ghost"
            size="medium"
          />
        </View>

        {/* Header with Icon */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon familyName="Feather" iconName="user-plus" size={32} variant="accent" />
          </View>
          <Text style={styles.title}>{t('auth.signup.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.signup.subtitle')}</Text>
        </View>

        {/* Signup Form */}
        <View style={styles.formContainer}>
          <SignupForm onSubmit={handleSignup} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.signup.alreadyHaveAccount')}</Text>
          <Button variant="text" onPress={handleLogin} style={styles.loginButton}>
            {t('auth.signup.loginLink')}
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
  backButtonContainer: {
    marginBottom: theme.metrics.spacingV.p8,
    marginLeft: -theme.metrics.spacing.p8,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.metrics.spacingV.p24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.state.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.metrics.spacingV.p12,
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
  loginButton: {
    marginLeft: theme.metrics.spacing.p4,
  },
}));
