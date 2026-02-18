import { DevSettings, NativeModules } from 'react-native';

/**
 * Reload the app. Uses DevSettings in dev mode.
 * In production Expo builds, this is a no-op (user must manually restart).
 */
export function reloadApp() {
  if (__DEV__) {
    DevSettings.reload();
    return;
  }

  // Production: try expo-updates if available
  try {
    const ExpoUpdates = NativeModules.ExpoUpdates as { reload?: () => void } | undefined;
    ExpoUpdates?.reload?.();
  } catch {
    // No reload mechanism available - user must manually restart
  }
}
