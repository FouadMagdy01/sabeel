import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  cardLayout: {
    gap: theme.metrics.spacingV.p12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseLabel: {
    fontSize: theme.fonts.size.xxs,
  },
  arabicText: {
    lineHeight: 32,
  },
  translationText: {
    lineHeight: 18,
  },
}));
