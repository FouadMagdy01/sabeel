import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Typography } from '@/common/components/Typography';
import { styles } from './DatePicker.styles';
import type { YearSelectorProps } from './DatePicker.types';

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;
const ITEM_HEIGHT = 48;

/**
 * YearSelector sub-component for DatePicker.
 * Displays a scrollable list of years (1900-2100) with selected year highlighting.
 *
 * @example
 * ```tsx
 * <YearSelector
 *   selectedYear={2000}
 *   onSelectYear={(year) => console.log(year)}
 *   minYear={1950}
 *   maxYear={2050}
 * />
 * ```
 */
export function YearSelector({
  selectedYear,
  onSelectYear,
  minYear = MIN_YEAR,
  maxYear = MAX_YEAR,
}: YearSelectorProps) {
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList>(null);
  const [isInputMode, setIsInputMode] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Generate years array (1900-2100)
  const years = useMemo(() => {
    const yearsList: number[] = [];
    for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
      yearsList.push(year);
    }
    return yearsList;
  }, []);

  // Calculate initial scroll index
  const initialScrollIndex = useMemo(() => {
    return Math.max(0, selectedYear - MIN_YEAR);
  }, [selectedYear]);

  const isYearDisabled = useCallback(
    (year: number): boolean => {
      return year < minYear || year > maxYear;
    },
    [minYear, maxYear]
  );

  const handleYearPress = useCallback(
    (year: number) => {
      if (!isYearDisabled(year)) {
        onSelectYear(year);
      }
    },
    [isYearDisabled, onSelectYear]
  );

  const handleYearLabelTap = useCallback(() => {
    setIsInputMode(true);
    setInputValue(selectedYear.toString());
  }, [selectedYear]);

  const handleInputSubmit = useCallback(() => {
    const year = parseInt(inputValue, 10);

    // Validate: 4 digits, within range
    if (!isNaN(year) && inputValue.length === 4 && year >= minYear && year <= maxYear) {
      onSelectYear(year);
      // Scroll to the year
      const index = year - MIN_YEAR;
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }

    setIsInputMode(false);
    setInputValue('');
  }, [inputValue, minYear, maxYear, onSelectYear]);

  const handleInputBlur = useCallback(() => {
    setIsInputMode(false);
    setInputValue('');
  }, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<number> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const renderYearItem = useCallback(
    ({ item: year }: { item: number }) => {
      const isSelected = year === selectedYear;
      const isDisabled = isYearDisabled(year);

      return (
        <Pressable
          style={[
            styles.yearItem,
            isSelected && styles.yearItemSelected,
            isDisabled && styles.yearItemDisabled,
          ]}
          onPress={() => handleYearPress(year)}
          disabled={isDisabled}
        >
          <Typography
            type="body"
            size="md"
            weight={isSelected ? 'semiBold' : 'regular'}
            color={isSelected ? 'inverse' : isDisabled ? 'disabled' : 'primary'}
          >
            {year}
          </Typography>
        </Pressable>
      );
    },
    [selectedYear, isYearDisabled, handleYearPress]
  );

  const keyExtractor = useCallback((item: number) => item.toString(), []);

  return (
    <View style={styles.yearSelectorContainer}>
      {/* Tap-to-type input */}
      <View style={styles.yearInputContainer}>
        {isInputMode ? (
          <TextInput
            style={styles.yearInput}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleInputSubmit}
            onBlur={handleInputBlur}
            keyboardType="number-pad"
            maxLength={4}
            placeholder={t('auth.calendar.yearInput')}
            autoFocus
            selectTextOnFocus
          />
        ) : (
          <Pressable onPress={handleYearLabelTap}>
            <Typography type="heading" size="xl" weight="bold" align="center">
              {selectedYear}
            </Typography>
          </Pressable>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={years}
        renderItem={renderYearItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialScrollIndex}
        showsVerticalScrollIndicator={true}
        maxToRenderPerBatch={20}
        windowSize={11}
      />
    </View>
  );
}
