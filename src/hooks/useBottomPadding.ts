import { MINI_PLAYER_HEIGHT } from '@/common/components/MiniPlayer';
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useBottomPadding(includeTabBar = true) {
  const tabBarHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  const isPlayerVisible = usePlayerStore((s) => s.isVisible);

  return (includeTabBar ? tabBarHeight : 0) + bottom + (isPlayerVisible ? MINI_PLAYER_HEIGHT : 0);
}

/**
 * Bottom padding for screens outside the tab navigator (e.g. quran-reader).
 * Accounts for safe area insets and the MiniPlayer when visible.
 */
export function useReaderBottomPadding() {
  const { bottom } = useSafeAreaInsets();
  const isPlayerVisible = usePlayerStore((s) => s.isVisible);
  const isMiniPlayerHidden = usePlayerStore((s) => s.isMiniPlayerHidden);
  const showPlayer = isPlayerVisible && !isMiniPlayerHidden;

  return bottom + (showPlayer ? MINI_PLAYER_HEIGHT : 0);
}
