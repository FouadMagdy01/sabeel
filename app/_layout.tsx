import { MiniPlayer } from '@/common/components/MiniPlayer';
import { useInitQuranPlayer } from '@/features/quran/hooks/useQuranPlayer';
import i18n from '@/i18n/config';
import { AuthProvider, QueryProvider } from '@/providers';
import { initializeTheme } from '@/theme/themeManager';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { I18nManager, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Initialize theme from persisted preferences (synchronous)
initializeTheme();

// Sync RTL direction with saved language at startup.
// forceRTL persists to native preferences and takes effect on next reload.
// The settings screen triggers reloadApp() after calling forceRTL,
// so by the time this code runs the RTL state should already match.
const isArabic = i18n.language === 'ar';
if (Platform.OS !== 'web') {
  I18nManager.allowRTL(isArabic);
  I18nManager.forceRTL(isArabic);
}

function RootNavigator() {
  // Auth guards commented out for release — re-enable when auth flow is ready
  // const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useUnistyles();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background.app },
      }}
      initialRouteName="(main)"
    >
      <Stack.Screen name="(main)" />
      {/* <Stack.Screen name="(auth)" /> */}
    </Stack>
  );
}

function AppContent() {
  useInitQuranPlayer();

  return (
    <View style={styles.appContainer}>
      <RootNavigator />
      <MiniPlayer />
      <Toast />
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.rootView}>
      <QueryProvider>
        <AuthProvider>
          <BottomSheetModalProvider>
            <AppContent />
          </BottomSheetModalProvider>
        </AuthProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create((theme) => ({
  rootView: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  appContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
}));
