import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useBottomPadding() {
  const tabBarHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();

  return tabBarHeight + bottom;
}
