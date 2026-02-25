import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { getSurahById } from '@/features/library/data/surahData';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import Slider from '@react-native-community/slider';
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

export function MiniPlayer() {
  const { theme } = useUnistyles();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const isVisible = usePlayerStore((s) => s.isVisible);
  const isMiniPlayerHidden = usePlayerStore((s) => s.isMiniPlayerHidden);
  const tabBarHeight = usePlayerStore((s) => s.tabBarHeight);
  const miniPlayerHeight = usePlayerStore((s) => s.miniPlayerHeight);
  const setMiniPlayerHeight = usePlayerStore((s) => s.setMiniPlayerHeight);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentSurahName = usePlayerStore((s) => s.currentSurahName);
  const currentAyahNumber = usePlayerStore((s) => s.currentAyahNumber);
  const reciterName = usePlayerStore((s) => s.reciterName);
  const playerSource = usePlayerStore((s) => s.playerSource);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const skipToNext = usePlayerStore((s) => s.skipToNext);
  const skipToPrevious = usePlayerStore((s) => s.skipToPrevious);
  const stop = usePlayerStore((s) => s.stop);
  const seekTo = usePlayerStore((s) => s.seekTo);

  const { position, duration } = useProgress(200);

  const isDark = theme.colors.mode === 'dark';
  const isRTL = I18nManager.isRTL;

  const isOnTabScreen = segments.includes('(tabs)' as never);
  const TAB_BAR_GAP = 8;
  const bottomOffset =
    isOnTabScreen && tabBarHeight > 0 ? tabBarHeight + TAB_BAR_GAP : insets.bottom;

  const shouldShow = isVisible && !isMiniPlayerHidden;
  const hideDistance = (miniPlayerHeight || 150) + bottomOffset;
  const translateY = useSharedValue(hideDistance);

  useEffect(() => {
    translateY.value = withTiming(shouldShow ? 0 : hideDistance, {
      duration: 300,
    });
  }, [shouldShow, hideDistance, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const isArabic = i18n.language === 'ar';
  const surahId = Number(currentSurahName);
  const surahInfo = getSurahById(surahId);
  const surahDisplayName = isArabic ? surahInfo?.nameArabic : surahInfo?.nameSimple;

  let trackTitle: string;
  if (playerSource === 'library') {
    trackTitle = surahDisplayName ?? currentSurahName;
  } else if (surahInfo) {
    trackTitle = t('screens.quran.player.surahAyah', {
      surah: surahDisplayName,
      ayah: String(currentAyahNumber),
    });
  } else {
    trackTitle = `${currentSurahName}:${String(currentAyahNumber)}`;
  }

  const prevIcon = isRTL ? ('play-skip-forward' as const) : ('play-skip-back' as const);
  const nextIcon = isRTL ? ('play-skip-back' as const) : ('play-skip-forward' as const);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[styles.container, animatedStyle, { bottom: bottomOffset }]}
      onLayout={(event) => {
        const height = event.nativeEvent.layout.height;
        if (height > 0 && height !== miniPlayerHeight) {
          setMiniPlayerHeight(height);
        }
      }}
    >
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={Platform.OS === 'ios' ? 40 : 80}
        tint={isDark ? 'dark' : 'light'}
        style={styles.blur}
        pointerEvents="none"
      />

      <Pressable
        onPress={() => {
          void stop();
        }}
        hitSlop={8}
        style={styles.closeButton}
      >
        <Icon familyName="Ionicons" iconName="close" size={20} variant="muted" />
      </Pressable>

      <View style={styles.info}>
        <Typography size="sm" weight="semiBold" numberOfLines={1}>
          {trackTitle}
        </Typography>
        <Typography size="xxs" color="secondary" numberOfLines={1}>
          {reciterName}
        </Typography>
      </View>

      <Slider
        style={styles.slider}
        value={position}
        minimumValue={0}
        maximumValue={duration > 0 ? duration : 1}
        minimumTrackTintColor={theme.colors.brand.primary}
        maximumTrackTintColor={theme.colors.border.default}
        thumbTintColor={theme.colors.brand.primary}
        onSlidingComplete={(value) => {
          void seekTo(value);
        }}
      />

      <View style={styles.controls}>
        <Pressable
          onPress={() => {
            void skipToPrevious();
          }}
          hitSlop={8}
        >
          <Icon familyName="Ionicons" iconName={prevIcon} size={24} variant="primary" />
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
            size={32}
            variant="brandPrimary"
          />
        </Pressable>
        <Pressable
          onPress={() => {
            void skipToNext();
          }}
          hitSlop={8}
        >
          <Icon familyName="Ionicons" iconName={nextIcon} size={24} variant="primary" />
        </Pressable>
      </View>
    </Animated.View>
  );
}
