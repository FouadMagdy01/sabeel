import { Stack } from 'expo-router';

export default function MainStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="reciters" options={{ headerShown: false }} />
      <Stack.Screen name="reciter-surahs" options={{ headerShown: false }} />
      <Stack.Screen name="quran-reader" options={{ headerShown: false }} />
      <Stack.Screen name="qibla" options={{ headerShown: false }} />
      <Stack.Screen name="tasbeeh" options={{ headerShown: false }} />
      <Stack.Screen name="adhan-sound" options={{ headerShown: false }} />
      <Stack.Screen name="azkar-hub" options={{ headerShown: false }} />
      <Stack.Screen name="azkar-session" options={{ headerShown: false }} />
      <Stack.Screen name="sunnah-collections" options={{ headerShown: false }} />
      <Stack.Screen name="sunnah-books" options={{ headerShown: false }} />
      <Stack.Screen name="sunnah-hadiths" options={{ headerShown: false }} />
    </Stack>
  );
}
