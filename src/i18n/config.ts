import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getItem, STORAGE_KEYS } from '@/utils/storage';
import ar from './locales/ar.json';
import en from './locales/en.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof en;
    };
  }
}

const savedLang = getItem<string>(STORAGE_KEYS.preferences.language);
const initialLang = savedLang.success && savedLang.data ? savedLang.data : 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
