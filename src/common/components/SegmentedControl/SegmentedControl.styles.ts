import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: theme.metrics.spacingV.p8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  segmentActive: {
    backgroundColor: theme.colors.brand.primary,
    shadowColor: theme.colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: theme.colors.shadow.elevationMedium,
  },
  segmentText: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.muted,
  },
  segmentTextActive: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.inverse,
  },
}));
