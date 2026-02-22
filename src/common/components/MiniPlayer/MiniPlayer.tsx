import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { getSurahById } from '@/features/library/data/surahData';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import { BlurView } from 'expo-blur';
import { useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, Platform, Pressable, View } from 'react-native';
import { useProgress } from 'react-native-track-player';
import { useUnistyles } from 'react-native-unistyles';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './MiniPlayer.styles';
import { MINI_PLAYER_HEIGHT } from './MiniPlayer.types';

export function MiniPlayer() {
  const { theme } = useUnistyles();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const isVisible = usePlayerStore((s) => s.isVisible);
  const isMiniPlayerHidden = usePlayerStore((s) => s.isMiniPlayerHidden);
  const tabBarHeight = usePlayerStore((s) => s.tabBarHeight);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentSurahName = usePlayerStore((s) => s.currentSurahName);
  const currentAyahNumber = usePlayerStore((s) => s.currentAyahNumber);
  const reciterName = usePlayerStore((s) => s.reciterName);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const skipToNext = usePlayerStore((s) => s.skipToNext);
  const skipToPrevious = usePlayerStore((s) => s.skipToPrevious);
  const stop = usePlayerStore((s) => s.stop);

  const { position, duration } = useProgress(200);
  const progress = duration > 0 ? position / duration : 0;

  const isDark = theme.colors.mode === 'dark';
  const isRTL = I18nManager.isRTL;

  // Detect if we're on a tab screen (segments: ["(main)", "(tabs)", ...])
  const isOnTabScreen = segments.includes('(tabs)' as never);
  // Position above tab bar on tab screens (with 8px gap), above safe area on other screens
  const TAB_BAR_GAP = 8;
  const bottomOffset =
    isOnTabScreen && tabBarHeight > 0 ? tabBarHeight + TAB_BAR_GAP : insets.bottom;

  const shouldShow = isVisible && !isMiniPlayerHidden;
  const translateY = useSharedValue(MINI_PLAYER_HEIGHT + bottomOffset);

  useEffect(() => {
    translateY.value = withTiming(shouldShow ? 0 : MINI_PLAYER_HEIGHT + bottomOffset, {
      duration: 300,
    });
  }, [shouldShow, bottomOffset, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Build localized surah + ayah display
  const isArabic = i18n.language === 'ar';
  const surahId = Number(currentSurahName);
  const surahInfo = getSurahById(surahId);
  const surahDisplayName = isArabic ? surahInfo?.nameArabic : surahInfo?.nameSimple;
  const trackTitle = surahInfo
    ? t('screens.quran.player.surahAyah', {
        surah: surahDisplayName,
        ayah: String(currentAyahNumber),
      })
    : `${currentSurahName}:${String(currentAyahNumber)}`;

  // In RTL, swap both icon names and handlers so visual direction matches
  const prevIcon = isRTL ? ('play-skip-forward' as const) : ('play-skip-back' as const);
  const nextIcon = isRTL ? ('play-skip-back' as const) : ('play-skip-forward' as const);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          bottom: bottomOffset,
        },
      ]}
    >
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={Platform.OS === 'ios' ? 40 : 80}
        tint={isDark ? 'dark' : 'light'}
        style={styles.blur}
        pointerEvents="none"
      />

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${String(Math.round(progress * 100))}%` as `${number}%`,
              backgroundColor: theme.colors.brand.primary,
            },
          ]}
        />
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={() => {
            void skipToPrevious();
          }}
          hitSlop={8}
        >
          <Icon familyName="Ionicons" iconName={prevIcon} size={22} variant="primary" />
        </Pressable>
        <Pressable
          onPress={() => {
            void togglePlayPause();
          }}
          hitSlop={8}
        >
          <Icon
            familyName="Ionicons"
            iconName={isPlaying ? 'pause' : 'play'}
            size={28}
            variant="brandPrimary"
          />
        </Pressable>
        <Pressable
          onPress={() => {
            void skipToNext();
          }}
          hitSlop={8}
        >
          <Icon familyName="Ionicons" iconName={nextIcon} size={22} variant="primary" />
        </Pressable>
      </View>

      <View style={styles.info}>
        <Typography size="sm" weight="semiBold" numberOfLines={1}>
          {trackTitle}
        </Typography>
        <Typography size="xxs" color="secondary" numberOfLines={1}>
          {reciterName}
        </Typography>
      </View>

      <Pressable
        onPress={() => {
          void stop();
        }}
        hitSlop={8}
        style={styles.closeButton}
      >
        <Icon familyName="Ionicons" iconName="close" size={22} variant="muted" />
      </Pressable>
    </Animated.View>
  );
}
