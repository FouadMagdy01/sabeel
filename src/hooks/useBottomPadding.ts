import { usePlayerStore } from '@/features/quran/stores/playerStore';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ANDROID_EXTRA_PADDING = 24;

export function useBottomPadding(includeTabBar = true) {
  const tabBarHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  const isPlayerVisible = usePlayerStore((s) => s.isVisible);
  const miniPlayerHeight = usePlayerStore((s) => s.miniPlayerHeight);
  const extra = Platform.OS === 'android' ? ANDROID_EXTRA_PADDING : 0;
  console.warn(bottom, miniPlayerHeight);
  return (
    (includeTabBar ? tabBarHeight : 0) + bottom + extra + (isPlayerVisible ? miniPlayerHeight : 0)
  );
}

/**
 * Bottom padding for screens outside the tab navigator (e.g. quran-reader).
 * Accounts for safe area insets and the MiniPlayer when visible.
 */
export function useReaderBottomPadding() {
  const { bottom } = useSafeAreaInsets();
  const isPlayerVisible = usePlayerStore((s) => s.isVisible);
  const isMiniPlayerHidden = usePlayerStore((s) => s.isMiniPlayerHidden);
  const miniPlayerHeight = usePlayerStore((s) => s.miniPlayerHeight);
  const showPlayer = isPlayerVisible && !isMiniPlayerHidden;

  return bottom + (showPlayer ? miniPlayerHeight : 0);
}
