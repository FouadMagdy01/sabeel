import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.metrics.spacingV.p12,
  },
  topBorder: {
    height: 3,
    borderRadius: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.metrics.spacing.p12,
    paddingVertical: theme.metrics.spacingV.p4,
    borderRadius: 12,
  },
  arabicText: {
    paddingVertical: theme.metrics.spacingV.p8,
    lineHeight: 36,
  },
  ayahBadge: {
    alignSelf: 'center',
    paddingHorizontal: theme.metrics.spacing.p12,
    paddingVertical: theme.metrics.spacingV.p4,
    borderRadius: 8,
  },
  source: {
    alignSelf: 'flex-end',
  },
}));
