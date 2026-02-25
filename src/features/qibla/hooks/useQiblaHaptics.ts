import { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';

export function useQiblaHaptics(isFacingQibla: boolean): void {
  const wasFacingRef = useRef(false);

  useEffect(() => {
    if (isFacingQibla && !wasFacingRef.current) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    wasFacingRef.current = isFacingQibla;
  }, [isFacingQibla]);
}
