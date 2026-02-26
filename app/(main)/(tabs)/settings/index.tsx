import { SegmentedControl } from '@/common/components/SegmentedControl';
import { Toggle } from '@/common/components/Toggle';
import { Typography } from '@/common/components/Typography';
import { SettingsRow, SettingsSection, ThemeSwatchPicker } from '@/features/settings';
import { useBottomPadding } from '@/hooks/useBottomPadding';
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
import Constants from 'expo-constants';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, I18nManager, Linking, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomPadding = useBottomPadding();

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

  const handleContactUs = useCallback(() => {
    const subject = encodeURIComponent(t('screens.contact.emailSubject'));
    const body = encodeURIComponent(t('screens.contact.emailBody'));
    void Linking.openURL(`mailto:fouad.maggdy772@gmail.com?subject=${subject}&body=${body}`);
  }, [t]);

  const handleReportIssue = useCallback(() => {
    const subject = encodeURIComponent(t('screens.report.emailSubject'));
    const deviceInfo = `${Platform.OS} ${Platform.Version}`;
    const body = encodeURIComponent(
      `${t('screens.report.descriptionLabel')}\n\n\n${t('screens.report.stepsLabel')}\n1. \n2. \n3. \n\n${t('screens.report.deviceLabel')}\n${deviceInfo} | Sabeel v${APP_VERSION}`
    );
    void Linking.openURL(`mailto:fouad.maggdy772@gmail.com?subject=${subject}&body=${body}`);
  }, [t]);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomPadding }]}
      showsVerticalScrollIndicator={false}
    >
      <Typography type="heading" size="2xl" weight="bold" style={styles.screenTitle}>
        {t('screens.settings.title')}
      </Typography>

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
          onPress={() => router.push('/privacy-policy')}
        />
        <SettingsRow
          icon="document-text-outline"
          iconFamily="Ionicons"
          label={t('settings.support.terms')}
          onPress={() => router.push('/terms-of-service')}
        />
        <SettingsRow
          icon="information-circle-outline"
          iconFamily="Ionicons"
          label={t('settings.support.about')}
          onPress={() => router.push('/about')}
        />
        <SettingsRow
          icon="mail-outline"
          iconFamily="Ionicons"
          label={t('settings.support.contact')}
          onPress={handleContactUs}
        />
        <SettingsRow
          icon="bug-outline"
          iconFamily="Ionicons"
          label={t('settings.support.report')}
          isLast
          onPress={handleReportIssue}
        />
      </SettingsSection>

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
  version: {
    paddingBottom: theme.metrics.spacingV.p16,
  },
}));
