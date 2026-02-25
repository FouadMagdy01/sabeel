import { useCallback, useRef } from 'react';
import * as Haptics from 'expo-haptics';

interface UseTasbeehHapticsReturn {
  onIncrement: () => void;
  onTargetReached: () => void;
}

export function useTasbeehHaptics(enabled: boolean): UseTasbeehHapticsReturn {
  const targetFiredRef = useRef(false);

  const onIncrement = useCallback(() => {
    if (!enabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Reset target flag on each increment so it can fire again after reset
    targetFiredRef.current = false;
  }, [enabled]);

  const onTargetReached = useCallback(() => {
    if (!enabled || targetFiredRef.current) return;
    targetFiredRef.current = true;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [enabled]);

  return { onIncrement, onTargetReached };
}
