import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createSignupSchema = (t: TFunction) =>
  z
    .object({
      firstName: z
        .string()
        .min(1, t('auth.validation.firstNameRequired'))
        .min(2, t('auth.validation.nameMinLength')),
      lastName: z
        .string()
        .min(1, t('auth.validation.lastNameRequired'))
        .min(2, t('auth.validation.nameMinLength')),
      email: z
        .string()
        .min(1, t('auth.validation.emailRequired'))
        .email(t('auth.validation.emailInvalid')),
      password: z
        .string()
        .min(1, t('auth.validation.passwordRequired'))
        .min(8, t('auth.validation.passwordMinLength'))
        .regex(/[a-zA-Z]/, t('auth.authError.passwordNeedsLetterAndNumber'))
        .regex(/[0-9]/, t('auth.authError.passwordNeedsLetterAndNumber')),
      confirmPassword: z.string().min(1, t('auth.validation.confirmPasswordRequired')),
      country: z.string().min(1, t('auth.validation.countryRequired')),
      dateOfBirth: z.date(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.validation.passwordsDoNotMatch'),
      path: ['confirmPassword'],
    })
    .refine(
      (data) => {
        const today = new Date();
        const age = today.getFullYear() - data.dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - data.dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < data.dateOfBirth.getDate())) {
          return age - 1 >= 13;
        }
        return age >= 13;
      },
      {
        message: t('auth.validation.ageRequirement'),
        path: ['dateOfBirth'],
      }
    );

export type SignupFormData = z.infer<ReturnType<typeof createSignupSchema>>;
