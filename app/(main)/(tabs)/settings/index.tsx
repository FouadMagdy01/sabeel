import React, { useCallback, useState } from 'react';
import { Alert, I18nManager, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/common/components/Button';
import { Toggle } from '@/common/components/Toggle';
import { Typography } from '@/common/components/Typography';
import { useAuth } from '@/providers';
import { useLogoutMutation } from '@/features/auth/hooks';
import {
  ProfileHeader,
  SettingsRow,
  SettingsSection,
  ThemeSwatchPicker,
} from '@/features/settings';
import { SegmentedControl } from '@/common/components/SegmentedControl';
import { setItem, STORAGE_KEYS } from '@/utils/storage';
import { applyThemePreset, getCurrentPreset, toggleDarkMode } from '@/theme/themeManager';
import type { ThemePresetName } from '@/theme/config';
import { spacingV } from '@/theme/metrics';
import { reloadApp } from '@/utils/reload';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const logoutMutation = useLogoutMutation();

  const [isDark, setIsDark] = useState(theme.colors.mode === 'dark');
  const [currentPreset, setCurrentPreset] = useState<ThemePresetName>(getCurrentPreset);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleToggleDarkMode = useCallback((value: boolean) => {
    setIsDark(value);
    toggleDarkMode(value);
  }, []);

  const handlePresetChange = useCallback((preset: ThemePresetName) => {
    setCurrentPreset(preset);
    applyThemePreset(preset);
  }, []);

  const handleLanguageChange = useCallback(
    (language: string) => {
      setCurrentLanguage(language);
      void i18n.changeLanguage(language);
      setItem(STORAGE_KEYS.preferences.language, language);

      // RTL requires app reload to take effect
      const isArabic = language === 'ar';
      if (isArabic !== I18nManager.isRTL) {
        I18nManager.forceRTL(isArabic);
        Alert.alert(t('settings.language.restartRequired'), t('settings.language.restartMessage'), [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('common.restart'),
            onPress: reloadApp,
          },
        ]);
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
      contentContainerStyle={styles.contentContainer}
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
  contentContainer: {
    paddingBottom: spacingV.p40,
  },
  screenTitle: {
    paddingHorizontal: 16,
    paddingTop: spacingV.p16,
    paddingBottom: spacingV.p20,
  },
  signOutContainer: {
    paddingHorizontal: 16,
    marginBottom: spacingV.p24,
  },
  version: {
    paddingBottom: spacingV.p16,
  },
}));
