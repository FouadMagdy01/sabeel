import { Icon } from '@/common/components/Icon';
import React, { useCallback } from 'react';
import { View } from 'react-native';

import { UniActivityIndicator, UniPressable, UniTextInput } from '@/common/components/themed';
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

  return (
    <View style={[styles.container, containerStyle]}>
      {loading ? (
        <UniActivityIndicator size="small" style={styles.loadingSpinner} />
      ) : (
        <Icon familyName="Feather" iconName="search" size={iconSize} variant="tertiary" />
      )}
      <UniTextInput
        style={[styles.input, style]}
        value={value}
        editable={!disabled}
        onSubmitEditing={handleSubmitEditing}
        returnKeyType={onSearch ? 'search' : 'default'}
        {...textInputProps}
      />
      {shouldShowClear && onClear && !disabled && (
        <UniPressable onPress={onClear} style={styles.clearButton} hitSlop={8}>
          <Icon familyName="Feather" iconName="x" size={iconSize - 2} variant="muted" />
        </UniPressable>
      )}
    </View>
  );
}
