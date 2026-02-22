import { Stack } from 'expo-router';

export default function MainStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="reciters" options={{ headerShown: false }} />
      <Stack.Screen name="reciter-surahs" options={{ headerShown: false }} />
      <Stack.Screen name="quran-reader" options={{ headerShown: false }} />
    </Stack>
  );
}
