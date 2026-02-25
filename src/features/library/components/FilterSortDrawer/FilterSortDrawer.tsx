import { Button } from '@/common/components/Button';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  I18nManager,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRewayat } from '../../hooks/useRewayat';
import type { FilterSortState, SortOption } from '../../types/filter.types';
import { DRAWER_FRACTAL, styles } from './FilterSortDrawer.styles';
import type { FilterSortDrawerProps } from './FilterSortDrawer.types';

const SORT_OPTIONS: SortOption[] = ['name-asc', 'name-desc', 'surah-count-desc', 'surah-count-asc'];

const FilterSortDrawer: React.FC<FilterSortDrawerProps> = ({
  isOpen,
  onClose,
  filterSortState,
  onApply,
  onReset,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: rewayat } = useRewayat();
  const isRTL = I18nManager.isRTL;

  const prefix = 'screens.library.explore.allReciters.filterSort' as const;
  const getSortLabel = useCallback(
    (option: SortOption) => {
      switch (option) {
        case 'name-asc':
          return t(`${prefix}.nameAsc`);
        case 'name-desc':
          return t(`${prefix}.nameDesc`);
        case 'surah-count-desc':
          return t(`${prefix}.surahCountDesc`);
        case 'surah-count-asc':
          return t(`${prefix}.surahCountAsc`);
      }
    },
    [t]
  );

  const [tempState, setTempState] = useState<FilterSortState>(filterSortState);
  const [visible, setVisible] = useState(false);
  const { width } = useWindowDimensions();
  const offscreenX = isRTL ? -(width * DRAWER_FRACTAL) : width * DRAWER_FRACTAL;
  const translateX = useSharedValue(offscreenX);

  useEffect(() => {
    setTempState(filterSortState);
  }, [filterSortState]);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      translateX.value = withTiming(0, { duration: 300 });
    } else {
      translateX.value = withTiming(offscreenX, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(setVisible)(false);
        }
      });
    }
  }, [isOpen, offscreenX, translateX]);

  useEffect(() => {
    if (!isOpen) return;

    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });

    return () => handler.remove();
  }, [isOpen, onClose]);

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleApply = useCallback(() => {
    onApply(tempState);
    onClose();
  }, [tempState, onApply, onClose]);

  const handleReset = useCallback(() => {
    onReset();
    onClose();
  }, [onReset, onClose]);

  const handleRewayahSelect = useCallback((rewayahId: number | null) => {
    setTempState((prev) => ({ ...prev, rewayahId }));
  }, []);

  const handleSortSelect = useCallback((sortOption: SortOption) => {
    setTempState((prev) => ({ ...prev, sortOption }));
  }, []);

  const safeAreaTopStyle = useMemo(() => ({ paddingTop: insets.top }), [insets.top]);
  const scrollBottomStyle = useMemo(() => ({ paddingBottom: insets.bottom + 16 }), [insets.bottom]);
  const footerBottomStyle = useMemo(() => ({ paddingBottom: insets.bottom + 12 }), [insets.bottom]);

  if (!visible && !isOpen) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdropPressable} onPress={onClose} />

      <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
        <View style={[styles.drawerContent, isRTL && styles.drawerContentRTL, safeAreaTopStyle]}>
          <View style={styles.header}>
            <Typography size="md" weight="bold">
              {t('screens.library.explore.allReciters.filterSort.title')}
            </Typography>
            <IconButton
              familyName="MaterialIcons"
              iconName="close"
              variant="ghost"
              size="medium"
              onPress={onClose}
            />
          </View>

          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={[styles.scrollContentContainer, scrollBottomStyle]}
            showsVerticalScrollIndicator={false}
          >
            <Typography size="sm" weight="semiBold" style={styles.sectionTitle}>
              {t('screens.library.explore.allReciters.filterSort.filterByRewayah')}
            </Typography>

            <View style={styles.chipContainer}>
              <Pressable
                style={[styles.chip, tempState.rewayahId === null && styles.chipSelected]}
                onPress={() => handleRewayahSelect(null)}
              >
                <Typography
                  size="xs"
                  weight="medium"
                  color={tempState.rewayahId === null ? 'inverse' : 'primary'}
                >
                  {t('screens.library.explore.allReciters.filterSort.allRewayat')}
                </Typography>
              </Pressable>

              {rewayat?.map((rewayah) => (
                <Pressable
                  key={rewayah.id}
                  style={[styles.chip, tempState.rewayahId === rewayah.id && styles.chipSelected]}
                  onPress={() => handleRewayahSelect(rewayah.id)}
                >
                  <Typography
                    size="xs"
                    weight="medium"
                    color={tempState.rewayahId === rewayah.id ? 'inverse' : 'primary'}
                  >
                    {rewayah.name}
                  </Typography>
                </Pressable>
              ))}
            </View>

            <Typography size="sm" weight="semiBold" style={styles.sectionTitle}>
              {t('screens.library.explore.allReciters.filterSort.sortBy')}
            </Typography>

            {SORT_OPTIONS.map((option) => {
              const isSelected = tempState.sortOption === option;
              return (
                <Pressable
                  key={option}
                  style={styles.sortOption}
                  onPress={() => handleSortSelect(option)}
                >
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Typography size="sm" weight={isSelected ? 'semiBold' : 'regular'}>
                    {getSortLabel(option)}
                  </Typography>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={[styles.footer, footerBottomStyle]}>
            <Button variant="text" size="small" onPress={handleReset}>
              {t('screens.library.explore.allReciters.filterSort.reset')}
            </Button>
            <Button variant="contained" size="small" onPress={handleApply}>
              {t('screens.library.explore.allReciters.filterSort.apply')}
            </Button>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default FilterSortDrawer;
