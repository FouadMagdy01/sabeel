import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/common/components/Button';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { styles } from './DatePicker.styles';
import type { DatePickerProps } from './DatePicker.types';

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

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

/**
 * DatePicker component with custom calendar.
 * Supports clearable mode and custom date formatting.
 *
 * @example
 * ```tsx
 * // Basic date picker
 * <DatePicker
 *   label="Date of Birth"
 *   value={dateOfBirth}
 *   onValueChange={setDateOfBirth}
 *   placeholder="Select your birth date"
 *   maxDate={new Date()}
 * />
 *
 * // With clear button
 * <DatePicker
 *   label="Event Date"
 *   value={eventDate}
 *   onValueChange={setEventDate}
 *   clearable
 * />
 * ```
 */
export function DatePicker({
  value,
  onValueChange,
  placeholder,
  label,
  variant = 'outlined',
  size = 'medium',
  disabled = false,
  error = false,
  errorText,
  helperText,
  minDate,
  maxDate,
  clearable = false,
  containerStyle,
  pickerStyle,
  labelStyle,
}: DatePickerProps) {
  const { t } = useTranslation();
  const defaultPlaceholder = placeholder ?? t('auth.calendar.placeholder');
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => value ?? new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ?? null);

  // Configure variants
  styles.useVariants({
    variant,
    size,
    disabled: disabled as true | false,
    error: error as true | false,
    open: isOpen as true | false,
    placeholder: !value as true | false,
  });

  const formatDate = useCallback((date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }, []);

  const displayText = value ? formatDate(value) : defaultPlaceholder;
  const displayHelperText = error && errorText ? errorText : helperText;

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setViewDate(value ?? new Date());
      setSelectedDate(value ?? null);
      setIsOpen(true);
    }
  }, [disabled, value]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    onValueChange(selectedDate);
    setIsOpen(false);
  }, [selectedDate, onValueChange]);

  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  }, []);

  const handleSelectDay = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleClear = useCallback(() => {
    onValueChange(null);
  }, [onValueChange]);

  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    },
    [minDate, maxDate]
  );

  const isSameDay = useCallback((date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }, []);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month days (fill remaining cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [viewDate]);

  const today = useMemo(() => new Date(), []);

  const monthYearDisplay = useMemo(() => {
    const monthKey = MONTHS[viewDate.getMonth()];
    const monthName = t(`auth.calendar.months.${monthKey}`);
    return `${monthName} ${viewDate.getFullYear()}`;
  }, [viewDate, t]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <Pressable
        style={[styles.pickerButton, pickerStyle]}
        onPress={handleOpen}
        disabled={disabled}
      >
        <View style={styles.pickerContent}>
          <Icon familyName="Feather" iconName="calendar" variant="muted" size={20} />
          <Text style={styles.pickerText}>{displayText}</Text>
        </View>
        <View style={styles.rightActions}>
          {clearable && value && !disabled && (
            <Pressable onPress={handleClear} style={styles.clearButton} hitSlop={8}>
              <Icon familyName="Feather" iconName="x" variant="muted" size={16} />
            </Pressable>
          )}
          <Icon familyName="Feather" iconName="chevron-down" variant="muted" size={20} />
        </View>
      </Pressable>

      {displayHelperText && <Text style={styles.helperText}>{displayHelperText}</Text>}

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={handleClose}>
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('auth.calendar.selectDate')}</Text>
              <IconButton
                familyName="Feather"
                iconName="x"
                onPress={handleClose}
                variant="ghost"
                size="medium"
              />
            </View>

            <View style={styles.calendarContainer}>
              {/* Month/Year Navigation */}
              <View style={styles.monthYearSelector}>
                <Text style={styles.monthYearText}>{monthYearDisplay}</Text>
                <View style={styles.monthYearNav}>
                  <IconButton
                    familyName="Feather"
                    iconName="chevron-left"
                    onPress={handlePrevMonth}
                    variant="ghost"
                    size="small"
                  />
                  <IconButton
                    familyName="Feather"
                    iconName="chevron-right"
                    onPress={handleNextMonth}
                    variant="ghost"
                    size="small"
                  />
                </View>
              </View>

              {/* Weekday Headers */}
              <View style={styles.weekdaysRow}>
                {WEEKDAYS.map((day) => (
                  <View key={day} style={styles.weekdayCell}>
                    <Text style={styles.weekdayText}>{t(`auth.calendar.weekdays.${day}`)}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar Days */}
              <View style={styles.daysGrid}>
                {calendarDays.map((item, index) => {
                  const isDisabled = isDateDisabled(item.date);
                  const isSelected = isSameDay(selectedDate, item.date);
                  const isToday = isSameDay(today, item.date);

                  return (
                    <View key={index} style={styles.dayCell}>
                      <Pressable
                        style={[
                          styles.dayButton,
                          isSelected && styles.dayButtonSelected,
                          isToday && !isSelected && styles.dayButtonToday,
                        ]}
                        onPress={() =>
                          !isDisabled && item.isCurrentMonth && handleSelectDay(item.date)
                        }
                        disabled={isDisabled || !item.isCurrentMonth}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            isSelected && styles.dayTextSelected,
                            isDisabled && styles.dayTextDisabled,
                            !item.isCurrentMonth && styles.dayTextOtherMonth,
                          ]}
                        >
                          {item.date.getDate()}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.modalFooter}>
              <Button variant="text" color="secondary" onPress={handleClose}>
                {t('auth.calendar.cancel')}
              </Button>
              <Button variant="contained" color="primary" onPress={handleConfirm}>
                {t('auth.calendar.confirm')}
              </Button>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
