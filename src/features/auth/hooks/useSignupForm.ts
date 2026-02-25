import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import { createSignupSchema, type SignupFormData } from '../schemas/signup.schema';
import { register } from '../services/authService';
import type { RegisterParams } from '../services/authService.types';

export function useSignupForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const schema = createSignupSchema(t);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      firstName: 'Fouad',
      lastName: 'Magdy',
      email: 'fouad.magdy7515@gmail.com',
      password: 'FouadMagdy2024@',
      confirmPassword: 'FouadMagdy2024@',
      country: '',
      dateOfBirth: undefined,
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (params: RegisterParams) => register(params),
    onSuccess: () => {
      // After successful registration and auto-login, navigate to main app
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace('/(main)/(tabs)' as any);
    },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleConfirmVisibility = () => {
    setIsConfirmVisible((prev) => !prev);
  };

  const handleSignup = async (data: SignupFormData) => {
    Keyboard.dismiss();

    // Map form data to RegisterParams
    const params: RegisterParams = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      country: data.country,
      dateOfBirth: data.dateOfBirth.toISOString().split('T')[0], // Convert Date to "YYYY-MM-DD"
    };

    await registerMutation.mutateAsync(params);
  };

  // Map mutation error to localized message
  const serverError = registerMutation.error
    ? (() => {
        const errorMessage = registerMutation.error.message;

        if (
          errorMessage.includes('already registered') ||
          errorMessage.includes('User already registered')
        ) {
          return t('auth.authError.emailAlreadyRegistered');
        }
        if (
          errorMessage.toLowerCase().includes('network') ||
          errorMessage.toLowerCase().includes('timeout')
        ) {
          return t('auth.authError.networkError');
        }
        if (errorMessage.includes('Password must be at least 8')) {
          return t('auth.authError.passwordTooShort');
        }
        if (errorMessage.includes('letter and') || errorMessage.includes('letter and one number')) {
          return t('auth.authError.passwordNeedsLetterAndNumber');
        }

        return t('auth.authError.registrationFailed');
      })()
    : null;

  return {
    control,
    errors,
    isSubmitting: registerMutation.isPending,
    serverError,
    isPasswordVisible,
    isConfirmVisible,
    togglePasswordVisibility,
    toggleConfirmVisibility,
    handleSignup,
    handleSubmit,
    trigger,
  };
}
