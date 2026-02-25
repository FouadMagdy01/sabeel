import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    marginTop: theme.metrics.spacingV.p4,
  },
  statLabel: {
    fontSize: theme.fonts.size.xxs,
    marginTop: 2,
  },
}));
