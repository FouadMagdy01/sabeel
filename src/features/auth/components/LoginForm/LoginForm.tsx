import { Button } from '@/common/components/Button';
import { Divider } from '@/common/components/Divider';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Input } from '@/common/components/Input';
import { Typography } from '@/common/components/Typography';
import { useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useLoginForm } from '../../hooks/useLoginForm';
import { styles } from './LoginForm.styles';

export function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    control,
    errors,
    isSubmitting,
    serverError,
    isPasswordVisible,
    togglePasswordVisibility,
    handleLogin,
    handleSubmit,
  } = useLoginForm();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        {/* Logo with Icon */}
        <View style={styles.logoContainer}>
          <Icon familyName="MaterialIcons" iconName="mosque" variant="accent" size={40} />
        </View>

        {/* App Name */}
        <Typography type="heading" size="3xl" weight="bold" color="primary" align="center">
          {t('auth.login.appName')}
        </Typography>

        {/* Tagline */}
        <Typography type="body" size="sm" color="secondary" align="center" uppercase>
          {t('auth.login.tagline')}
        </Typography>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        {/* Email Input */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('auth.labels.email')}
              placeholder={t('auth.login.emailPlaceholder')}
              variant="filled"
              size="large"
              leftElement={<Icon familyName="Feather" iconName="mail" variant="muted" size={20} />}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.email}
              errorText={errors.email?.message}
              accessibilityLabel={t('auth.labels.email')}
            />
          )}
        />

        {/* Password Input */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('auth.labels.password')}
              placeholder={t('auth.login.passwordPlaceholder')}
              variant="filled"
              size="large"
              leftElement={<Icon familyName="Feather" iconName="lock" variant="muted" size={20} />}
              rightElement={
                <IconButton
                  familyName="Feather"
                  iconName={isPasswordVisible ? 'eye-off' : 'eye'}
                  variant="ghost"
                  iconVariant="muted"
                  size="small"
                  onPress={togglePasswordVisibility}
                  accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
                />
              }
              secureTextEntry={!isPasswordVisible}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.password}
              errorText={errors.password?.message}
              accessibilityLabel={t('auth.labels.password')}
            />
          )}
        />

        {/* Forgot Password Link */}
        <View style={styles.forgotPasswordContainer}>
          <Button
            variant="text"
            size="small"
            onPress={() => {
              // TODO: Navigate to forgot password screen when implemented
            }}
            accessibilityRole="link"
            accessibilityLabel={t('auth.login.forgotPassword')}
          >
            {t('auth.login.forgotPassword')}
          </Button>
        </View>

        {/* Login Button */}
        <View style={styles.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            fullWidth
            loading={isSubmitting}
            onPress={handleSubmit(handleLogin)}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel={t('auth.login.loginButton')}
          >
            {t('auth.login.loginButton')}
          </Button>

          {/* Server Error Display */}
          {serverError && (
            <Typography type="caption" color="error" align="center" style={styles.serverError}>
              {serverError}
            </Typography>
          )}

          {/* Footer Section - Wrapped in single View with gap */}
          {/* Or Divider */}
          <Divider>{t('auth.login.or')}</Divider>

          {/* Continue as Guest Button */}
          <Button
            variant="outlined"
            size="medium"
            fullWidth
            onPress={() => router.replace('/(main)/(tabs)')}
            accessibilityRole="button"
            accessibilityLabel={t('auth.login.continueAsGuest')}
          >
            {t('auth.login.continueAsGuest')}
          </Button>
        </View>
      </View>

      {/* Sign Up Link */}
      <View style={styles.signupContainer}>
        <View style={styles.signupWrapper}>
          <Typography type="body" size="sm" color="secondary">
            {t('auth.login.noAccount')}{' '}
          </Typography>
          <Button
            variant="text"
            size="small"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onPress={() => router.push('/(auth)/Signup' as any)}
            accessibilityRole="link"
            accessibilityLabel={t('auth.login.createAccount')}
          >
            {t('auth.login.createAccount')}
          </Button>
        </View>
      </View>
    </View>
  );
}
