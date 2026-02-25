import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.metrics.spacingV.p16,
  },
  sectionHeader: {
    fontSize: theme.fonts.size.xs,
    paddingHorizontal: 4,
  },
}));
