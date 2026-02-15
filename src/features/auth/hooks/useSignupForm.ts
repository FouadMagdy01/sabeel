import { useState } from 'react';
import { Keyboard } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { createSignupSchema, type SignupFormData } from '../schemas/signup.schema';
import { supabase } from '@/integrations/supabase';

export function useSignupForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const schema = createSignupSchema(t);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      dateOfBirth: undefined,
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleConfirmVisibility = () => {
    setIsConfirmVisible((prev) => !prev);
  };

  const handleSignup = async (data: SignupFormData) => {
    Keyboard.dismiss();
    setServerError(null);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          country: data.country,
          date_of_birth: data.dateOfBirth.toISOString().split('T')[0], // ISO date string
        },
      },
    });

    if (error) {
      // Map Supabase error to localized message
      if (error.message.includes('already registered')) {
        setServerError(t('auth.validation.emailExists'));
      } else if (error.message.includes('Invalid email')) {
        setServerError(t('auth.validation.emailInvalid'));
      } else if (
        error.message.toLowerCase().includes('network') ||
        error.message.toLowerCase().includes('timeout')
      ) {
        setServerError(t('errors.network'));
      } else {
        setServerError(t('auth.signup.serviceUnavailable'));
      }
      return;
    }

    // Navigate to main app on success
    router.replace('/(main)/(tabs)');
  };

  return {
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
  };
}
