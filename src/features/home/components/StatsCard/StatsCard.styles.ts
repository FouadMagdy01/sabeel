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
    marginTop: 4,
  },
  statLabel: {
    fontSize: theme.fonts.size.xxs,
    letterSpacing: -0.3,
    marginTop: 2,
  },
}));
