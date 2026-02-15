import { Button } from '@/common/components/Button';
import { DatePicker } from '@/common/components/DatePicker';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Input } from '@/common/components/Input';
import { Select } from '@/common/components/Select';
import { Typography } from '@/common/components/Typography';
import { useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { COUNTRIES } from '../../data/countries';
import { useSignupForm } from '../../hooks/useSignupForm';
import { styles } from './SignupForm.styles';

export function SignupForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    control,
    errors,
    isSubmitting,
    serverError,
    isPasswordVisible,
    isConfirmVisible,
    togglePasswordVisibility,
    toggleConfirmVisibility,
    handleSignup,
    handleSubmit,
    trigger,
  } = useSignupForm();

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
          {t('auth.signup.appName')}
        </Typography>

        {/* Tagline */}
        <Typography type="body" size="sm" color="secondary" align="center" uppercase>
          {t('auth.signup.tagline')}
        </Typography>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        {/* First Name Input */}
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('auth.labels.firstName')}
              placeholder={t('auth.signup.firstNamePlaceholder')}
              variant="filled"
              size="large"
              leftElement={<Icon familyName="Feather" iconName="user" variant="muted" size={20} />}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.firstName}
              errorText={errors.firstName?.message}
              accessibilityLabel={t('auth.labels.firstName')}
            />
          )}
        />

        {/* Last Name Input */}
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('auth.labels.lastName')}
              placeholder={t('auth.signup.lastNamePlaceholder')}
              variant="filled"
              size="large"
              leftElement={<Icon familyName="Feather" iconName="user" variant="muted" size={20} />}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.lastName}
              errorText={errors.lastName?.message}
              accessibilityLabel={t('auth.labels.lastName')}
            />
          )}
        />

        {/* Email Input */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('auth.labels.email')}
              placeholder={t('auth.signup.emailPlaceholder')}
              variant="filled"
              size="large"
              leftElement={<Icon familyName="Feather" iconName="mail" variant="muted" size={20} />}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                void trigger('email');
              }}
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
              placeholder={t('auth.signup.passwordPlaceholder')}
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
              onBlur={() => {
                onBlur();
                void trigger('password');
              }}
              error={!!errors.password}
              errorText={errors.password?.message}
              accessibilityLabel={t('auth.labels.password')}
            />
          )}
        />

        {/* Confirm Password Input */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('auth.labels.confirmPassword')}
              placeholder={t('auth.signup.confirmPasswordPlaceholder')}
              variant="filled"
              size="large"
              leftElement={<Icon familyName="Feather" iconName="lock" variant="muted" size={20} />}
              rightElement={
                <IconButton
                  familyName="Feather"
                  iconName={isConfirmVisible ? 'eye-off' : 'eye'}
                  variant="ghost"
                  iconVariant="muted"
                  size="small"
                  onPress={toggleConfirmVisibility}
                  accessibilityLabel={isConfirmVisible ? 'Hide password' : 'Show password'}
                />
              }
              secureTextEntry={!isConfirmVisible}
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                void trigger('confirmPassword');
              }}
              error={!!errors.confirmPassword}
              errorText={errors.confirmPassword?.message}
              accessibilityLabel={t('auth.labels.confirmPassword')}
            />
          )}
        />

        {/* Country Select */}
        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, value } }) => (
            <Select
              label={t('auth.labels.country')}
              options={COUNTRIES}
              value={value}
              onValueChange={onChange}
              placeholder={t('auth.signup.countryPlaceholder')}
              variant="filled"
              size="large"
              leftIcon={<Icon familyName="Feather" iconName="globe" variant="muted" size={20} />}
              searchable
              error={!!errors.country}
              errorText={errors.country?.message}
            />
          )}
        />

        {/* Date of Birth DatePicker */}
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label={t('auth.labels.dateOfBirth')}
              value={value}
              onValueChange={onChange}
              placeholder={t('auth.signup.dateOfBirthPlaceholder')}
              variant="filled"
              size="large"
              maxDate={new Date()}
              error={!!errors.dateOfBirth}
              errorText={errors.dateOfBirth?.message}
            />
          )}
        />

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            fullWidth
            loading={isSubmitting}
            onPress={handleSubmit(handleSignup)}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel={t('auth.signup.signupButton')}
          >
            {t('auth.signup.signupButton')}
          </Button>

          {/* Server Error Display */}
          {serverError && (
            <Typography type="caption" color="error" align="center" style={styles.serverError}>
              {serverError}
            </Typography>
          )}
        </View>
      </View>

      {/* Footer - Already have an account? Log In */}
      <View style={styles.loginContainer}>
        <View style={styles.loginWrapper}>
          <Typography type="body" size="sm" color="secondary">
            {t('auth.signup.alreadyHaveAccount')}{' '}
          </Typography>
          <Button
            variant="text"
            size="small"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onPress={() => router.push('/(auth)' as any)}
            accessibilityRole="link"
            accessibilityLabel={t('auth.signup.loginLink')}
          >
            {t('auth.signup.loginLink')}
          </Button>
        </View>
      </View>
    </View>
  );
}
