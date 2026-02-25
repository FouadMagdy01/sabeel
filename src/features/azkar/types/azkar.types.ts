export type AzkarCategory =
  | 'morning_azkar'
  | 'evening_azkar'
  | 'sleep_azkar'
  | 'after_prayer'
  | 'waking_up'
  | 'general_duas'
  | 'travel_duas'
  | 'mosque_duas'
  | 'food_duas'
  | 'miscellaneous';

export interface AzkarItem {
  id: string;
  categoryId: AzkarCategory;
  arabic: string;
  transliteration: string;
  translationKey: string;
  source: string;
  sourceKey: string;
  repeatCount: number;
  virtue?: string;
}

export interface CategoryMeta {
  id: AzkarCategory;
  labelKey: string;
  descriptionKey: string;
  iconFamily:
    | 'MaterialIcons'
    | 'MaterialCommunityIcons'
    | 'Ionicons'
    | 'FontAwesome'
    | 'FontAwesome5'
    | 'FontAwesome6'
    | 'Feather'
    | 'AntDesign'
    | 'Entypo'
    | 'EvilIcons'
    | 'Fontisto'
    | 'Foundation'
    | 'Octicons'
    | 'SimpleLineIcons'
    | 'Zocial';
  iconName: string;
  isRecommended?: boolean;
}

export interface AzkarSessionState {
  categoryId: AzkarCategory | null;
  currentItemIndex: number;
  currentRepeatCount: number;
  completedItems: string[];
  hapticsEnabled: boolean;
}

export interface AzkarSessionActions {
  startSession: (categoryId: AzkarCategory) => void;
  incrementRepeat: () => void;
  nextItem: () => void;
  previousItem: () => void;
  resetSession: () => void;
  toggleHaptics: () => void;
  loadFromStorage: () => void;
}

export type AzkarSessionStore = AzkarSessionState & AzkarSessionActions;
