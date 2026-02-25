import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { TASBEEH_PHRASES } from '../../constants';
import { styles } from './PhraseSelector.styles';
import type { PhraseSelectorProps } from './PhraseSelector.types';

const PhraseSelector = forwardRef<BottomSheetModal, PhraseSelectorProps>(
  ({ selectedPhraseId, onSelect }, ref) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const { theme } = useUnistyles();
    const insets = useSafeAreaInsets();

    const snapPoints = useMemo(() => ['60%', '80%'], []);

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
      (phraseId: string) => {
        onSelect(phraseId);
        if (ref && 'current' in ref) {
          ref.current?.dismiss();
        }
      },
      [onSelect, ref]
    );

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
          <View style={styles.headerInfo}>
            <Typography size="md" weight="bold">
              {t('screens.tasbeeh.phraseSelector.title')}
            </Typography>
            <Typography size="xs" color="secondary">
              {t('screens.tasbeeh.phraseSelector.subtitle')}
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
          {TASBEEH_PHRASES.map((phrase) => {
            const isSelected = phrase.id === selectedPhraseId;
            return (
              <Pressable
                key={phrase.id}
                style={[styles.phraseItem, isSelected && styles.phraseItemSelected]}
                onPress={() => handleSelect(phrase.id)}
              >
                <View style={styles.phraseInfo}>
                  <Typography size="lg" weight="bold" align="right">
                    {phrase.arabic}
                  </Typography>
                  <Typography size="xs" color="tertiary">
                    {`× ${String(phrase.defaultTarget)}`}
                  </Typography>
                  {!isArabic && (
                    <Typography size="xs" color="tertiary">
                      {t(phrase.translationKey as never)}
                    </Typography>
                  )}
                </View>
                {isSelected && (
                  <Icon
                    familyName="MaterialIcons"
                    iconName="check-circle"
                    size={24}
                    variant="brandPrimary"
                  />
                )}
              </Pressable>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

PhraseSelector.displayName = 'PhraseSelector';

export default PhraseSelector;
