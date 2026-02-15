import { useState } from 'react';
import { Keyboard } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { createLoginSchema, type LoginFormData } from '../schemas/login.schema';
import { supabase } from '@/integrations/supabase';

export function useLoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const schema = createLoginSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleLogin = async (data: LoginFormData) => {
    Keyboard.dismiss();
    setServerError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      // Map Supabase error to localized message
      if (error.message.includes('Invalid') || error.message.includes('credentials')) {
        setServerError(t('auth.login.invalidCredentials'));
      } else {
        setServerError(t('errors.network'));
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
    togglePasswordVisibility,
    handleLogin,
    handleSubmit,
  };
}
