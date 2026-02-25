import type { AzkarCategory, AzkarItem } from '../types';

import { AFTER_PRAYER_AZKAR } from './afterPrayerAzkar';
import { EVENING_AZKAR } from './eveningAzkar';
import { FOOD_DUAS } from './foodDuas';
import { GENERAL_DUAS } from './generalDuas';
import { MISCELLANEOUS_AZKAR } from './miscellaneous';
import { MORNING_AZKAR } from './morningAzkar';
import { MOSQUE_DUAS } from './mosqueDuas';
import { SLEEP_AZKAR } from './sleepAzkar';
import { TRAVEL_DUAS } from './travelDuas';
import { WAKING_UP_AZKAR } from './wakingUpAzkar';

export {
  AFTER_PRAYER_AZKAR,
  EVENING_AZKAR,
  FOOD_DUAS,
  GENERAL_DUAS,
  MISCELLANEOUS_AZKAR,
  MORNING_AZKAR,
  MOSQUE_DUAS,
  SLEEP_AZKAR,
  TRAVEL_DUAS,
  WAKING_UP_AZKAR,
};

export const ALL_AZKAR_ITEMS: AzkarItem[] = [
  ...MORNING_AZKAR,
  ...EVENING_AZKAR,
  ...SLEEP_AZKAR,
  ...AFTER_PRAYER_AZKAR,
  ...WAKING_UP_AZKAR,
  ...GENERAL_DUAS,
  ...TRAVEL_DUAS,
  ...MOSQUE_DUAS,
  ...FOOD_DUAS,
  ...MISCELLANEOUS_AZKAR,
];

export function getItemsByCategory(categoryId: AzkarCategory): AzkarItem[] {
  return ALL_AZKAR_ITEMS.filter((item) => item.categoryId === categoryId);
}
