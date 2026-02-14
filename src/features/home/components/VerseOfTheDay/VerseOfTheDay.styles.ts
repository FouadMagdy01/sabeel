import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    borderTopColor: theme.colors.brand.tertiary,
    borderTopWidth: 1,
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
    gap: 8,
  },
  labelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.brand.tertiary,
  },
  label: {
    fontSize: 10,
    letterSpacing: 3,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.brand.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.brand.tertiary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
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
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  referenceText: {
    fontSize: 10,
  },
  pressed: {
    opacity: 0.8,
  },
}));
