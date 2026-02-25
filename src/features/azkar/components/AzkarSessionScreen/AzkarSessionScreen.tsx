import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/common/components/Button';
import { Card } from '@/common/components/Card';
import { Divider } from '@/common/components/Divider';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Toggle } from '@/common/components/Toggle';
import { Typography } from '@/common/components/Typography';
import type { TypographySize } from '@/common/components/Typography';
import { useReaderBottomPadding } from '@/hooks/useBottomPadding';
import { rf } from '@/theme/metrics';

import { AZKAR_CATEGORIES } from '../../constants';
import { getItemsByCategory } from '../../data';
import { useAzkarHaptics } from '../../hooks';
import { useAzkarSessionStore } from '../../stores';
import type { AzkarCategory } from '../../types';
import { AzkarCounter } from '../AzkarCounter';
import { styles } from './AzkarSessionScreen.styles';

function getArabicTextStyle(text: string): { size: TypographySize; lineHeight: number } {
  const len = text.length;
  if (len < 50) return { size: '3xl', lineHeight: rf(52) };
  if (len < 100) return { size: '2xl', lineHeight: rf(44) };
  if (len < 200) return { size: 'xl', lineHeight: rf(38) };
  return { size: 'lg', lineHeight: rf(32) };
}

export function AzkarSessionScreen() {
  const insets = useSafeAreaInsets();
  const bottomPadding = useReaderBottomPadding();
  const { theme } = useUnistyles();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const isArabic = i18n.language === 'ar';

  const {
    currentItemIndex,
    currentRepeatCount,
    completedItems,
    hapticsEnabled,
    startSession,
    incrementRepeat,
    nextItem,
    previousItem,
    resetSession,
    toggleHaptics,
    loadFromStorage,
  } = useAzkarSessionStore();

  const { onIncrement, onItemComplete } = useAzkarHaptics(hapticsEnabled);

  const items = useMemo(
    () => (categoryId ? getItemsByCategory(categoryId as AzkarCategory) : []),
    [categoryId]
  );

  const currentItem = items[currentItemIndex] ?? null;
  const isItemComplete = currentItem ? currentRepeatCount >= currentItem.repeatCount : false;
  const isSessionComplete = completedItems.length >= items.length;
  const categoryMeta = AZKAR_CATEGORIES.find((c) => c.id === categoryId);
  const sessionProgress = items.length > 0 ? completedItems.length / items.length : 0;
  const arabicStyle = useMemo(
    () => (currentItem ? getArabicTextStyle(currentItem.arabic) : null),
    [currentItem]
  );

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (categoryId) {
      startSession(categoryId as AzkarCategory);
    }
  }, [categoryId, startSession]);

  useEffect(() => {
    if (isItemComplete) {
      onItemComplete();
    }
  }, [isItemComplete, onItemComplete]);

  const handleIncrement = useCallback(() => {
    if (isItemComplete && !isSessionComplete) return;
    incrementRepeat();
    onIncrement();
  }, [incrementRepeat, onIncrement, isItemComplete, isSessionComplete]);

  if (!currentItem || !categoryMeta) return null;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
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
          <Typography type="heading" size="lg" weight="bold" align="center">
            {t(categoryMeta.labelKey as never)}
          </Typography>
          <Typography size="xs" color="muted" align="center">
            {t('screens.azkar.session.progress', {
              current: currentItemIndex + 1,
              total: items.length,
            })}
          </Typography>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View
        style={[
          styles.progressBar,
          styles.progressBarContainer,
          { backgroundColor: theme.colors.background.surface },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.colors.brand.primary,
              width: `${Math.round(sessionProgress * 100)}%`,
            },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: bottomPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Content Card */}
        <Card variant="elevated">
          <View style={styles.contentCard}>
            <Typography
              type="heading"
              size={arabicStyle?.size ?? '3xl'}
              weight="bold"
              align="center"
              style={[styles.arabicText, { lineHeight: arabicStyle?.lineHeight }]}
            >
              {currentItem.arabic}
            </Typography>

            <View style={styles.divider}>
              <Divider />
            </View>

            {!isArabic && (
              <Typography size="md" color="tertiary" italic align="center">
                {t(currentItem.translationKey as never)}
              </Typography>
            )}

            {currentItem.source.startsWith('Quran ') && (
              <View
                style={[
                  styles.ayahBadge,
                  { backgroundColor: theme.colors.brand.primary },
                ]}
              >
                <Typography size="sm" weight="semiBold" color="inverse">
                  {t('screens.azkar.session.ayah', {
                    ref: currentItem.source.replace('Quran ', ''),
                  })}
                </Typography>
              </View>
            )}

            <View
              style={[styles.sourceBadge, { backgroundColor: theme.colors.background.surface }]}
            >
              <Typography size="xs" color="muted">
                {currentItem.source}
              </Typography>
            </View>

            {currentItem.virtue && (
              <View style={[styles.virtueCard, { backgroundColor: theme.colors.state.successBg }]}>
                <Typography size="sm" color="success">
                  {t(currentItem.virtue as never)}
                </Typography>
              </View>
            )}
          </View>
        </Card>

        {/* Counter */}
        <AzkarCounter
          count={currentRepeatCount}
          target={currentItem.repeatCount}
          onPress={handleIncrement}
          isComplete={isItemComplete}
        />

        {/* Session Complete Banner */}
        {isSessionComplete && (
          <View style={[styles.banner, { backgroundColor: theme.colors.state.successBg }]}>
            <Typography size="sm" weight="semiBold" color="success">
              {t('screens.azkar.session.sessionComplete')}
            </Typography>
          </View>
        )}

        {/* Navigation Row */}
        <View style={styles.navigationRow}>
          <IconButton
            familyName="Feather"
            iconName="chevron-left"
            onPress={previousItem}
            variant="outlined"
            size="medium"
            disabled={currentItemIndex === 0}
          />
          <Button variant="outlined" size="small" onPress={resetSession}>
            {t('screens.azkar.session.reset')}
          </Button>
          <IconButton
            familyName="Feather"
            iconName="chevron-right"
            onPress={nextItem}
            variant="outlined"
            size="medium"
            disabled={currentItemIndex >= items.length - 1}
          />
        </View>

        {/* Haptics Toggle */}
        <View style={styles.settingsRow}>
          <View style={styles.settingsLabel}>
            <Icon familyName="MaterialIcons" iconName="vibration" size={20} variant="secondary" />
            <Typography size="sm" color="secondary">
              {t('screens.azkar.session.haptics')}
            </Typography>
          </View>
          <Toggle value={hapticsEnabled} onValueChange={toggleHaptics} />
        </View>
      </ScrollView>
    </View>
  );
}
