import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { styles } from './select.styles';
import type { SelectOption, SelectProps } from './select.types';

/**
 * Select component with bottom sheet dropdown
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   options={countries}
 *   value={selectedCountry}
 *   onValueChange={setSelectedCountry}
 *   placeholder="Select your country"
 * />
 * ```
 */
export function Select({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  label,
  variant = 'outlined',
  size = 'medium',
  disabled = false,
  error = false,
  errorText,
  helperText,
  containerStyle,
  selectStyle,
  labelStyle,
}: SelectProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  // Configure variants
  styles.useVariants({
    variant,
    size,
    disabled: disabled as true | false,
    error: error as true | false,
    open: false as true | false,
    placeholder: !value as true | false,
  });

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label ?? placeholder;
  const displayHelperText = error && errorText ? errorText : helperText;

  const handleOpen = useCallback(() => {
    if (!disabled) {
      bottomSheetModalRef.current?.present();
    }
  }, [disabled]);

  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      onValueChange(option.value);
      bottomSheetModalRef.current?.dismiss();
    },
    [onValueChange]
  );

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <Pressable
        style={[styles.selectButton, selectStyle]}
        onPress={handleOpen}
        disabled={disabled}
      >
        <View style={styles.selectContent}>
          {selectedOption?.icon && <Text style={styles.selectIcon}>{selectedOption.icon}</Text>}
          <Text style={styles.selectText}>{displayText}</Text>
        </View>
        <Icon familyName="Feather" iconName="chevron-down" variant="muted" size={20} />
      </Pressable>

      {displayHelperText && <Text style={styles.helperText}>{displayHelperText}</Text>}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['50%', '75%']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetScrollView
          contentContainerStyle={[styles.optionsList, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.modalTitle}>{label ?? placeholder}</Text>
            <IconButton
              familyName="Feather"
              iconName="x"
              onPress={handleClose}
              variant="ghost"
              size="medium"
            />
          </View>
          {options.map((item) => {
            const isSelected = item.value === value;
            return (
              <Pressable
                key={item.value}
                style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                onPress={() => handleSelect(item)}
              >
                {item.icon && <Text style={styles.optionIcon}>{item.icon}</Text>}
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {item.label}
                </Text>
                {isSelected && (
                  <Icon familyName="Feather" iconName="check" variant="accent" size={20} />
                )}
              </Pressable>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}
