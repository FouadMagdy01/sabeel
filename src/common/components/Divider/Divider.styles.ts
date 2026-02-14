import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  base: {
    backgroundColor: theme.colors.border.default,
  },
  dot: {
    backgroundColor: theme.colors.text.muted,
    opacity: 0.6, // Reduced opacity for subtle dot separator
  },
}));
