import { useCallback, useRef } from 'react';
import * as Haptics from 'expo-haptics';

interface UseAzkarHapticsReturn {
  onIncrement: () => void;
  onItemComplete: () => void;
}

export function useAzkarHaptics(enabled: boolean): UseAzkarHapticsReturn {
  const completeFiredRef = useRef(false);

  const onIncrement = useCallback(() => {
    if (!enabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    completeFiredRef.current = false;
  }, [enabled]);

  const onItemComplete = useCallback(() => {
    if (!enabled || completeFiredRef.current) return;
    completeFiredRef.current = true;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [enabled]);

  return { onIncrement, onItemComplete };
}
