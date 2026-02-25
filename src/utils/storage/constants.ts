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
    bookmarks: 'quran_bookmarks',
    selectedReciter: 'quran_selected_reciter',
    playbackSettings: 'quran_playback_settings',
  },
  prayers: {
    yearlyData: 'prayers_yearly_data',
    adhanEnabled: 'prayers_adhan_enabled',
    adhanSound: 'prayers_adhan_sound',
    locationName: 'prayers_location_name',
  },
  library: {
    downloadCancelFlag: 'library_download_cancel_flag',
  },
  tasbeeh: {
    currentCount: 'tasbeeh_current_count',
    selectedPhrase: 'tasbeeh_selected_phrase',
    targetCount: 'tasbeeh_target_count',
    hapticsEnabled: 'tasbeeh_haptics_enabled',
  },
  azkar: {
    currentCategory: 'azkar_current_category',
    currentItemIndex: 'azkar_current_item_index',
    currentRepeatCount: 'azkar_current_repeat_count',
    hapticsEnabled: 'azkar_haptics_enabled',
  },
} as const;
