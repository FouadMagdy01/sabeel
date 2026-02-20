import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import { createLoginSchema, type LoginFormData } from '../schemas/login.schema';
import { login } from '../services/authService';
import type { LoginParams } from '../services/authService.types';

export function useLoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const schema = createLoginSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { email: 'fouad.magdy7515@gmail.com', password: 'FouadMagdy2024@' },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const loginMutation = useMutation({
    mutationFn: (params: LoginParams) => login(params),
    onSuccess: () => {
      // After successful login, navigate to main app
      router.replace('/(main)/(tabs)');
    },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleLogin = async (data: LoginFormData) => {
    Keyboard.dismiss();

    // Map form data to LoginParams
    const params: LoginParams = {
      email: data.email,
      password: data.password,
    };

    await loginMutation.mutateAsync(params);
  };

  // Map mutation error to localized message
  const serverError = loginMutation.error
    ? (() => {
        const errorMessage = loginMutation.error.message;

        if (errorMessage.includes('Invalid') || errorMessage.includes('credentials')) {
          return t('auth.authError.invalidCredentials');
        }
        if (
          errorMessage.toLowerCase().includes('network') ||
          errorMessage.toLowerCase().includes('timeout')
        ) {
          return t('auth.authError.networkError');
        }

        return t('auth.authError.unknownError');
      })()
    : null;

  return {
    control,
    errors,
    isSubmitting: loginMutation.isPending,
    serverError,
    isPasswordVisible,
    togglePasswordVisibility,
    handleLogin,
    handleSubmit,
  };
}
