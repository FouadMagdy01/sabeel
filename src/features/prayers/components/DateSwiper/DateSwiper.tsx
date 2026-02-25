import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUnistyles } from 'react-native-unistyles';

import { DatePicker } from '@/common/components/DatePicker';
import { Typography } from '@/common/components/Typography';

import { styles } from './DateSwiper.styles';
import type { DateSwiperProps, DayItem } from './DateSwiper.types';

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function DateSwiper({ selectedDate, onDateChange }: DateSwiperProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const flatListRef = useRef<FlatList>(null);
  const today = useMemo(() => new Date(), []);
  const yearStart = useMemo(() => new Date(today.getFullYear(), 0, 1), [today]);
  const yearEnd = useMemo(() => new Date(today.getFullYear(), 11, 31), [today]);

  const handleDatePickerChange = useCallback(
    (date: Date | null) => {
      if (date) {
        onDateChange(date);
      }
    },
    [onDateChange]
  );

  const days: DayItem[] = useMemo(() => {
    const items: DayItem[] = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      items.push({
        date,
        dayNumber: date.getDate(),
        weekdayKey: WEEKDAY_KEYS[date.getDay()],
        isSelected: isSameDay(date, selectedDate),
        isToday: i === 0,
      });
    }
    return items;
  }, [today, selectedDate]);

  const handlePress = useCallback(
    (date: Date) => {
      onDateChange(date);
    },
    [onDateChange]
  );

  const renderItem = useCallback(
    ({ item }: { item: DayItem }) => {
      const isActive = item.isSelected;
      const bgColor = isActive ? theme.colors.brand.primary : theme.colors.background.surfaceAlt;
      const textColor = isActive ? theme.colors.text.inverse : theme.colors.text.muted;
      const numberColor = isActive ? theme.colors.text.inverse : theme.colors.text.primary;
      const dotColor = isActive ? theme.colors.text.inverse : theme.colors.brand.primary;

      return (
        <Pressable onPress={() => handlePress(item.date)}>
          <View style={[styles.dayItem, { backgroundColor: bgColor }]}>
            <Typography type="body" style={[styles.dayNumber, { color: numberColor }]}>
              {item.dayNumber}
            </Typography>
            <Typography type="caption" style={[styles.weekday, { color: textColor }]}>
              {t(`common.weekdays.${item.weekdayKey}` as 'common.weekdays.sun')}
            </Typography>
            {item.isToday && <View style={[styles.todayDot, { backgroundColor: dotColor }]} />}
          </View>
        </Pressable>
      );
    },
    [theme, handlePress, t]
  );

  const keyExtractor = useCallback((item: DayItem) => item.date.toISOString(), []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={days}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialScrollIndex={3}
        getItemLayout={(_, index) => ({
          length: 56,
          offset: 56 * index,
          index,
        })}
      />
      <View style={styles.datePickerRow}>
        <DatePicker
          value={selectedDate}
          onValueChange={handleDatePickerChange}
          mode="date"
          minDate={yearStart}
          maxDate={yearEnd}
          placeholder={t('screens.prayers.selectDate')}
          size="small"
          variant="outlined"
        />
      </View>
    </View>
  );
}
