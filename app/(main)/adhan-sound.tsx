import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { ADHAN_SOUNDS, DEFAULT_ADHAN_SOUND } from '@/features/prayers/constants';
import type { AdhanSound } from '@/features/prayers/constants';
import { scheduleYearlyPrayerNotifications } from '@/features/prayers/services/notificationService';
import type { PrayerKey, YearlyPrayerData } from '@/features/prayers/types';
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage';

/* eslint-disable @typescript-eslint/no-require-imports */
const SOUND_FILES: Record<string, number> = {
  adhan_mansour: require('../../assets/sounds/adhan_mansour.mp3') as number,
  adhan_hafiz_mustafa: require('../../assets/sounds/adhan_hafiz_mustafa.mp3') as number,
  adhan_dubai_mishary: require('../../assets/sounds/adhan_dubai_mishary.mp3') as number,
  adhan_mashary: require('../../assets/sounds/adhan_mashary.mp3') as number,
};
/* eslint-enable @typescript-eslint/no-require-imports */

export default function AdhanSoundScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  const [selectedId, setSelectedId] = useState(() => {
    const result = getItem<string>(STORAGE_KEYS.prayers.adhanSound);
    return result.success && result.data ? result.data : DEFAULT_ADHAN_SOUND;
  });

  const [playingId, setPlayingId] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

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

  const stopPreview = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {
        // Ignore cleanup errors
      }
      soundRef.current = null;
    }
    setPlayingId(null);
  }, []);

  const playPreview = useCallback(
    async (soundId: string) => {
      await stopPreview();

      if (soundId === 'default' || !SOUND_FILES[soundId]) return;

      try {
        const { sound } = await Audio.Sound.createAsync(SOUND_FILES[soundId]);
        soundRef.current = sound;
        setPlayingId(soundId);

        sound.setOnPlaybackStatusUpdate((status) => {
          if ('didJustFinish' in status && status.didJustFinish) {
            setPlayingId(null);
            void sound.unloadAsync();
            soundRef.current = null;
          }
        });

        await sound.playAsync();
      } catch {
        setPlayingId(null);
      }
    },
    [stopPreview]
  );

  const handleSelect = useCallback(
    async (soundId: string) => {
      setSelectedId(soundId);
      setItem(STORAGE_KEYS.prayers.adhanSound, soundId);

      // Reschedule notifications with new sound
      const adhanEnabledResult = getItem<boolean>(STORAGE_KEYS.prayers.adhanEnabled);
      const isEnabled =
        adhanEnabledResult.success && adhanEnabledResult.data !== undefined
          ? adhanEnabledResult.data
          : true;

      if (isEnabled) {
        const yearlyResult = getItem<YearlyPrayerData>(STORAGE_KEYS.prayers.yearlyData);
        if (yearlyResult.success && yearlyResult.data) {
          await scheduleYearlyPrayerNotifications(yearlyResult.data, prayerNames, soundId);
        }
      }
    },
    [prayerNames]
  );

  const handleBack = useCallback(async () => {
    await stopPreview();
    router.back();
  }, [stopPreview, router]);

  const renderItem = useCallback(
    ({ item }: { item: AdhanSound }) => {
      const isSelected = item.id === selectedId;
      const isPlaying = item.id === playingId;
      const canPreview = item.filename !== null;

      return (
        <Pressable onPress={() => void handleSelect(item.id)}>
          <View
            style={[
              styles.row,
              {
                backgroundColor: isSelected
                  ? `${theme.colors.brand.primary}10`
                  : theme.colors.background.surface,
                borderColor: isSelected ? theme.colors.brand.primary : theme.colors.border.default,
              },
            ]}
          >
            <View
              style={[
                styles.radio,
                {
                  borderColor: isSelected ? theme.colors.brand.primary : theme.colors.border.strong,
                },
              ]}
            >
              {isSelected && (
                <View
                  style={[styles.radioInner, { backgroundColor: theme.colors.brand.primary }]}
                />
              )}
            </View>

            <View style={styles.textContainer}>
              <Typography
                type="body"
                weight={isSelected ? 'semiBold' : 'regular'}
                style={{ color: theme.colors.text.primary }}
              >
                {t(item.nameKey as 'screens.adhanSound.defaultSound')}
              </Typography>
            </View>

            {canPreview && (
              <Pressable
                onPress={() => {
                  if (isPlaying) {
                    void stopPreview();
                  } else {
                    void playPreview(item.id);
                  }
                }}
                hitSlop={8}
              >
                <View
                  style={[
                    styles.playButton,
                    {
                      backgroundColor: isPlaying
                        ? theme.colors.brand.primary
                        : `${theme.colors.brand.primary}15`,
                    },
                  ]}
                >
                  <Icon
                    familyName="Ionicons"
                    iconName={isPlaying ? 'stop' : 'play'}
                    size={16}
                    color={isPlaying ? theme.colors.text.inverse : theme.colors.brand.primary}
                  />
                </View>
              </Pressable>
            )}
          </View>
        </Pressable>
      );
    },
    [selectedId, playingId, theme, t, handleSelect, stopPreview, playPreview]
  );

  const keyExtractor = useCallback((item: AdhanSound) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.app }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => void handleBack()} hitSlop={8}>
          <Icon
            familyName="Ionicons"
            iconName="arrow-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </Pressable>
        <Typography type="heading" size="lg" weight="bold" style={styles.headerTitle}>
          {t('screens.adhanSound.title')}
        </Typography>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={ADHAN_SOUNDS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingBottom: theme.metrics.spacingV.p12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center' as const,
  },
  headerSpacer: {
    width: 24,
  },
  listContent: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingTop: theme.metrics.spacingV.p8,
    gap: theme.metrics.spacingV.p8,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p16,
    borderRadius: 12,
    borderWidth: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: theme.metrics.spacing.p12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
}));
