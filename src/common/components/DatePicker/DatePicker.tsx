import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, View } from 'react-native';

import { Button } from '@/common/components/Button';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { styles } from './DatePicker.styles';
import type { DatePickerProps, DatePickerViewMode } from './DatePicker.types';
import { YearSelector } from './YearSelector';
import { MonthGrid } from './MonthGrid';
import { TimeWheelPicker } from './TimeWheelPicker';

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
  mode = 'date',
  timeFormat = '12h',
  minuteStep = 5,
  minTime,
  maxTime,
  containerStyle,
  pickerStyle,
  labelStyle,
}: DatePickerProps) {
  const { t, i18n } = useTranslation();
  const defaultPlaceholder = placeholder ?? t('auth.calendar.placeholder');
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => value ?? new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ?? null);
  const [viewMode, setViewMode] = useState<DatePickerViewMode>('calendar');
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);

  // Resolve effective time format: prop override or locale-based detection
  const effectiveTimeFormat = useMemo(() => {
    if (timeFormat) return timeFormat;

    // Auto-detect from locale
    const locale = i18n.language;
    if (locale === 'ar' || locale.startsWith('en')) {
      return '12h';
    }
    return '24h';
  }, [timeFormat, i18n.language]);

  // Configure variants
  styles.useVariants({
    variant,
    size,
    disabled,
    error,
    open: isOpen,
    placeholder: !value as true | false,
  });

  const formatDate = useCallback((date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }, []);

  const formatTime = useCallback(
    (date: Date): string => {
      const hours = date.getHours();
      const minutes = date.getMinutes();

      if (effectiveTimeFormat === '12h') {
        const displayHour = hours % 12 || 12;
        const ampm = hours >= 12 ? t('auth.calendar.time.pm') : t('auth.calendar.time.am');
        return `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    },
    [effectiveTimeFormat, t]
  );

  const getDisplayText = useCallback(() => {
    if (!value) return defaultPlaceholder;

    if (mode === 'date') {
      return formatDate(value);
    } else if (mode === 'time') {
      return formatTime(value);
    } else {
      // datetime
      return `${formatDate(value)} · ${formatTime(value)}`;
    }
  }, [value, mode, formatDate, formatTime, defaultPlaceholder]);

  const getModalTitle = useCallback(() => {
    if (mode === 'date') {
      return t('auth.calendar.selectDate');
    } else if (mode === 'time') {
      return t('auth.calendar.selectTime');
    } else {
      return t('auth.calendar.selectDateTime');
    }
  }, [mode, t]);

  const displayText = getDisplayText();
  const displayHelperText = error && errorText ? errorText : helperText;
  const modalTitle = getModalTitle();

  const handleOpen = useCallback(() => {
    if (!disabled) {
      const dateValue = value ?? new Date();
      setViewDate(dateValue);
      setSelectedDate(value ?? null);

      // Initialize time from value
      if (value) {
        setSelectedHour(value.getHours());
        setSelectedMinute(value.getMinutes());
      } else {
        setSelectedHour(0);
        setSelectedMinute(0);
      }

      setIsOpen(true);
    }
  }, [disabled, value]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    let resultDate: Date | null = null;

    if (mode === 'date') {
      // Date only mode - existing behavior
      resultDate = selectedDate;
    } else if (mode === 'time') {
      // Time only mode - use today's date with selected time
      const today = new Date();
      resultDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        selectedHour,
        selectedMinute,
        0,
        0
      );
    } else if (mode === 'datetime') {
      // Date + time mode - combine selectedDate with selectedHour/selectedMinute
      if (selectedDate) {
        resultDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          selectedHour,
          selectedMinute,
          0,
          0
        );
      }
    }

    onValueChange(resultDate);
    setIsOpen(false);
  }, [mode, selectedDate, selectedHour, selectedMinute, onValueChange]);

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

  // Validation helper: check if minDate/maxDate constraints are valid
  const getValidatedDateConstraints = useCallback(() => {
    const fallbackMinDate = new Date(1900, 0, 1);
    const fallbackMaxDate = new Date(2100, 11, 31);

    if (minDate && maxDate && minDate > maxDate) {
      console.warn(
        'DatePicker: minDate is greater than maxDate. Using fallback values (1900-01-01 to 2100-12-31).'
      );
      return { minDate: fallbackMinDate, maxDate: fallbackMaxDate };
    }

    return { minDate: minDate ?? fallbackMinDate, maxDate: maxDate ?? fallbackMaxDate };
  }, [minDate, maxDate]);

  // Auto-adjust helper: clamp day to last valid day of month (leap year handling)
  const autoAdjustDate = useCallback((year: number, month: number, day: number): Date => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const adjustedDay = Math.min(day, daysInMonth);
    return new Date(year, month, adjustedDay);
  }, []);

  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      const { minDate: validMin, maxDate: validMax } = getValidatedDateConstraints();
      if (date < validMin) return true;
      if (date > validMax) return true;
      return false;
    },
    [getValidatedDateConstraints]
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

  const monthName = useMemo(() => {
    const monthKey = MONTHS[viewDate.getMonth()];
    return t(`auth.calendar.months.${monthKey}` as const);
  }, [viewDate, t]);

  const yearNumber = useMemo(() => viewDate.getFullYear(), [viewDate]);

  const handleMonthTap = useCallback(() => {
    setViewMode('month');
  }, []);

  const handleYearTap = useCallback(() => {
    setViewMode('year');
  }, []);

  const handleBackToCalendar = useCallback(() => {
    setViewMode('calendar');
  }, []);

  const handleSelectYear = useCallback(
    (year: number) => {
      const currentDay = viewDate.getDate();
      const currentMonth = viewDate.getMonth();
      const newDate = autoAdjustDate(year, currentMonth, currentDay);
      setViewDate(newDate);
      setViewMode('calendar');
    },
    [viewDate, autoAdjustDate]
  );

  const handleSelectMonth = useCallback(
    (month: number) => {
      const currentDay = viewDate.getDate();
      const currentYear = viewDate.getFullYear();
      const newDate = autoAdjustDate(currentYear, month, currentDay);
      setViewDate(newDate);
      setViewMode('calendar');
    },
    [viewDate, autoAdjustDate]
  );

  const handleTimeChange = useCallback((hours: number, minutes: number) => {
    setSelectedHour(hours);
    setSelectedMinute(minutes);
  }, []);

  // Calculate min/max years from date constraints
  const { minDate: validMin, maxDate: validMax } = useMemo(
    () => getValidatedDateConstraints(),
    [getValidatedDateConstraints]
  );
  const minYear = useMemo(() => validMin.getFullYear(), [validMin]);
  const maxYear = useMemo(() => validMax.getFullYear(), [validMax]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography type="label" size="xs" weight="semiBold" color="secondary" style={labelStyle}>
          {label}
        </Typography>
      )}

      <Pressable
        style={[styles.pickerButton, pickerStyle]}
        onPress={handleOpen}
        disabled={disabled}
      >
        <View style={styles.pickerContent}>
          <Icon familyName="Feather" iconName="calendar" variant="muted" size={20} />
          <Typography
            type="body"
            size={size === 'small' ? 'xs' : size === 'large' ? 'md' : 'sm'}
            color={!value ? 'muted' : 'primary'}
          >
            {displayText}
          </Typography>
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

      {displayHelperText && (
        <Typography type="caption" size="xs" color={error ? 'error' : 'muted'}>
          {displayHelperText}
        </Typography>
      )}

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={handleClose}>
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Typography type="heading" size="lg" weight="semiBold">
                {modalTitle}
              </Typography>
              <IconButton
                familyName="Feather"
                iconName="x"
                onPress={handleClose}
                variant="ghost"
                size="medium"
              />
            </View>

            {/* Calendar Container (hidden for time-only mode) */}
            {mode !== 'time' && (
              <View style={styles.calendarContainer}>
                {viewMode === 'year' ? (
                  /* Year Selector View */
                  <>
                    <View style={styles.subViewHeader}>
                      <IconButton
                        familyName="Feather"
                        iconName="chevron-left"
                        onPress={handleBackToCalendar}
                        variant="ghost"
                        size="small"
                      />
                      <Typography type="heading" size="md" weight="medium">
                        {t('auth.calendar.selectYear')}
                      </Typography>
                    </View>
                    <YearSelector
                      selectedYear={yearNumber}
                      onSelectYear={handleSelectYear}
                      minYear={minYear}
                      maxYear={maxYear}
                    />
                  </>
                ) : viewMode === 'month' ? (
                  /* Month Grid View */
                  <>
                    <View style={styles.subViewHeader}>
                      <IconButton
                        familyName="Feather"
                        iconName="chevron-left"
                        onPress={handleBackToCalendar}
                        variant="ghost"
                        size="small"
                      />
                      <Typography type="heading" size="md" weight="medium">
                        {t('auth.calendar.selectMonth')}
                      </Typography>
                    </View>
                    <MonthGrid
                      selectedMonth={viewDate.getMonth()}
                      year={yearNumber}
                      onSelectMonth={handleSelectMonth}
                      minDate={minDate}
                      maxDate={maxDate}
                    />
                  </>
                ) : (
                  <>
                    {/* Month/Year Navigation */}
                    <View style={styles.monthYearSelector}>
                      <View style={styles.monthYearContainer}>
                        <Pressable onPress={handleMonthTap} style={styles.monthYearTappable}>
                          <Typography type="heading" size="md" weight="medium">
                            {monthName}
                          </Typography>
                        </Pressable>
                        <Pressable onPress={handleYearTap} style={styles.monthYearTappable}>
                          <Typography type="heading" size="md" weight="medium">
                            {yearNumber}
                          </Typography>
                        </Pressable>
                      </View>
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
                          <Typography type="caption" size="xs" weight="medium" color="muted">
                            {t(`auth.calendar.weekdays.${day}` as const)}
                          </Typography>
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
                              <Typography
                                type="body"
                                size="sm"
                                color={
                                  isSelected
                                    ? 'inverse'
                                    : isDisabled
                                      ? 'disabled'
                                      : !item.isCurrentMonth
                                        ? 'muted'
                                        : 'primary'
                                }
                              >
                                {item.date.getDate()}
                              </Typography>
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  </>
                )}
              </View>
            )}

            {/* Time Picker (for datetime and time modes) */}
            {(mode === 'datetime' || mode === 'time') && (
              <TimeWheelPicker
                hours={selectedHour}
                minutes={selectedMinute}
                onTimeChange={handleTimeChange}
                timeFormat={effectiveTimeFormat}
                minuteStep={minuteStep}
                minTime={minTime}
                maxTime={maxTime}
              />
            )}

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
