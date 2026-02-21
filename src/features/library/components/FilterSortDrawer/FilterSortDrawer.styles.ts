import { StyleSheet } from 'react-native-unistyles';

const FILL = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export const DRAWER_FRACTAL = 0.65;

export const styles = StyleSheet.create((theme, rt) => ({
  overlay: {
    ...FILL,
    zIndex: 100,
  },
  backdropPressable: {
    ...FILL,
  },
  drawer: {
    position: 'absolute',
    backgroundColor: theme.colors.overlay.modal,
    top: 0,
    bottom: 0,
    right: 0,
    width: rt.screen.width * DRAWER_FRACTAL,
    zIndex: 101,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: theme.colors.background.surface,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  drawerContentRTL: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingTop: theme.metrics.spacingV.p16,
  },
  sectionTitle: {
    marginBottom: theme.metrics.spacingV.p12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.metrics.spacing.p8,
    marginBottom: theme.metrics.spacingV.p24,
  },
  chip: {
    paddingHorizontal: theme.metrics.spacing.p12,
    paddingVertical: theme.metrics.spacingV.p8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.surface,
  },
  chipSelected: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.primary,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.metrics.spacingV.p12,
    gap: theme.metrics.spacing.p12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: theme.colors.brand.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.brand.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
}));
