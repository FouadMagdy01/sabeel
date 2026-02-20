export const STORAGE_KEYS = {
  preferences: {
    theme: 'user_theme_preference',
    themePreset: 'user_theme_preset',
    language: 'user_language',
  },
  quran: {
    downloadStatus: 'quran_download_status',
    downloadResume: 'quran_download_resume',
    lastPage: 'quran_last_page',
  },
  prayers: {
    yearlyData: 'prayers_yearly_data',
  },
} as const;
