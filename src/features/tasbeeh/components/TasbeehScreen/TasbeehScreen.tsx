import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Button } from '@/common/components/Button';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Toggle } from '@/common/components/Toggle';
import { Typography } from '@/common/components/Typography';
import { Card } from '@/common/components/Card';
import { INFINITE_TARGET, PRESET_TARGETS, TASBEEH_PHRASES } from '../../constants';
import { useTasbeehHaptics } from '../../hooks';
import { useTasbeehStore } from '../../stores';
import { TasbeehCounter } from '../TasbeehCounter';
import { PhraseSelector } from '../PhraseSelector';
import { styles } from './TasbeehScreen.styles';

const TARGET_OPTIONS = [...PRESET_TARGETS, INFINITE_TARGET];

export function TasbeehScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const router = useRouter();
  const phraseSelectorRef = useRef<BottomSheetModal>(null);

  const {
    currentCount,
    selectedPhraseId,
    targetCount,
    hapticsEnabled,
    increment,
    reset,
    setSelectedPhrase,
    setTargetCount,
    toggleHaptics,
    loadFromStorage,
  } = useTasbeehStore();

  const { onIncrement, onTargetReached } = useTasbeehHaptics(hapticsEnabled);

  const selectedPhrase =
    TASBEEH_PHRASES.find((p) => p.id === selectedPhraseId) ?? TASBEEH_PHRASES[0];
  const isTargetReached = targetCount !== INFINITE_TARGET && currentCount >= targetCount;

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isTargetReached) {
      onTargetReached();
    }
  }, [isTargetReached, onTargetReached]);

  const handleIncrement = useCallback(() => {
    increment();
    onIncrement();
  }, [increment, onIncrement]);

  const handlePhrasePress = useCallback(() => {
    phraseSelectorRef.current?.present();
  }, []);

  const handlePhraseSelect = useCallback(
    (phraseId: string) => {
      setSelectedPhrase(phraseId);
    },
    [setSelectedPhrase]
  );

  const handleTargetPress = useCallback(
    (target: number) => {
      setTargetCount(target);
    },
    [setTargetCount]
  );

  const getTargetLabel = (target: number) => {
    if (target === INFINITE_TARGET) return '∞';
    return String(target);
  };

  return (
    <GestureHandlerRootView style={styles.screen}>
      <BottomSheetModalProvider>
        <View style={[styles.stickyHeader, { paddingTop: insets.top }]}>
          {/* Header */}
          <View style={styles.header}>
            <IconButton
              familyName="Feather"
              iconName="arrow-left"
              onPress={() => router.back()}
              variant="ghost"
              size="medium"
            />
            <View style={styles.headerTitle}>
              <Typography type="heading" size="xl" weight="bold" align="center">
                {t('screens.tasbeeh.title')}
              </Typography>
            </View>
            <View style={styles.headerSpacer} />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: insets.bottom + 24,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Phrase Card */}
          <Card variant="elevated" onPress={handlePhrasePress}>
            <View style={styles.phraseCard}>
              <Typography type="heading" size="4xl" weight="bold" align="center">
                {selectedPhrase.arabic}
              </Typography>
              {!isArabic && (
                <Typography size="sm" color="tertiary" align="center">
                  {t(selectedPhrase.translationKey as never)}
                </Typography>
              )}
            </View>
          </Card>

          {/* Counter */}
          <TasbeehCounter
            count={currentCount}
            target={targetCount}
            onPress={handleIncrement}
            isTargetReached={isTargetReached}
          />

          {/* Target Reached Banner */}
          {isTargetReached && (
            <View style={[styles.banner, { backgroundColor: theme.colors.state.successBg }]}>
              <Typography size="sm" weight="semiBold" style={{ color: theme.colors.state.success }}>
                {t('screens.tasbeeh.targetReached')}
              </Typography>
            </View>
          )}

          {/* Target Selector */}
          <View style={styles.targetsContainer}>
            <Typography size="sm" weight="medium" color="secondary">
              {t('screens.tasbeeh.target')}
            </Typography>
            <View style={styles.targetsRow}>
              {TARGET_OPTIONS.map((target) => {
                const isActive = target === targetCount;
                return (
                  <Pressable
                    key={target}
                    style={[
                      styles.targetChip,
                      {
                        backgroundColor: isActive
                          ? theme.colors.brand.primary
                          : theme.colors.background.surface,
                        borderColor: isActive
                          ? theme.colors.brand.primary
                          : theme.colors.border.default,
                      },
                    ]}
                    onPress={() => handleTargetPress(target)}
                  >
                    <Typography
                      size="sm"
                      weight={isActive ? 'semiBold' : 'regular'}
                      style={{
                        color: isActive ? theme.colors.text.inverse : theme.colors.text.primary,
                      }}
                    >
                      {getTargetLabel(target)}
                    </Typography>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Settings */}
          <View style={styles.settingsRow}>
            <View style={styles.settingsLabel}>
              <Icon familyName="MaterialIcons" iconName="vibration" size={20} variant="secondary" />
              <Typography size="sm" color="secondary">
                {t('screens.tasbeeh.haptics')}
              </Typography>
            </View>
            <Toggle value={hapticsEnabled} onValueChange={toggleHaptics} />
          </View>

          {/* Reset */}
          <View style={styles.resetButton}>
            <Button
              variant="outlined"
              color="error"
              size="medium"
              onPress={reset}
              icon={
                <Icon familyName="MaterialIcons" iconName="refresh" size={18} variant="error" />
              }
            >
              {t('screens.tasbeeh.reset')}
            </Button>
          </View>
        </ScrollView>

        {/* Phrase Selector Bottom Sheet */}
        <PhraseSelector
          ref={phraseSelectorRef}
          selectedPhraseId={selectedPhraseId}
          onSelect={handlePhraseSelect}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
