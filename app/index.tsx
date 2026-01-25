import { Redirect } from 'expo-router';

// Replace with your actual authentication logic
const isAuthenticated = true;

export default function Index() {
  if (isAuthenticated) {
    return <Redirect href="/(main)/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}
