import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  base: {
    backgroundColor: theme.colors.border.default,
  },
  dot: {
    backgroundColor: theme.colors.text.muted,
    opacity: 0.6, // Reduced opacity for subtle dot separator
  },
  dotWithColor: {
    opacity: 1,
  },
  dashed: {
    borderStyle: 'dashed',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainerHorizontal: {
    width: '100%',
  },
  labelLine: {
    flex: 1,
    backgroundColor: theme.colors.border.default,
  },
  labelText: {
    paddingHorizontal: theme.metrics.spacing.p12,
    fontFamily: theme.fonts.regular,
    fontSize: theme.fonts.size.sm,
    color: theme.colors.text.tertiary,
  },
  labelAlignLeft: {
    paddingLeft: 0,
    paddingRight: theme.metrics.spacing.p12,
  },
  labelAlignRight: {
    paddingLeft: theme.metrics.spacing.p12,
    paddingRight: 0,
  },
}));
