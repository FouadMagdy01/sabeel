import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create(() => ({
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
    marginTop: 4,
  },
  statLabel: {
    fontSize: 9,
    letterSpacing: -0.5,
    marginTop: 2,
  },
}));
