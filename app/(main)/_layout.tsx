import { Stack } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';

export default function MainStackLayout() {
  const { theme } = useUnistyles();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background.app },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="reciters" />
      <Stack.Screen name="reciter-surahs" />
      <Stack.Screen name="quran-reader" />
      <Stack.Screen name="qibla" />
      <Stack.Screen name="tasbeeh" />
      <Stack.Screen name="adhan-sound" />
      <Stack.Screen name="azkar-hub" />
      <Stack.Screen name="azkar-session" />
      <Stack.Screen name="sunnah-collections" />
      <Stack.Screen name="sunnah-books" />
      <Stack.Screen name="sunnah-hadiths" />
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="terms-of-service" />
      <Stack.Screen name="about" />
    </Stack>
  );
}
