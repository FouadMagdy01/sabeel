import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  cardContent: {
    alignItems: 'center',
    gap: theme.metrics.spacingV.p8,
    paddingVertical: theme.metrics.spacingV.p12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
