import { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Typography } from '@/common/components/Typography';
import { styles } from './DatePicker.styles';
import type { MonthGridProps } from './DatePicker.types';

const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

/**
 * MonthGrid sub-component for DatePicker.
 * Displays a 3x4 grid of months for quick selection.
 *
 * @example
 * ```tsx
 * <MonthGrid
 *   selectedMonth={5}
 *   year={2023}
 *   onSelectMonth={(month) => console.log(month)}
 *   minDate={new Date(2020, 0, 1)}
 *   maxDate={new Date(2025, 11, 31)}
 * />
 * ```
 */
export function MonthGrid({
  selectedMonth,
  year,
  onSelectMonth,
  minDate,
  maxDate,
}: MonthGridProps) {
  const { t } = useTranslation();

  const isMonthDisabled = useCallback(
    (monthIndex: number): boolean => {
      // Check if entire month is outside allowed range
      if (minDate) {
        const minYear = minDate.getFullYear();
        const minMonth = minDate.getMonth();
        if (year < minYear || (year === minYear && monthIndex < minMonth)) {
          return true;
        }
      }

      if (maxDate) {
        const maxYear = maxDate.getFullYear();
        const maxMonth = maxDate.getMonth();
        if (year > maxYear || (year === maxYear && monthIndex > maxMonth)) {
          return true;
        }
      }

      return false;
    },
    [year, minDate, maxDate]
  );

  const handleMonthPress = useCallback(
    (monthIndex: number) => {
      if (!isMonthDisabled(monthIndex)) {
        onSelectMonth(monthIndex);
      }
    },
    [isMonthDisabled, onSelectMonth]
  );

  return (
    <View style={styles.monthGrid}>
      {MONTHS.map((monthKey, index) => {
        const isSelected = index === selectedMonth;
        const isDisabled = isMonthDisabled(index);
        const monthName = t(`auth.calendar.months.${monthKey}` as const);

        return (
          <Pressable
            key={monthKey}
            style={[
              styles.monthItem,
              isSelected && styles.monthItemSelected,
              isDisabled && styles.monthItemDisabled,
            ]}
            onPress={() => handleMonthPress(index)}
            disabled={isDisabled}
          >
            <Typography
              type="body"
              size="sm"
              weight={isSelected ? 'semiBold' : 'regular'}
              color={isSelected ? 'inverse' : isDisabled ? 'disabled' : 'primary'}
            >
              {monthName}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}
