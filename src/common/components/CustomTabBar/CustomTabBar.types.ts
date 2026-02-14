import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

/**
 * Props for the CustomTabBar component.
 * Extends BottomTabBarProps from React Navigation.
 *
 * @param state - Navigation state containing routes and current index
 * @param descriptors - Tab descriptor objects with options and navigation helpers
 * @param navigation - Navigation object for dispatching actions
 */
export type CustomTabBarProps = BottomTabBarProps;

/**
 * Tab item configuration.
 * Used internally to represent each tab.
 *
 * @param key - Unique identifier for the tab route
 * @param label - Display text for the tab
 * @param focused - Whether this tab is currently active
 * @param color - Icon and text color (theme-aware)
 * @param onPress - Handler for tab press
 * @param onLongPress - Handler for tab long press
 * @param accessibilityLabel - Screen reader label
 * @default undefined
 * @param icon - Tab icon element
 */
export interface TabItemConfig {
  key: string;
  label: string;
  focused: boolean;
  color: string;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityLabel?: string;
  icon?: React.ReactNode;
}
