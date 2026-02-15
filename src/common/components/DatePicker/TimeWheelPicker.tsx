import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { Typography } from '@/common/components/Typography';
import { styles } from './DatePicker.styles';
import type { TimeWheelPickerProps } from './DatePicker.types';

const ITEM_HEIGHT = 44;
const PADDING_ITEMS = 2;

/**
 * TimeWheelPicker sub-component for DatePicker.
 * Displays scrollable wheels for hours and minutes selection.
 *
 * @example
 * ```tsx
 * <TimeWheelPicker
 *   hours={14}
 *   minutes={30}
 *   onTimeChange={(h, m) => console.log(h, m)}
 *   timeFormat="24h"
 *   minuteStep={5}
 * />
 * ```
 */
export function TimeWheelPicker({
  hours,
  minutes,
  onTimeChange,
  timeFormat = '24h',
  minuteStep = 5,
  minTime,
  maxTime,
}: TimeWheelPickerProps) {
  const { t } = useTranslation();
  const hourListRef = useRef<FlatList>(null);
  const minuteListRef = useRef<FlatList>(null);

  // AM/PM state for 12h format
  const [isAM, setIsAM] = useState(() => hours < 12);

  // Generate hours array based on format
  const hourValues = useMemo(() => {
    const values: number[] = [];
    if (timeFormat === '12h') {
      for (let i = 1; i <= 12; i++) {
        values.push(i);
      }
    } else {
      for (let i = 0; i <= 23; i++) {
        values.push(i);
      }
    }
    return values;
  }, [timeFormat]);

  // Generate minutes array based on step
  const minuteValues = useMemo(() => {
    const values: number[] = [];
    for (let i = 0; i <= 55; i += minuteStep) {
      values.push(i);
    }
    return values;
  }, [minuteStep]);

  // Convert 12h display to 24h
  const convertTo24h = useCallback(
    (hour12: number, am: boolean): number => {
      if (timeFormat === '24h') return hour12;

      if (am) {
        return hour12 === 12 ? 0 : hour12;
      } else {
        return hour12 === 12 ? 12 : hour12 + 12;
      }
    },
    [timeFormat]
  );

  // Convert 24h to 12h display
  const convertTo12h = useCallback((hour24: number): number => {
    if (hour24 === 0) return 12;
    if (hour24 > 12) return hour24 - 12;
    return hour24;
  }, []);

  const isHourDisabled = useCallback(
    (hour: number): boolean => {
      // Convert display hour to 24h for comparison
      const hour24 = convertTo24h(hour, isAM);

      if (minTime && hour24 < minTime.hours) return true;
      if (maxTime && hour24 > maxTime.hours) return true;
      return false;
    },
    [minTime, maxTime, convertTo24h, isAM]
  );

  const isMinuteDisabled = useCallback(
    (minute: number, currentHour: number): boolean => {
      if (minTime?.hours === currentHour && minute < minTime.minutes) return true;
      if (maxTime?.hours === currentHour && minute > maxTime.minutes) return true;
      return false;
    },
    [minTime, maxTime]
  );

  const handleHourScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const selectedHour = hourValues[index];

      if (selectedHour !== undefined && !isHourDisabled(selectedHour)) {
        const hour24 = convertTo24h(selectedHour, isAM);
        onTimeChange(hour24, minutes);
      }
    },
    [hourValues, minutes, onTimeChange, isHourDisabled, convertTo24h, isAM]
  );

  const handleAMPress = useCallback(() => {
    setIsAM(true);
    const currentDisplay = timeFormat === '12h' ? convertTo12h(hours) : hours;
    const hour24 = convertTo24h(currentDisplay, true);
    onTimeChange(hour24, minutes);
  }, [hours, minutes, onTimeChange, convertTo12h, convertTo24h, timeFormat]);

  const handlePMPress = useCallback(() => {
    setIsAM(false);
    const currentDisplay = timeFormat === '12h' ? convertTo12h(hours) : hours;
    const hour24 = convertTo24h(currentDisplay, false);
    onTimeChange(hour24, minutes);
  }, [hours, minutes, onTimeChange, convertTo12h, convertTo24h, timeFormat]);

  const handleMinuteScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const selectedMinute = minuteValues[index];

      if (selectedMinute !== undefined && !isMinuteDisabled(selectedMinute, hours)) {
        onTimeChange(hours, selectedMinute);
      }
    },
    [minuteValues, hours, onTimeChange, isMinuteDisabled]
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<number> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const renderHourItem = useCallback(
    ({ item: hour, index }: { item: number; index: number }) => {
      const displayHour = timeFormat === '12h' ? convertTo12h(hours) : hours;
      const isSelected = hour === displayHour;
      const isDisabled = isHourDisabled(hour);
      const isPadding = index < PADDING_ITEMS || index >= hourValues.length + PADDING_ITEMS;

      if (isPadding) {
        return <View style={styles.timeWheelItem} />;
      }

      return (
        <View
          style={[
            styles.timeWheelItem,
            isSelected && styles.timeWheelItemSelected,
            isDisabled && styles.timeWheelItemDisabled,
          ]}
        >
          <Typography
            type="body"
            size="lg"
            weight={isSelected ? 'semiBold' : 'regular'}
            color={isSelected ? 'inverse' : isDisabled ? 'disabled' : 'primary'}
          >
            {hour.toString().padStart(2, '0')}
          </Typography>
        </View>
      );
    },
    [hours, isHourDisabled, hourValues.length, timeFormat, convertTo12h]
  );

  const renderMinuteItem = useCallback(
    ({ item: minute, index }: { item: number; index: number }) => {
      const isSelected = minute === minutes;
      const isDisabled = isMinuteDisabled(minute, hours);
      const isPadding = index < PADDING_ITEMS || index >= minuteValues.length + PADDING_ITEMS;

      if (isPadding) {
        return <View style={styles.timeWheelItem} />;
      }

      return (
        <View
          style={[
            styles.timeWheelItem,
            isSelected && styles.timeWheelItemSelected,
            isDisabled && styles.timeWheelItemDisabled,
          ]}
        >
          <Typography
            type="body"
            size="lg"
            weight={isSelected ? 'semiBold' : 'regular'}
            color={isSelected ? 'inverse' : isDisabled ? 'disabled' : 'primary'}
          >
            {minute.toString().padStart(2, '0')}
          </Typography>
        </View>
      );
    },
    [minutes, hours, isMinuteDisabled, minuteValues.length]
  );

  // Add padding items for centering
  const hourDataWithPadding = useMemo(() => {
    const padding = new Array<number>(PADDING_ITEMS).fill(-1);
    return [...padding, ...hourValues, ...padding];
  }, [hourValues]);

  const minuteDataWithPadding = useMemo(() => {
    const padding = new Array<number>(PADDING_ITEMS).fill(-1);
    return [...padding, ...minuteValues, ...padding];
  }, [minuteValues]);

  // Calculate initial scroll indices
  const initialHourIndex = useMemo(() => {
    const displayHour = timeFormat === '12h' ? convertTo12h(hours) : hours;
    const index = hourValues.indexOf(displayHour);
    return index >= 0 ? index + PADDING_ITEMS : PADDING_ITEMS;
  }, [hours, hourValues, timeFormat, convertTo12h]);

  const initialMinuteIndex = useMemo(() => {
    const index = minuteValues.indexOf(minutes);
    return index >= 0 ? index + PADDING_ITEMS : PADDING_ITEMS;
  }, [minutes, minuteValues]);

  const keyExtractor = useCallback((item: number, index: number) => `${item}-${index}`, []);

  return (
    <View style={styles.timePickerContainer}>
      <View style={styles.timeWheelContainer}>
        {/* Hours Wheel */}
        <FlatList
          ref={hourListRef}
          data={hourDataWithPadding}
          renderItem={renderHourItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          initialScrollIndex={initialHourIndex}
          onMomentumScrollEnd={handleHourScroll}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * PADDING_ITEMS }}
        />

        {/* Separator */}
        <Typography type="body" size="xl" weight="bold" style={styles.timeWheelSeparator}>
          :
        </Typography>

        {/* Minutes Wheel */}
        <FlatList
          ref={minuteListRef}
          data={minuteDataWithPadding}
          renderItem={renderMinuteItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          initialScrollIndex={initialMinuteIndex}
          onMomentumScrollEnd={handleMinuteScroll}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * PADDING_ITEMS }}
        />

        {/* AM/PM Toggle (12h format only) */}
        {timeFormat === '12h' && (
          <View style={styles.amPmToggle}>
            <Pressable
              style={[styles.amPmButton, isAM && styles.amPmButtonActive]}
              onPress={handleAMPress}
            >
              <Typography
                type="body"
                size="sm"
                weight="semiBold"
                color={isAM ? 'inverse' : 'primary'}
              >
                {t('auth.calendar.time.am')}
              </Typography>
            </Pressable>
            <Pressable
              style={[styles.amPmButton, !isAM && styles.amPmButtonActive]}
              onPress={handlePMPress}
            >
              <Typography
                type="body"
                size="sm"
                weight="semiBold"
                color={!isAM ? 'inverse' : 'primary'}
              >
                {t('auth.calendar.time.pm')}
              </Typography>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
