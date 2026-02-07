import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/common/components/Button';
import Icon from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Input } from '@/common/components/Input';
import { loginSchema, type LoginFormData } from '../../schemas';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  onForgotPassword?: () => void;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, onForgotPassword, isLoading = false }: LoginFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('auth.labels.email')}
            placeholder={t('auth.login.emailPlaceholder')}
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

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('auth.labels.password')}
            placeholder={t('auth.login.passwordPlaceholder')}
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

      {onForgotPassword && (
        <Button variant="text" onPress={onForgotPassword} style={styles.forgotPassword}>
          {t('auth.login.forgotPassword')}
        </Button>
      )}

      <Button onPress={handleSubmit(onSubmit)} loading={isLoading} style={styles.submitButton}>
        {t('auth.login.loginButton')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.metrics.spacingV.p16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  submitButton: {
    marginTop: theme.metrics.spacingV.p8,
  },
}));
