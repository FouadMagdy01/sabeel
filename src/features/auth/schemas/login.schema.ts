import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, t('auth.validation.emailRequired'))
      .email(t('auth.validation.emailInvalid')),
    password: z
      .string()
      .min(1, t('auth.validation.passwordRequired'))
      .min(8, t('auth.validation.passwordMinLength')),
  });

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
