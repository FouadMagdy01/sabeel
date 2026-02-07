import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/common/components/Button';
import { DatePicker } from '@/common/components/DatePicker';
import Icon from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Input } from '@/common/components/Input';
import { Select } from '@/common/components/Select';
import { COUNTRIES } from '../../data';
import { signupSchema, type SignupFormData, type SignupFormInput } from '../../schemas';
import { styles } from './SignupForm.styles';

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
  isLoading?: boolean;
}

export function SignupForm({ onSubmit, isLoading = false }: SignupFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInput, unknown, SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      dateOfBirth: null,
    },
  });

  return (
    <View style={styles.container}>
      {/* First Name & Last Name Row */}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.labels.firstName')}
                placeholder={t('auth.signup.firstNamePlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.firstName}
                errorText={errors.firstName?.message}
                autoCapitalize="words"
                leftElement={
                  <Icon familyName="Feather" iconName="user" size={20} variant="muted" />
                }
              />
            )}
          />
        </View>
        <View style={styles.halfWidth}>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.labels.lastName')}
                placeholder={t('auth.signup.lastNamePlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.lastName}
                errorText={errors.lastName?.message}
                autoCapitalize="words"
              />
            )}
          />
        </View>
      </View>

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('auth.labels.email')}
            placeholder={t('auth.signup.emailPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.email}
            errorText={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftElement={<Icon familyName="Feather" iconName="mail" size={20} variant="muted" />}
          />
        )}
      />

      {/* Country */}
      <Controller
        control={control}
        name="country"
        render={({ field: { onChange, value } }) => (
          <Select
            label={t('auth.labels.country')}
            placeholder={t('auth.signup.countryPlaceholder')}
            options={COUNTRIES}
            value={value}
            onValueChange={onChange}
            error={!!errors.country}
            errorText={errors.country?.message}
          />
        )}
      />

      {/* Date of Birth */}
      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field: { onChange, value } }) => (
          <DatePicker
            label={t('auth.labels.dateOfBirth')}
            placeholder={t('auth.signup.dateOfBirthPlaceholder')}
            value={value}
            onValueChange={onChange}
            maxDate={new Date()}
            error={!!errors.dateOfBirth}
            errorText={errors.dateOfBirth?.message}
          />
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('auth.labels.password')}
            placeholder={t('auth.signup.passwordPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.password}
            errorText={errors.password?.message}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            leftElement={<Icon familyName="Feather" iconName="lock" size={20} variant="muted" />}
            rightElement={
              <IconButton
                familyName="Feather"
                iconName={showPassword ? 'eye-off' : 'eye'}
                iconVariant="muted"
                size="small"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
        )}
      />

      {/* Confirm Password */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('auth.labels.confirmPassword')}
            placeholder={t('auth.signup.confirmPasswordPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.confirmPassword}
            errorText={errors.confirmPassword?.message}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            leftElement={<Icon familyName="Feather" iconName="lock" size={20} variant="muted" />}
            rightElement={
              <IconButton
                familyName="Feather"
                iconName={showConfirmPassword ? 'eye-off' : 'eye'}
                iconVariant="muted"
                size="small"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
        )}
      />

      <Button onPress={handleSubmit(onSubmit)} loading={isLoading} style={styles.submitButton}>
        {t('auth.signup.signupButton')}
      </Button>
    </View>
  );
}
