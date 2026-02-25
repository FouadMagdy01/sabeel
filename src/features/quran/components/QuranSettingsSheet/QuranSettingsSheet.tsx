import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { SegmentedControl } from '@/common/components/SegmentedControl';
import { Typography } from '@/common/components/Typography';
import { usePlayerStore, type QuranRepeatMode } from '@/features/quran/stores/playerStore';
import { getQuranClient } from '@/integrations/quranApi';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { type RecitationResource, Language } from '@quranjs/api';
import { useQuery } from '@tanstack/react-query';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './QuranSettingsSheet.styles';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const QuranSettingsSheet = forwardRef<BottomSheetModal>((_props, ref) => {
  const { t, i18n } = useTranslation();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();

  const isPlayerVisible = usePlayerStore((s) => s.isVisible);
  const miniPlayerHeight = usePlayerStore((s) => s.miniPlayerHeight);
  const selectedReciterId = usePlayerStore((s) => s.selectedReciterId);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const repeatCount = usePlayerStore((s) => s.repeatCount);
  const playbackSpeed = usePlayerStore((s) => s.playbackSpeed);
  const setSelectedReciter = usePlayerStore((s) => s.setSelectedReciter);
  const setRepeatMode = usePlayerStore((s) => s.setRepeatMode);
  const setRepeatCount = usePlayerStore((s) => s.setRepeatCount);
  const setPlaybackSpeed = usePlayerStore((s) => s.setPlaybackSpeed);

  const snapPoints = useMemo(() => ['60%', '85%'], []);

  const { data: recitations, isLoading } = useQuery({
    queryKey: ['recitations', i18n.language],
    queryFn: async () => {
      const client = getQuranClient();
      return client.resources.findAllRecitations({
        language: i18n.language === 'ar' ? Language.ARABIC : Language.ENGLISH,
      });
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={1}
        style={[props.style, { backgroundColor: theme.colors.overlay.modal }]}
      />
    ),
    [theme.colors.overlay.modal]
  );

  const handleDismiss = useCallback(() => {
    if (ref && 'current' in ref) {
      ref.current?.dismiss();
    }
  }, [ref]);

  const handleReciterSelect = useCallback(
    (recitation: RecitationResource) => {
      if (recitation.id == null || !recitation.translatedName) return;
      setSelectedReciter(String(recitation.id), recitation.translatedName.name);
    },
    [setSelectedReciter]
  );

  const handleRepeatModeChange = useCallback(
    (mode: QuranRepeatMode) => {
      setRepeatMode(mode);
    },
    [setRepeatMode]
  );

  const handleSpeedChange = useCallback(
    (speed: number) => {
      void setPlaybackSpeed(speed);
    },
    [setPlaybackSpeed]
  );

  const repeatModes: { key: QuranRepeatMode; label: string }[] = [
    { key: 'off', label: t('screens.quran.settings.repeatOff') },
    { key: 'one', label: t('screens.quran.settings.repeatOne') },
    { key: 'all', label: t('screens.quran.settings.repeatAll') },
  ];

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      containerStyle={styles.sheetContainer}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
    >
      <View style={styles.header}>
        <Typography size="md" weight="bold">
          {t('screens.quran.settings.title')}
        </Typography>
        <IconButton
          familyName="Feather"
          iconName="x"
          onPress={handleDismiss}
          variant="ghost"
          size="medium"
        />
      </View>

      <BottomSheetScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (isPlayerVisible ? miniPlayerHeight : 0) + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Reciter Selection */}
        <View style={styles.sectionTitle}>
          <Typography size="sm" weight="semiBold" color="secondary">
            {t('screens.quran.settings.selectReciter')}
          </Typography>
        </View>

        {isLoading ? (
          <ActivityIndicator color={theme.colors.brand.primary} style={styles.loadingContainer} />
        ) : (
          recitations?.map((recitation) => {
            if (recitation.id == null) return null;
            const isSelected = String(recitation.id) === selectedReciterId;
            return (
              <Pressable
                key={recitation.id}
                style={styles.reciterItem}
                onPress={() => handleReciterSelect(recitation)}
              >
                <Icon
                  familyName="Ionicons"
                  iconName={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  variant={isSelected ? 'brandPrimary' : 'muted'}
                />
                <View style={styles.reciterInfo}>
                  <Typography size="sm" weight={isSelected ? 'semiBold' : 'regular'}>
                    {recitation.translatedName?.name ?? recitation.reciterName ?? ''}
                  </Typography>
                  {recitation.style ? (
                    <Typography size="xxs" color="tertiary">
                      {recitation.style}
                    </Typography>
                  ) : null}
                </View>
              </Pressable>
            );
          })
        )}

        {/* Playback Options */}
        <View style={styles.sectionTitle}>
          <Typography size="sm" weight="semiBold" color="secondary">
            {t('screens.quran.settings.playbackOptions')}
          </Typography>
        </View>

        <View style={styles.settingsSection}>
          {/* Repeat Mode */}
          <View>
            <Typography size="xs" color="secondary" style={styles.sectionLabel}>
              {t('screens.quran.settings.repeatMode')}
            </Typography>
            <SegmentedControl
              options={repeatModes.map((m) => ({ label: m.label, value: m.key }))}
              value={repeatMode}
              onChange={(val) => handleRepeatModeChange(val as QuranRepeatMode)}
              size="small"
              fullWidth
            />
          </View>

          {/* Loop Count (visible only when repeat one) */}
          {repeatMode === 'one' && (
            <View style={styles.settingRow}>
              <Typography size="sm">{t('screens.quran.settings.loopCount')}</Typography>
              <View style={styles.stepperRow}>
                <IconButton
                  familyName="Ionicons"
                  iconName="remove"
                  onPress={() => setRepeatCount(Math.max(1, repeatCount - 1))}
                  variant="outlined"
                  size="small"
                />
                <Typography size="md" weight="bold">
                  {String(repeatCount)}
                </Typography>
                <IconButton
                  familyName="Ionicons"
                  iconName="add"
                  onPress={() => setRepeatCount(Math.min(10, repeatCount + 1))}
                  variant="outlined"
                  size="small"
                />
              </View>
            </View>
          )}

          {/* Playback Speed */}
          <View>
            <Typography size="xs" color="secondary" style={styles.sectionLabel}>
              {t('screens.quran.settings.speed')}
            </Typography>
            <View style={styles.speedRow}>
              {SPEED_OPTIONS.map((speed) => {
                const isActive = playbackSpeed === speed;
                return (
                  <Pressable
                    key={speed}
                    style={[styles.speedButton, isActive && styles.speedButtonActive]}
                    onPress={() => handleSpeedChange(speed)}
                  >
                    <Typography
                      size="xs"
                      weight={isActive ? 'semiBold' : 'regular'}
                      color={isActive ? 'inverse' : 'primary'}
                    >
                      {`${String(speed)}x`}
                    </Typography>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

QuranSettingsSheet.displayName = 'QuranSettingsSheet';

export default QuranSettingsSheet;
