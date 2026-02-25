import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.brand.tertiary,
  },
  decorativeIcon: {
    position: 'absolute',
    right: -24,
    top: -24,
    opacity: 0.05,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.metrics.spacingV.p24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
  labelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.brand.tertiary,
  },
  label: {
    fontSize: theme.fonts.size.xxs,
  },
  shareButton: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowColor: theme.colors.brand.tertiary,
    elevation: 4,
  },
  contentArea: {
    alignItems: 'center',
  },
  arabicText: {
    writingDirection: 'rtl',
    lineHeight: 50,
    marginBottom: theme.metrics.spacingV.p24,
    width: '100%',
  },
  translationText: {
    marginBottom: theme.metrics.spacingV.p8,
  },
  referenceText: {
    fontSize: theme.fonts.size.xxs,
  },
}));
