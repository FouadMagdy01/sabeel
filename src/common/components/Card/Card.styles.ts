import { StyleSheet } from 'react-native-unistyles';

export const RADIUS_MAP = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background.surface,
    overflow: 'hidden',
    variants: {
      variant: {
        elevated: {
          borderWidth: 1,
          borderColor: theme.colors.border.default,
          shadowColor: theme.colors.shadow.color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
        },
        outlined: {
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        },
        filled: {
          backgroundColor: theme.colors.background.surface,
        },
        gradient: {
          backgroundColor: 'transparent',
        },
      },
      radius: {
        sm: { borderRadius: RADIUS_MAP.sm },
        md: { borderRadius: RADIUS_MAP.md },
        lg: { borderRadius: RADIUS_MAP.lg },
        xl: { borderRadius: RADIUS_MAP.xl },
      },
      padding: {
        none: { padding: 0 },
        sm: { padding: theme.metrics.spacing.p8 },
        md: { padding: theme.metrics.spacing.p16 },
        lg: { padding: theme.metrics.spacing.p24 },
      },
    },
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background.disabled,
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressedState: {
    opacity: 0.85,
  },
}));
