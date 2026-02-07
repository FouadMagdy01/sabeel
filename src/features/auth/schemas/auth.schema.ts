import { z } from 'zod';
import i18n from '@/i18n/config';

/**
 * Login validation schema with translated error messages
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, i18n.t('auth.validation.emailRequired'))
    .email(i18n.t('auth.validation.emailInvalid')),
  password: z
    .string()
    .min(1, i18n.t('auth.validation.passwordRequired'))
    .min(8, i18n.t('auth.validation.passwordMinLength')),
});

/**
 * Signup validation schema with translated error messages
 */
export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, i18n.t('auth.validation.firstNameRequired'))
      .min(2, i18n.t('auth.validation.nameMinLength')),
    lastName: z
      .string()
      .min(1, i18n.t('auth.validation.lastNameRequired'))
      .min(2, i18n.t('auth.validation.nameMinLength')),
    email: z
      .string()
      .min(1, i18n.t('auth.validation.emailRequired'))
      .email(i18n.t('auth.validation.emailInvalid')),
    password: z
      .string()
      .min(1, i18n.t('auth.validation.passwordRequired'))
      .min(8, i18n.t('auth.validation.passwordMinLength')),
    confirmPassword: z.string().min(1, i18n.t('auth.validation.confirmPasswordRequired')),
    country: z.string().min(1, i18n.t('auth.validation.countryRequired')),
    dateOfBirth: z
      .union([z.date(), z.null()])
      .refine((val) => val !== null, {
        message: i18n.t('auth.validation.dateOfBirthRequired'),
      })
      .transform((val) => val as Date),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: i18n.t('auth.validation.passwordsDoNotMatch'),
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

// Input type for the form (before validation)
export type SignupFormInput = z.input<typeof signupSchema>;
