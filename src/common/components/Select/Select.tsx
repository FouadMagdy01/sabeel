import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { SearchInput } from '@/common/components/SearchInput';
import { Typography } from '@/common/components/Typography';
import { styles } from './Select.styles';
import type { SelectOption, SelectProps } from './Select.types';

/**
 * Select component with bottom sheet dropdown.
 * Supports search, clear button, and loading states.
 *
 * @example
 * ```tsx
 * // Basic select
 * <Select
 *   label="Country"
 *   options={countries}
 *   value={selectedCountry}
 *   onValueChange={setSelectedCountry}
 *   placeholder="Select your country"
 * />
 *
 * // Searchable select
 * <Select
 *   label="Country"
 *   options={countries}
 *   value={selectedCountry}
 *   onValueChange={setSelectedCountry}
 *   searchable
 * />
 *
 * // With clear button
 * <Select
 *   label="Country"
 *   options={countries}
 *   value={selectedCountry}
 *   onValueChange={setSelectedCountry}
 *   allowClear
 * />
 *
 * // Loading state
 * <Select
 *   label="Country"
 *   options={countries}
 *   value={selectedCountry}
 *   onValueChange={setSelectedCountry}
 *   loading
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
  searchable = false,
  allowClear = false,
  loading = false,
  leftIcon,
  containerStyle,
  selectStyle,
  labelStyle,
}: SelectProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

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
    setSearchQuery('');
  }, []);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      onValueChange(option.value);
      bottomSheetModalRef.current?.dismiss();
      setSearchQuery('');
    },
    [onValueChange]
  );

  const handleClear = useCallback(() => {
    onValueChange('');
  }, [onValueChange]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, searchQuery, searchable]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography type="label" size="xs" weight="semiBold" color="secondary" style={labelStyle}>
          {label}
        </Typography>
      )}

      <Pressable
        style={[styles.selectButton, selectStyle]}
        onPress={handleOpen}
        disabled={disabled}
      >
        {leftIcon && <View style={styles.leftElement}>{leftIcon}</View>}

        <View style={styles.selectContent}>
          {selectedOption?.icon && <Text style={styles.selectIcon}>{selectedOption.icon}</Text>}
          <Typography
            type="body"
            size={size === 'small' ? 'xs' : size === 'large' ? 'md' : 'sm'}
            color={!value ? 'muted' : 'primary'}
          >
            {displayText}
          </Typography>
        </View>

        <View style={styles.rightActions}>
          {allowClear && value && !disabled && (
            <Pressable onPress={handleClear} style={styles.clearButton} hitSlop={8}>
              <Icon familyName="Feather" iconName="x" variant="muted" size={16} />
            </Pressable>
          )}
          <Icon familyName="Feather" iconName="chevron-down" variant="muted" size={20} />
        </View>
      </Pressable>

      {displayHelperText && (
        <Typography type="caption" size="xs" color={error ? 'error' : 'tertiary'}>
          {displayHelperText}
        </Typography>
      )}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['50%', '75%']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        containerStyle={styles.sheetContainer}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
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

        {searchable && (
          <View style={styles.searchContainer}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search options..."
              size="medium"
              onClear={() => setSearchQuery('')}
            />
          </View>
        )}

        <BottomSheetScrollView
          contentContainerStyle={[styles.optionsList, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.brand.primary} />
            </View>
          ) : (
            <>
              {filteredOptions.map((item) => {
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
              {searchable && filteredOptions.length === 0 && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.optionText}>{t('common.noOptionsFound')}</Text>
                </View>
              )}
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}
