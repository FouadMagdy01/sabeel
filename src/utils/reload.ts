import * as Updates from 'expo-updates';
import { DevSettings } from 'react-native';

/**
 * Reload the app. Uses DevSettings in dev mode, expo-updates in production.
 */
export async function reloadApp() {
  if (__DEV__) {
    DevSettings.reload();
    return;
  }

  await Updates.reloadAsync();
}
