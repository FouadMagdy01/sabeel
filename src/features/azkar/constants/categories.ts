import type { CategoryMeta } from '../types';

export const AZKAR_CATEGORIES: CategoryMeta[] = [
  {
    id: 'morning_azkar',
    labelKey: 'screens.azkar.categories.morning_azkar.label',
    descriptionKey: 'screens.azkar.categories.morning_azkar.description',
    iconFamily: 'MaterialIcons',
    iconName: 'wb-sunny',
    isRecommended: true,
  },
  {
    id: 'evening_azkar',
    labelKey: 'screens.azkar.categories.evening_azkar.label',
    descriptionKey: 'screens.azkar.categories.evening_azkar.description',
    iconFamily: 'MaterialIcons',
    iconName: 'nights-stay',
    isRecommended: true,
  },
  {
    id: 'sleep_azkar',
    labelKey: 'screens.azkar.categories.sleep_azkar.label',
    descriptionKey: 'screens.azkar.categories.sleep_azkar.description',
    iconFamily: 'MaterialIcons',
    iconName: 'bedtime',
  },
  {
    id: 'after_prayer',
    labelKey: 'screens.azkar.categories.after_prayer.label',
    descriptionKey: 'screens.azkar.categories.after_prayer.description',
    iconFamily: 'MaterialIcons',
    iconName: 'volunteer-activism',
  },
  {
    id: 'waking_up',
    labelKey: 'screens.azkar.categories.waking_up.label',
    descriptionKey: 'screens.azkar.categories.waking_up.description',
    iconFamily: 'MaterialIcons',
    iconName: 'wb-twilight',
  },
  {
    id: 'general_duas',
    labelKey: 'screens.azkar.categories.general_duas.label',
    descriptionKey: 'screens.azkar.categories.general_duas.description',
    iconFamily: 'MaterialIcons',
    iconName: 'auto-awesome',
  },
  {
    id: 'travel_duas',
    labelKey: 'screens.azkar.categories.travel_duas.label',
    descriptionKey: 'screens.azkar.categories.travel_duas.description',
    iconFamily: 'MaterialIcons',
    iconName: 'flight-takeoff',
  },
  {
    id: 'mosque_duas',
    labelKey: 'screens.azkar.categories.mosque_duas.label',
    descriptionKey: 'screens.azkar.categories.mosque_duas.description',
    iconFamily: 'MaterialCommunityIcons',
    iconName: 'mosque',
  },
  {
    id: 'food_duas',
    labelKey: 'screens.azkar.categories.food_duas.label',
    descriptionKey: 'screens.azkar.categories.food_duas.description',
    iconFamily: 'MaterialIcons',
    iconName: 'restaurant',
  },
  {
    id: 'miscellaneous',
    labelKey: 'screens.azkar.categories.miscellaneous.label',
    descriptionKey: 'screens.azkar.categories.miscellaneous.description',
    iconFamily: 'MaterialIcons',
    iconName: 'more-horiz',
  },
];

export const RECOMMENDED_CATEGORIES = AZKAR_CATEGORIES.filter((c) => c.isRecommended);
export const ESSENTIAL_CATEGORIES = AZKAR_CATEGORIES.filter((c) => !c.isRecommended);
