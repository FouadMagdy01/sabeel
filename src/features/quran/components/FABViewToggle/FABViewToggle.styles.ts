import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  fab: {
    position: 'absolute',
    right: theme.metrics.spacing.p16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: theme.colors.shadow.elevationLarge,
    shadowColor: theme.colors.shadow.color,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
}));
