import { Button } from '@/common/components/Button';
import { SegmentedControl } from '@/common/components/SegmentedControl';
import { Toggle } from '@/common/components/Toggle';
import { Typography } from '@/common/components/Typography';
import { useLogoutMutation } from '@/features/auth/hooks';
import {
  ProfileHeader,
  SettingsRow,
  SettingsSection,
  ThemeSwatchPicker,
} from '@/features/settings';
import { useBottomPadding } from '@/hooks/useBottomPadding';
import { useAuth } from '@/providers';
import type { ThemePresetName } from '@/theme/config';

import { applyThemePreset, getCurrentPreset, toggleDarkMode } from '@/theme/themeManager';

import { ADHAN_SOUNDS, DEFAULT_ADHAN_SOUND } from '@/features/prayers/constants';
import {
  cancelAllPrayerNotifications,
  scheduleYearlyPrayerNotifications,
} from '@/features/prayers/services/notificationService';
import type { PrayerKey, YearlyPrayerData } from '@/features/prayers/types';
import { reloadApp } from '@/utils/reload';
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, I18nManager, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomPadding = useBottomPadding();
  const { isAuthenticated } = useAuth();
  const logoutMutation = useLogoutMutation();

  const router = useRouter();
  const { rt } = useUnistyles();
  const isDark = String(rt.themeName ?? '').endsWith('dark');
  const [currentPreset, setCurrentPreset] = useState<ThemePresetName>(getCurrentPreset);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Adhan notification settings
  const [adhanEnabled, setAdhanEnabled] = useState<boolean>(() => {
    const result = getItem<boolean>(STORAGE_KEYS.prayers.adhanEnabled);
    if (result.success && typeof result.data === 'boolean') return result.data;
    return true;
  });

  const currentAdhanSoundId = useMemo(() => {
    const result = getItem<string>(STORAGE_KEYS.prayers.adhanSound);
    return result.success && result.data ? result.data : DEFAULT_ADHAN_SOUND;
  }, []);

  const currentSoundDisplayName = useMemo(() => {
    const sound = ADHAN_SOUNDS.find((s) => s.id === currentAdhanSoundId);
    return sound
      ? t(sound.nameKey as 'screens.adhanSound.defaultSound')
      : t('screens.adhanSound.defaultSound');
  }, [currentAdhanSoundId, t]);

  const prayerNames = useMemo<Record<PrayerKey, string>>(
    () => ({
      Fajr: t('prayers.names.Fajr'),
      Sunrise: t('prayers.names.Sunrise'),
      Dhuhr: t('prayers.names.Dhuhr'),
      Asr: t('prayers.names.Asr'),
      Maghrib: t('prayers.names.Maghrib'),
      Isha: t('prayers.names.Isha'),
    }),
    [t]
  );

  const handleToggleAdhan = useCallback(
    (value: boolean) => {
      setAdhanEnabled(value);
      setItem(STORAGE_KEYS.prayers.adhanEnabled, value);

      if (!value) {
        void cancelAllPrayerNotifications();
      } else {
        const yearlyResult = getItem<YearlyPrayerData>(STORAGE_KEYS.prayers.yearlyData);
        if (yearlyResult.success && yearlyResult.data) {
          const soundResult = getItem<string>(STORAGE_KEYS.prayers.adhanSound);
          const sound =
            soundResult.success && soundResult.data ? soundResult.data : DEFAULT_ADHAN_SOUND;
          void scheduleYearlyPrayerNotifications(yearlyResult.data, prayerNames, sound);
        }
      }
    },
    [prayerNames]
  );

  const handleToggleDarkMode = useCallback((value: boolean) => {
    toggleDarkMode(value);
  }, []);

  const handlePresetChange = useCallback((preset: ThemePresetName) => {
    setCurrentPreset(preset);
    applyThemePreset(preset);
  }, []);

  const handleLanguageChange = useCallback(
    (language: string) => {
      const isArabic = language === 'ar';
      const needsRTLChange = isArabic !== I18nManager.isRTL;

      if (needsRTLChange && Platform.OS !== 'web') {
        Alert.alert(t('settings.language.restartRequired'), t('settings.language.restartMessage'), [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('settings.language.restartNow'),
            onPress: () => {
              // Persist language preference
              setItem(STORAGE_KEYS.preferences.language, language);
              void i18n.changeLanguage(language);

              // Apply RTL direction change
              I18nManager.allowRTL(isArabic);
              I18nManager.forceRTL(isArabic);

              // Reload the app so the native layout direction takes effect
              void reloadApp();
            },
          },
        ]);
      } else {
        setCurrentLanguage(language);
        void i18n.changeLanguage(language);
        setItem(STORAGE_KEYS.preferences.language, language);
      }
    },
    [t, i18n]
  );

  const handleSignOut = useCallback(() => {
    Alert.alert(t('settings.signOut.confirmTitle'), t('settings.signOut.confirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.signOut.confirm'),
        style: 'destructive',
        onPress: () => logoutMutation.mutate(),
      },
    ]);
  }, [t, logoutMutation]);

  const handlePlaceholderPress = useCallback((_feature: string) => {
    // Placeholder for future navigation
  }, []);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomPadding }]}
      showsVerticalScrollIndicator={false}
    >
      <Typography type="heading" size="2xl" weight="bold" style={styles.screenTitle}>
        {t('screens.settings.title')}
      </Typography>

      <ProfileHeader />

      <SettingsSection title={t('settings.sections.preferences')}>
        <SettingsRow
          icon="moon-outline"
          iconFamily="Ionicons"
          label={t('settings.preferences.darkMode')}
          showChevron={false}
          rightElement={<Toggle value={isDark} onValueChange={handleToggleDarkMode} />}
        />
        <SettingsRow
          icon="language-outline"
          iconFamily="Ionicons"
          label={t('settings.preferences.language')}
          showChevron={false}
          isLast
          rightElement={
            <SegmentedControl
              options={[
                { label: 'EN', value: 'en' },
                { label: 'AR', value: 'ar' },
              ]}
              value={currentLanguage}
              onChange={handleLanguageChange}
              size="small"
            />
          }
        />
      </SettingsSection>

      <SettingsSection title={t('settings.sections.notifications')}>
        <SettingsRow
          icon="notifications-outline"
          iconFamily="Ionicons"
          label={t('settings.notifications.adhanEnabled')}
          showChevron={false}
          rightElement={<Toggle value={adhanEnabled} onValueChange={handleToggleAdhan} />}
        />
        <SettingsRow
          icon="musical-notes-outline"
          iconFamily="Ionicons"
          label={t('settings.notifications.adhanSound')}
          value={currentSoundDisplayName}
          isLast
          onPress={() => router.push('/adhan-sound')}
        />
      </SettingsSection>

      <SettingsSection title={t('settings.sections.theme')}>
        <ThemeSwatchPicker selected={currentPreset} onSelect={handlePresetChange} />
      </SettingsSection>

      <SettingsSection title={t('settings.sections.support')}>
        <SettingsRow
          icon="shield-checkmark-outline"
          iconFamily="Ionicons"
          label={t('settings.support.privacy')}
          onPress={() => handlePlaceholderPress('Privacy Policy')}
        />
        <SettingsRow
          icon="document-text-outline"
          iconFamily="Ionicons"
          label={t('settings.support.terms')}
          onPress={() => handlePlaceholderPress('Terms of Service')}
        />
        <SettingsRow
          icon="information-circle-outline"
          iconFamily="Ionicons"
          label={t('settings.support.about')}
          onPress={() => handlePlaceholderPress('About')}
        />
        <SettingsRow
          icon="mail-outline"
          iconFamily="Ionicons"
          label={t('settings.support.contact')}
          onPress={() => handlePlaceholderPress('Contact')}
        />
        <SettingsRow
          icon="bug-outline"
          iconFamily="Ionicons"
          label={t('settings.support.report')}
          isLast
          onPress={() => handlePlaceholderPress('Report')}
        />
      </SettingsSection>

      {isAuthenticated && (
        <View style={styles.signOutContainer}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onPress={handleSignOut}
            loading={logoutMutation.isPending}
          >
            {t('settings.signOut.button')}
          </Button>
        </View>
      )}

      <Typography type="caption" color="muted" align="center" style={styles.version}>
        {t('settings.version', { version: APP_VERSION })}
      </Typography>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  contentContainer: {},
  screenTitle: {
    paddingHorizontal: 16,
    paddingTop: theme.metrics.spacingV.p16,
    paddingBottom: theme.metrics.spacingV.p20,
  },
  signOutContainer: {
    paddingHorizontal: 16,
    marginBottom: theme.metrics.spacingV.p24,
  },
  version: {
    paddingBottom: theme.metrics.spacingV.p16,
  },
}));
