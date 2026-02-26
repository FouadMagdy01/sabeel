import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import type { Moshaf } from '../../types/api.types';
import { styles } from './MoshafSelectionSheet.styles';
import type { MoshafSelectionSheetProps } from './MoshafSelectionSheet.types';

const MoshafSelectionSheet = forwardRef<BottomSheetModal, MoshafSelectionSheetProps>(
  (
    {
      reciterName,
      moshafList,
      onSelect,
      onFavoriteToggle,
      isMoshafFavorited,
      onPlay,
      isMoshafPlaying,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const { theme } = useUnistyles();
    const insets = useSafeAreaInsets();

    const snapPoints = useMemo(() => ['50%', '70%'], []);

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

    const handleSelect = useCallback(
      (moshaf: Moshaf) => {
        if (ref && 'current' in ref) {
          ref.current?.dismiss();
        }
        onSelect(moshaf);
      },
      [ref, onSelect]
    );

    const handlePlay = useCallback(
      (moshaf: Moshaf) => {
        if (ref && 'current' in ref) {
          ref.current?.dismiss();
        }
        onPlay?.(moshaf);
      },
      [ref, onPlay]
    );

    return (
      <BottomSheetModal
        ref={ref}
        style={{}}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        containerStyle={styles.sheetContainer}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.indicator}
      >
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Typography size="md" weight="bold">
              {t('screens.library.explore.allReciters.moshafSelection.title')}
            </Typography>
            <Typography size="xs" color="secondary">
              {reciterName}
            </Typography>
          </View>
          <IconButton
            familyName="Feather"
            iconName="x"
            onPress={handleDismiss}
            variant="ghost"
            size="medium"
          />
        </View>

        <BottomSheetScrollView
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
        >
          {moshafList.map((moshaf) => (
            <Pressable
              key={moshaf.id}
              style={styles.moshafItem}
              onPress={() => handleSelect(moshaf)}
            >
              <Icon
                familyName="MaterialIcons"
                iconName="menu-book"
                size={24}
                variant="brandPrimary"
              />
              <View style={styles.moshafInfo}>
                <Typography size="sm" weight="medium">
                  {moshaf.name}
                </Typography>
                <Typography size="xs" color="tertiary">
                  {t('screens.library.explore.allReciters.moshafSelection.surahCount', {
                    count: moshaf.surah_total,
                  })}
                </Typography>
              </View>
              {onFavoriteToggle && (
                <IconButton
                  familyName="MaterialIcons"
                  iconName={isMoshafFavorited?.(moshaf.id) ? 'favorite' : 'favorite-border'}
                  variant="ghost"
                  size="small"
                  iconVariant={isMoshafFavorited?.(moshaf.id) ? 'accent' : 'muted'}
                  onPress={() => onFavoriteToggle(moshaf)}
                />
              )}
              {onPlay && (
                <IconButton
                  familyName="MaterialIcons"
                  iconName={isMoshafPlaying?.(moshaf.id) ? 'pause' : 'play-arrow'}
                  variant="tinted"
                  size="small"
                  onPress={() => handlePlay(moshaf)}
                />
              )}
              <Icon
                familyName="MaterialIcons"
                iconName={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                size={20}
                variant="muted"
              />
            </Pressable>
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

MoshafSelectionSheet.displayName = 'MoshafSelectionSheet';

export default MoshafSelectionSheet;
