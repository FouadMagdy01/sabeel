import { Icon } from '@/common/components/Icon';
import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { SEARCH_INPUT_ICON_SIZES, styles } from './SearchInput.styles';
import type { SearchInputProps } from './SearchInput.types';

/**
 * SearchInput - A styled search input with search icon and optional clear button
 *
 * @example
 * ```tsx
 * <SearchInput
 *   value={query}
 *   onChangeText={setQuery}
 *   placeholder="Search suras..."
 *   onClear={() => setQuery('')}
 * />
 *
 * <SearchInput
 *   value={query}
 *   onChangeText={setQuery}
 *   onSearch={handleSearch}
 *   loading={isLoading}
 *   size="large"
 * />
 *
 * <SearchInput
 *   disabled
 *   placeholder="Search disabled..."
 * />
 * ```
 */
export function SearchInput({
  containerStyle,
  style,
  onClear,
  showClearButton,
  value,
  onSearch,
  loading = false,
  size = 'medium',
  disabled = false,
  ...textInputProps
}: SearchInputProps) {
  const { theme } = useUnistyles();

  styles.useVariants({
    size,
    disabled: disabled as true | false,
  });

  const handleSubmitEditing = useCallback(() => {
    if (onSearch && value) {
      onSearch(value);
    }
  }, [onSearch, value]);

  const shouldShowClear = showClearButton ?? Boolean(value && value.length > 0);
  const iconSize = SEARCH_INPUT_ICON_SIZES[size];

  // Inline color styles to avoid flicker during theme switching
  const containerColors = {
    backgroundColor: disabled ? theme.colors.background.disabled : theme.colors.background.input,
    borderColor: theme.colors.border.default,
  };
  const inputColor = { color: theme.colors.text.primary };

  return (
    <View style={[styles.container, containerColors, containerStyle]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={theme.colors.brand.primary}
          style={styles.loadingSpinner}
        />
      ) : (
        <Icon
          familyName="Feather"
          iconName="search"
          size={iconSize}
          color={theme.colors.icon.tertiary}
        />
      )}
      <TextInput
        style={[styles.input, inputColor, style]}
        placeholderTextColor={theme.colors.text.muted}
        value={value}
        editable={!disabled}
        onSubmitEditing={handleSubmitEditing}
        returnKeyType={onSearch ? 'search' : 'default'}
        {...textInputProps}
      />
      {shouldShowClear && onClear && !disabled && (
        <Pressable onPress={onClear} style={styles.clearButton} hitSlop={8}>
          <Icon
            familyName="Feather"
            iconName="x"
            size={iconSize - 2}
            color={theme.colors.icon.muted}
          />
        </Pressable>
      )}
    </View>
  );
}
