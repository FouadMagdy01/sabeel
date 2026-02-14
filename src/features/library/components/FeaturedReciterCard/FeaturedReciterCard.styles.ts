import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    minWidth: 150,
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: 32,
    padding: theme.metrics.spacing.p16,
    gap: theme.metrics.spacingV.p4,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background.surface,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: theme.metrics.spacingV.p8,
  },
  styleText: {
    fontSize: 10,
    letterSpacing: 1,
  },
}));
