import i18n from '@/i18n/config';
import { AuthProvider, QueryProvider, useAuth } from '@/providers';
import { initializeTheme } from '@/theme/themeManager';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { ActivityIndicator, I18nManager, Platform, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { StyleSheet } from 'react-native-unistyles';

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
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(main)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BottomSheetModalProvider>
          <RootNavigator />
          <Toast />
        </BottomSheetModalProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

const styles = StyleSheet.create((_theme) => ({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
