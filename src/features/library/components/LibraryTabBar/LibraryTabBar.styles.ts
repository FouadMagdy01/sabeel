import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    paddingHorizontal: theme.metrics.spacing.p16,
    gap: theme.metrics.spacing.p24,
    marginBottom: theme.metrics.spacingV.p8,
  },
  tabItem: {
    alignItems: 'center',
    paddingBottom: theme.metrics.spacingV.p8,
  },
  tabLabel: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.muted,
  },
  tabLabelActive: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.bold,
    color: theme.colors.brand.primary,
  },
  tabIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.brand.primary,
    marginTop: 4,
  },
}));
