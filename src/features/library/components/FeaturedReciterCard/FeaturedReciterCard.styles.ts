import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    minWidth: 150,
    borderWidth: 1,
    borderRadius: 32,
    padding: theme.metrics.spacing.p16,
    gap: theme.metrics.spacingV.p4,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.default,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: `${theme.colors.brand.primary}15`,
  },
  playButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.background.surface,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: theme.metrics.spacingV.p8,
  },
  styleText: {
    fontSize: theme.fonts.size.xxs,
    letterSpacing: 1,
  },
}));
