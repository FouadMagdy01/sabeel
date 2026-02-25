export interface DateSwiperProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export interface DayItem {
  date: Date;
  dayNumber: number;
  weekdayKey: string;
  isSelected: boolean;
  isToday: boolean;
}
